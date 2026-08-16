// Extractors for non-YouTube platforms.
// Every endpoint used here is a public, key-free endpoint. Nothing in this file
// costs money or requires registration.

/** Follow short links (vm.tiktok.com, fb.watch, ...) to their canonical URL. */
async function resolveRedirect(url, signal) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)' },
    });
    return res.url || url;
  } catch {
    return url;
  }
}

/* ------------------------------------------------------------------ TikTok */

/**
 * TikTok, no-watermark download.
 * The mobile `/aweme/v1/feed/` endpoint returns `play_addr` (clean, no watermark)
 * alongside `download_addr` (watermarked). We prefer play_addr, which is exactly
 * the feature users hunt for on other sites.
 */
export async function extractTikTok(url, { signal } = {}) {
  let target = url;
  if (/vm\.tiktok\.com|vt\.tiktok\.com|tiktok\.com\/t\//.test(url)) {
    target = await resolveRedirect(url, signal);
  }

  const idMatch = target.match(/\/video\/(\d+)/) || target.match(/\/photo\/(\d+)/);
  if (!idMatch) {
    const err = new Error('لم نتعرف على رقم فيديو تيك توك في الرابط');
    err.code = 'INVALID_TIKTOK_URL';
    throw err;
  }
  const awemeId = idMatch[1];

  const api =
    `https://api22-normal-c-useast2a.tiktokv.com/aweme/v1/feed/?aweme_id=${awemeId}` +
    '&version_code=300904&app_name=musical_ly&channel=App&device_id=7318518857994389254' +
    '&os_version=14.4&device_platform=iphone&device_type=iPhone9&iid=7318518857994389254&aid=1180';

  let item = null;
  try {
    const res = await fetch(api, {
      signal,
      headers: {
        'User-Agent': 'TikTok 30.9.4 rv:309904 (iPhone; iOS 14.4.2; en_US) Cronet',
        Accept: 'application/json',
      },
    });
    if (res.ok) {
      const json = await res.json();
      item = json?.aweme_list?.find((a) => a.aweme_id === awemeId) || json?.aweme_list?.[0] || null;
    }
  } catch {
    /* fall through to oEmbed */
  }

  if (item) {
    const noWatermark = item.video?.play_addr?.url_list?.[0] || null;
    const watermarked = item.video?.download_addr?.url_list?.[0] || null;
    const music = item.music?.play_url?.url_list?.[0] || null;

    const formats = { muxed: [], videoOnly: [], audioOnly: [] };
    if (noWatermark) {
      formats.muxed.push({
        itag: 'tt-nowm',
        url: noWatermark,
        ext: 'mp4',
        mimeType: 'video/mp4',
        qualityLabel: `${item.video?.height || 720}p بدون علامة مائية`,
        height: item.video?.height || null,
        width: item.video?.width || null,
        filesize: item.video?.play_addr?.data_size || null,
        hasAudio: true,
        hasVideo: true,
        noWatermark: true,
      });
    }
    if (watermarked && watermarked !== noWatermark) {
      formats.muxed.push({
        itag: 'tt-wm',
        url: watermarked,
        ext: 'mp4',
        mimeType: 'video/mp4',
        qualityLabel: 'مع علامة مائية',
        filesize: item.video?.download_addr?.data_size || null,
        hasAudio: true,
        hasVideo: true,
        noWatermark: false,
      });
    }
    if (music) {
      formats.audioOnly.push({
        itag: 'tt-audio',
        url: music,
        ext: 'mp3',
        mimeType: 'audio/mpeg',
        qualityLabel: 'الصوت الأصلي (MP3)',
        hasAudio: true,
        hasVideo: false,
      });
    }

    return {
      platform: 'tiktok',
      id: awemeId,
      title: item.desc || 'فيديو تيك توك',
      author: item.author?.nickname || item.author?.unique_id || null,
      duration: item.video?.duration ? Math.round(item.video.duration / 1000) : null,
      viewCount: item.statistics?.play_count ?? null,
      likeCount: item.statistics?.digg_count ?? null,
      thumbnail:
        item.video?.cover?.url_list?.[0] ||
        item.video?.origin_cover?.url_list?.[0] ||
        null,
      webpageUrl: target,
      formats,
      extractedVia: 'mobile-api',
    };
  }

  // Fallback: oEmbed always works and at least gives real title/author/thumbnail
  // so the user sees truthful metadata instead of a fabricated placeholder.
  const oe = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(target)}`, {
    signal,
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!oe.ok) {
    const err = new Error('تعذّر جلب بيانات فيديو تيك توك');
    err.code = 'TIKTOK_EXTRACTION_FAILED';
    throw err;
  }
  const meta = await oe.json();
  return {
    platform: 'tiktok',
    id: awemeId,
    title: meta.title || 'فيديو تيك توك',
    author: meta.author_name || null,
    thumbnail: meta.thumbnail_url || null,
    duration: null,
    webpageUrl: target,
    formats: { muxed: [], videoOnly: [], audioOnly: [] },
    partial: true,
    notice: 'تم جلب المعلومات فقط. تيك توك يحجب الاستخراج المباشر من هذا الخادم حاليًا.',
    extractedVia: 'oembed',
  };
}

/* ------------------------------------------------------------------- Vimeo */
//
// REMOVED, and it must stay removed. This is a legal boundary, not a bug.
//
// Vimeo used to publish `request.files.progressive`: a plain array of
// unencrypted MP4 URLs. That array is now empty on every video we probed.
// The only remaining delivery paths are encrypted:
//
//   DASH  ->  <ContentProtection schemeIdUri="urn:mpeg:dash:mp4protection:2011"
//                                value="cenc" cenc:default_KID="..."> plus
//             Widevine (edef8ba9-79d6-4ace-a3c8-27dcd51d21ed) and
//             PlayReady (9a04f079-9840-4286-ab92-e65be0885f95) pssh boxes.
//   HLS   ->  #EXT-X-KEY:METHOD=SAMPLE-AES,URI="skd://drm",
//             KEYFORMAT="com.apple.streamingkeydelivery"   (FairPlay)
//
// Turning those bytes into a playable file requires obtaining a content key
// from a licence server, i.e. circumventing a technological protection
// measure. In the US that is DMCA 17 U.S.C. 1201, and unlike ordinary
// copyright it has no fair-use style exemption for this use. It is a
// criminal provision, not a terms-of-service matter.
//
// So there is no "clever fix" here and no amount of engineering makes it
// legal. Shipping a Vimeo button that cannot work would also be exactly the
// false promise we removed everywhere else in this codebase.

/* ------------------------------------------------------------------ Reddit */

/** Reddit exposes .json on every post; DASH video + separate audio track. */
export async function extractReddit(url, { signal } = {}) {
  const clean = url.split('?')[0].replace(/\/$/, '');
  const res = await fetch(`${clean}.json`, {
    signal,
    headers: { 'User-Agent': 'web:videomaster:1.0 (by /u/videomaster)' },
  });
  if (!res.ok) {
    const err = new Error('تعذّر الوصول إلى منشور Reddit');
    err.code = 'REDDIT_EXTRACTION_FAILED';
    throw err;
  }
  const json = await res.json();
  const post = json?.[0]?.data?.children?.[0]?.data;
  if (!post) {
    const err = new Error('لم يتم العثور على المنشور');
    err.code = 'REDDIT_NOT_FOUND';
    throw err;
  }

  const rv = post.secure_media?.reddit_video || post.media?.reddit_video;
  const formats = { muxed: [], videoOnly: [], audioOnly: [] };

  if (rv?.fallback_url) {
    const base = rv.fallback_url.split('/DASH_')[0];
    formats.videoOnly.push({
      itag: 'reddit-video',
      url: rv.fallback_url.split('?')[0],
      ext: 'mp4',
      mimeType: 'video/mp4',
      qualityLabel: `${rv.height || ''}p`,
      height: rv.height || null,
      width: rv.width || null,
      hasAudio: false,
      hasVideo: true,
    });
    formats.audioOnly.push({
      itag: 'reddit-audio',
      url: `${base}/DASH_AUDIO_128.mp4`,
      ext: 'm4a',
      mimeType: 'audio/mp4',
      qualityLabel: 'الصوت (128kbps)',
      hasAudio: true,
      hasVideo: false,
    });
  }

  return {
    platform: 'reddit',
    id: post.id,
    title: post.title || 'منشور Reddit',
    author: post.author ? `u/${post.author}` : null,
    duration: rv?.duration || null,
    viewCount: null,
    likeCount: post.score ?? null,
    thumbnail:
      post.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&') || null,
    webpageUrl: `https://www.reddit.com${post.permalink}`,
    formats,
    extractedVia: 'reddit-json',
  };
}

