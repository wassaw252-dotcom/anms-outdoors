(() => {
  const root = document.getElementById('NxcChallenge');
  if (!root || root.dataset.nxcReady === '1') return;
  root.dataset.nxcReady = '1';

  /* Load the compact Expedition Pass layer from the same Shopify theme asset path. */
  if (!document.querySelector('link[data-nxc-expedition]')) {
    const script = document.currentScript || document.querySelector('script[src*="challenge-experience.js"]');
    if (script?.src) {
      const href = script.src.replace(/challenge-experience\.js(?:\?[^#]*)?/, 'challenge-expedition.css');
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.nxcExpedition = '1';
      document.head.appendChild(link);
    }
  }

  /* Approved transparent campaign badge, resized for a tighter mobile hero. */
  const prizeBadge = root.querySelector('.nxc-lockup');
  if (prizeBadge) {
    prizeBadge.src = 'https://cdn.shopify.com/s/files/1/0968/1128/6825/files/anms-challenge-grand-prize-badge.png?v=1789530643';
    prizeBadge.alt = 'Challenge — RM5,000 Grand Prize';
    prizeBadge.width = 2172;
    prizeBadge.height = 724;
    prizeBadge.style.width = 'min(218px, 56vw)';
    prizeBadge.style.maxWidth = '100%';
    prizeBadge.style.margin = '-11px auto -4px';
  }

  const timer = root.querySelector('[data-nxc-countdown]');
  const entryPass = root.querySelector('.nxc-entrychoices');
  const gearLabel = entryPass?.querySelector('.nxc-entrychoice:last-child .nxc-entrychoice__top');
  const heroCta = root.querySelector('.nxc-hero__cta');

  timer?.classList.add('nxc-expedition-clock');
  entryPass?.classList.add('nxc-expedition-pass');
  if (gearLabel) gearLabel.textContent = 'GEAR ENTRY';
  heroCta?.remove();

  /* Emotional story copy for the campaign. */
  const storyBody = root.querySelector('.nxc-story__copy .nxc-copy');
  if (storyBody) {
    storyBody.innerHTML = '<strong>Sometimes, the moments we remember most happen when life slows down.</strong><br><br>Away from the noise, surrounded by nature, we find time to talk, laugh, reconnect and simply be present with the people who matter most.<br><br>ANM’s OUTDOORS Challenge is an invitation to step outside, make time for each other and capture the moments that deserve to be remembered — a family laugh by the fire, a quiet morning beneath the trees, or an adventure that brings everyone a little closer.<br><br><strong>Because one day, the trip will end.<br>But the feeling, the story and the memories can stay forever.</strong><br><br><strong>Go outside. Be present. Make it a story worth sharing.</strong>';
  }

  /* Replace only the story image; keep the existing story text and overlay copy. */
  const storyImage = root.querySelector('.nxc-story__image');
  if (storyImage) {
    storyImage.style.backgroundImage = "linear-gradient(180deg,transparent,rgba(3,14,10,.28)),url('https://cdn.shopify.com/s/files/1/0968/1128/6825/files/anms-your-adventure-story-sunset.jpg?v=1789537027')";
    storyImage.style.backgroundPosition = 'center';
  }

  /* Keep empty until the owner says: start countdown. */
  const COUNTDOWN_END = '';
  const COUNTDOWN_DAYS = 45;
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