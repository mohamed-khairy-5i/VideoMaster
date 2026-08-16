// URL validation + platform routing.
// Security note: this is also our SSRF guard. Only hostnames on the allow-list
// below are ever fetched by the extractors or streamed by the proxy.

export const PLATFORMS = {
  youtube: {
    label: 'YouTube',
    pattern: /(?:^|\.)(youtube\.com|youtu\.be|youtube-nocookie\.com)$/,
    supported: true,
  },
  tiktok: { label: 'TikTok', pattern: /(?:^|\.)(tiktok\.com|tiktokv\.com)$/, supported: true },
  reddit: { label: 'Reddit', pattern: /(?:^|\.)(reddit\.com|redd\.it)$/, supported: true },
  twitter: { label: 'Twitter / X', pattern: /(?:^|\.)(twitter\.com|x\.com|t\.co)$/, supported: true },
};

// Hostnames the streaming proxy is allowed to fetch bytes from.
// Keeping this tight is what stops the proxy being used as an open relay.
export const STREAM_HOST_ALLOWLIST = [
  /(?:^|\.)googlevideo\.com$/,
  /(?:^|\.)youtube\.com$/,
  /(?:^|\.)ytimg\.com$/,
  /(?:^|\.)tiktokcdn(?:-\w+)?\.com$/,
  /(?:^|\.)tiktokv\.com$/,
  /(?:^|\.)tiktokcdn-us\.com$/,
  /(?:^|\.)muscdn\.com$/,
  /(?:^|\.)akamaized\.net$/,
  /(?:^|\.)redd\.it$/,
  /(?:^|\.)redditmedia\.com$/,
  /(?:^|\.)twimg\.com$/,
];

export function isAllowedStreamHost(hostname) {
  const h = hostname.toLowerCase();
  return STREAM_HOST_ALLOWLIST.some((re) => re.test(h));
}

/**
 * Normalise user input into a URL object.
 * Users paste all kinds of things: missing scheme, invisible characters from
 * copy/paste on mobile, tracking params, wrapping whitespace.
 */
export function normaliseUrl(input) {
  if (typeof input !== 'string') {
    const e = new Error('الرجاء إدخال رابط');
    e.code = 'MISSING_URL';
    throw e;
  }

  let s = input
    .trim()
    // zero-width + BiDi marks that Arabic mobile keyboards inject
    .replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '');

  if (!s) {
    const e = new Error('الرجاء إدخال رابط');
    e.code = 'MISSING_URL';
    throw e;
  }
  if (s.length > 2048) {
    const e = new Error('الرابط طويل بشكل غير معتاد');
    e.code = 'URL_TOO_LONG';
    throw e;
  }
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`;

  let u;
  try {
    u = new URL(s);
  } catch {
    const e = new Error('هذا ليس رابطًا صالحًا');
    e.code = 'INVALID_URL';
    throw e;
  }

  if (!['http:', 'https:'].includes(u.protocol)) {
    const e = new Error('بروتوكول غير مدعوم');
    e.code = 'BAD_PROTOCOL';
    throw e;
  }

  // Block internal targets (SSRF hardening).
  const host = u.hostname.toLowerCase();
  const blocked =
    host === 'localhost' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ||
    /^\[?::1\]?$/.test(host) ||
    host.startsWith('169.254.') ||
    host.startsWith('metadata.');
  if (blocked) {
    const e = new Error('هذا العنوان غير مسموح');
    e.code = 'BLOCKED_HOST';
    throw e;
  }

  return u;
}

/** Identify which extractor should handle a URL. Returns null when unsupported. */
export function detectPlatform(urlObj) {
  const host = urlObj.hostname.toLowerCase().replace(/^www\./, '').replace(/^m\./, '');
  for (const [key, def] of Object.entries(PLATFORMS)) {
    if (def.pattern.test(host)) return key;
  }
  return null;
}
