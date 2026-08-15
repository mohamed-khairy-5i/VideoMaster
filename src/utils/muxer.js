// Client-side muxing with ffmpeg.wasm.
//
// The problem it solves: on YouTube, every stream above 720p is video-only:
// audio lives in a separate track. Competitors either cap you at 720p, hand you
// a silent 4K file, or run ffmpeg on their own servers (which costs money and
// cannot fit in a 10s serverless function).
//
// We do the merge inside the user's browser instead. Consequences:
//   * server cost stays at zero, so this scales with users instead of against us
//   * the media never touches a third-party machine, a real privacy guarantee
//   * quality is untouched: `-c copy` remuxes the containers without re-encoding,
//     so it is fast and lossless.
//
// ffmpeg.wasm is loaded lazily from a CDN on first use so the initial page load
// is unaffected for users who only need audio or 720p.

const FFMPEG_VERSION = '0.12.10';
const CORE_VERSION = '0.12.6';
const CDN = 'https://cdn.jsdelivr.net/npm';

let ffmpegPromise = null;

/** Load and initialise ffmpeg.wasm once, reusing the instance afterwards. */
async function getFFmpeg(onStatus) {
  if (ffmpegPromise) return ffmpegPromise;

  ffmpegPromise = (async () => {
    onStatus?.('جاري تحميل محرك الدمج (مرة واحدة فقط)…');

    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import(/* @vite-ignore */ `${CDN}/@ffmpeg/ffmpeg@${FFMPEG_VERSION}/dist/esm/index.js`),
      import(/* @vite-ignore */ `${CDN}/@ffmpeg/util@0.12.1/dist/esm/index.js`),
    ]);

    const coreBase = `${CDN}/@ffmpeg/core@${CORE_VERSION}/dist/esm`;
    const ffmpeg = new FFmpeg();

    // The core must be served same-origin as a blob, otherwise the worker is
    // blocked by cross-origin rules.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${coreBase}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${coreBase}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    return ffmpeg;
  })().catch((e) => {
    ffmpegPromise = null; // allow a retry on a later attempt
    throw e;
  });

  return ffmpegPromise;
}

/** Download one track, reporting progress as a fraction of the whole job. */
async function fetchTrack(url, onProgress, weight, offset) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      res.status === 410
        ? 'انتهت صلاحية الرابط. أعد تحليل الفيديو.'
        : `فشل تحميل المسار (${res.status})`
    );
  }

  const total = Number(res.headers.get('content-length')) || 0;
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (total) onProgress?.(offset + (received / total) * weight);
  }

  const out = new Uint8Array(received);
  let pos = 0;
  for (const c of chunks) {
    out.set(c, pos);
    pos += c.length;
  }
  return out;
}

/**
 * Merge a video-only track with an audio-only track into a single MP4.
 * Returns a Blob ready to be saved.
 */
export async function muxVideoAudio({ videoUrl, audioUrl, onProgress, onStatus }) {
  const ffmpeg = await getFFmpeg(onStatus);

  onStatus?.('جاري تنزيل مسار الفيديو…');
  // Budget: video 55%, audio 20%, merge 25%.
  const video = await fetchTrack(videoUrl, onProgress, 55, 0);

  onStatus?.('جاري تنزيل مسار الصوت…');
  const audio = await fetchTrack(audioUrl, onProgress, 20, 55);

  onStatus?.('جاري دمج الصوت مع الصورة…');
  onProgress?.(78);

  await ffmpeg.writeFile('v.dat', video);
  await ffmpeg.writeFile('a.dat', audio);

  ffmpeg.on('progress', ({ progress }) => {
    if (progress > 0 && progress <= 1) onProgress?.(78 + progress * 20);
  });

  // `-c copy` = remux only, no re-encode: lossless and roughly realtime.
  // faststart moves the moov atom to the front so the file plays while copying.
  await ffmpeg.exec([
    '-i', 'v.dat',
    '-i', 'a.dat',
    '-c', 'copy',
    '-map', '0:v:0',
    '-map', '1:a:0',
    '-movflags', '+faststart',
    '-f', 'mp4',
    'out.mp4',
  ]);

  const data = await ffmpeg.readFile('out.mp4');
  onProgress?.(100);
  onStatus?.('تم الدمج');

  // Free the virtual filesystem so repeated merges do not exhaust memory.
  for (const f of ['v.dat', 'a.dat', 'out.mp4']) {
    try {
      await ffmpeg.deleteFile(f);
    } catch {
      /* non-fatal */
    }
  }

  return new Blob([data.buffer ?? data], { type: 'video/mp4' });
}

/** Trigger a save dialog for an in-memory Blob. */
export function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment to start the write before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/**
 * Merging needs the whole file in RAM, so we keep it off devices that would
 * crash. Rough guide: mobile browsers tend to die well before desktop.
 */
export function canMuxSafely(totalBytes) {
  if (!totalBytes) return true;
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const limit = isMobile ? 350 * 1024 * 1024 : 1.5 * 1024 * 1024 * 1024;
  return totalBytes < limit;
}
