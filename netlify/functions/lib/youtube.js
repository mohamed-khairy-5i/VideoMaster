// YouTube extractor — real extraction via the InnerTube (youtubei) API.
//
// Why InnerTube instead of yt-dlp:
//   yt-dlp needs Python + ffmpeg and 10-60s of runtime. Netlify functions cap at
//   10s and have no Python runtime. InnerTube is a single JSON POST (~300ms) and
//   returns CDN URLs directly.
//
// Why the mobile clients specifically:
//   The web client returns URLs protected by a `signatureCipher` that must be
//   decrypted by running YouTube's obfuscated player JS (heavy + very fragile).
//   The iOS/Android clients return plain `url` fields with no cipher, so we get
//   playable links with zero JS execution. This is the whole trick.

const CLIENTS = {
  // Ordered by preference. IOS gives the best adaptive ladder (up to 4K),
  // ANDROID reliably returns a muxed 360p (video+audio in one file) which we use
  // as the "instant, no-processing" option.
  IOS: {
    name: 'IOS',
    version: '20.10.4',
    key: 'AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc',
    userAgent:
      'com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X)',
    context: {
      deviceMake: 'Apple',
      deviceModel: 'iPhone16,2',
      osName: 'iPhone',
      osVersion: '18.3.2.22D82',
    },
  },
  ANDROID: {
    name: 'ANDROID',
    version: '20.10.38',
    key: 'AIzaSyA8eiZmM1FaDVjRy-df2KTyQ_vz_yYM39w',
    userAgent: 'com.google.android.youtube/20.10.38 (Linux; U; Android 15) gzip',
    context: {
      androidSdkVersion: 35,
      osName: 'Android',
      osVersion: '15',
    },
  },
  // Last resort: the TV client is the most permissive for age/embed-restricted
  // videos, though it exposes fewer formats.
  TVHTML5: {
    name: 'TVHTML5_SIMPLY_EMBEDDED_PLAYER',
    version: '2.0',
    key: 'AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc',
    userAgent: 'Mozilla/5.0 (SMART-TV; Linux; Tizen 6.0) AppleWebKit/537.36',
    context: {},
  },
};

const PLAYER_ENDPOINT = 'https://youtubei.googleapis.com/youtubei/v1/player';

/** Pull the 11-character video id out of any known YouTube URL shape. */
export function parseVideoId(rawUrl) {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
    /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = rawUrl.match(re);
    if (m) return m[1];
  }
  return null;
}

async function callPlayer(client, videoId, signal) {
  const res = await fetch(`${PLAYER_ENDPOINT}?key=${client.key}&prettyPrint=false`, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': client.userAgent,
      // Telling YouTube which client we are, in the header as well as the body,
      // avoids a chunk of the "content unavailable" responses.
      'X-YouTube-Client-Name': client.name === 'IOS' ? '5' : '3',
      'X-YouTube-Client-Version': client.version,
      Origin: 'https://www.youtube.com',
    },
    body: JSON.stringify({
      videoId,
      contentCheckOk: true,
      racyCheckOk: true,
      context: {
        client: {
          clientName: client.name,
          clientVersion: client.version,
          hl: 'en',
          gl: 'US',
          ...client.context,
        },
      },
      playbackContext: {
        contentPlaybackContext: { html5Preference: 'HTML5_PREF_WANTS' },
      },
    }),
  });

  if (!res.ok) throw new Error(`InnerTube HTTP ${res.status}`);
  return res.json();
}

/** Human-readable size. Kept here so the UI never has to guess. */
function approxSize(format, durationSec) {
  if (format.contentLength) return Number(format.contentLength);
  // Adaptive formats sometimes omit contentLength; derive from bitrate.
  if (format.bitrate && durationSec) {
    return Math.round((format.bitrate / 8) * durationSec);
  }
  return null;
}

