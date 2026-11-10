import { updateHighlights } from './highlights.js';
import { connectPresenter } from './presenter-sync.js';

const params = new URLSearchParams(location.search);
const audienceMode = params.has('present') || params.has('preview');
document.body.classList.toggle('audience-mode', audienceMode);

const slides = [...document.querySelectorAll('.slide')];
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Also works for the hidden environment template and non-secure previews.
    const input = document.createElement('textarea');
    input.value = text;
    input.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(input);
    input.select();
    try {
      if (!document.execCommand('copy')) throw new Error('Clipboard unavailable');
    } finally {
      input.remove();
    }
  }
}
document.querySelectorAll('[data-copy]').forEach(button => {
  const label = button.textContent;
  button.onclick = async () => {
    const prompt = document.getElementById(button.dataset.copy);
    button.disabled = true;
    try {
      await copyText(prompt.textContent);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Copy unavailable · try again';
    } finally {
      button.disabled = false;
      button.focus();
      setTimeout(() => { button.textContent = label; }, 1800);
    }
  };
});
let index = 0;
function resize() {
  document.documentElement.style.setProperty('--scale', Math.min(innerWidth / 1600, (innerHeight - (audienceMode ? 0 : 42)) / 900));
}
function show(next) {
  index = Math.max(0, Math.min(slides.length - 1, next));
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    slide.setAttribute('aria-hidden', String(i !== index));
    slide.inert = i !== index;
  });
  document.querySelector('#slide-count').textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  document.querySelector('#slide-label').textContent = slides[index].dataset.title;
  document.querySelector('#notes-time').textContent = slides[index].dataset.time;
  document.querySelector('#notes-title').textContent = slides[index].dataset.title;
  document.querySelector('#notes-text').textContent = slides[index].querySelector('.speaker-note').textContent;
  updateHighlights(slides[index]);
  history.replaceState(null, '', `#slide-${index + 1}`);
  dispatchEvent(new Event('deck:slidechange'));
}
const fromHash = () => show(Number(location.hash.match(/slide-(\d+)/)?.[1] || 1) - 1);
addEventListener('resize', resize);
addEventListener('hashchange', fromHash);
resize(); fromHash();
document.querySelector('#previous').onclick = () => show(index - 1);
document.querySelector('#next').onclick = () => show(index + 1);
const notes = document.querySelector('#notes-panel');
document.querySelector('#notes-toggle').onclick = () => { notes.hidden = !notes.hidden; };
document.querySelector('#notes-close').onclick = () => { notes.hidden = true; };
const fullscreen = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
document.querySelector('#fullscreen').onclick = fullscreen;
addEventListener('keydown', event => {
  if (event.target.matches('textarea,input')) return;
  if (event.target.matches('button') && [' ', 'Enter'].includes(event.key)) return;
  if (event.key === ' ') {
    const advance = new CustomEvent('deck:advance', { cancelable: true });
    dispatchEvent(advance);
    if (advance.defaultPrevented) { event.preventDefault(); return; }
  }
  if (['ArrowRight', ' ', 'PageDown'].includes(event.key)) { event.preventDefault(); show(index + 1); }
  if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); show(index - 1); }
  if (event.key === 'Home') show(0);
  if (event.key === 'End') show(slides.length - 1);
  if (event.key.toLowerCase() === 'n' && !audienceMode) notes.hidden = !notes.hidden;
  if (event.key.toLowerCase() === 'p' && !params.has('preview')) document.querySelector('#presenter-link').click();
  if (event.key.toLowerCase() === 'f') fullscreen();
  if (event.key === 'Escape') notes.hidden = true;
});
connectPresenter({ slides, getIndex: () => index, show });
