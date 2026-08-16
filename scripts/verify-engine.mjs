#!/usr/bin/env node
// Engine smoke test. Run with `npm run test:extract`.
//
// Extractors depend on third-party endpoints that change without notice, so this
// script exists to answer "is the engine still working?" in a few seconds,
// without deploying. It hits the real network on purpose.

import { extractYouTube } from '../netlify/functions/lib/youtube.js';
import extractHandler from '../netlify/functions/extract.js';
import streamHandler from '../netlify/edge-functions/stream.js';

// Why this suite now checks bytes and not just object shape:
//
// The previous version asserted `r.title && formatCount > 0`. A Dailymotion
// extractor that built its download URL by string concatenation, never fetched
// it, and returned a manifest link that answered 403 passed this test for its
// entire life. The test was measuring that we had built an object, not that a
// user could download a video. Shape assertions cannot catch a dead URL, so
// every extractor case below is followed by a real ranged GET.
const CASES = [
  { name: 'YouTube (classic)', fn: () => extractYouTube('https://www.youtube.com/watch?v=dQw4w9WgXcQ') },
  { name: 'YouTube (youtu.be)', fn: () => extractYouTube('https://youtu.be/9bZkp7q19f0') },
];

/**
 * Fetch the first bytes of a stream and confirm they are really media.
 * A 200 response is not enough: a 403 HTML error page and an m3u8 playlist are
 * both "successful" fetches that are useless to the user. We look at the magic
 * bytes instead.
 */
async function assertRealMedia(url) {
  const headers = { 'User-Agent': 'Mozilla/5.0', Range: 'bytes=0-4095' };
  if (/tiktok|muscdn/.test(url)) headers.Referer = 'https://www.tiktok.com/';
  if (/redd\.it|redditmedia/.test(url)) headers.Referer = 'https://www.reddit.com/';
  if (/twimg/.test(url)) headers.Referer = 'https://twitter.com/';

  const res = await fetch(url, { headers });
  if (!res.ok && res.status !== 206) return { ok: false, why: `HTTP ${res.status}` };

  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.length === 0) return { ok: false, why: 'empty body' };

  const head = new TextDecoder('latin1').decode(buf.slice(0, 64));
  if (head.startsWith('#EXTM3U')) return { ok: false, why: 'HLS playlist, not a video file' };
  if (/^\s*<(!doctype|html)/i.test(head)) return { ok: false, why: 'HTML error page' };

  // MP4/MOV carry an 'ftyp' box early; WebM/Matroska start with 0x1A45DFA3.
  const isMp4 = head.includes('ftyp');
  const isWebm = buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3;
  if (!isMp4 && !isWebm) return { ok: false, why: 'unrecognised container' };

  return { ok: true, bytes: buf.length, kind: isMp4 ? 'mp4' : 'webm' };
}

let pass = 0;
let fail = 0;
let warn = 0;

const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const bad = (m) => console.log(`  \x1b[31m✗\x1b[0m ${m}`);
const note = (m) => console.log(`  \x1b[33m!\x1b[0m ${m}`);

console.log('\n\x1b[1mExtractors\x1b[0m');
for (const c of CASES) {
  const t = Date.now();
  try {
    const r = await c.fn();
    const all = [
      ...(r.formats.muxed || []),
      ...(r.formats.videoOnly || []),
      ...(r.formats.audioOnly || []),
    ];
    if (!r.title || all.length === 0) throw new Error('no title or no formats');

    // The part that actually matters: can we pull real media bytes back?
    const probe = await assertRealMedia(all[0].url);
    if (!probe.ok) throw new Error(`format looked fine but ${probe.why}`);

    ok(
      `${c.name} · "${r.title.slice(0, 32)}" · ${all.length} formats · via ${r.extractedVia}` +
        ` · ${probe.bytes}B real ${probe.kind} · ${Date.now() - t}ms`
    );
    pass++;
  } catch (e) {
    // YouTube rate-limits by source IP. On a shared cloud/CI address some videos
    // answer LOGIN_REQUIRED no matter how the request is built; yt-dlp fails on
    // the same IP too. That is an environment condition, not a code regression,
    // so we surface it as a warning instead of failing the suite.
    if (e.code === 'YOUTUBE_BOT_CHECK') {
      note(`${c.name} · bot check on this IP (expected on shared hosts; not a code fault)`);
      warn++;
    } else {
      bad(`${c.name} · ${e.message}`);
      fail++;
    }
  }
}

console.log('\n\x1b[1mValidation & security\x1b[0m');
const call = async (url) => {
  const res = await extractHandler(
    new Request('https://local/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
  );
  return { status: res.status, body: await res.json() };
};

const guards = [
  ['rejects unsupported host', 'https://example.com/v', 'UNSUPPORTED_PLATFORM'],
  ['blocks localhost (SSRF)', 'http://localhost/x', 'BLOCKED_HOST'],
  ['blocks raw IP (SSRF)', 'http://169.254.169.254/latest/meta-data', 'BLOCKED_HOST'],
  ['rejects empty input', '', 'MISSING_URL'],
];
for (const [label, url, expected] of guards) {
  try {
    const r = await call(url);
    if (r.body.code === expected) {
      ok(`${label} → ${r.body.code}`);
      pass++;
    } else {
      bad(`${label} → got ${r.body.code}, expected ${expected}`);
      fail++;
    }
  } catch (e) {
    bad(`${label} · threw ${e.message}`);
    fail++;
  }
}

// The proxy must never relay from a host outside the allow-list.
try {
  const res = await streamHandler(
    new Request('https://local/api/stream?u=https%3A%2F%2Fevil.example.com%2Fa.mp4&n=a.mp4')
  );
  if (res.status === 403) {
    ok('proxy refuses non-allow-listed host → 403');
    pass++;
  } else {
    bad(`proxy allowed a foreign host → ${res.status}`);
    fail++;
  }
} catch (e) {
  bad(`proxy guard · ${e.message}`);
  fail++;
}

console.log('\n\x1b[1mEnd-to-end byte transfer\x1b[0m');
try {
  const r = await call('https://youtu.be/dQw4w9WgXcQ');
  const target = r.body.data.formats.audioOnly[0] || r.body.data.formats.muxed[0];
  if (!target) throw new Error('no downloadable format returned');
  if (target.url !== undefined) throw new Error('raw CDN url leaked to client');

  const res = await streamHandler(
    new Request(`https://local${target.downloadUrl}`, { headers: { Range: 'bytes=0-65535' } })
  );
  const buf = new Uint8Array(await res.arrayBuffer());
  if (res.status !== 206 || buf.length === 0) {
    throw new Error(`status ${res.status}, ${buf.length} bytes`);
  }
  const cd = res.headers.get('content-disposition') || '';
  if (!cd.startsWith('attachment')) throw new Error('missing attachment disposition');

  ok(`streamed ${buf.length} real bytes · HTTP ${res.status} · forced download`);
  pass++;
} catch (e) {
  bad(`byte transfer · ${e.message}`);
  fail++;
}

console.log(
  `\n${fail === 0 ? '\x1b[32m' : '\x1b[31m'}${pass} passed, ${fail} failed` +
    `${warn ? `, ${warn} skipped (IP-blocked)` : ''}\x1b[0m\n`
);
process.exit(fail === 0 ? 0 : 1);
