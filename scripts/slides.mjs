import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { config, assertReady } from '../src/config.ts';
import { answer } from '../src/agent.ts';
import { Store } from '../src/store.ts';

const partnerAssets = ['similarweb.svg', 'crunchbase.avif', 'zoominfo.png', 'harmonic.svg', 'jinko.svg', 'particle.svg',
  'baselayer.svg', 'fiber.svg', 'affiliate.svg', 'financial-datasets.svg', 'definitive-healthcare.jpg', 'faraday.jpg',
  'intellizence.jpg', 'kernel.png', 'openalex.jpg', 'traject-data.jpg', 'databento.jpg', 'alpha-vantage.png'].map(name => `connect/${name}`);
const customerAssets = ['cursor.svg', 'cognition.png', 'hubspot.png'].map(name => `customers/${name}`);
const assets = new Map([
  ['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']],
  ['/deck.css', ['deck.css', 'text/css']], ['/deck.js', ['deck.js', 'text/javascript']],
  ['/demo.js', ['demo.js', 'text/javascript']],
  ['/highlights.js', ['highlights.js', 'text/javascript']],
  ['/presenter', ['presenter.html', 'text/html']], ['/presenter.html', ['presenter.html', 'text/html']],
  ['/presenter.js', ['presenter.js', 'text/javascript']], ['/presenter.css', ['presenter.css', 'text/css']],
  ['/presenter-sync.js', ['presenter-sync.js', 'text/javascript']],
  ['/assets/env.example', ['assets/env.example', 'text/plain']],
  ...['exa.svg', 'mem0.svg', 'qwen.png', 'similarweb.svg', 'financial-datasets.svg', 'particle.svg', 'linq-api-tokens.png', 'ngrok-authtoken.png', 'exa-sf-weather-og.png', 'imessage-demo-hero.png', ...partnerAssets, ...customerAssets]
    .map(name => [`/assets/${name}`, [`assets/${name}`, name.endsWith('.svg') ? 'image/svg+xml' : name.endsWith('.avif') ? 'image/avif' : name.endsWith('.jpg') ? 'image/jpeg' : 'image/png']]),
]);
let store;
let busy = false;
const server = createServer(async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store');
    const path = new URL(req.url || '/', 'http://localhost').pathname;
    if (req.method === 'GET' && path === '/workshop.html') {
      res.writeHead(302, { Location: '/#slide-14' }).end(); return;
    }
    if (req.method === 'GET' && path === '/api/status') {
      res.setHeader('Content-Type', 'application/json');
      let live = false;
      try { assertReady(); live = true; } catch {}
      res.end(JSON.stringify({ live, milestone: config.milestone }));
      return;
    }
    if (req.method === 'POST' && path === '/api/chat') {
      if (req.headers.origin !== `http://${req.headers.host}` || req.headers['content-type'] !== 'application/json') {
        res.writeHead(403).end(); return;
      }
      if (busy) { res.writeHead(409).end(); return; }
      let body = '';
      for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 35_000) { res.writeHead(413).end(); return; } }
      const { text } = JSON.parse(body);
      if (typeof text !== 'string' || !text.trim() || text.length > 8000) { res.writeHead(400).end(); return; }
      assertReady();
      busy = true;
      try {
        store ??= new Store(`${config.dataDir}/stage`);
        const reply = await answer(store, 'stage-demo', text);
        store.addTurn('stage-demo', 'user', text);
        store.addTurn('stage-demo', 'assistant', reply);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ reply }));
      } finally { busy = false; }
      return;
    }
    const asset = req.method === 'GET' && assets.get(path);
    if (!asset) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', `${asset[1]}${asset[1].startsWith('text/') ? '; charset=utf-8' : ''}`);
    res.end(await readFile(new URL(`../slides/${asset[0]}`, import.meta.url)));
  } catch {
    res.writeHead(503, { 'Content-Type': 'application/json' }).end(JSON.stringify({ error: 'Live demo unavailable. Check workshop configuration and provider access.' }));
  }
});
server.listen(Number(process.env.SLIDES_PORT || 3402), '127.0.0.1', () => console.log(`Slides: http://127.0.0.1:${server.address().port} · arrows: navigate · N: notes · F: fullscreen`));
