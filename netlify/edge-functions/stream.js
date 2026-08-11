// GET /api/stream?u=<cdn-url>&n=<filename>
//
// Streaming download proxy, deliberately implemented as an EDGE function
// (Deno, runs on Netlify's CDN) rather than a normal serverless function:
//
//   * Regular Netlify functions cap at 10s runtime and ~6MB response — a 50MB
//     video is impossible there.
//   * Edge functions can return a streaming ReadableStream, so bytes are piped
//     straight from the origin CDN to the user without ever being buffered in
//     memory or written to disk. Memory stays flat regardless of file size.
//
// It exists to solve two hard problems:
//   1. CORS: media CDNs send no Access-Control-Allow-Origin, so the browser
//      cannot fetch them from our origin. We re-emit the bytes from our origin.
//   2. Saving: a raw CDN link opens in a tab. We set Content-Disposition so the
//      browser saves the file with the real video title as its name.
//
// Range requests are forwarded verbatim, which keeps seeking, pausing and
// resuming working in download managers.

const ALLOWED_HOSTS = [
  /(?:^|\.)googlevideo\.com$/,
  /(?:^|\.)youtube\.com$/,
  /(?:^|\.)ytimg\.com$/,
  /(?:^|\.)tiktokcdn(?:-\w+)?\.com$/,
  /(?:^|\.)tiktokv\.com$/,
  /(?:^|\.)muscdn\.com$/,
  /(?:^|\.)akamaized\.net$/,
  /(?:^|\.)vimeocdn\.com$/,
  /(?:^|\.)redd\.it$/,
  /(?:^|\.)redditmedia\.com$/,
  /(?:^|\.)twimg\.com$/,
  /(?:^|\.)dailymotion\.com$/,
  /(?:^|\.)dmcdn\.net$/,
  // Piped / Invidious mirrors proxy YouTube media on their own domains, so when
  // extraction falls back to a mirror the resulting urls must be streamable too.
  /(?:^|\.)piped\.[\w.]+$/,
  /(?:^|\.)pipedproxy[\w.-]*\.[\w.]+$/,
  /(?:^|\.)kavin\.rocks$/,
  /(?:^|\.)adminforge\.de$/,
  /(?:^|\.)private\.coffee$/,
  /(?:^|\.)reallyaweso\.me$/,
  /(?:^|\.)drgns\.space$/,
  /(?:^|\.)nadeko\.net$/,
  /(?:^|\.)nerdvpn\.de$/,
  /(?:^|\.)yewtu\.be$/,
  /(?:^|\.)privacyredirect\.com$/,
  /(?:^|\.)melmac\.space$/,
];

// Referer/Origin some CDNs require before they serve bytes.
function originHeadersFor(host) {
  if (/tiktok|muscdn/.test(host)) {
    return { Referer: 'https://www.tiktok.com/', Origin: 'https://www.tiktok.com' };
  }
  if (/vimeocdn/.test(host)) return { Referer: 'https://player.vimeo.com/' };
  if (/redd\.it|redditmedia/.test(host)) return { Referer: 'https://www.reddit.com/' };
  if (/twimg/.test(host)) return { Referer: 'https://twitter.com/' };
  if (/dailymotion|dmcdn/.test(host)) return { Referer: 'https://www.dailymotion.com/' };
  if (/googlevideo/.test(host)) {
    // googlevideo is picky: it wants a plausible client UA, and no Referer.
    return {
      'User-Agent':
        'com.google.ios.youtube/20.10.4 (iPhone16,2; U; CPU iOS 18_3_2 like Mac OS X)',
    };
  }
  return {};
}

/**
 * RFC 5987 encoding so Arabic filenames survive the HTTP header round-trip.
 * We send both a plain ASCII fallback and the UTF-8 version.
 */
function contentDisposition(filename) {
  const safe = filename || 'video.mp4';
  const ascii = safe.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '');
  const encoded = encodeURIComponent(safe);
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

export default async (request) => {
  const reqUrl = new URL(request.url);
  const target = reqUrl.searchParams.get('u');
  const filename = reqUrl.searchParams.get('n') || 'video.mp4';

  if (!target) {
    return new Response(JSON.stringify({ error: 'المعامل u مفقود' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return new Response(JSON.stringify({ error: 'رابط غير صالح' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  // Allow-list check: without this the proxy would be an open relay that anyone
  // could abuse to burn our bandwidth quota.
  const host = parsed.hostname.toLowerCase();
  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.some((re) => re.test(host))) {
    return new Response(
      JSON.stringify({ error: 'هذا المصدر غير مسموح', host }),
      { status: 403, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }

  // Forward the client's Range header so seeking / resuming keeps working.
  const upstreamHeaders = {
    ...originHeadersFor(host),
    Accept: '*/*',
    'Accept-Encoding': 'identity', // never re-compress media
  };
  const range = request.headers.get('range');
  if (range) upstreamHeaders.Range = range;

  let upstream;
  try {
    upstream = await fetch(parsed.toString(), {
      headers: upstreamHeaders,
      redirect: 'follow',
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'تعذّر الاتصال بمصدر الفيديو', detail: String(e) }),
      { status: 502, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }

  if (!upstream.ok && upstream.status !== 206) {
    return new Response(
      JSON.stringify({
        error:
          upstream.status === 403
            ? 'انتهت صلاحية رابط التحميل. أعد تحليل الفيديو مرة أخرى.'
            : `رفض المصدر الطلب (${upstream.status})`,
      }),
      { status: upstream.status === 403 ? 410 : 502, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }

  // Pass through the headers that matter for a correct, resumable download.
  const out = new Headers({
    'Content-Disposition': contentDisposition(filename),
    'Content-Type': upstream.headers.get('content-type') || 'application/octet-stream',
    'Accept-Ranges': 'bytes',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  for (const h of ['content-length', 'content-range']) {
    const v = upstream.headers.get(h);
    if (v) out.set(h, v);
  }

  // upstream.body is a ReadableStream — returning it directly streams the bytes
  // through without buffering.
  return new Response(upstream.body, { status: upstream.status, headers: out });
};

export const config = { path: '/api/stream' };