/* ---------------------------------------------------------------- Twitter/X */

/** The syndication endpoint powers embedded tweets: public and key-free. */
export async function extractTwitter(url, { signal } = {}) {
  const m = url.match(/(?:twitter|x)\.com\/[^/]+\/status(?:es)?\/(\d+)/);
  if (!m) {
    const err = new Error('رابط تويتر/X غير صالح');
    err.code = 'INVALID_TWITTER_URL';
    throw err;
  }
  const id = m[1];

  // The token is a simple derived value the endpoint expects.
  const token = ((Number(id) / 1e15) * Math.PI)
    .toString(36)
    .replace(/(0+|\.)/g, '');

  const res = await fetch(
    `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${token}&lang=en`,
    { signal, headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } }
  );
  if (!res.ok) {
    const err = new Error('التغريدة محمية أو محذوفة');
    err.code = 'TWITTER_EXTRACTION_FAILED';
    throw err;
  }
  const t = await res.json();

  // A deleted or protected tweet answers HTTP 200 with a `tombstone` payload
  // and no media. The previous version fell through this case and returned a
  // made-up title ('تغريدة') with an empty format list, so the UI showed a
  // successful-looking result card with nothing to download. Fail loudly.
  if (t.tombstone || t.__typename === 'TweetTombstone') {
    const err = new Error('هذه التغريدة محذوفة أو من حساب محمي');
    err.code = 'TWITTER_UNAVAILABLE';
    throw err;
  }

  const variants =
    t.mediaDetails?.flatMap((md) => md.video_info?.variants || []) ||
    t.video?.variants ||
    [];

  const muxed = variants
    .filter((v) => v.content_type === 'video/mp4' || /\.mp4/.test(v.url || ''))
    .map((v) => {
      const res2 = (v.url || '').match(/\/(\d+)x(\d+)\//);
      return {
        itag: `tw-${v.bitrate || 0}`,
        url: v.url,
        ext: 'mp4',
        mimeType: 'video/mp4',
        bitrate: v.bitrate || null,
        width: res2 ? Number(res2[1]) : null,
        height: res2 ? Number(res2[2]) : null,
        qualityLabel: res2 ? `${res2[2]}p` : 'MP4',
        hasAudio: true,
        hasVideo: true,
      };
    })
    .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

  // Text-only and photo-only tweets are perfectly valid tweets, but there is
  // nothing here to download. Say that plainly rather than rendering an empty
  // download card.
  if (muxed.length === 0) {
    const err = new Error('لا يوجد فيديو في هذه التغريدة');
    err.code = 'TWITTER_NO_VIDEO';
    throw err;
  }

  return {
    platform: 'twitter',
    id,
    title: (t.text || '').slice(0, 200) || 'تغريدة',
    author: t.user?.name ? `${t.user.name} (@${t.user.screen_name})` : null,
    duration: t.mediaDetails?.[0]?.video_info?.duration_millis
      ? Math.round(t.mediaDetails[0].video_info.duration_millis / 1000)
      : null,
    likeCount: t.favorite_count ?? null,
    thumbnail: t.mediaDetails?.[0]?.media_url_https || t.photos?.[0]?.url || null,
    webpageUrl: url,
    formats: { muxed, videoOnly: [], audioOnly: [] },
    extractedVia: 'syndication',
  };
}

/* -------------------------------------------------------------- Dailymotion */
//
// REMOVED. Two independent reasons, either one sufficient.
//
// 1. The URL this extractor returned was never real. It built
//    `https://www.dailymotion.com/cdn/manifest/video/<id>.m3u8` by string
//    concatenation and never fetched it. That path answers HTTP 403 for every
//    id, with every combination of User-Agent / Referer / Origin we tried.
//    The genuine manifest URL is a short-lived signed link from
//    /player/metadata/video/<id>, and even that answers 403 from a datacenter
//    IP, which is exactly what a Netlify function is.
//
// 2. Even with a valid manifest, we could not have delivered a video file.
//    Dailymotion is HLS-only: no progressive MP4 exists. Saving a manifest
//    hands the user a few kilobytes of text named ".m3u8", not a video. The
//    old code marked this option `isHls: true` and the UI still rendered it as
//    "صوت وصورة، تحميل فوري" because nothing ever consumed that flag.
//
// Fixing this properly means fetching the manifest, downloading every segment,
// and concatenating them with ffmpeg.wasm. That is real work we may do later
// (see ROADMAP), but until it exists the honest move is to not offer the
// button at all.
