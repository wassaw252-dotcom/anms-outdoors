(() => {
  const root = document.getElementById('NxcChallenge');
  if (!root || root.dataset.nxcReady === '1') return;
  root.dataset.nxcReady = '1';

  /* Use the approved transparent campaign badge; keep the original page layout intact. */
  const prizeBadge = root.querySelector('.nxc-lockup');
  if (prizeBadge) {
    prizeBadge.src = 'https://cdn.shopify.com/s/files/1/0968/1128/6825/files/anms-challenge-grand-prize-badge.png?v=1789530643';
    prizeBadge.alt = 'Challenge — RM5,000 Grand Prize';
    prizeBadge.width = 2172;
    prizeBadge.height = 724;
    /* 40% smaller than the previous lockup and pulled slightly upward. */
    prizeBadge.style.width = 'min(324px, 56vw)';
    prizeBadge.style.maxWidth = '100%';
    prizeBadge.style.margin = '-14px auto -2px';
  }

  /* Keep empty until the owner says: start countdown. */
  const COUNTDOWN_END = '';
  const COUNTDOWN_DAYS = 45;
  const timer = root.querySelector('[data-nxc-countdown]');
  const daysEl = root.querySelector('[data-nxc-days]');
  const hoursEl = root.querySelector('[data-nxc-hours]');
  const minutesEl = root.querySelector('[data-nxc-minutes]');
  const pad = (value) => String(value).padStart(2, '0');
  let countdownInterval = null;

  const paintCountdown = () => {
    if (!timer || !daysEl || !hoursEl || !minutesEl) return;
    let totalMinutes = COUNTDOWN_DAYS * 24 * 60;

    if (COUNTDOWN_END) {
      const end = Date.parse(COUNTDOWN_END);
      if (Number.isFinite(end)) {
        totalMinutes = Math.max(0, Math.ceil((end - Date.now()) / 60000));
      }
    }

    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    timer.setAttribute('aria-label', `${days} days ${hours} hours ${minutes} minutes remaining`);

    if (COUNTDOWN_END && totalMinutes <= 0 && countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
  };

  paintCountdown();
  if (COUNTDOWN_END) countdownInterval = window.setInterval(paintCountdown, 1000);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = Array.from(root.querySelectorAll('[data-nxc-reveal]'));

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach((el) => io.observe(el));
  }

  const hero = root.querySelector('.nxc-hero');
  const media = root.querySelector('.nxc-hero__media');
  const steps = root.querySelector('[data-nxc-steps]');
  const progress = steps?.querySelector('.nxc-steps__line span');
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY || 0;

    if (!reduce && media && hero && window.innerWidth > 700) {
      const max = Math.max(hero.offsetHeight, 1);
      const p = Math.max(0, Math.min(1, y / max));
      media.style.transform = `translate3d(0,${p * 12}px,0) scale(${1 + p * 0.012})`;
    }

    if (steps && progress && window.innerWidth > 900) {
      const r = steps.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, (vh * 0.78 - r.top) / (r.height + vh * 0.35)));
      progress.style.width = `${p * 100}%`;
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();