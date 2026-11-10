const $ = selector => document.querySelector(selector);
const channel = new BroadcastChannel('exa-personal-agent-presenter');
const scriptKey = 'exa-personal-agent-presenter-scripts';
const fontKey = 'exa-personal-agent-presenter-font';
let slides = [], number = Number(location.hash.match(/slide-(\d+)/)?.[1] || 1);
let audienceId = new URLSearchParams(location.search).get('audience'), lastSeen = 0;
let latestFrame, currentFrame = '', renderedNumber, editingNumber = null;
let scripts = {}, fontSize = 24, elapsed = 0, startedAt = null;
try { scripts = JSON.parse(localStorage.getItem(scriptKey) || '{}'); fontSize = Number(localStorage.getItem(fontKey)) || 24; } catch {}
if (!scripts || typeof scripts !== 'object' || Array.isArray(scripts)) scripts = {};
function setFont() { fontSize = Math.max(16, Math.min(40, fontSize)); document.documentElement.style.setProperty('--notes-size', `${fontSize}px`); }
setFont();
function persist() {
  try { localStorage.setItem(scriptKey, JSON.stringify(scripts)); $('#save-status').textContent = 'Saved in this browser.'; }
  catch { $('#save-status').textContent = 'Browser storage is unavailable. Export your notes to keep them.'; }
}
function saveScript() {
  if (editingNumber === null) return;
  scripts[editingNumber] = $('#script-input').value; persist();
  editingNumber = null; $('#script-editor').hidden = true; $('#speaker-script').hidden = false;
}
function cleanSlide(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script,iframe,object,embed,base,meta,.speaker-note').forEach(el => el.remove());
  for (const el of doc.querySelectorAll('*')) for (const attr of [...el.attributes]) {
    if (/^on/i.test(attr.name) || attr.name === 'srcdoc' || (/^(href|src|action)$/i.test(attr.name) && /^\s*(javascript|data):/i.test(attr.value))) el.removeAttribute(attr.name);
  }
  const slide = doc.querySelector('section.slide');
  if (!slide) return '';
  slide.classList.add('active'); slide.removeAttribute('inert'); slide.setAttribute('aria-hidden', 'false');
  return slide.outerHTML;
}
function frame(frame, html, scroll = []) {
  const cleaned = cleanSlide(html);
  frame.onload = () => {
    for (const item of scroll) {
      const el = frame.contentDocument.getElementById(item.id);
      if (el) { el.scrollTop = item.top; el.scrollLeft = item.left; }
    }
  };
  frame.srcdoc = `<!doctype html><html><head><link rel="stylesheet" href="/deck.css"><style>html,body{margin:0;width:1600px;height:900px;overflow:hidden}.canvas{position:static;transform:none}.slide.active{display:flex}.demo.active,.kernel-slide.active{display:grid}</style></head><body class="audience-mode"><div class="canvas">${cleaned}</div></body></html>`;
}
new ResizeObserver(entries => {
  for (const entry of entries) entry.target.querySelector('iframe').style.transform = `scale(${entry.contentRect.width / 1600})`;
}).observe($('#current-slide').parentElement);
new ResizeObserver(entries => {
  for (const entry of entries) entry.target.querySelector('iframe').style.transform = `scale(${entry.contentRect.width / 1600})`;
}).observe($('#next-slide').parentElement);
function paint() {
  if (!slides.length) return;
  number = Math.max(1, Math.min(slides.length, number));
  if (renderedNumber !== number) {
    saveScript(); $('.notes-scroll').scrollTop = 0; renderedNumber = number;
  }
  const slide = slides[number - 1];
  $('#position').textContent = `${number} / ${slides.length}`;
  $('#slide-title').textContent = slide.title; $('#timing').textContent = slide.time;
  $('#slide-picker').value = String(number);
  $('#previous').disabled = number === 1; $('#next').disabled = number === slides.length;
  const custom = typeof scripts[number] === 'string';
  $('#note-kind').textContent = custom ? 'Your script' : 'Speaker notes';
  $('#speaker-script').textContent = custom ? scripts[number] : slide.notes;
  $('#restore-notes').hidden = !custom;
  const html = latestFrame?.number === number ? latestFrame.html : slide.html;
  const scroll = latestFrame?.number === number ? latestFrame.scroll : [];
  const identity = JSON.stringify([html, scroll]);
  if (identity !== currentFrame) { frame($('#current-slide'), html, scroll); currentFrame = identity; }
  $('.next-slide').hidden = number === slides.length;
  if (number < slides.length && $('#next-slide').dataset.number !== String(number + 1)) {
    frame($('#next-slide'), slides[number].html); $('#next-slide').dataset.number = String(number + 1);
    $('#next-label').textContent = `Next · ${slides[number].title}`;
  }
  $('#advance-demo').hidden = !latestFrame?.canAdvance || latestFrame.number !== number;
  history.replaceState(null, '', `${location.pathname}${audienceId ? `?audience=${encodeURIComponent(audienceId)}` : ''}#slide-${number}`);
}
function command(action, extra = {}) { if (audienceId) channel.postMessage({ type: 'presenter-command', audienceId, action, ...extra }); }
function navigate(next) {
  saveScript(); number = Math.max(1, Math.min(slides.length, next));
  latestFrame = null; paint(); command('goto', { number });
}
async function loadDeck() {
  try {
    const response = await fetch('/index.html', { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error();
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    slides = [...doc.querySelectorAll('section.slide')].map(slide => ({ title: slide.dataset.title, time: slide.dataset.time,
      notes: slide.querySelector('.speaker-note')?.textContent || '', html: slide.outerHTML }));
    if (!slides.length) throw new Error();
    $('#slide-picker').replaceChildren(...slides.map((slide, i) => new Option(`${i + 1}. ${slide.title}`, String(i + 1))));
    $('#load-error').hidden = true; paint(); command('state');
  } catch { $('#load-error').hidden = false; }
}
channel.addEventListener('message', ({ data }) => {
  if (data?.type !== 'audience-state' || typeof data.audienceId !== 'string' || typeof data.html !== 'string' ||
    !Number.isInteger(data.number) || data.number < 1 || (slides.length && data.number > slides.length)) return;
  if (audienceId && audienceId !== data.audienceId) return;
  audienceId = data.audienceId; lastSeen = Date.now(); number = data.number;
  latestFrame = { ...data, scroll: Array.isArray(data.scroll) ? data.scroll : [] }; paint();
  $('#connection').textContent = 'Audience window connected'; $('#connection').dataset.connected = 'true';
  $('#current-label').textContent = 'Live audience';
});
$('#open-audience').onclick = () => {
  saveScript(); audienceId = crypto.randomUUID(); lastSeen = 0; latestFrame = null; paint();
  const audience = window.open(`/?present=1&audience=${encodeURIComponent(audienceId)}#slide-${number}`, 'exa-personal-agent-audience', 'popup,width=1440,height=900');
  if (!audience) { $('#connection').textContent = 'Allow pop-ups to open the audience window'; return; }
  audience.focus();
};
$('#previous').onclick = () => navigate(number - 1);
$('#next').onclick = () => navigate(number + 1);
$('#slide-picker').onchange = () => { navigate(Number($('#slide-picker').value)); $('#slide-picker').blur(); };
$('#advance-demo').onclick = () => command('advance');
$('#retry').onclick = loadDeck;
$('#edit-script').onclick = () => {
  editingNumber = number; $('#script-input').value = typeof scripts[number] === 'string' ? scripts[number] : slides[number - 1].notes;
  $('#script-editor').hidden = false; $('#speaker-script').hidden = true; $('#script-input').focus();
};
$('#save-script').onclick = () => { saveScript(); paint(); };
$('#cancel-script').onclick = () => { editingNumber = null; $('#script-editor').hidden = true; $('#speaker-script').hidden = false; };
$('#restore-notes').onclick = () => { editingNumber = null; $('#script-editor').hidden = true; $('#speaker-script').hidden = false; delete scripts[number]; persist(); paint(); };
$('#export-notes').onclick = () => {
  saveScript(); paint();
  const content = '# Exa in Personal Agents — presenter notes\n\n' + slides.map((slide, i) => `## ${i + 1}. ${slide.title}\n\n${scripts[i + 1] ?? slide.notes}`).join('\n\n');
  const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown' }));
  const a = document.createElement('a'); a.href = url; a.download = 'exa-personal-agents-presenter-notes.md'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
};
for (const [id, delta] of [['smaller', -2], ['larger', 2]]) $('#' + id).onclick = () => {
  fontSize += delta; setFont(); try { localStorage.setItem(fontKey, String(fontSize)); } catch {}
};
$('#timer-toggle').onclick = () => {
  if (startedAt === null) startedAt = Date.now(); else { elapsed += Date.now() - startedAt; startedAt = null; }
  $('#timer-toggle').textContent = startedAt === null ? 'Start timer' : 'Pause timer';
};
$('#timer-reset').onclick = () => { elapsed = 0; if (startedAt !== null) startedAt = Date.now(); };
addEventListener('keydown', event => {
  if (event.metaKey || event.ctrlKey || event.altKey || event.isComposing || event.target.closest('input,textarea,select')) return;
  if ([' ', 'Enter'].includes(event.key) && event.target.closest('button,a,summary')) return;
  if (['ArrowRight','PageDown',' '].includes(event.key)) { event.preventDefault(); navigate(number + 1); }
  if (['ArrowLeft','PageUp'].includes(event.key)) { event.preventDefault(); navigate(number - 1); }
  if (event.key === 'Home') navigate(1);
  if (event.key === 'End') navigate(slides.length);
});
setInterval(() => {
  const seconds = Math.floor((elapsed + (startedAt === null ? 0 : Date.now() - startedAt)) / 1000);
  $('#elapsed').textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}, 250);
setInterval(() => {
  command('state');
  if (Date.now() - lastSeen > 5000) {
    $('#connection').textContent = 'Waiting for audience window'; $('#connection').dataset.connected = 'false';
    $('#current-label').textContent = latestFrame ? 'Last audience frame' : 'Current slide';
  }
}, 2000);
addEventListener('beforeunload', saveScript);
await loadDeck();
