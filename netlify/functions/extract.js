// POST /api/extract  →  real video metadata + real downloadable stream URLs.
//
// This function only ever moves JSON. Video bytes never pass through it, which
// is what keeps the whole service inside Netlify's free tier: extraction is a
// sub-second JSON call, and the actual file transfer is handled by the edge
// streaming proxy (netlify/edge-functions/stream.js) or by the browser directly.

import { normaliseUrl, detectPlatform, PLATFORMS } from './lib/detect.js';
import { extractYouTube } from './lib/youtube.js';
import { extractTikTok, extractReddit, extractTwitter } from './lib/platforms.js';

// Vimeo and Dailymotion were removed on purpose; see the block comments in
// lib/platforms.js. Vimeo is DRM-encrypted end to end (DMCA 1201 territory) and
// Dailymotion's only download URL answered 403 while promising an instant MP4.
const EXTRACTORS = {
  youtube: extractYouTube,
  tiktok: extractTikTok,
  reddit: extractReddit,
  twitter: extractTwitter,
};

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Cache-Control': 'no-store',
};

/**
 * Rewrite every stream URL to go through our edge proxy.
 *
 * Two reasons this is mandatory rather than optional:
 *  1. CORS: the CDNs return no Access-Control-Allow-Origin header, so a browser
 *     fetch() from our origin is blocked. (Verified: ACAO is null.)
 *  2. Filename: a raw CDN link opens in a tab instead of saving, and has no
 *     usable filename. The proxy sets Content-Disposition.
 */
function proxify(formats, meta) {
  const wrap = (f) => {
    if (!f.url) return f;
    const params = new URLSearchParams({
      u: f.url,
      // Filename the browser will save as; built from the real title.
      n: buildFilename(meta.title, f),
    });
    return { ...f, url: undefined, downloadUrl: `/api/stream?${params.toString()}` };
  };

  return {
    muxed: (formats.muxed || []).map(wrap),
    videoOnly: (formats.videoOnly || []).map(wrap),
    audioOnly: (formats.audioOnly || []).map(wrap),
  };
}

/** Safe, readable filename that preserves Arabic characters. */
function buildFilename(title, format) {
  const base = (title || 'video')
    // Strip only characters that are illegal in filenames. The control-character
    // range is the point of this expression, not an accident: a raw \n or \r in a
    // video title would break the Content-Disposition header it ends up in, which
    // is a header-injection vector, so the eslint rule is disabled knowingly.
    // eslint-disable-next-line no-control-regex
    .replace(/[\\/:*?"<>|\x00-\x1f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80) || 'video';

  const tag = format.qualityLabel
    ? `_${String(format.qualityLabel).replace(/[^\w\u0600-\u06FF]+/g, '')}`
    : '';
  return `${base}${tag}.${format.ext || 'mp4'}`;
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: JSON_HEADERS });
  if (req.method !== 'POST') {
    return Response.json(
      { success: false, error: 'استخدم POST', code: 'METHOD_NOT_ALLOWED' },
      { status: 405, headers: JSON_HEADERS }
    );
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return Response.json(
      { success: false, error: 'صيغة الطلب غير صالحة', code: 'BAD_JSON' },
      { status: 400, headers: JSON_HEADERS }
    );
  }

  const started = Date.now();

  try {
    const urlObj = normaliseUrl(payload?.url);
    const platform = detectPlatform(urlObj);

    if (!platform) {
      return Response.json(
        {
          success: false,
          error: `${urlObj.hostname} غير مدعوم حاليًا`,
          code: 'UNSUPPORTED_PLATFORM',
          supported: Object.values(PLATFORMS).map((p) => p.label),
        },
        { status: 400, headers: JSON_HEADERS }
      );
    }

    // Hard timeout so we always answer before Netlify's 10s function cap.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    let info;
    try {
      info = await EXTRACTORS[platform](urlObj.href, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }

    const formatCount =
      (info.formats.muxed?.length || 0) +
      (info.formats.videoOnly?.length || 0) +
      (info.formats.audioOnly?.length || 0);

    return Response.json(
      {
        success: true,
        data: {
          ...info,
          formats: proxify(info.formats, info),
          formatCount,
        },
        meta: { elapsedMs: Date.now() - started },
      },
      { status: 200, headers: JSON_HEADERS }
    );
  } catch (err) {
    const isAbort = err.name === 'AbortError';
    const code = isAbort ? 'TIMEOUT' : err.code || 'EXTRACTION_FAILED';
    const status =
      code === 'TIMEOUT'
        ? 504
        : /INVALID|MISSING|UNSUPPORTED|BAD_|BLOCKED|URL_TOO_LONG/.test(code)
          ? 400
          : 502;

    return Response.json(
      {
        success: false,
        error: isAbort
          ? 'استغرق الاستخراج وقتًا طويلاً. حاول مرة أخرى.'
          : err.message || 'تعذّر استخراج الفيديو',
        code,
        meta: { elapsedMs: Date.now() - started },
      },
      { status, headers: JSON_HEADERS }
    );
  }
};

export const config = { path: '/api/extract' };
