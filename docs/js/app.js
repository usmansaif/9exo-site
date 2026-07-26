(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Preloader */
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    if (preloader) {
      preloader.classList.add('is-hidden');
    }
    document.documentElement.classList.add('is-loaded');
  });

  /* Header background on scroll */
  var header = document.getElementById('siteHeader');
  function updateHeader() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* Scroll reveal */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* Reveal hero content immediately (above the fold, no scroll needed) */
  var heroReveals = document.querySelectorAll('.hero [data-reveal]');
  heroReveals.forEach(function (el) {
    requestAnimationFrame(function () { el.classList.add('is-visible'); });
  });

  /* Subtle parallax glow following pointer in hero */
  var hero = document.querySelector('.hero');
  var glow = document.querySelector('.hero__glow');
  if (hero && glow && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
      var y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
      glow.style.transform = 'translate(calc(-50% + ' + x + 'px), ' + y + 'px)';
    });
  }

  /* Smooth-scroll anchor links (extra assurance beyond CSS scroll-behavior) */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      var target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
})();
