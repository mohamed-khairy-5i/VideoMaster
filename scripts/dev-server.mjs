#!/usr/bin/env node
// Local preview server.
//
// Netlify runs `extract` as a function and `stream` as an edge function; there
// is no single `npm run dev` that serves both plus the built site. This script
// wires all three together with the plain node http module so the full flow can
// be exercised locally exactly as it behaves in production.
//
// Usage: node scripts/dev-server.mjs   (expects `npm run build` to have run)

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { Readable } from 'node:stream';

import extractHandler from '../netlify/functions/extract.js';
import streamHandler from '../netlify/edge-functions/stream.js';

const ROOT = resolve(import.meta.dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

/** Bridge a node request into the WHATWG Request the handlers expect. */
async function toWebRequest(req) {
  const url = `http://${req.headers.host || 'localhost'}${req.url}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((x) => headers.append(k, x));
    else if (v != null) headers.set(k, v);
  }

  let body;
  if (!['GET', 'HEAD'].includes(req.method)) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    body = Buffer.concat(chunks);
  }
  return new Request(url, { method: req.method, headers, body });
}

/** Pipe a WHATWG Response back out through the node response. */
async function sendWebResponse(webRes, res) {
  const headers = {};
  webRes.headers.forEach((v, k) => {
    headers[k] = v;
  });
  res.writeHead(webRes.status, headers);
  if (!webRes.body) {
    res.end();
    return;
  }
  Readable.fromWeb(webRes.body).pipe(res);
}

const server = createServer(async (req, res) => {
  const path = new URL(req.url, 'http://localhost').pathname;

  try {
    if (path === '/api/extract') {
      return await sendWebResponse(await extractHandler(await toWebRequest(req)), res);
    }
    if (path === '/api/stream') {
      return await sendWebResponse(await streamHandler(await toWebRequest(req)), res);
    }

    // Static files, with SPA fallback to index.html.
    let filePath = join(ROOT, path === '/' ? 'index.html' : path.replace(/^\/+/, ''));
    try {
      const s = await stat(filePath);
      if (s.isDirectory()) filePath = join(filePath, 'index.html');
    } catch {
      filePath = join(ROOT, 'index.html');
    }

    const data = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: String(err?.message || err) }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`preview running on http://0.0.0.0:${PORT}`);
});
