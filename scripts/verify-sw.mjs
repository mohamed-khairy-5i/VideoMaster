#!/usr/bin/env node
/*
 * Service-worker invariant checks.
 *
 * Why this file exists: a service worker fails in ways that are invisible in
 * normal development. It only misbehaves for a returning visitor, or only on a
 * first visit, or only offline, and a broken one persists in the user's browser
 * until the cache key changes. Two real bugs found by measuring sw.js in a
 * headless browser motivated every assertion below.
 *
 * BUG 1 - the stream proxy was cached.
 *   '/api/' was routed to a network-first strategy that cached every successful
 *   response, so a 2 GB download was copied into the Cache API on its way to
 *   disk, filling the origin quota until downloads started failing.
 *
 * BUG 2 - offline served a blank page on a first visit.
 *   Vite emits its module scripts with a `crossorigin` attribute, so the browser
 *   requests them in CORS mode, while cache.add() stores them as same-origin
 *   'basic' responses. cache.match(request) compares request modes and misses,
 *   so the entry sat in the cache, was visible in DevTools, and the request
 *   still went to the network and died offline:
 *
 *     script /assets/index-*.js   net::ERR_FAILED
 *     script /assets/vendor-*.js  net::ERR_FAILED
 *     script /assets/router-*.js  net::ERR_FAILED
 *     -> HTTP 200 shell, bodyLen 0, blank white page
 *
 *   The stylesheet carries no crossorigin attribute and was the only asset that
 *   resolved, which is what exposed the pattern. Fixed by keying cache entries
 *   on the pathname, which is safe because those filenames are content-hashed.
 *
 * These are static checks: no browser and no dependencies, so they run anywhere
 * and cost nothing. The full behavioural test needs a real browser and is
 * documented in README under "اختبار العمل بدون اتصال".
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const swPath = join(root, 'public', 'sw.js');

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const bold = (s) => `\x1b[1m${s}\x1b[0m`;

let passed = 0;
const failures = [];

function check(name, condition, why) {
  if (condition) {
    passed++;
    console.log(`  ${green('✓')} ${name}`);
  } else {
    failures.push({ name, why });
    console.log(`  ${red('✗')} ${name}`);
    console.log(`      ${why}`);
  }
}

if (!existsSync(swPath)) {
  console.error(red('public/sw.js not found'));
  process.exit(1);
}
const sw = readFileSync(swPath, 'utf8');
// Strip comments so prose describing a past bug cannot satisfy or trip a check.
const code = sw
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '');

console.log(`\n${bold('Service worker invariants')}`);

check(
  'API traffic is never intercepted',
  /startsWith\(['"]\/api\/['"]\)/.test(code) && /return;/.test(code),
  "The '/api/' guard is gone. Caching /api/stream copies whole video downloads " +
    'into the Cache API and exhausts the origin storage quota (BUG 1).'
);

check(
  'no cache.put on an API response',
  !/\/api\/[\s\S]{0,200}cache\.put/.test(code),
  'A cache.put appears near an /api/ branch. The stream proxy must never be stored.'
);

check(
  'asset lookups are keyed on pathname, not the Request',
  /cache\.match\(\s*url\.pathname/.test(code),
  'Asset lookup no longer matches on url.pathname. cache.match(request) misses ' +
    'CORS-mode module scripts and produces a blank offline page (BUG 2).'
);

check(
  'asset writes are keyed on pathname',
  /cache\.put\(\s*url\.pathname/.test(code),
  'cache.put must be keyed on url.pathname so a later CORS-mode request hits.'
);

check(
  'ignoreVary is set on cache lookups',
  /ignoreVary:\s*true/.test(code),
  'Without ignoreVary a Vary header on the response can cause a silent miss.'
);

check(
  'install precaches the assets referenced by index.html',
  /matchAll\([^)]*assets/.test(code) || /\/\(\?:src\|href\)/.test(code),
  'Install no longer discovers hashed assets from index.html. On a first visit ' +
    'the page fetches them before the worker takes control, so nothing is ' +
    'cached and offline shows a blank page (BUG 2).'
);

check(
  'install cannot reject on a network failure',
  /Promise\.allSettled/.test(code) && /catch\s*\{/.test(code),
  'A rejected install leaves the worker permanently uninstalled. Use ' +
    'allSettled and swallow fetch failures.'
);

check(
  'activate deletes every non-current cache',
  /caches\.keys\(\)/.test(code) && /caches\.delete\(/.test(code),
  'Stale cache versions are never evicted, so returning visitors keep the old ' +
    'shell (and any broken behaviour) forever.'
);

check(
  'a single CACHE_VERSION drives the cache key',
  /const CACHE_VERSION\s*=/.test(code) && /shell-\$\{CACHE_VERSION\}/.test(code),
  'The cache name must derive from CACHE_VERSION so one edit invalidates it.'
);

check(
  'non-GET requests are ignored',
  /request\.method\s*!==\s*['"]GET['"]/.test(code),
  'Only GET is cacheable. Intercepting POST breaks form and API semantics.'
);

check(
  'cross-origin requests are ignored',
  /url\.origin\s*!==\s*self\.location\.origin/.test(code),
  'Caching third-party responses duplicates the browser HTTP cache and can ' +
    'store opaque responses that cannot be validated.'
);

check(
  'navigation has an offline fallback to the shell',
  /mode\s*===\s*['"]navigate['"]/.test(code) && /index\.html/.test(code),
  'Without a navigation fallback an offline visit gets a network error page. ' +
    'The SPA serves every route from index.html, so that one entry covers all.'
);

check(
  'no reference to a non-existent offline page',
  !/offline\.html/.test(code),
  'offline.html does not exist in public/. Referencing it makes the offline ' +
    'path resolve to undefined instead of a page.'
);

// The version must be bumped whenever behaviour changes. We cannot detect that
// statically, but we can require the marker to be present and well formed.
const version = sw.match(/const CACHE_VERSION\s*=\s*['"]([^'"]+)['"]/);
check(
  'CACHE_VERSION is a simple incrementing token',
  version && /^v\d+$/.test(version[1]),
  `CACHE_VERSION is ${version ? `'${version[1]}'` : 'missing'}. Use v1, v2, ... ` +
    'so it is obvious whether a deploy invalidated the cache.'
);

console.log(
  `\n${failures.length === 0 ? green(`${passed} passed, 0 failed`) : red(`${passed} passed, ${failures.length} failed`)}`
);
if (version) console.log(`cache key: shell-${version[1]}\n`);

process.exit(failures.length === 0 ? 0 : 1);
