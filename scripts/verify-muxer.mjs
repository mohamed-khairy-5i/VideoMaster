#!/usr/bin/env node
/*
 * Behavioural test for src/utils/muxer.js, the browser-side merge that is this
 * project's whole reason to exist. It had no test coverage at all, which is how
 * two resource leaks survived in it.
 *
 * This imports the real module. The two CDN imports inside it are redirected to
 * local stubs by scripts/fixtures/ffmpeg-loader.mjs, so the run needs no
 * network and no 30MB wasm download. Nothing about the code under test is
 * duplicated here: a test that reimplements its subject proves nothing.
 *
 * Run: npm run test:mux
 */
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./fixtures/ffmpeg-loader.mjs', import.meta.url);

const { FFmpeg, stubState, resetStubState } = await import('./fixtures/ffmpeg-stub.mjs');

// --- minimal browser shims the module expects -------------------------------

/** Serve a fixed byte length through a streaming Response, as fetchTrack expects. */
function fakeTrackResponse(bytes, { status = 200 } = {}) {
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(bytes));
      controller.close();
    },
  });
  return new Response(body, {
    status,
    headers: { 'content-length': String(bytes) },
  });
}

let fetchCalls = [];
globalThis.fetch = async (url) => {
  fetchCalls.push(String(url));
  if (String(url).includes('gone')) return fakeTrackResponse(0, { status: 410 });
  if (String(url).includes('boom')) return fakeTrackResponse(0, { status: 500 });
  return fakeTrackResponse(String(url).includes('audio') ? 512 : 4096);
};

// Node 22 defines navigator as a getter-only property, so it has to be
// redefined rather than assigned.
function setUserAgent(userAgent) {
  Object.defineProperty(globalThis, 'navigator', {
    value: { userAgent },
    configurable: true,
    writable: true,
  });
}
setUserAgent('Mozilla/5.0 (X11; Linux x86_64)');

// --- tiny assertion harness -------------------------------------------------

let passed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed += 1;
    console.log(`  ok   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` :: ${detail}` : ''}`);
    console.log(`  FAIL ${name}${detail ? ` :: ${detail}` : ''}`);
  }
}

const muxerUrl = pathToFileURL(new URL('../src/utils/muxer.js', import.meta.url).pathname).href;
const { muxVideoAudio, canMuxSafely } = await import(muxerUrl);

async function merge(id = 'q') {
  return muxVideoAudio({
    videoUrl: `https://example.test/${id}/video.mp4`,
    audioUrl: `https://example.test/${id}/audio.m4a`,
    onProgress: () => {},
    onStatus: () => {},
  });
}

// --- 1. a single merge works and cleans up ----------------------------------

console.log('\nmuxVideoAudio: happy path');
resetStubState();
const blob = await merge('first');
const ffmpeg = FFmpeg.last;

check('returns a Blob', blob instanceof Blob, `got ${blob?.constructor?.name}`);
check('blob is typed video/mp4', blob.type === 'video/mp4', blob.type);
check('blob carries the produced bytes', blob.size === 8, `size=${blob.size}`);
check('ffmpeg exec ran once', stubState.execCalls === 1, `${stubState.execCalls}`);
check(
  'both tracks were fetched',
  fetchCalls.filter((u) => u.startsWith('https://example.test/')).length === 2,
  fetchCalls.join(', ')
);
check(
  'virtual filesystem is empty afterwards',
  ffmpeg.openFiles.length === 0,
  `left behind: ${ffmpeg.openFiles.join(', ') || 'nothing'}`
);
check(
  'no progress listener is left attached',
  ffmpeg.progressListenerCount === 0,
  `${ffmpeg.progressListenerCount} still attached`
);

// --- 2. the engine instance is reused, so leaks compound --------------------

console.log('\nmuxVideoAudio: repeated merges in one session');
check('ffmpeg instance is cached, not rebuilt', stubState.instances === 1, `${stubState.instances}`);

