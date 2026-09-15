(() => {
  const root = document.getElementById('AnmChallengeExperience');
  if (!root || root.dataset.cxReady === 'true') return;
  root.dataset.cxReady = 'true';

  const tabs = Array.from(root.querySelectorAll('[data-cx-tab]'));
  const panels = Array.from(root.querySelectorAll('[data-cx-panel]'));
  const hub = root.querySelector('#ChallengeHub');

  const activate = (name, options = {}) => {
    const target = panels.find((panel) => panel.dataset.cxPanel === name);
    if (!target) return;

    tabs.forEach((tab) => {
      const active = tab.dataset.cxTab === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });

    panels.forEach((panel) => {
      const active = panel === target;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });

    if (options.scroll && hub) {
      const top = hub.getBoundingClientRect().top + window.scrollY - 8;
      window.scrollTo({ top, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }

    if (options.focus) {
      const heading = target.querySelector('h2, h3');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.cxTab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      tabs[next].focus();
      activate(tabs[next].dataset.cxTab);
    });
  });

  root.querySelectorAll('[data-cx-open]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const name = trigger.dataset.cxOpen;
      if (!name) return;
      event.preventDefault();
      activate(name, { scroll: true, focus: true });
    });
  });

  root.querySelectorAll('[data-cx-rules]').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      activate('rules', { scroll: true, focus: true });
      window.setTimeout(() => {
        const first = root.querySelector('[data-cx-panel="rules"] details');
        if (first) first.open = true;
      }, 280);
    });
  });

  const initial = root.querySelector('.cx-tab.is-active')?.dataset.cxTab || 'join';
  activate(initial);
})();