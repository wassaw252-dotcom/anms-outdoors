(() => {
  'use strict';
  /* Interaction behavior ported from ANM’s OUTDOORS — Claude Preview and adapted to the target's <details> mega markup. */
  const header = document.querySelector('.header');
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');

  if (header) {
    let ticking = false;
    const update = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 16);
      ticking = false;
    };
    update();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
  }

  const megas = [...document.querySelectorAll('details[data-mega]')];
  const syncHeaderOpen = () => header?.classList.toggle('is-open', megas.some((mega) => mega.open));

  const closeMega = (mega, restoreFocus = false) => {
    if (!mega.open) return;
    mega.removeAttribute('open');
    syncHeaderOpen();
    if (restoreFocus) mega.querySelector('summary')?.focus({ preventScroll: true });
  };

  megas.forEach((mega) => {
    const summary = mega.querySelector('summary');
    let closeTimer;

    mega.addEventListener('toggle', syncHeaderOpen);

    mega.addEventListener('pointerenter', () => {
      if (!hoverCapable.matches) return;
      clearTimeout(closeTimer);
      megas.forEach((other) => { if (other !== mega) closeMega(other); });
      mega.setAttribute('open', '');
      syncHeaderOpen();
    });

    mega.addEventListener('pointerleave', () => {
      if (!hoverCapable.matches) return;
      closeTimer = setTimeout(() => closeMega(mega), 200);
    });

    /* Claude Preview behavior: a mouse click after hover-open does not immediately close it. Keyboard/touch still toggles normally. */
    summary?.addEventListener('click', (event) => {
      if (hoverCapable.matches && event.detail > 0 && mega.open) event.preventDefault();
    });

    mega.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mega.open) closeMega(mega, true);
    });

    mega.addEventListener('focusout', (event) => {
      if (event.relatedTarget instanceof Node && mega.contains(event.relatedTarget)) return;
      closeMega(mega);
    });
  });

  document.addEventListener('click', (event) => {
    if (megas.some((mega) => mega.contains(event.target))) return;
    megas.forEach((mega) => closeMega(mega));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openMega = megas.find((mega) => mega.open);
    if (openMega) closeMega(openMega, true);
  });

  syncHeaderOpen();
})();
