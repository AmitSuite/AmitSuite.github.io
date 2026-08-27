/* ==========================================================================
   Amit Automation Suite — site behaviour
   No dependencies. Everything here is progressive enhancement: with this file
   blocked the pages remain fully readable and navigable.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. Mobile navigation ------------------------------------------- */

  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      menu.classList.toggle('is-open', !open);
    });

    // Escape closes and returns focus to the button.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });

    // A click anywhere outside the open menu closes it.
    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    // Following a link closes it too.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    // Crossing back to the desktop layout must not leave a stale open state.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---- 2. Header elevation on scroll ----------------------------------- */

  var header = document.querySelector('.site-header');
  if (header) {
    var ticking = false;
    var applyStuck = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(applyStuck);
    }, { passive: true });
    applyStuck();
  }

  /* ---- 3. Reveal on scroll --------------------------------------------- */

  var revealables = document.querySelectorAll('.reveal');

  function revealAll() {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-visible');
    });
  }

  if (!revealables.length) {
    // nothing to do
  } else if (reduceMotion || !('IntersectionObserver' in window)) {
    // Show everything at once — no animation, no dependency on the observer.
    revealAll();
  } else {
    try {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

      Array.prototype.forEach.call(revealables, function (el) {
        observer.observe(el);
      });
    } catch (e) {
      // Whatever went wrong, content must never stay invisible.
      revealAll();
    }
  }

  // Printing must not depend on having scrolled the page first. Safari and
  // older Firefox do not fire beforeprint, so the print stylesheet repeats
  // this guard; both together cover every browser.
  if (revealables.length) {
    window.addEventListener('beforeprint', revealAll);
    if (window.matchMedia) {
      var printQuery = window.matchMedia('print');
      var onPrintChange = function (e) { if (e.matches) revealAll(); };
      if (printQuery.addEventListener) printQuery.addEventListener('change', onPrintChange);
      else if (printQuery.addListener) printQuery.addListener(onPrintChange);
    }
  }

  /* ---- 4. Footer year --------------------------------------------------- */

  Array.prototype.forEach.call(
    document.querySelectorAll('[data-year]'),
    function (el) { el.textContent = String(new Date().getFullYear()); }
  );
})();
