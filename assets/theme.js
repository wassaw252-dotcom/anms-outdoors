(() => {
  'use strict';
  const root = document.body.dataset.root || '/';
  const strings = JSON.parse(document.getElementById('ThemeStrings')?.textContent || '{}');
  const t = key => strings[key] || key;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const status = message => { const el = document.getElementById('StoreStatus'); if (el) el.textContent = message; };
  const parse = html => new DOMParser().parseFromString(html, 'text/html');
  const dialogs = new Map();
  function closeDialog(dialog) {
    dialog.close();
    document.body.classList.toggle('modal-open', !!document.querySelector('dialog[open]'));
    const trigger = dialogs.get(dialog);
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  }
  function openDialog(id, trigger = document.activeElement) {
    const dialog = document.getElementById(id);
    if (!dialog?.showModal) return false;
    document.querySelectorAll('dialog[open]').forEach(d => closeDialog(d));
    document.querySelectorAll('[data-mega][open]').forEach(d => d.removeAttribute('open'));
    dialogs.set(dialog, trigger);
    dialog.showModal();
    document.body.classList.add('modal-open');
    return true;
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog); });
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(dialog); } });
  });
  document.addEventListener('click', event => {
    const opener = event.target.closest('[data-open]');
    if (opener && openDialog(opener.dataset.open, opener)) event.preventDefault();
    const closer = event.target.closest('[data-close]');
    if (closer) closeDialog(closer.closest('dialog'));
    if (!event.target.closest('[data-mega]')) document.querySelectorAll('[data-mega][open]').forEach(d => d.removeAttribute('open'));
    const quantity = event.target.closest('[data-quantity]');
    if (quantity) {
      const input = quantity.parentElement.querySelector('input');
      const min = Number(input.min || 1), step = Number(input.step || 1), max = input.max ? Number(input.max) : Infinity;
      input.value = Math.min(max, Math.max(min, (Number(input.value) || min) + Number(quantity.dataset.quantity) * step));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const step = event.target.closest('[data-gallery-step]');
    const media = event.target.closest('[data-media-link]');
    if (step || media) {
      event.preventDefault();
      const gallery = (step || media).closest('.gallery-wrap').querySelector('[data-gallery]');
      const left = media ? [...gallery.children].findIndex(e => e.id === `Media-${media.dataset.mediaLink}`) * gallery.clientWidth : gallery.scrollLeft + Number(step.dataset.galleryStep) * gallery.clientWidth;
      gallery.scrollTo({ left, behavior: reduced.matches ? 'instant' : 'smooth' });
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.querySelectorAll('[data-mega][open]').forEach(d => { d.removeAttribute('open'); d.querySelector('summary').focus(); });
  });
  document.addEventListener('focusin', event => {
    document.querySelectorAll('[data-mega][open]').forEach(d => { if (!d.contains(event.target)) d.removeAttribute('open'); });
  });
  async function jsonRequest(url, options = {}) {
    const response = await fetch(url, { credentials: 'same-origin', ...options });
    let data;
    try { data = await response.json(); } catch { throw new Error(t('error')); }
    if (!response.ok) throw new Error(typeof data.description === 'string' ? data.description : typeof data.message === 'string' ? data.message : t('error'));
    return data;
  }
  let cartQueue = Promise.resolve();
  let cartPending = 0;
  let noteDraft = null;
  let noteTimer;
  const cartErrors = message => { document.querySelectorAll('[data-cart-error]').forEach(el => { el.textContent = message; }); status(message); };
  async function refreshCart() {
    const page = document.querySelector('[data-cart-page-content]');
    const pageSection = page?.closest('[id^="shopify-section-"]')?.id.replace('shopify-section-', '');
    const sectionIds = ['cart-drawer', ...(pageSection ? [pageSection] : [])];
    const [cart, sections] = await Promise.all([jsonRequest(`${root}cart.js`), jsonRequest(`${location.pathname}?sections=${encodeURIComponent(sectionIds.join(','))}`)]);
    const active = document.activeElement;
    const activeId = active?.id;
    const selection = active?.matches('[data-cart-note]') ? [active.selectionStart, active.selectionEnd] : null;
    const drawerSource = sections['cart-drawer'] && parse(sections['cart-drawer']).querySelector('[data-cart-content]');
    if (drawerSource) document.querySelector('[data-cart-content]').replaceChildren(...drawerSource.childNodes);
    if (pageSection && sections[pageSection]) {
      const source = parse(sections[pageSection]).querySelector('[data-cart-page-content]');
      if (source) page.replaceChildren(...source.childNodes);
    }
    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = cart.item_count; });
    if (noteDraft !== null) document.querySelectorAll('[data-cart-note]').forEach(el => { el.value = noteDraft; });
    if (activeId) { const restored = document.getElementById(activeId); if (restored) { restored.focus({ preventScroll: true }); if (selection) restored.setSelectionRange(...selection); } }
    return cart;
  }
  function enqueueCart(operation) {
    cartPending++;
    const next = cartQueue.catch(() => {}).then(operation);
    cartQueue = next.finally(() => { cartPending--; });
    cartQueue.catch(() => {});
    return next;
  }
  document.addEventListener('submit', async event => {
    const form = event.target;
    if (form.matches('[data-add-form]')) {
      event.preventDefault();
      const button = event.submitter || form.querySelector('[type=submit]');
      if (button.disabled) return;
      const error = form.querySelector('.form-error');
      const original = button.innerHTML;
      button.disabled = true; button.textContent = t('loading');
      if (error) error.textContent = '';
      const data = new FormData(form);
      try {
        await enqueueCart(async () => {
          await jsonRequest(`${root}cart/add.js`, { method: 'POST', body: data });
          try { await refreshCart(); } catch { location.assign(`${root}cart`); return; }
          openDialog('CartDialog', button); status(t('added'));
        });
      } catch (err) { if (error) error.textContent = err.message; status(err.message); }
      finally { button.disabled = false; button.innerHTML = original; }
    }
    if (form.matches('[data-cart-form]') && !form.dataset.ready && (cartPending || noteTimer)) {
      event.preventDefault();
      clearTimeout(noteTimer); noteTimer = null;
      const wantsCheckout = event.submitter?.name === 'checkout';
      try {
        await cartQueue;
        if (noteDraft !== null) await jsonRequest(`${root}cart/update.js`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note: noteDraft }) });
        const target = document.getElementById(form.id);
        if (target) { target.dataset.ready = 'true'; target.requestSubmit(target.querySelector(`[name="${wantsCheckout ? 'checkout' : 'update'}"]`)); }
      } catch (err) { cartErrors(err.message); }
    }
  });
  async function changeLine(item, quantity, focusRemove = false) {
    if (!Number.isInteger(quantity) || quantity < 0 || item.hasAttribute('aria-busy')) return;
    item.setAttribute('aria-busy', 'true');
    item.querySelectorAll('button,input').forEach(el => { el.disabled = true; });
    try {
      await enqueueCart(async () => {
        await jsonRequest(`${root}cart/change.js`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.dataset.key, quantity }) });
        await refreshCart(); status(t('updated'));
        if (focusRemove) document.querySelector('#CartDialog[open] [data-close], [data-cart-page-content] .button')?.focus();
      });
    } catch (err) { cartErrors(err.message); }
    finally { item.removeAttribute('aria-busy'); item.querySelectorAll('button,input').forEach(el => { el.disabled = false; }); }
  }
  document.addEventListener('click', event => {
    const delta = event.target.closest('[data-cart-delta]');
    const remove = event.target.closest('[data-cart-remove]');
    if (!delta && !remove) return;
    event.preventDefault();
    const item = (delta || remove).closest('[data-cart-item]');
    const quantity = remove ? 0 : Math.max(0, Number(item.querySelector('[data-cart-quantity]').value) + Number(delta.dataset.cartDelta));
    changeLine(item, quantity, quantity === 0);
  });
  document.addEventListener('change', async event => {
    const input = event.target;
    if (input.matches('[data-cart-quantity]')) changeLine(input.closest('[data-cart-item]'), Number(input.value), Number(input.value) === 0);
    if (input.matches('[data-variant-select]')) {
      const section = input.closest('[data-product-section]');
      const selected = input.value;
      section.setAttribute('aria-busy', 'true');
      section.querySelectorAll('button,select').forEach(el => { el.disabled = true; });
      const url = new URL(section.dataset.productUrl, location.origin); url.searchParams.set('variant', selected); url.searchParams.set('section_id', section.dataset.productSection);
      try {
        const response = await fetch(url); if (!response.ok) throw new Error(t('error'));
        const doc = parse(await response.text()); const replacement = doc.querySelector('[data-product-section]');
        if (!replacement) throw new Error(t('error'));
        section.replaceWith(replacement);
        const historyUrl = new URL(location.href); historyUrl.searchParams.set('variant', selected); history.replaceState({}, '', historyUrl);
        replacement.querySelector('[data-variant-select]')?.focus({ preventScroll: true });
        syncSaves(); status(replacement.querySelector('.product-price')?.textContent.trim() || '');
      } catch { const fallback = new URL(location.href); fallback.searchParams.set('variant', selected); location.assign(fallback); }
    }
  });
  document.addEventListener('input', event => {
    if (!event.target.matches('[data-cart-note]')) return;
    noteDraft = event.target.value;
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => {
      noteTimer = null;
      const note = noteDraft;
      enqueueCart(() => jsonRequest(`${root}cart/update.js`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ note }) })).catch(err => cartErrors(err.message));
    }, 600);
  });
  const savedKey = 'anms-outdoors-saved-v1';
  function readSaved() {
    try { const data = JSON.parse(localStorage.getItem(savedKey) || '[]'); return Array.isArray(data) ? data.filter(x => x && /^[a-z0-9-]+$/.test(x.handle) && typeof x.title === 'string').slice(0, 100) : []; } catch { return []; }
  }
  function syncSaves() {
    const handles = new Set(readSaved().map(x => x.handle));
    document.querySelectorAll('[data-save]').forEach(button => button.setAttribute('aria-pressed', String(handles.has(button.dataset.save))));
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-save]');
    if (!button) return;
    const saved = readSaved(); const handle = button.dataset.save; const exists = saved.some(x => x.handle === handle);
    try {
      localStorage.setItem(savedKey, JSON.stringify(exists ? saved.filter(x => x.handle !== handle) : [...saved.slice(-99), { handle, title: button.dataset.title || handle }]));
      syncSaves(); status(t(exists ? 'removed' : 'saved'));
      if (document.querySelector('[data-saved-grid]') && exists) renderSaved();
    } catch { status(t('storage')); }
  });
  let savedGeneration = 0;
  async function renderSaved() {
    const grid = document.querySelector('[data-saved-grid]'); if (!grid) return;
    const saved = readSaved(); const generation = ++savedGeneration;
    if (!grid.dataset.empty) grid.dataset.empty = grid.innerHTML;
    if (!saved.length) { grid.innerHTML = grid.dataset.empty; grid.removeAttribute('aria-busy'); return; }
    grid.setAttribute('aria-busy', 'true');
    const nodes = [];
    for (let index = 0; index < saved.length; index += 4) {
      const batch = await Promise.all(saved.slice(index, index + 4).map(async item => {
        try {
          const response = await fetch(`${root}products/${encodeURIComponent(item.handle)}?section_id=saved-product`);
          if (!response.ok) throw new Error('unavailable');
          const card = parse(await response.text()).querySelector('.product-card');
          if (card) return card;
          throw new Error('unavailable');
        } catch {
          const article = document.createElement('article'); article.className = 'saved-unavailable';
          const title = document.createElement('h3'); title.textContent = item.title;
          const copy = document.createElement('p'); copy.textContent = t('unavailable');
          const button = document.createElement('button'); button.className = 'button secondary'; button.dataset.save = item.handle; button.dataset.title = item.title; button.textContent = t('remove');
          article.append(title, copy, button); return article;
        }
      }));
      nodes.push(...batch); if (generation !== savedGeneration) return;
    }
    grid.replaceChildren(...nodes); grid.removeAttribute('aria-busy'); syncSaves();
  }
  window.addEventListener('storage', event => { if (event.key === savedKey) { syncSaves(); renderSaved(); } });
  syncSaves(); renderSaved();
  document.querySelectorAll('[data-recommendations]').forEach(async section => {
    try {
      const response = await fetch(section.dataset.recommendations);
      if (!response.ok) return;
      const replacement = parse(await response.text()).querySelector('[data-recommendations]');
      if (replacement && !replacement.hidden) { section.replaceWith(replacement); syncSaves(); }
    } catch { section.hidden = true; }
  });
  let audioContext, master, ambience, sound = false, explicitlyMuted = false;
  function soundState(enabled) { sound = enabled; document.querySelectorAll('[data-sound]').forEach(button => { button.setAttribute('aria-pressed', String(enabled)); button.querySelector('[data-sound-label]').textContent = t(enabled ? 'sound_on' : 'sound_off'); }); }
  async function enableAudio(withCue = false) {
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error();
      if (!audioContext) {
        audioContext = new Audio(); master = audioContext.createGain(); master.gain.value = 0; master.connect(audioContext.destination);
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 4, audioContext.sampleRate);
        const samples = buffer.getChannelData(0); let last = 0;
        for (let i = 0; i < samples.length; i++) { last = (last + (Math.random() * 2 - 1) * .025) / 1.025; samples[i] = last; }
        ambience = audioContext.createBufferSource(); ambience.buffer = buffer; ambience.loop = true;
        const filter = audioContext.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 380; ambience.connect(filter); filter.connect(master); ambience.start();
      }
      await audioContext.resume();
      const now = audioContext.currentTime; master.gain.cancelScheduledValues(now); master.gain.setTargetAtTime(.075, now, 1.4); soundState(true);
      if (withCue) {
        const click = audioContext.createOscillator(), gain = audioContext.createGain();
        click.frequency.setValueAtTime(620, now); click.frequency.exponentialRampToValueAtTime(170, now + .09);
        gain.gain.setValueAtTime(.035, now); gain.gain.exponentialRampToValueAtTime(.001, now + .11); click.connect(gain); gain.connect(audioContext.destination); click.start(now); click.stop(now + .12);
        const noise = audioContext.createBufferSource(); noise.buffer = ambience.buffer;
        const band = audioContext.createBiquadFilter(); band.type = 'bandpass'; band.frequency.setValueAtTime(180, now); band.frequency.exponentialRampToValueAtTime(1100, now + .55);
        const swell = audioContext.createGain(); swell.gain.setValueAtTime(0, now); swell.gain.linearRampToValueAtTime(.3, now + .22); swell.gain.linearRampToValueAtTime(0, now + .75); noise.connect(band); band.connect(swell); swell.connect(audioContext.destination); noise.start(now); noise.stop(now + .8);
      }
    } catch { soundState(false); status(t('sound_error')); }
  }
  function muteAudio() { if (audioContext && master) { const now = audioContext.currentTime; master.gain.cancelScheduledValues(now); master.gain.setTargetAtTime(0, now, .08); } soundState(false); }
  document.querySelector('[data-sound]')?.addEventListener('click', () => { if (sound) { explicitlyMuted = true; muteAudio(); } else { explicitlyMuted = false; enableAudio(); } });
  let entering = false;
  document.querySelector('[data-enter]')?.addEventListener('click', event => {
    event.preventDefault(); if (entering) return; entering = true;
    if (!explicitlyMuted) enableAudio(true);
    const entrance = document.querySelector('[data-entrance]'); entrance.classList.add('entering');
    const move = () => { const target = document.getElementById('StoreStart'); target?.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth' }); target?.focus({ preventScroll: true }); entering = false; };
    if (reduced.matches) move(); else setTimeout(move, 500);
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { muteAudio(); audioContext?.suspend().catch(() => {}); } });
  window.addEventListener('pagehide', () => { muteAudio(); audioContext?.suspend().catch(() => {}); });
  document.querySelector('[data-error-summary]')?.focus();
})();
