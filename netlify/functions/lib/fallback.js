// Fallback extraction sources for YouTube.
//
// Why this file exists:
//   YouTube applies bot-detection per source IP. A shared cloud IP (which is
//   what any free host gives you) periodically gets served LOGIN_REQUIRED —
//   "Sign in to confirm you're not a bot" — regardless of how well-formed the
//   request is. This is not a bug we can code around; even yt-dlp fails on the
//   exact same IP at the exact same moment.
//
// The mitigation is redundancy: when our direct InnerTube call is refused, we
// re-ask a public Piped / Invidious instance. Those run on different IPs with
// different reputations, so a block on ours does not imply a block on theirs.
// Each instance is cheap to try and none of them cost money.
//
// Instances go down often, so we race a few in parallel and take the first
// healthy answer rather than walking a list serially.

const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.adminforge.de',
  'https://api.piped.private.coffee',
  'https://pipedapi.reallyaweso.me',
  'https://pipedapi.drgns.space',
];

const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
  'https://yewtu.be',
  'https://invidious.privacyredirect.com',
  'https://iv.melmac.space',
];

const PER_INSTANCE_TIMEOUT = 4000;

async function getJson(url, timeout = PER_INSTANCE_TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('json')) throw new Error('non-json response');
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Resolve the first promise that fulfils AND passes `isValid`.
 * Unlike Promise.any this lets us reject "successful" HTTP responses that are
 * actually empty or error payloads.
 */
function firstValid(promises, isValid) {
  return new Promise((resolve, reject) => {
    let pending = promises.length;
    if (!pending) {
      reject(new Error('no sources'));
      return;
    }
    let settled = false;
    for (const p of promises) {
      p.then((value) => {
        if (settled) return;
        if (isValid(value)) {
          settled = true;
          resolve(value);
        } else if (--pending === 0) reject(new Error('all sources returned unusable data'));
      }).catch(() => {
        if (settled) return;
        if (--pending === 0) reject(new Error('all sources failed'));
      });
    }
  });
}

function mapPiped(data, videoId) {
  const video = (data.videoStreams || []).filter((s) => !s.videoOnly === false || s.videoOnly);
  const muxed = (data.videoStreams || [])
    .filter((s) => s.videoOnly === false)
    .map((s) => ({
      itag: s.itag ?? `piped-${s.quality}`,
      url: s.url,
      ext: s.format === 'WEBM' ? 'webm' : 'mp4',
      mimeType: s.mimeType || 'video/mp4',
      qualityLabel: s.quality,
      height: parseInt(s.quality, 10) || null,
      fps: s.fps || null,
      filesize: s.contentLength ? Number(s.contentLength) : null,
      hasAudio: true,
      hasVideo: true,
    }));

  const videoOnly = (data.videoStreams || [])
    .filter((s) => s.videoOnly === true)
    .map((s) => ({
      itag: s.itag ?? `piped-v-${s.quality}`,
      url: s.url,
      ext: s.format === 'WEBM' ? 'webm' : 'mp4',
      mimeType: s.mimeType || 'video/mp4',
      qualityLabel: s.quality,
      height: parseInt(s.quality, 10) || null,
      fps: s.fps || null,
      filesize: s.contentLength ? Number(s.contentLength) : null,
      hasAudio: false,
      hasVideo: true,
    }));

  const audioOnly = (data.audioStreams || [])
    .map((s) => ({
      itag: s.itag ?? `piped-a-${s.bitrate}`,
      url: s.url,
      ext: s.format === 'WEBM' ? 'webm' : 'm4a',
      mimeType: s.mimeType || 'audio/mp4',
      bitrate: s.bitrate || null,
      qualityLabel: s.quality || (s.bitrate ? `${Math.round(s.bitrate / 1000)} kbps` : 'صوت'),
      filesize: s.contentLength ? Number(s.contentLength) : null,
      hasAudio: true,
      hasVideo: false,
    }))
    .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

  const byHeight = (a, b) => (b.height || 0) - (a.height || 0);

  return {
    platform: 'youtube',
    id: videoId,
    title: data.title || 'فيديو يوتيوب',
    author: data.uploader || null,
    duration: data.duration || null,
    viewCount: data.views ?? null,
    likeCount: data.likes >= 0 ? data.likes : null,
    description: (data.description || '').replace(/<[^>]+>/g, '').slice(0, 800) || null,
    thumbnail: data.thumbnailUrl || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    isLive: !!data.livestream,
    webpageUrl: `https://www.youtube.com/watch?v=${videoId}`,
    formats: {
      muxed: muxed.sort(byHeight),
      videoOnly: videoOnly.sort(byHeight),
      audioOnly,
    },
    extractedVia: 'piped',
  };
}

