import { createServer } from 'node:http';
import { incomingJob, verifyWebhook } from './linq.ts';
import type { Store } from './store.ts';

export function webhookServer(store: Store, settings: { owner: string; line: string; secret: string }, wake: () => void) {
  return createServer(async (req, res) => {
    const path = new URL(req.url || '/', 'http://localhost').pathname;
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET' && path === '/healthz') { res.end('{"ok":true}'); return; }
    if (req.method !== 'POST' || path !== '/webhooks/linq') { res.writeHead(404).end('{"error":"not found"}'); return; }
    const chunks: Buffer[] = [];
    let size = 0;
    try {
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 256 * 1024) { res.writeHead(413).end('{"error":"body too large"}'); return; }
        chunks.push(Buffer.from(chunk));
      }
      const raw = Buffer.concat(chunks);
      if (!verifyWebhook(raw, req.headers, settings.secret)) { res.writeHead(401).end('{"error":"invalid signature"}'); return; }
      let job;
      try { job = incomingJob(JSON.parse(raw.toString('utf8')), settings.owner, settings.line); }
      catch { res.writeHead(400).end('{"error":"invalid event; use webhook version 2026-02-03"}'); return; }
      if (job) store.enqueue(job);
      res.writeHead(200).end('{"ok":true}');
      if (job) wake();
    } catch { if (!res.writableEnded) res.writeHead(500).end('{"error":"retry later"}'); }
  });
}