// Count progress callbacks with ONE shared counter rather than one per merge.
// A per-merge counter would not catch this: each merge's callback closure only
// ever counts its own invocations, so stale listeners from earlier merges stay
// invisible. The shared total is what exposes them, because a leaked listener
// keeps calling the onProgress of a download that already finished.
let totalProgressCalls = 0;
const perMergeTotals = [];
for (const id of ['a', 'b', 'c', 'd', 'e']) {
  const before = totalProgressCalls;
  await muxVideoAudio({
    videoUrl: `https://example.test/${id}/video.mp4`,
    audioUrl: `https://example.test/${id}/audio.m4a`,
    onProgress: () => {
      totalProgressCalls += 1;
    },
    onStatus: () => {},
  });
  perMergeTotals.push(totalProgressCalls - before);
}

check(
  'listener count stays at zero across 5 merges',
  FFmpeg.last.progressListenerCount === 0,
  `${FFmpeg.last.progressListenerCount} attached after 5 merges`
);
check('the same instance served all merges', stubState.instances === 1, `${stubState.instances}`);

// Every merge does identical work, so every merge must cost the same number of
// progress callbacks. Growth means merge N is also driving the callbacks of
// merges 1..N-1.
check(
  'total progress work per merge does not grow',
  perMergeTotals.every((n) => n === perMergeTotals[0]),
  `per-merge callback totals: ${perMergeTotals.join(', ')}`
);
check(
  'virtual filesystem still empty after 5 merges',
  FFmpeg.last.openFiles.length === 0,
  `left behind: ${FFmpeg.last.openFiles.join(', ')}`
);

// --- 3. a failed merge must not strand resources ---------------------------

console.log('\nmuxVideoAudio: failure path');
stubState.failNextExecs = 1;
let threw = null;
try {
  await merge('doomed');
} catch (e) {
  threw = e;
}

check('a failed exec propagates to the caller', threw instanceof Error, `${threw}`);
check(
  'a failed merge frees the input tracks',
  FFmpeg.last.openFiles.length === 0,
  `stranded in wasm memory: ${FFmpeg.last.openFiles.join(', ')}`
);
check(
  'a failed merge removes its progress listener',
  FFmpeg.last.progressListenerCount === 0,
  `${FFmpeg.last.progressListenerCount} attached after a failure`
);

// A later merge must still succeed: proof the failure left nothing poisoned.
const after = await merge('recovered');
check('a merge after a failure still succeeds', after instanceof Blob, `${after}`);
check(
  'no listener accumulated across the failure',
  FFmpeg.last.progressListenerCount === 0,
  `${FFmpeg.last.progressListenerCount}`
);

// --- 4. expired and broken links surface a usable message ------------------

console.log('\nfetchTrack: error reporting');
let expired = null;
try {
  await muxVideoAudio({ videoUrl: 'https://example.test/gone/video.mp4', audioUrl: 'x' });
} catch (e) {
  expired = e;
}
check('410 is reported as an expired link', /انتهت صلاحية الرابط/.test(expired?.message || ''), expired?.message);

let broken = null;
try {
  await muxVideoAudio({ videoUrl: 'https://example.test/boom/video.mp4', audioUrl: 'x' });
} catch (e) {
  broken = e;
}
check('other failures report the status code', /\(500\)/.test(broken?.message || ''), broken?.message);
check(
  'a fetch failure leaves no listener behind',
  FFmpeg.last.progressListenerCount === 0,
  `${FFmpeg.last.progressListenerCount}`
);

// --- 5. the device guard ---------------------------------------------------

console.log('\ncanMuxSafely: device limits');
check('unknown size is allowed', canMuxSafely(0) === true);
check('a 700MB file is allowed on desktop', canMuxSafely(700 * 1024 * 1024) === true);
check('a 2GB file is refused on desktop', canMuxSafely(2 * 1024 * 1024 * 1024) === false);

setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)');
check('a 700MB file is refused on mobile', canMuxSafely(700 * 1024 * 1024) === false);
check('a 100MB file is allowed on mobile', canMuxSafely(100 * 1024 * 1024) === true);

// --- summary --------------------------------------------------------------

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