function mapInvidious(data, videoId) {
  const adaptive = data.adaptiveFormats || [];

  const videoOnly = adaptive
    .filter((f) => (f.type || '').startsWith('video/'))
    .map((f) => ({
      itag: f.itag,
      url: f.url,
      ext: (f.type || '').includes('webm') ? 'webm' : 'mp4',
      mimeType: (f.type || '').split(';')[0],
      qualityLabel: f.qualityLabel || f.resolution,
      height: parseInt(f.resolution || f.qualityLabel, 10) || null,
      fps: f.fps || null,
      bitrate: f.bitrate ? Number(f.bitrate) : null,
      filesize: f.clen ? Number(f.clen) : null,
      hasAudio: false,
      hasVideo: true,
    }));

  const audioOnly = adaptive
    .filter((f) => (f.type || '').startsWith('audio/'))
    .map((f) => ({
      itag: f.itag,
      url: f.url,
      ext: (f.type || '').includes('webm') ? 'webm' : 'm4a',
      mimeType: (f.type || '').split(';')[0],
      bitrate: f.bitrate ? Number(f.bitrate) : null,
      qualityLabel: f.audioQuality
        ? f.audioQuality.replace('AUDIO_QUALITY_', '')
        : f.bitrate
          ? `${Math.round(Number(f.bitrate) / 1000)} kbps`
          : 'صوت',
      filesize: f.clen ? Number(f.clen) : null,
      hasAudio: true,
      hasVideo: false,
    }))
    .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

  const muxed = (data.formatStreams || []).map((f) => ({
    itag: f.itag,
    url: f.url,
    ext: (f.type || '').includes('webm') ? 'webm' : 'mp4',
    mimeType: (f.type || '').split(';')[0],
    qualityLabel: f.qualityLabel || f.resolution,
    height: parseInt(f.resolution || f.qualityLabel, 10) || null,
    fps: f.fps || null,
    hasAudio: true,
    hasVideo: true,
  }));

  const byHeight = (a, b) => (b.height || 0) - (a.height || 0);

  return {
    platform: 'youtube',
    id: videoId,
    title: data.title || 'فيديو يوتيوب',
    author: data.author || null,
    duration: data.lengthSeconds ? Number(data.lengthSeconds) : null,
    viewCount: data.viewCount ?? null,
    likeCount: data.likeCount ?? null,
    description: (data.description || '').slice(0, 800) || null,
    thumbnail:
      data.videoThumbnails?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    isLive: !!data.liveNow,
    webpageUrl: `https://www.youtube.com/watch?v=${videoId}`,
    formats: { muxed: muxed.sort(byHeight), videoOnly: videoOnly.sort(byHeight), audioOnly },
    extractedVia: 'invidious',
  };
}

const hasStreams = (info) =>
  !!info &&
  (info.formats.muxed.length || info.formats.videoOnly.length || info.formats.audioOnly.length);

/**
 * Try the public mirrors. Resolves with normalised info, or throws if every
 * instance is unreachable / blocked / empty.
 */
export async function extractViaMirrors(videoId, { budgetMs = 5000 } = {}) {
  const attempts = [
    ...PIPED_INSTANCES.map((base) =>
      getJson(`${base}/streams/${videoId}`).then((d) => mapPiped(d, videoId))
    ),
    ...INVIDIOUS_INSTANCES.map((base) =>
      getJson(`${base}/api/v1/videos/${videoId}`).then((d) => mapInvidious(d, videoId))
    ),
  ];

  // Never let the mirror hunt eat the whole function budget.
  const overall = new Promise((_, rej) =>
    setTimeout(() => rej(new Error('mirror timeout')), budgetMs)
  );

  return Promise.race([firstValid(attempts, hasStreams), overall]);
}
