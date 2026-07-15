/* au-theme.js — African Updates Hugo theme */
(function () {
  'use strict';

  /* ── HELPERS ─────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── NAV: hamburger + dropdowns ──────────────────────── */
  function initNav() {
    const hamburger = $('#au-nav .au-nav__hamburger');
    const menu      = $('#au-nav-menu');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      hamburger.setAttribute('aria-expanded', String(open));
    });

    // Dropdown toggles (mobile tap, desktop hover handled by CSS)
    $$('.au-nav__item.has-dropdown').forEach(item => {
      const link    = item.querySelector('.au-nav__link');
      const dropdown = item.querySelector('.au-nav__dropdown');
      if (!link || !dropdown) return;

      link.addEventListener('click', e => {
        // Only intercept on mobile (menu stacked)
        if (window.innerWidth > 768) return;
        e.preventDefault();
        const open = item.classList.toggle('dropdown-open');
        link.setAttribute('aria-expanded', String(open));
      });
    });

    // Close menu on outside click
    document.addEventListener('click', e => {
      if (!e.target.closest('#au-nav')) {
        menu.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── HEADER SEARCH TOGGLE ────────────────────────────── */
  function initHeaderSearch() {
    const btn   = $('.au-header .au-search-toggle');
    const panel = $('.au-header .au-search-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const hidden = panel.hasAttribute('hidden');
      if (hidden) {
        panel.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');
        panel.querySelector('input')?.focus();
      } else {
        panel.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.au-header__search')) {
        panel.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── NAV SEARCH TOGGLE (mobile) ──────────────────────── */
  function initNavSearch() {
    const btn   = $('.au-nav__search-btn');
    const panel = $('.au-nav__mobile-search');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const hidden = panel.hasAttribute('hidden');
      if (hidden) {
        panel.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');
        panel.querySelector('input')?.focus();
      } else {
        panel.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── STICKY NAV ──────────────────────────────────────── */
  function initStickyNav() {
    const nav = $('#au-nav');
    if (!nav) return;
    // CSS handles sticky; we just add a scrolled class for shadow
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── HERO SLIDER ─────────────────────────────────────── */
  function initSlider() {
    const slider = $('[data-slider]');
    if (!slider) return;

    const slides   = $$('[data-slide]', slider);
    const dots     = $$('.au-slider__dot', slider);
    const prevBtn  = $('[data-slider-prev]', slider);
    const nextBtn  = $('[data-slider-next]', slider);
    let current    = 0;
    let timer      = null;
    const INTERVAL = 6000;

    if (slides.length < 2) return;

    function goTo(idx) {
      slides[current].classList.remove('is-active');
      slides[current].setAttribute('aria-hidden', 'true');
      dots[current]?.classList.remove('is-active');
      dots[current]?.setAttribute('aria-current', 'false');

      current = (idx + slides.length) % slides.length;

      slides[current].classList.add('is-active');
      slides[current].setAttribute('aria-hidden', 'false');
      dots[current]?.classList.add('is-active');
      dots[current]?.setAttribute('aria-current', 'true');
    }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(() => goTo(current + 1), INTERVAL);
    }

    function stopAuto() { clearInterval(timer); }

    prevBtn?.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    nextBtn?.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAuto(); });
    });

    // Pause on hover
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    // Keyboard navigation
    slider.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { goTo(current - 1); startAuto(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
    });

    // Touch swipe
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    slider.addEventListener('touchend', e => {
      const delta = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) {
        delta < 0 ? goTo(current + 1) : goTo(current - 1);
        startAuto();
      }
    }, { passive: true });

    // Respect reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      startAuto();
    }
  }

  /* ── LOAD MORE (simple pagination fallback) ─────────── */
  function initLoadMore() {
    const btn = $('#au-loadmore-btn');
    if (!btn) return;
    // Default behaviour: just follow the href link.
    // Swap for AJAX fetch if you add a JSON endpoint later.
  }

  /* ── INIT ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initHeaderSearch();
    initNavSearch();
    initStickyNav();
    initSlider();
    initLoadMore();
  });

})();

/* ── COPY LINK BUTTON ────────────────────────────────────── */
function initCopyLinks() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-copy-url]');
    if (!btn) return;
    const url = btn.dataset.copyUrl;
    navigator.clipboard?.writeText(url).then(() => {
      const label = btn.querySelector('span');
      const icon  = btn.querySelector('i');
      btn.classList.add('copied');
      if (label) label.textContent = 'Copied!';
      if (icon)  { icon.className = 'fa fa-check'; }
      setTimeout(() => {
        btn.classList.remove('copied');
        if (label) label.textContent = 'Copy';
        if (icon)  { icon.className = 'fa fa-link'; }
      }, 2000);
    });
  });
}

/* ── LAZY IMAGE BACKGROUNDS ──────────────────────────────── */
function initLazyBg() {
  // Cards use inline background-image; this is a no-op hook for
  // future IntersectionObserver-based lazy loading if needed.
}

/* ── DROPDOWN: close on outside click (desktop) ──────────── */
function initDropdownClose() {
  document.addEventListener('click', e => {
    if (!e.target.closest('.au-nav__item.has-dropdown')) {
      document.querySelectorAll('.au-nav__item.dropdown-open').forEach(el => {
        el.classList.remove('dropdown-open');
      });
    }
  });
}

// Extend DOMContentLoaded init
document.addEventListener('DOMContentLoaded', () => {
  initCopyLinks();
  initLazyBg();
  initDropdownClose();
});

/* ── BREAKING TICKER ─────────────────────────────────────── */
function initTicker() {
  const ticker  = document.querySelector('.au-ticker');
  const track   = document.getElementById('au-ticker-track');
  const pauseBtn = document.getElementById('au-ticker-pause');
  if (!ticker || !track || !pauseBtn) return;

  // Skip animation if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Calibrate speed to content width so it always feels the same pace
  const trackWidth = track.scrollWidth / 2; // halved because list is doubled
  const pxPerSec   = 80; // pixels per second
  const duration   = Math.max(20, trackWidth / pxPerSec);
  track.style.animationDuration = duration + 's';

  let paused = false;
  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    track.classList.toggle('is-paused', paused);
    pauseBtn.setAttribute('aria-pressed', String(paused));
    const icon = pauseBtn.querySelector('i');
    if (icon) icon.className = paused ? 'fa fa-play' : 'fa fa-pause';
    pauseBtn.setAttribute('aria-label', paused ? 'Resume ticker' : 'Pause ticker');
  });

  // Pause on hover / focus for accessibility
  ticker.addEventListener('mouseenter', () => { if (!paused) track.classList.add('is-paused'); });
  ticker.addEventListener('mouseleave', () => { if (!paused) track.classList.remove('is-paused'); });
  ticker.addEventListener('focusin',    () => { if (!paused) track.classList.add('is-paused'); });
  ticker.addEventListener('focusout',   () => { if (!paused) track.classList.remove('is-paused'); });
}

/* ── BACK TO TOP ─────────────────────────────────────────── */
function initBackTop() {
  const btn = document.getElementById('au-back-top');
  if (!btn) return;

  const SHOW_AT = 600; // px scrolled before button appears

  window.addEventListener('scroll', () => {
    if (window.scrollY > SHOW_AT) {
      btn.removeAttribute('hidden');
    } else {
      btn.setAttribute('hidden', '');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initTicker();
  initBackTop();
});
