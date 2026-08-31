/* ==========================================================================
   Amit Automation Suite — site behaviour
   No dependencies. Everything here is progressive enhancement: with this file
   blocked the pages remain fully readable and navigable.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     CONFIG — the only part of this file you normally need to edit.
     ====================================================================== */
  var CONFIG = {

    /* --- WhatsApp ------------------------------------------------------
       This is a plain number link, so two things follow:

       1. The number is NOT displayed anywhere on the site — but it is inside
          this link, so anyone who opens the page source can read it. If you
          want it hidden completely, replace the line below with a WhatsApp
          Business short link:
              'https://wa.me/message/ABCD1234EFGH1'
          (WhatsApp Business → Settings → Business tools → Short link.)

       2. Because it is a number link, the contact and comment forms show a
          "Send on WhatsApp" button that arrives with the message already
          typed. A short link cannot do that — WhatsApp does not let short
          links carry pre-filled text — so switching would hide those buttons
          and the forms would use email only.

       PLANNED: replace this with a WhatsApp username link once that is set up
       (a username link hides the number the same way a short link does). No
       other change is needed — anything that is not wa.me/<digits> is treated
       as "cannot pre-fill", so the forms' WhatsApp buttons hide themselves and
       the rest of the site keeps working.

       Leaving this empty hides every WhatsApp element on the site, so a dead
       link is never shown to a visitor. */
    whatsappLink: 'https://wa.me/919210351535',

    /* --- Email --------------------------------------------------------- */
    email: '123amitjain@gmail.com',

    /* --- Map -----------------------------------------------------------
       Loaded only after the visitor clicks "Show map", so nothing reaches
       Google until they ask for it.

       NOTE: the written address on the site says only "Delhi, India", but this
       embed drops a pin on the exact building, and Google shows the full street
       address inside the map once it is loaded. If you would rather nothing
       pinpointed the office, swap the line below for this city-level one:

         mapEmbed: 'https://maps.google.com/maps?q=Delhi,India&hl=en&z=11&output=embed',

       If you do that, also remove the "Open in Google Maps" link near the
       bottom of contact.html — it points at the exact place. */
    mapEmbed: 'https://maps.google.com/maps?q=28.6547056,77.3052461&hl=en&z=17&output=embed',

    /* --- Comments ------------------------------------------------------
       Only comments listed in this file are ever shown. A new comment is
       emailed to you and appears on the site only once you add it here. */
    commentsUrl: 'assets/data/comments.json'
  };

  /* ====================================================================== */

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return (ctx || document).querySelectorAll(sel); }

  /* ---- 1. Mobile navigation ------------------------------------------- */

  var toggle = $('.nav__toggle');
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

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---- 2. Header elevation + scroll progress --------------------------- */

  var header = $('.site-header');
  var progressBar = $('.scroll-progress span');

  if (header || progressBar) {
    var ticking = false;

    var onScroll = function () {
      if (header) header.classList.toggle('is-stuck', window.scrollY > 8);

      if (progressBar) {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        progressBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      }
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }, { passive: true });

    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* ---- 3. Reveal on scroll --------------------------------------------- */

  var revealables = $$('.reveal');

  function revealAll() {
    each(revealables, function (el) { el.classList.add('is-visible'); });
  }

  if (!revealables.length) {
    // nothing to do
  } else if (reduceMotion || !('IntersectionObserver' in window)) {
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

      each(revealables, function (el) { observer.observe(el); });
    } catch (e) {
      revealAll();
    }
  }

  /* ---- 3b. Stagger siblings inside a grid ------------------------------
     Rather than hand-tagging every third card in the markup, each container
     below hands its own children an increasing delay, so a row of cards
     arrives in sequence instead of all at once. An inline delay beats the
     .reveal-d* classes still present in the HTML, which keeps the two from
     fighting. */

  if (!reduceMotion) {
    each($$('.grid, .steps, .panel__grid, .comments'), function (group) {
      var i = 0;
      each(group.children, function (child) {
        if (!child.classList.contains('reveal')) return;
        child.style.transitionDelay = (i * 70) + 'ms';
        i++;
      });
    });
  }

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

  each($$('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---- 5. WhatsApp ------------------------------------------------------ */

  var waLink = (CONFIG.whatsappLink || '').trim();
  var waNumberMatch = waLink.match(/wa\.me\/(\d{8,15})(?:[/?#]|$)/);
  var waSupportsPrefill = !!waNumberMatch;

  function waHref(text) {
    if (!waLink) return '';
    if (waSupportsPrefill && text) {
      return 'https://wa.me/' + waNumberMatch[1] + '?text=' + encodeURIComponent(text);
    }
    return waLink;
  }

  if (waLink) {
    each($$('[data-wa-link]'), function (el) {
      el.href = waLink;
      el.removeAttribute('hidden');
    });
    each($$('[data-wa-item]'), function (el) { el.removeAttribute('hidden'); });
    // Lets the back-to-top button know it has to sit above the float button.
    document.body.classList.add('has-wa');
  }
  // When it is not configured the elements simply stay hidden, which is the
  // markup's default — nothing to undo here.

  /* ---- 6. Map: load only on request ------------------------------------ */

  each($$('[data-map]'), function (wrap) {
    var button = $('[data-map-load]', wrap);
    var consent = $('.map__consent', wrap);
    if (!button || !consent) return;

    button.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      frame.src = CONFIG.mapEmbed;
      frame.title = 'Google Map showing the location of Aanya Enterprises, Delhi';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.setAttribute('allowfullscreen', '');
      wrap.appendChild(frame);
      consent.remove();
    });
  });

  /* ---- 7. Forms --------------------------------------------------------- */

  function setError(field, message) {
    var wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.add('is-invalid');
    var slot = $('[data-error-text]', wrap);
    if (slot) slot.textContent = message;
    field.setAttribute('aria-invalid', 'true');
  }

  function clearError(field) {
    var wrap = field.closest('.field');
    if (!wrap) return;
    wrap.classList.remove('is-invalid');
    field.removeAttribute('aria-invalid');
  }

  function validate(form) {
    var ok = true;
    var firstBad = null;

    each(form.querySelectorAll('[data-required]'), function (field) {
      var value = (field.value || '').trim();
      clearError(field);

      if (!value) {
        setError(field, field.dataset.msgRequired || 'This field is required.');
        ok = false;
        if (!firstBad) firstBad = field;
        return;
      }
      if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setError(field, 'Please enter a valid email address.');
        ok = false;
        if (!firstBad) firstBad = field;
        return;
      }
      if (field.dataset.minlength && value.length < Number(field.dataset.minlength)) {
        setError(field, 'Please write at least ' + field.dataset.minlength + ' characters.');
        ok = false;
        if (!firstBad) firstBad = field;
      }
    });

    if (firstBad) firstBad.focus();
    return ok;
  }

  function showStatus(form, message, isOk) {
    var box = $('.form__status', form);
    if (!box) return;
    box.classList.add('is-shown');
    box.classList.toggle('is-ok', !!isOk);
    var text = $('[data-status-text]', box);
    if (text) text.textContent = message;
  }

  function fieldValue(form, name) {
    var el = form.elements[name];
    return el ? (el.value || '').trim() : '';
  }

  function openCompose(url) {
    // A plain assignment keeps mail clients and WhatsApp happy on both
    // desktop and mobile; window.open is blocked more often.
    window.location.href = url;
  }

  each($$('[data-form]'), function (form) {
    var kind = form.dataset.form; // 'contact' | 'comment'

    each(form.querySelectorAll('input, textarea'), function (field) {
      field.addEventListener('input', function () { clearError(field); });
    });

    function buildMessage() {
      if (kind === 'comment') {
        return [
          'New website comment — awaiting your approval',
          '',
          'Name    : ' + fieldValue(form, 'name'),
          'Company : ' + (fieldValue(form, 'company') || '—'),
          'Email   : ' + (fieldValue(form, 'email') || '—'),
          '',
          'Comment :',
          fieldValue(form, 'message'),
          '',
          '— Sent from amitsuite.github.io. This comment is not public until you add it to assets/data/comments.json.'
        ].join('\n');
      }
      return [
        'Website enquiry — Amit Automation Suite',
        '',
        'Name    : ' + fieldValue(form, 'name'),
        'Company : ' + (fieldValue(form, 'company') || '—'),
        'Email   : ' + fieldValue(form, 'email'),
        'Topic   : ' + (fieldValue(form, 'topic') || '—'),
        '',
        'Message :',
        fieldValue(form, 'message'),
        '',
        '— Sent from amitsuite.github.io'
      ].join('\n');
    }

    function subject() {
      if (kind === 'comment') {
        return 'Website comment from ' + (fieldValue(form, 'name') || 'a visitor');
      }
      var topic = fieldValue(form, 'topic');
      return 'AAS enquiry' + (topic ? ' — ' + topic : '') +
             ' — ' + (fieldValue(form, 'name') || 'website');
    }

    function send(via) {
      // Honeypot: a real person never fills this.
      if (fieldValue(form, 'website')) return;
      if (!validate(form)) return;

      var body = buildMessage();

      if (via === 'whatsapp' && waSupportsPrefill) {
        window.open(waHref(body), '_blank', 'noopener');
        showStatus(form,
          'WhatsApp is opening with your message ready — press send there to deliver it.',
          true);
        return;
      }

      openCompose('mailto:' + CONFIG.email +
        '?subject=' + encodeURIComponent(subject()) +
        '&body=' + encodeURIComponent(body));

      showStatus(form, kind === 'comment'
        ? 'Your email app is opening with the comment ready. Press send there — the comment appears on this page only after Amit has reviewed and approved it.'
        : 'Your email app is opening with the message ready. Press send there and it reaches Amit directly.',
        true);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send('email');
    });

    each($$('[data-send="whatsapp"]', form), function (btn) {
      // Only offer it when the configured link can actually carry the text.
      if (!waSupportsPrefill) { btn.hidden = true; return; }
      btn.hidden = false;
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        send('whatsapp');
      });
    });
  });

  /* ---- 7b. Counting figures in the dashboard illustration --------------
     The numbers count up once, the first time the illustration is scrolled
     into view. Values are read from the markup, so the figures shown are
     whatever the HTML says — the animation invents nothing. */

  var counters = $$('[data-count]');

  if (counters.length) {
    var runCounter = function (el) {
      var target = Number(el.getAttribute('data-count'));
      var prefix = el.getAttribute('data-prefix') || '';
      if (!isFinite(target)) return;

      var format = function (n) {
        return prefix + Math.round(n).toLocaleString('en-IN');
      };

      if (reduceMotion) { el.textContent = format(target); return; }

      var duration = 1100;
      var start = null;
      var done = false;

      var finish = function () {
        if (done) return;
        done = true;
        el.textContent = format(target);
      };

      var tick = function (now) {
        if (done) return;
        if (start === null) start = now;
        var p = Math.min(1, (now - start) / duration);
        // Ease-out cubic: quick at first, settling at the end.
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(target * eased);
        if (p < 1) window.requestAnimationFrame(tick);
        else finish();
      };

      // requestAnimationFrame is suspended while a tab is in the background,
      // so an animation interrupted part-way would otherwise leave a wrong
      // number frozen on screen. This guarantees the real figure lands.
      window.setTimeout(finish, duration + 900);

      window.requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      each(counters, runCounter);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        });
      }, { threshold: 0.4 });

      each(counters, function (el) { countObserver.observe(el); });
    }
  }

  /* ---- 7c. Back to top -------------------------------------------------
     Built here rather than in the markup so it cannot appear on a page with
     JavaScript switched off, where it would do nothing. */

  var toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Back to top');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  document.body.appendChild(toTop);

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    // Send focus somewhere sensible rather than leaving it on a button that
    // has just faded out.
    var skip = $('.skip-link');
    if (skip) skip.focus({ preventScroll: true });
  });

  var toTopTicking = false;
  var updateToTop = function () {
    toTop.classList.toggle('is-shown', window.scrollY > 600);
    toTopTicking = false;
  };
  window.addEventListener('scroll', function () {
    if (toTopTicking) return;
    toTopTicking = true;
    window.requestAnimationFrame(updateToTop);
  }, { passive: true });
  updateToTop();

  /* ---- 8. Approved comments -------------------------------------------- */

  var commentList = $('[data-comments]');

  if (commentList) {
    var fmtDate = function (iso) {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    var el = function (tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;   // textContent, never innerHTML
      return n;
    };

    var render = function (items) {
      commentList.textContent = '';

      var counter = $('[data-comments-count]');
      if (counter) {
        counter.textContent = items.length === 0 ? 'No comments yet'
          : items.length === 1 ? '1 comment' : items.length + ' comments';
      }

      if (!items.length) {
        var empty = el('div', 'comments__empty',
          'No comments published yet. Yours could be the first — use the form below.');
        commentList.appendChild(empty);
        return;
      }

      items.forEach(function (c) {
        var row = el('article', 'comment');

        var name = String(c.name || 'Anonymous');
        row.appendChild(el('div', 'comment__avatar', name.trim().charAt(0) || '?'));

        var main = el('div');
        var head = el('div', 'comment__head');
        head.appendChild(el('span', 'comment__name', name));
        if (c.company) head.appendChild(el('span', 'comment__org', c.company));
        if (c.date) {
          var t = el('time', 'comment__date', fmtDate(c.date));
          t.setAttribute('datetime', c.date);
          head.appendChild(t);
        }
        main.appendChild(head);

        var body = el('div', 'comment__body');
        String(c.message || '').split(/\n{2,}/).forEach(function (para) {
          if (para.trim()) body.appendChild(el('p', null, para.trim()));
        });
        main.appendChild(body);

        if (c.reply) {
          var reply = el('div', 'comment__reply');
          var rh = el('div', 'comment__head');
          rh.appendChild(el('span', 'comment__name', c.replyBy || 'Amit Jain'));
          if (c.replyDate) {
            var rt = el('time', 'comment__date', fmtDate(c.replyDate));
            rt.setAttribute('datetime', c.replyDate);
            rh.appendChild(rt);
          }
          reply.appendChild(rh);
          reply.appendChild(el('p', null, String(c.reply)));
          main.appendChild(reply);
        }

        row.appendChild(main);
        commentList.appendChild(row);
      });
    };

    if (window.fetch) {
      fetch(CONFIG.commentsUrl, { cache: 'no-cache' })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
        .then(function (data) {
          var items = Array.isArray(data) ? data : (data.comments || []);
          // Newest first, and never trust a stray "approved: false".
          items = items
            .filter(function (c) { return c && c.approved !== false && c.message; })
            .sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });
          render(items);
        })
        .catch(function () {
          // Offline, opened over file://, or the file is not there yet.
          render([]);
        });
    } else {
      render([]);
    }
  }
})();
