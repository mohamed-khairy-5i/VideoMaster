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

/** Vimeo publishes a public player config JSON with progressive MP4 links. */
export async function extractVimeo(url, { signal } = {}) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!m) {
    const err = new Error('رابط Vimeo غير صالح');
    err.code = 'INVALID_VIMEO_URL';
    throw err;
  }
  const id = m[1];

  const res = await fetch(`https://player.vimeo.com/video/${id}/config`, {
    signal,
    headers: { Referer: 'https://vimeo.com/', 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) {
    const err = new Error('هذا الفيديو خاص أو محمي بكلمة مرور على Vimeo');
    err.code = 'VIMEO_EXTRACTION_FAILED';
    throw err;
  }
  const cfg = await res.json();
  const v = cfg.video || {};
  const progressive = cfg.request?.files?.progressive || [];

  return {
    platform: 'vimeo',
    id,
    title: v.title || 'فيديو Vimeo',
    author: v.owner?.name || null,
    duration: v.duration || null,
    thumbnail: v.thumbs?.base || v.thumbs?.['1280'] || null,
    webpageUrl: v.url || `https://vimeo.com/${id}`,
    formats: {
      muxed: progressive
        .map((p) => ({
          itag: `vimeo-${p.quality}`,
          url: p.url,
          ext: 'mp4',
          mimeType: 'video/mp4',
          qualityLabel: p.quality,
          height: p.height || null,
          width: p.width || null,
          fps: p.fps || null,
          hasAudio: true,
          hasVideo: true,
        }))
        .sort((a, b) => (b.height || 0) - (a.height || 0)),
      videoOnly: [],
      audioOnly: [],
    },
    extractedVia: 'player-config',
  };
}

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

export async function extractDailymotion(url, { signal } = {}) {
  const m = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/) || url.match(/dai\.ly\/([a-zA-Z0-9]+)/);
  if (!m) {
    const err = new Error('رابط Dailymotion غير صالح');
    err.code = 'INVALID_DAILYMOTION_URL';
    throw err;
  }
  const id = m[1];

  const res = await fetch(
    `https://api.dailymotion.com/video/${id}?fields=id,title,owner.screenname,duration,thumbnail_720_url,views_total`,
    { signal, headers: { 'User-Agent': 'Mozilla/5.0' } }
  );
  if (!res.ok) {
    const err = new Error('تعذّر جلب بيانات Dailymotion');
    err.code = 'DAILYMOTION_EXTRACTION_FAILED';
    throw err;
  }
  const d = await res.json();

  return {
    platform: 'dailymotion',
    id,
    title: d.title || 'فيديو Dailymotion',
    author: d['owner.screenname'] || null,
    duration: d.duration || null,
    viewCount: d.views_total ?? null,
    thumbnail: d.thumbnail_720_url || null,
    webpageUrl: `https://www.dailymotion.com/video/${id}`,
    // Dailymotion serves HLS only; we expose the manifest for the player/proxy.
    formats: {
      muxed: [
        {
          itag: 'dm-hls',
          url: `https://www.dailymotion.com/cdn/manifest/video/${id}.m3u8`,
          ext: 'm3u8',
          mimeType: 'application/x-mpegURL',
          qualityLabel: 'HLS (جودة تلقائية)',
          hasAudio: true,
          hasVideo: true,
          isHls: true,
        },
      ],
      videoOnly: [],
      audioOnly: [],
    },
    extractedVia: 'dailymotion-api',
  };
}
