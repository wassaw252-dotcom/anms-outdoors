(() => {
  const root = document.getElementById('NxcChallenge');
  if (!root || root.dataset.nxcReady === '1') return;
  root.dataset.nxcReady = '1';

  const installCampaignLockup = () => {
    const oldLockup = root.querySelector('.nxc-lockup');
    if (!oldLockup || root.querySelector('.nxc-campaign-lockup')) return;

    if (!document.getElementById('NxcCampaignLockupStyles')) {
      const style = document.createElement('style');
      style.id = 'NxcCampaignLockupStyles';
      style.textContent = `
        .nxc-campaign-lockup{
          width:min(560px,94vw);
          margin:-6px auto 3px;
          position:relative;
          text-align:center;
          isolation:isolate;
          filter:drop-shadow(0 12px 26px rgba(0,0,0,.28));
        }
        .nxc-campaign-word{
          position:relative;
          z-index:2;
          display:flex;
          align-items:flex-end;
          justify-content:center;
          gap:8px;
          margin:0 0 -8px;
          transform:rotate(-1.2deg);
        }
        .nxc-campaign-word__text{
          display:block;
          white-space:nowrap;
          color:#fffaf0;
          font-family:'Brush Script MT','Segoe Script','Marker Felt','Comic Sans MS',cursive;
          font-size:clamp(62px,9.5vw,112px);
          font-weight:900;
          font-style:italic;
          line-height:.78;
          letter-spacing:-.065em;
          -webkit-text-stroke:.5px rgba(255,255,255,.95);
          text-shadow:
            3px 4px 0 rgba(221,166,73,.52),
            0 7px 18px rgba(0,0,0,.5);
          transform:skewX(-5deg);
        }
        .nxc-campaign-word__mountain{
          width:68px;
          height:42px;
          flex:0 0 auto;
          color:#e9b455;
          margin:0 0 9px -2px;
          filter:drop-shadow(0 5px 8px rgba(0,0,0,.28));
        }
        .nxc-campaign-word__mountain svg{
          width:100%;
          height:100%;
          display:block;
          fill:currentColor;
        }
        .nxc-campaign-prize{
          position:relative;
          z-index:1;
          width:100%;
          padding:18px 52px 13px;
          color:#061b14;
          background:linear-gradient(90deg,#c88b34 0%,#e8b45d 18%,#f0c776 48%,#e0aa52 78%,#c68631 100%);
          clip-path:polygon(2% 14%,10% 7%,20% 10%,31% 5%,43% 8%,55% 3%,67% 7%,79% 4%,91% 8%,99% 14%,95% 24%,100% 33%,96% 42%,99% 51%,95% 61%,99% 71%,95% 80%,98% 89%,89% 94%,77% 91%,64% 96%,50% 92%,37% 97%,25% 92%,13% 96%,3% 89%,6% 79%,1% 69%,5% 59%,1% 49%,5% 39%,0 29%,5% 21%);
          box-shadow:inset 0 1px rgba(255,255,255,.22),0 12px 24px rgba(0,0,0,.28);
        }
        .nxc-campaign-prize:before,
        .nxc-campaign-prize:after{
          content:'';
          position:absolute;
          top:48%;
          width:12%;
          height:16%;
          background:#d89e45;
          z-index:-1;
          opacity:.78;
        }
        .nxc-campaign-prize:before{left:-6%;transform:rotate(-5deg) skewX(-24deg)}
        .nxc-campaign-prize:after{right:-6%;transform:rotate(4deg) skewX(24deg)}
        .nxc-campaign-prize strong{
          display:block;
          font:400 clamp(62px,9vw,98px)/.8 'NxcAnton',Impact,'Arial Black',sans-serif;
          letter-spacing:.015em;
          color:#071b14;
          text-shadow:0 1px rgba(255,255,255,.1);
        }
        .nxc-campaign-prize span{
          display:block;
          margin-top:8px;
          font:900 clamp(21px,3vw,38px)/1 Arial,'Arial Narrow',sans-serif;
          letter-spacing:.055em;
          color:#071b14;
        }
        @media(max-width:600px){
          .nxc-campaign-lockup{width:95vw;margin:-4px auto 4px}
          .nxc-campaign-word{gap:4px;margin-bottom:-6px;transform:rotate(-.8deg)}
          .nxc-campaign-word__text{
            font-size:clamp(54px,18vw,76px);
            line-height:.8;
            letter-spacing:-.075em;
            text-shadow:2px 3px 0 rgba(221,166,73,.5),0 6px 14px rgba(0,0,0,.48);
          }
          .nxc-campaign-word__mountain{width:44px;height:28px;margin:0 0 8px -1px}
          .nxc-campaign-prize{padding:14px 24px 11px}
          .nxc-campaign-prize strong{font-size:clamp(50px,16vw,68px)}
          .nxc-campaign-prize span{font-size:clamp(18px,5.7vw,25px);margin-top:6px;letter-spacing:.045em}
        }
      `;
      document.head.appendChild(style);
    }

    const lockup = document.createElement('div');
    lockup.className = 'nxc-campaign-lockup';
    lockup.id = 'NxcChallengeTitle';
    lockup.setAttribute('role', 'img');
    lockup.setAttribute('aria-label', 'Challenge — RM5,000 Grand Prize');
    lockup.setAttribute('data-nxc-reveal', '');
    lockup.innerHTML = `
      <div class="nxc-campaign-word" aria-hidden="true">
        <span class="nxc-campaign-word__text">CHALLENGE</span>
        <span class="nxc-campaign-word__mountain">
          <svg viewBox="0 0 96 60" aria-hidden="true">
            <path d="M2 52 28 15l12 16L51 9l43 43H2Zm17-7h14l-7-10-7 10Zm20 0h37L52 20 39 45Z"/>
          </svg>
        </span>
      </div>
      <div class="nxc-campaign-prize" aria-hidden="true">
        <strong>RM5,000</strong>
        <span>GRAND PRIZE</span>
      </div>
    `;

    oldLockup.replaceWith(lockup);
  };

  installCampaignLockup();

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