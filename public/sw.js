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

const CACHE_VERSION = 'v3';
const SHELL_CACHE = `shell-${CACHE_VERSION}`;

// Only what is needed to render something offline. Hashed assets are added
// lazily on first visit, because their filenames change every build and cannot
// be listed here.
const SHELL_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // addAll() rejects the whole install if any single request fails, which
      // would leave the worker permanently uninstalled. Cache individually.
      await Promise.allSettled(SHELL_ASSETS.map((asset) => cache.add(asset)));
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
        const hit = await cache.match(request);
        if (hit) return hit;

        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })()
    );
  }
});

// Lets the page trigger an update without a manual reload.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
