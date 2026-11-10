export function connectPresenter({ slides, getIndex, show }) {
  const params = new URLSearchParams(location.search);
  if (params.has('preview')) return;
  const audienceId = params.get('audience') || crypto.randomUUID();
  const channel = new BroadcastChannel('exa-personal-agent-presenter');
  const link = document.querySelector('#presenter-link');
  function publish() {
    const slide = slides[getIndex()];
    link.href = `/presenter?audience=${encodeURIComponent(audienceId)}#slide-${getIndex() + 1}`;
    const clone = slide.cloneNode(true);
    clone.querySelectorAll('textarea').forEach((node, i) => { node.textContent = slide.querySelectorAll('textarea')[i].value; });
    clone.querySelectorAll('.speaker-note').forEach(node => node.remove());
    channel.postMessage({ type: 'audience-state', audienceId, number: getIndex() + 1,
      html: clone.outerHTML, scroll: [...slide.querySelectorAll('[id]')].filter(el => el.scrollTop || el.scrollLeft)
        .map(el => ({ id: el.id, top: el.scrollTop, left: el.scrollLeft })),
      canAdvance: slide.classList.contains('demo') && !document.querySelector('#example-next').disabled && document.querySelector('#example-mode').getAttribute('aria-pressed') === 'true' });
  }
  channel.addEventListener('message', ({ data }) => {
    if (data?.type !== 'presenter-command' || data.audienceId !== audienceId) return;
    if (data.action === 'next') show(getIndex() + 1);
    else if (data.action === 'previous') show(getIndex() - 1);
    else if (data.action === 'goto' && Number.isInteger(data.number) && data.number >= 1 && data.number <= slides.length) show(data.number - 1);
    else if (data.action === 'advance') {
      const advance = new CustomEvent('deck:advance', { cancelable: true }); dispatchEvent(advance);
      if (!advance.defaultPrevented) show(getIndex() + 1);
    }
    publish();
  });
  let pending;
  const schedule = () => { clearTimeout(pending); pending = setTimeout(publish, 80); };
  const observer = new MutationObserver(schedule);
  observer.observe(document.querySelector('.canvas'), { subtree: true, childList: true, characterData: true, attributes: true });
  addEventListener('deck:slidechange', publish);
  document.querySelector('.canvas').addEventListener('scroll', schedule, true);
  document.querySelector('.canvas').addEventListener('input', schedule);
  const heartbeat = setInterval(publish, 2000);
  addEventListener('pagehide', () => { clearInterval(heartbeat); clearTimeout(pending); observer.disconnect(); channel.close(); }, { once: true });
  publish();
}
