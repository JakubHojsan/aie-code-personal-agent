const input = document.querySelector('#chat-input');
const messages = document.querySelector('#messages');
const send = document.querySelector('#send');
const connection = document.querySelector('#connection');
let live = false, busy = false, mode = 'example';
let exampleStep = 0;
const liveThread = [];
const emptyTemplate = messages.querySelector('.stage-empty').outerHTML;
const exampleTurns = [
  [
    ['Find a dinner option for Friday that fits my preferences.', 'user'],
    ['I’d shortlist Robin for omakase. Its published range is $119–219 per person.\n\nFor your $150 food budget, confirm which option fits. Tax, tip, drinks, and fees may add to the total.\n\nhttps://www.robinomakase.com/location/robin-san-francisco/', 'agent'],
  ],
  [
    ['My friend wants somewhere quieter.', 'user'],
    ['I’ll keep your food preferences and budget. The source does not establish noise level, so I need another source or confirmation from the restaurant before calling it a quiet option.', 'agent'],
  ],
  [
    ['What do you remember about me?', 'user'],
    ['San Francisco\nSushi\n$150 per person, before tax and tip', 'agent'],
  ],
];
function renderExample() {
  messages.replaceChildren();
  const label = document.createElement('p'); label.className = 'message-date'; label.textContent = 'Worked example · authored, not agent output'; messages.append(label);
  for (let i = 0; i <= exampleStep; i++) for (const [text, role] of exampleTurns[i]) message(text, role);
  document.querySelector('#example-step').textContent = `${exampleStep + 1} / ${exampleTurns.length}`;
  document.querySelector('#example-next').disabled = exampleStep === exampleTurns.length - 1;
  messages.scrollTop = exampleStep === 0 ? 0 : messages.scrollHeight;
}
function setMode(next) {
  mode = next;
  document.querySelector('#example-mode').setAttribute('aria-pressed', String(mode === 'example'));
  document.querySelector('#live-mode').setAttribute('aria-pressed', String(mode === 'live'));
  document.querySelector('.phone').classList.toggle('example-view', mode === 'example');
  document.querySelector('.example-actions').hidden = mode !== 'example';
  document.querySelector('.demo-actions').hidden = mode !== 'live';
  document.querySelector('#chat-form').hidden = mode !== 'live';
  if (mode === 'example') {
    renderExample();
    connection.textContent = 'Authored example · official menu checked November 6, 2026';
  } else {
    messages.replaceChildren();
    if (liveThread.length) for (const [text, role] of liveThread) message(text, role);
    else messages.innerHTML = emptyTemplate;
    connection.textContent = live ? 'Live local agent · isolated stage profile' : 'Live agent needs workshop API keys.';
  }
}
document.querySelector('#example-mode').onclick = () => setMode('example');
document.querySelector('#live-mode').onclick = () => setMode('live');
document.querySelector('#example-next').onclick = () => { exampleStep = Math.min(exampleStep + 1, exampleTurns.length - 1); renderExample(); };
document.querySelector('#example-reset').onclick = () => { exampleStep = 0; renderExample(); };
messages.addEventListener('click', event => { if (event.target.closest('#remember-prompt')) fill('Remember I live in San Francisco, love sushi, and budget $150 per person before tax and tip.'); });
function fill(text) { input.value = text; input.focus(); }
document.querySelectorAll('[data-prompt]').forEach(button => button.onclick = () => fill(button.dataset.prompt));

function message(text, role) {
  const node = document.createElement('div');
  node.className = `chat-message ${role}`;
  // Render all model output as text; only explicit HTTPS URLs become links.
  const parts = text.split(/(https:\/\/[^\s<>\]\)]+)/g);
  for (const part of parts) {
    if (part.startsWith('https://')) {
      const a = document.createElement('a'); a.href = part; a.textContent = new URL(part).hostname.replace(/^www\./, ''); a.target = '_blank'; a.rel = 'noopener noreferrer'; node.append(a);
    } else node.append(document.createTextNode(part));
  }
  messages.append(node); messages.scrollTop = messages.scrollHeight;
  return node;
}
setMode('example');
addEventListener('deck:advance', event => {
  const current = document.querySelector('.slide.active');
  if (current?.classList.contains('demo') && mode === 'example' && exampleStep < exampleTurns.length - 1) {
    document.querySelector('#example-next').click(); event.preventDefault();
  }
});
let beforePrintMode = 'example', beforePrintStep = 0;
addEventListener('beforeprint', () => { beforePrintMode = mode; beforePrintStep = exampleStep; exampleStep = 0; setMode('example'); });
addEventListener('afterprint', () => { exampleStep = beforePrintStep; setMode(beforePrintMode); });
try {
  const response = await fetch('/api/status');
  if (!response.ok) throw new Error();
  const status = await response.json(); live = status.live;
  if (mode === 'live') setMode('live');
} catch { if (mode === 'live') connection.textContent = 'Run npm run slides to use live stage chat.'; }
async function submit(event) {
  event.preventDefault();
  const text = input.value.trim();
  if (!text || busy || mode !== 'live') return;
  if (!live) { connection.textContent = 'Add your model and Exa keys to workshop/.env, then restart npm run slides.'; return; }
  document.querySelector('.stage-empty')?.remove();
  liveThread.push([text, 'user']); message(text, 'user'); input.value = ''; busy = true; send.disabled = true;
  const working = document.createElement('div'); working.className = 'chat-working'; working.textContent = 'Working on your request…'; messages.append(working);
  try {
    const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }), signal: AbortSignal.timeout(135000) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    liveThread.push([result.reply, 'agent']); if (mode === 'live') message(result.reply, 'agent');
  } catch { const error = 'The live request could not finish. Check provider access and the server terminal.'; liveThread.push([error, 'error']); if (mode === 'live') message(error, 'error'); }
  finally { working.remove(); busy = false; send.disabled = false; }
}
document.querySelector('#chat-form').addEventListener('submit', submit);
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); document.querySelector('#chat-form').requestSubmit(); }
  if (event.key === 'Escape') input.blur();
});