function normaliseFormats(streamingData, durationSec) {
  const muxed = [];
  const videoOnly = [];
  const audioOnly = [];

  const all = [
    ...(streamingData?.formats || []),
    ...(streamingData?.adaptiveFormats || []),
  ];

  for (const f of all) {
    // Skip anything we cannot hand to the browser directly.
    if (!f.url) continue;

    const mime = f.mimeType || '';
    const isVideo = mime.startsWith('video/');
    const isAudio = mime.startsWith('audio/');
    const ext = mime.includes('mp4')
      ? 'mp4'
      : mime.includes('webm')
        ? 'webm'
        : mime.includes('mp4a')
          ? 'm4a'
          : 'bin';

    const entry = {
      itag: f.itag,
      url: f.url,
      ext: isAudio ? (mime.includes('mp4') ? 'm4a' : 'webm') : ext,
      mimeType: mime.split(';')[0],
      bitrate: f.bitrate || null,
      filesize: approxSize(f, durationSec),
      height: f.height || null,
      width: f.width || null,
      fps: f.fps || null,
      qualityLabel: f.qualityLabel || null,
      audioQuality: f.audioQuality || null,
      audioSampleRate: f.audioSampleRate ? Number(f.audioSampleRate) : null,
      // `hasAudio && hasVideo` on the same entry = directly playable file.
      hasAudio: isAudio || !!f.audioQuality,
      hasVideo: isVideo,
    };

    if (isVideo && entry.hasAudio) muxed.push(entry);
    else if (isVideo) videoOnly.push(entry);
    else if (isAudio) audioOnly.push(entry);
  }

  // Best first.
  const byHeight = (a, b) => (b.height || 0) - (a.height || 0) || (b.bitrate || 0) - (a.bitrate || 0);
  const byBitrate = (a, b) => (b.bitrate || 0) - (a.bitrate || 0);

  return {
    muxed: muxed.sort(byHeight),
    videoOnly: videoOnly.sort(byHeight),
    audioOnly: audioOnly.sort(byBitrate),
  };
}

/**
 * Extract real metadata + real stream URLs for a YouTube video.
 * Tries each client in turn so a single client-side block does not kill the request.
 */
export async function extractYouTube(url, { signal } = {}) {
  const videoId = parseVideoId(url);
  if (!videoId) {
    const err = new Error('لم نتعرف على رقم الفيديو في هذا الرابط');
    err.code = 'INVALID_YOUTUBE_URL';
    throw err;
  }

  const attempted = [];
  let lastReason = null;

  for (const key of ['IOS', 'ANDROID', 'TVHTML5']) {
    const client = CLIENTS[key];
    attempted.push(key);
    let data;
    try {
      data = await callPlayer(client, videoId, signal);
    } catch (e) {
      lastReason = e.message;
      continue;
    }

    const status = data?.playabilityStatus?.status;
    if (status !== 'OK') {
      lastReason =
        data?.playabilityStatus?.reason ||
        data?.playabilityStatus?.messages?.[0] ||
        status;
      continue; // try the next client — TV often succeeds where iOS fails
    }

    const details = data.videoDetails || {};
    const durationSec = Number(details.lengthSeconds) || 0;
    const formats = normaliseFormats(data.streamingData, durationSec);

    if (!formats.muxed.length && !formats.videoOnly.length && !formats.audioOnly.length) {
      lastReason = 'لم يتم إرجاع أي صيغة قابلة للتحميل';
      continue;
    }

    // Highest-resolution thumbnail YouTube offers for this video.
    const thumbs = details.thumbnail?.thumbnails || [];
    const thumbnail =
      thumbs.length
        ? thumbs[thumbs.length - 1].url
        : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

    return {
      platform: 'youtube',
      id: videoId,
      title: details.title || 'فيديو يوتيوب',
      author: details.author || null,
      channelId: details.channelId || null,
      duration: durationSec,
      viewCount: details.viewCount ? Number(details.viewCount) : null,
      description: (details.shortDescription || '').slice(0, 800) || null,
      thumbnail,
      isLive: !!details.isLiveContent,
      webpageUrl: `https://www.youtube.com/watch?v=${videoId}`,
      formats,
      extractedVia: key,
      attempted,
    };
  }

  const err = new Error(
    lastReason
      ? `تعذّر استخراج الفيديو: ${lastReason}`
      : 'تعذّر استخراج هذا الفيديو. قد يكون خاصًا أو محذوفًا.'
  );
  err.code = 'YOUTUBE_EXTRACTION_FAILED';
  err.attempted = attempted;
  throw err;
}
