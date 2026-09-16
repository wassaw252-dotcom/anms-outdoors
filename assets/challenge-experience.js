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

  /* Mobile-only Choose Your Path carousel layer. Desktop remains unchanged. */
  if (!document.querySelector('style[data-nxc-path-carousel]')) {
    const style = document.createElement('style');
    style.dataset.nxcPathCarousel = '1';
    style.textContent = `
      @media (max-width:700px){
        .nxc #nxc-entry{padding-top:54px!important;padding-bottom:54px!important;overflow:visible}
        .nxc #nxc-entry .nxc-sectionhead{margin-bottom:20px!important}
        .nxc #nxc-entry .nxc-sectionhead h2{font-size:clamp(34px,10vw,43px)!important;line-height:1!important;max-width:330px}
        .nxc #nxc-entry .nxc-entry__grid.nxc-path-carousel{display:flex!important;grid-template-columns:none!important;gap:12px!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;scroll-padding-left:0!important;-webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;scrollbar-width:none;padding:0 30px 4px 0!important;margin-right:-14px!important;touch-action:pan-x pan-y}
        .nxc #nxc-entry .nxc-entry__grid.nxc-path-carousel::-webkit-scrollbar{display:none}
        .nxc #nxc-entry .nxc-path-carousel .nxc-entrycard{flex:0 0 min(84vw,340px)!important;width:min(84vw,340px)!important;min-height:270px!important;scroll-snap-align:start!important;scroll-snap-stop:always!important;border-radius:16px!important;border:1px solid rgba(245,203,120,.22)!important;box-shadow:0 18px 42px rgba(0,0,0,.24)!important;overflow:hidden!important;background:#0b1c15!important}
        .nxc #nxc-entry .nxc-path-carousel .nxc-entrycard:before{background-image:linear-gradient(180deg,rgba(2,10,7,.02) 22%,rgba(2,10,7,.28) 49%,rgba(2,10,7,.96) 100%),var(--nxc-card)!important;background-position:center!important;transform:scale(1.01)!important}
        .nxc #nxc-entry .nxc-path-carousel .nxc-entrycard__content{padding:22px!important;max-width:none!important;width:100%!important}
        .nxc #nxc-entry .nxc-path-carousel .nxc-entrycard__type{font-size:9px!important;letter-spacing:.15em!important;color:#f0d89f!important}
        .nxc #nxc-entry .nxc-path-carousel .nxc-entrycard h3{font-size:42px!important;margin:5px 0 6px!important;color:#f5cb78!important;text-shadow:0 4px 16px rgba(0,0,0,.32)}
        .nxc #nxc-entry .nxc-path-carousel .nxc-entrycard p{font-size:13.5px!important;line-height:1.5!important;margin:0!important;max-width:285px!important;color:#edf0ea!important}
        .nxc #nxc-entry .nxc-path-carousel .nxc-entrycard a{margin-top:12px!important;padding-top:11px!important;border-top:1px solid rgba(245,203,120,.16)!important;width:100%!important;font-size:9.5px!important;letter-spacing:.1em!important;color:#f5cb78!important}
        .nxc #nxc-entry .nxc-entrycard:nth-child(1) .nxc-entrycard__type:before{content:'01 · '}
        .nxc #nxc-entry .nxc-entrycard:nth-child(2) .nxc-entrycard__type:before{content:'02 · '}
        .nxc .nxc-path-nav{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:13px;padding-right:2px}
        .nxc .nxc-path-nav__hint{font:800 8px/1 Arial,sans-serif;letter-spacing:.14em;color:#9fac9f;display:flex;align-items:center;gap:7px}
        .nxc .nxc-path-nav__hint:after{content:'→';font-size:13px;color:#e9b455;animation:nxcSwipeArrow 1.8s ease-in-out infinite}
        .nxc .nxc-path-dots{display:flex;align-items:center;gap:6px}
        .nxc .nxc-path-dot{width:6px;height:6px;border-radius:999px;background:rgba(245,203,120,.24);transition:width .28s ease,background .28s ease}
        .nxc .nxc-path-dot.is-active{width:22px;background:#e9b455}
      }
      @keyframes nxcSwipeArrow{0%,100%{transform:translateX(0);opacity:.55}50%{transform:translateX(4px);opacity:1}}
      @media(prefers-reduced-motion:reduce){.nxc .nxc-path-nav__hint:after{animation:none!important}.nxc .nxc-path-dot{transition:none!important}}
    `;
    document.head.appendChild(style);
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

  /* Swipeable Choose Your Path cards on mobile with a one-time gesture hint. */
  const pathSection = root.querySelector('#nxc-entry');
  const pathGrid = pathSection?.querySelector('.nxc-entry__grid');
  const pathCards = pathGrid ? Array.from(pathGrid.querySelectorAll('.nxc-entrycard')) : [];
  let pathDots = [];

  if (pathGrid && pathCards.length > 1) {
    pathGrid.classList.add('nxc-path-carousel');

    const nav = document.createElement('div');
    nav.className = 'nxc-path-nav';
    nav.setAttribute('aria-hidden', 'true');
    nav.innerHTML = '<span class="nxc-path-nav__hint">SWIPE TO CHOOSE</span><span class="nxc-path-dots"></span>';
    pathGrid.insertAdjacentElement('afterend', nav);

    const dotsWrap = nav.querySelector('.nxc-path-dots');
    pathCards.forEach((_, index) => {
      const dot = document.createElement('span');
      dot.className = `nxc-path-dot${index === 0 ? ' is-active' : ''}`;
      dotsWrap.appendChild(dot);
    });
    pathDots = Array.from(dotsWrap.children);

    const syncPathDots = () => {
      if (window.innerWidth > 700) return;
      const center = pathGrid.scrollLeft + pathGrid.clientWidth * 0.45;
      let active = 0;
      let closest = Infinity;
      pathCards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);
        if (distance < closest) {
          closest = distance;
          active = index;
        }
      });
      pathDots.forEach((dot, index) => dot.classList.toggle('is-active', index === active));
    };

    pathGrid.addEventListener('scroll', syncPathDots, { passive: true });
    window.addEventListener('resize', syncPathDots);
    syncPathDots();
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

  if (!reduce && pathSection && pathGrid && 'IntersectionObserver' in window) {
    const hintObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || window.innerWidth > 700 || pathGrid.dataset.nxcHinted === '1') return;
        pathGrid.dataset.nxcHinted = '1';
        window.setTimeout(() => {
          if (pathGrid.scrollLeft > 4) return;
          pathGrid.scrollTo({ left: 24, behavior: 'smooth' });
          window.setTimeout(() => pathGrid.scrollTo({ left: 0, behavior: 'smooth' }), 420);
        }, 260);
        hintObserver.disconnect();
      });
    }, { threshold: 0.48 });
    hintObserver.observe(pathSection);
  }

  const hero = root.querySelector('.nxc-hero');
  const media = root.querySelector('.nxc-hero__media');
  const steps = root.querySelector('[data-nxc-steps]');
  const progress = steps?.querySelector('.nxc-steps__line span');
  const stepItems = steps ? Array.from(steps.querySelectorAll('.nxc-step')) : [];
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY || 0;

    if (!reduce && media && hero && window.innerWidth > 700) {
      const max = Math.max(hero.offsetHeight, 1);
      const p = Math.max(0, Math.min(1, y / max));
      media.style.transform = `translate3d(0,${p * 12}px,0) scale(${1 + p * 0.012})`;
    }

    if (steps && progress) {
      const r = steps.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, (vh * 0.8 - r.top) / (r.height + vh * 0.18)));
      progress.style.width = `${p * 100}%`;

      stepItems.forEach((step, index) => {
        const threshold = (index + 0.35) / stepItems.length;
        step.classList.toggle('is-progressed', p >= threshold);
      });
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