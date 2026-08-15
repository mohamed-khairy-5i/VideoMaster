// Client-side API layer. Talks to /api/extract and formats results for the UI.
// No mock data anywhere in this file. Every value shown to the user comes from
// the real platform response.

export class APIError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.status = status;
  }
}

const SUPPORTED = [
  { key: 'youtube', label: 'YouTube', test: /(youtube\.com|youtu\.be|youtube-nocookie\.com)/i },
  { key: 'tiktok', label: 'TikTok', test: /tiktok\.com/i },
  { key: 'vimeo', label: 'Vimeo', test: /vimeo\.com/i },
  { key: 'reddit', label: 'Reddit', test: /(reddit\.com|redd\.it)/i },
  { key: 'twitter', label: 'Twitter / X', test: /(twitter\.com|x\.com)/i },
  { key: 'dailymotion', label: 'Dailymotion', test: /(dailymotion\.com|dai\.ly)/i },
];

export const SUPPORTED_PLATFORMS = SUPPORTED.map(({ key, label }) => ({ key, label }));

/** Local platform guess, used to give instant feedback while typing. */
export function detectPlatform(url) {
  if (!url) return null;
  const hit = SUPPORTED.find((p) => p.test.test(url));
  return hit ? hit.key : null;
}

/** Cleans the pasted text the same way the server will. */
export function cleanUrl(raw) {
  return (raw || '').trim().replace(/[\u200B-\u200F\u202A-\u202E\uFEFF]/g, '');
}

export function looksLikeUrl(raw) {
  const s = cleanUrl(raw);
  if (!s) return false;
  return /^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(s);
}

/** Call the extraction API and return normalised video info. */
export async function extractVideo(url, { signal } = {}) {
  const cleaned = cleanUrl(url);
  if (!looksLikeUrl(cleaned)) {
    throw new APIError('الرجاء لصق رابط فيديو صالح', 'INVALID_URL', 400);
  }

  let res;
  try {
    res = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: cleaned }),
      signal,
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new APIError('فشل الاتصال. تحقّق من الإنترنت وحاول مرة أخرى.', 'NETWORK_ERROR', 0);
  }

  let json;
  try {
    json = await res.json();
  } catch {
    throw new APIError('رد غير متوقّع من الخادم', 'BAD_RESPONSE', res.status);
  }

  if (!res.ok || !json.success) {
    throw new APIError(
      json?.error || 'تعذّر تحليل الفيديو',
      json?.code || 'EXTRACTION_FAILED',
      res.status
    );
  }
  return json.data;
}

/* ------------------------------------------------------------ presentation */

export function formatDuration(totalSeconds) {
  if (!totalSeconds && totalSeconds !== 0) return null;
  const s = Math.round(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

export function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return null;
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n < 10 && i > 0 ? n.toFixed(1) : Math.round(n)} ${units[i]}`;
}

export function formatCount(n) {
  if (n === null || n === undefined) return null;
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)} مليار`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)} مليون`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)} ألف`;
  return String(n);
}

/**
 * Turn the raw format lists into the choices we actually want to show.
 *
 * The important product decision here: a 4K YouTube stream is video-only, and a
 * naive site either hides it or hands the user a silent file. We surface it and
 * mark it `needsMux`, so the UI can merge it with the best audio track in the
 * browser via ffmpeg.wasm, giving 4K-with-sound at zero server cost.
 */
export function buildDownloadOptions(info) {
  const { muxed = [], videoOnly = [], audioOnly = [] } = info.formats || {};
  const bestAudio = audioOnly[0] || null;

  const options = [];

  // 1) Ready-to-save files: no processing, instant download.
  for (const f of muxed) {
    options.push({
      id: `muxed-${f.itag}`,
      kind: 'video',
      label: f.qualityLabel || `${f.height || ''}p` || 'فيديو',
      ext: f.ext,
      filesize: f.filesize,
      fps: f.fps,
      downloadUrl: f.downloadUrl,
      instant: true,
      needsMux: false,
      noWatermark: f.noWatermark,
      isHls: f.isHls,
      note: f.noWatermark ? 'بدون علامة مائية' : 'صوت وصورة، تحميل فوري',
    });
  }

  // 2) High-resolution video-only tracks, merged locally with the best audio.
  if (bestAudio) {
    const seen = new Set(muxed.map((m) => m.height));
    for (const f of videoOnly) {
      if (!f.height || seen.has(f.height)) continue;
      seen.add(f.height);
      options.push({
        id: `mux-${f.itag}`,
        kind: 'video',
        label: f.qualityLabel || `${f.height}p`,
        ext: 'mp4',
        // Combined size = video track + audio track.
        filesize: (f.filesize || 0) + (bestAudio.filesize || 0) || null,
        fps: f.fps,
        videoUrl: f.downloadUrl,
        audioUrl: bestAudio.downloadUrl,
        instant: false,
        needsMux: true,
        note: 'يُدمج داخل متصفحك، ولا يُرفع الملف لأي خادم',
      });
    }
  }

  // 3) Audio-only extraction.
  for (const f of audioOnly.slice(0, 3)) {
    options.push({
      id: `audio-${f.itag}`,
      kind: 'audio',
      label: f.qualityLabel || (f.bitrate ? `${Math.round(f.bitrate / 1000)} kbps` : 'صوت'),
      ext: f.ext,
      filesize: f.filesize,
      downloadUrl: f.downloadUrl,
      instant: true,
      needsMux: false,
      note: 'صوت فقط',
    });
  }

  // Highest quality first within each group; video groups before audio.
  const rank = (o) => (o.kind === 'video' ? 0 : 1);
  const px = (o) => parseInt(String(o.label), 10) || 0;
  options.sort((a, b) => rank(a) - rank(b) || px(b) - px(a));

  return options;
}

/**
 * Save a URL to disk. Because the proxy sets Content-Disposition, a plain
 * navigation is enough and the browser streams the file itself, so there is no
 * memory pressure in the tab, and downloads survive page navigation.
 */
export function saveDirect(downloadUrl) {
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
