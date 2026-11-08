import { answer } from './agent.ts';
import { assertReady, config } from './config.ts';
import { webhookServer } from './http.ts';
import { sendReply, replyLinks } from './linq.ts';
import { sourceCardLimit, isVoiceRequest } from './response.ts';
import { Store } from './store.ts';
import { Worker } from './worker.ts';
import { acknowledgeMessage, sendVoiceReply } from './extras.ts';

try { assertReady(true); } catch (error) { console.error((error as Error).message); process.exit(1); }
const store = new Store(config.dataDir);
const worker = new Worker(store, (scope, text) => {
  if (isVoiceRequest(text)) {
    const prompt = text.replace(/^\/voice\s*/i, '').trim();
    return prompt ? answer(store, scope, `Your reply will be synthesized and delivered as an actual voice memo. Write the spoken content in at most 80 words. Do not discuss your audio capabilities; answer the request or read the previous answer if asked. ${prompt}`) : Promise.resolve('Tell me what you would like me to say after /voice.');
  }
  return answer(store, scope, text);
}, (chat, text, key, request) => isVoiceRequest(request) && !/^\/voice\s*$/i.test(request || '')
  ? sendVoiceReply(store, chat, text, key)
  : sendReply(config.linqKey, chat, text, key, fetch, replyLinks(text), sourceCardLimit(request)),
  job => acknowledgeMessage(job));
const wake = () => { void worker.tick().catch(() => console.error('Worker storage error.')); };
const server = webhookServer(store, { owner: config.owner, line: config.line, secret: config.webhookSecret }, wake);
const timer = setInterval(wake, 1000);
server.requestTimeout = 15_000;
server.headersTimeout = 10_000;
server.on('error', () => { console.error('Could not start webhook server. Check PORT.'); process.exitCode = 1; clearInterval(timer); store.close(); });
server.listen(config.port, '127.0.0.1', () => { console.log(`Linq webhook ready on http://127.0.0.1:${config.port}/webhooks/linq`); wake(); });
function stop() {
  clearInterval(timer);
  server.close();
  const wait = setInterval(() => {
    if (!worker.busy) { clearInterval(wait); store.close(); }
  }, 100);
}
process.once('SIGINT', stop);
process.once('SIGTERM', stop);
