// Adapted from the AIE Shanghai page -> passages -> captured results sequence.
// This is a teaching illustration, not a live API request or a token benchmark.
let cleanup = () => {};

export function updateHighlights(slide) {
  cleanup();
  cleanup = () => {};
  const root = slide.querySelector('.highlight-animation');
  if (!root) return;
  const page = root.querySelector('.page-passages');
  const signal = page.querySelector('.page-signal');
  const count = text => text.trim().split(/\s+/u).length;
  const sourceWords = count(page.textContent);
  const selectedWords = count(signal.textContent);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let timers = [];
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  const phase = step => {
    root.dataset.highlightPhase = String(step);
    root.querySelector('.highlight-provenance').textContent = step === 4
      ? 'Captured Search result · Nov 6, 2026' : 'Illustration · surrounding page copy is fictional';
    root.querySelector('.page-heading-label').textContent = step === 3 ? 'Selected highlight' : 'Illustrative restaurant page';
    root.querySelector('.page-word-count').textContent = step === 3 ? `${selectedWords} selected words` : `${sourceWords.toLocaleString()} source words`;
    root.querySelector('.selection-status').textContent = [
      '', `${sourceWords.toLocaleString()} words in the illustrative page. One price question.`,
      'Select the passage that answers the query.',
      `${sourceWords.toLocaleString()} words → ${selectedWords} words of relevant context.`,
      'Search returns source URLs and relevant passages.',
    ][step];
  };
  const showResult = () => { clear(); phase(4); };
  const replay = () => {
    clear();
    if (reducedMotion.matches) { phase(4); return; }
    phase(1);
    page.scrollTo({ top: 0, behavior: 'instant' });
    timers = [
      setTimeout(() => {
        phase(2);
        page.scrollTo({ top: Math.max(0, signal.offsetTop - page.clientHeight / 3), behavior: 'smooth' });
      }, 1500),
      setTimeout(() => { phase(3); page.scrollTo({ top: 0, behavior: 'instant' }); }, 4200),
      setTimeout(() => phase(4), 7000),
    ];
  };
  const skip = root.querySelector('[data-show-highlight-results]');
  const restart = root.querySelector('[data-replay-highlights]');
  skip.onclick = showResult;
  restart.onclick = replay;
  const onMotionChange = () => { if (reducedMotion.matches) showResult(); };
  reducedMotion.addEventListener('change', onMotionChange);
  replay();
  cleanup = () => {
    clear();
    phase(4);
    skip.onclick = null;
    restart.onclick = null;
    reducedMotion.removeEventListener('change', onMotionChange);
  };
}
