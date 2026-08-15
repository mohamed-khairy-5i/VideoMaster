// Generates dist/sitemap.xml at build time.
//
// Why generated rather than committed: a sitemap requires absolute URLs, and the
// domain is not decided yet. The committed file hardcoded https://vidcatch.pro,
// a domain nobody here owns, and listed three routes that do not exist (/api,
// /platform/instagram, /platform/facebook). Submitting URLs that return the SPA
// fallback for missing routes trains the crawler to distrust the whole sitemap.
//
// Netlify exposes the deployed origin as URL (and DEPLOY_PRIME_URL for previews),
// so the correct host is filled in automatically the moment a domain is attached.
// With no origin available, no sitemap is written at all: absent is honest,
// wrong is not.
//
// The route list is derived from the same source of truth the app uses, so a
// platform cannot appear here unless the extractor actually supports it.

import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const origin = (process.env.URL || process.env.DEPLOY_PRIME_URL || '').replace(/\/+$/, '');

if (!origin) {
  console.log('[sitemap] no URL env var, skipping (expected in local builds)');
  process.exit(0);
}

// Parse the platform keys straight out of api.js rather than duplicating them.
const api = await readFile(join(root, 'src/utils/api.js'), 'utf8');
const block = api.match(/const SUPPORTED = \[([\s\S]*?)\];/);
if (!block) {
  console.error('[sitemap] could not find SUPPORTED in src/utils/api.js');
  process.exit(1);
}
const platforms = [...block[1].matchAll(/key:\s*'([^']+)'/g)].map((m) => m[1]);
if (!platforms.length) {
  console.error('[sitemap] SUPPORTED parsed but empty');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

// priority/changefreq are omitted deliberately: Google has stated it ignores
// both, so emitting them is noise that implies precision we do not have.
const routes = [
  '/',
  '/about',
  '/privacy',
  '/terms',
  ...platforms.map((p) => `/platform/${p}`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url>\n    <loc>${origin}${r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join('\n')}
</urlset>
`;

await mkdir(join(root, 'dist'), { recursive: true });
await writeFile(join(root, 'dist/sitemap.xml'), xml, 'utf8');

// robots.txt ships without a Sitemap line for the same reason. Append it here,
// where the origin is finally known.
const robotsPath = join(root, 'dist/robots.txt');
try {
  const robots = await readFile(robotsPath, 'utf8');
  if (!/^Sitemap:/m.test(robots)) {
    await writeFile(robotsPath, `${robots.trimEnd()}\nSitemap: ${origin}/sitemap.xml\n`, 'utf8');
  }
} catch {
  console.log('[sitemap] dist/robots.txt not found, skipped Sitemap line');
}

console.log(`[sitemap] wrote ${routes.length} urls for ${origin}`);
