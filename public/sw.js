// Service worker: offline shell only.
//
// The previous version had one bug bad enough to matter and a lot of code for
// features that do not exist.
//
// The bug: '/api/' was routed to a "network first" strategy that cached every
// successful response. /api/stream is the download proxy, so a 2 GB video
// download was copied into the Cache API on its way to disk. That silently
// fills the origin's storage quota, and once the quota is hit the browser starts
// evicting, so downloads begin failing for reasons no user could diagnose. API
// traffic is now skipped entirely: it never enters this file.
//
// Removed as fiction: push notification handling and a notificationclick
// handler (no push subscription exists anywhere and no server can send one), a
// background-sync handler whose body was a console.log, a getCacheSize()
// function that read every cached response into a Blob to sum sizes (nothing
// called it), and a fallback to /offline.html, a file that does not exist, so
// the offline path returned undefined instead of a page.
//
// CACHE_VERSION must change whenever the shell changes, otherwise returning
// visitors keep the old design forever. That is why the old 'v1.2.0' keys are
// gone rather than reused.

// Bumped to v5: install-time asset precache plus pathname-keyed cache entries.
// A visitor holding an older cache must not keep a version that could not boot
// offline, so the key changes with every behavioural change in this file.
const CACHE_VERSION = 'v5';
const SHELL_CACHE = `shell-${CACHE_VERSION}`;

// Only what is needed to render something offline. Hashed asset filenames change
// every build and cannot be listed here, so they are discovered at install time
// by parsing index.html (see cacheShell below).
const SHELL_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

/*
 * Caching the HTML alone is not enough, and the previous version got this wrong
 * in a way that only showed up when measured. On a first visit the page requests
 * its hashed JS and CSS before this worker takes control, so those requests
 * never reach the fetch handler and never enter the cache. Going offline then
 * produced an HTTP 200 with a completely blank body: the shell HTML was served,
 * but the bundle it needs to boot was missing. Measured before the fix:
 *
 *   after 1st load: 4 entries, 0 under /assets/   -> offline = blank page
 *   after reload:   8 entries, 4 under /assets/   -> offline = works
 *
 * So the offline promise held only for returning visitors, which is the opposite
 * of what an offline shell is for. Fix: read index.html during install and cache
 * the assets it references, so the very first visit is already offline-capable.
 */
async function cacheShell(cache) {
  // addAll() rejects the whole install if any single request fails, which would
  // leave the worker permanently uninstalled. Cache individually.
  await Promise.allSettled(SHELL_ASSETS.map((asset) => cache.add(asset)));

  try {
    const res = await fetch('/index.html', { cache: 'reload' });
    if (!res.ok) return;
    const html = await res.text();
    // Same-origin build output only. Vite emits hashed files under /assets/,
    // referenced from src="/assets/..." and href="/assets/...".
    const refs = new Set();
    for (const m of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) refs.add(m[1]);
    // put() keyed on the plain path rather than add(), so the entry is stored
    // under a key the fetch handler can find regardless of the request mode the
    // browser later uses. See the long note in the /assets/ branch below.
    await Promise.allSettled(
      [...refs].map(async (u) => {
        const r = await fetch(u, { cache: 'reload' });
        if (r.ok) await cache.put(u, r);
      })
    );
  } catch {
    // Offline or a fetch failure during install: the lazy /assets/ path in the
    // fetch handler still populates the cache on a later visit. Never let this
    // reject, or the worker fails to install at all.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      await cacheShell(cache);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((n) => n !== SHELL_CACHE).map((n) => caches.delete(n))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  // Same-origin only. Fonts, the jsDelivr CDN and platform media are left to the
  // browser's own HTTP cache, which already handles them correctly.
  if (url.origin !== self.location.origin) return;

  // Never intercept the API. Extraction must always be fresh, and the stream
  // proxy must never be buffered into storage.
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/')) {
    return;
  }

  // Navigations: network first so a deploy is picked up immediately, with the
  // cached shell as the offline fallback. The SPA serves every route from
  // index.html, so that one entry covers all of them.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          const cache = await caches.open(SHELL_CACHE);
          return (
            (await cache.match(request)) ||
            (await cache.match('/index.html')) ||
            new Response('لا يوجد اتصال بالإنترنت.', {
              status: 503,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            })
          );
        }
      })()
    );
    return;
  }

  // Build output under /assets/ is content-hashed, so a cache hit can never be
  // stale: a changed file gets a different filename.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(SHELL_CACHE);
        /*
         * Match on the URL string, not the Request object. Vite emits its module
         * scripts with a `crossorigin` attribute, so the browser requests them
         * in CORS mode, while cache.add() during install stores them as
         * same-origin 'basic' responses. cache.match(request) compares those and
         * misses, which is a genuinely invisible failure: the entry is sitting in
         * the cache, DevTools shows it, and the request still goes to the network
         * and dies offline. Measured symptom before this fix, offline first
         * visit:
         *
         *   script /assets/index-*.js   net::ERR_FAILED
         *   script /assets/vendor-*.js  net::ERR_FAILED
         *   script /assets/router-*.js  net::ERR_FAILED
         *   -> HTTP 200 shell with bodyLen 0, a blank white page
         *
         * The stylesheet has no crossorigin attribute and so was the only asset
         * that resolved, which is what made the pattern obvious. Keying on
         * url.pathname sidesteps request-mode comparison entirely, and is safe
         * because these filenames are content-hashed.
         */
        const hit =
          (await cache.match(url.pathname, { ignoreVary: true })) ||
          (await cache.match(request, { ignoreVary: true }));
        if (hit) return hit;

        // No cache entry: go to the network. A rejection here propagates to the
        // page as a failed request, which is correct. Returning a synthetic 200
        // would leave the page half-booted with no diagnosable cause.
        const response = await fetch(request);
        // Store under the pathname so a later CORS-mode request still hits.
        if (response.ok) await cache.put(url.pathname, response.clone());
        return response;
      })()
    );
  }
});

// Lets the page trigger an update without a manual reload.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
