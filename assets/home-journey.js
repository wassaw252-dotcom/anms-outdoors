(() => {
  'use strict';
  if (!document.body.classList.contains('page-index')) return;

  const selectors = [
    '.story-content > *',
    '.story-aside',
    '.sba-heading',
    '.sba-tabs',
    '.sba-controller',
    '.sba-why-head',
    '.sba-why-card',
    '.camp-pathways .section-heading',
    '.camp-pathways .pathway',
    '.camp-pathways > .wrap > .small',
    '.brand-story-copy'
  ];

  const nodes = [...document.querySelectorAll(selectors.join(','))];
  if (!nodes.length) return;

  nodes.forEach((node, index) => {
    node.classList.add('journey-reveal');
    node.style.setProperty('--journey-delay', `${Math.min(index % 4, 3) * 70}ms`);
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    nodes.forEach((node) => node.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  nodes.forEach((node) => observer.observe(node));
})();
