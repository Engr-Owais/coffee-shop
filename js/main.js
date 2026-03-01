/**
 * Brew & Bloom — main.js
 * Handles: navbar scroll, parallax, scroll-reveal (Intersection Observer),
 *          menu tabs, 3D tilt cards, gallery carousel, testimonial slider,
 *          contact form, back-to-top, year footer.
 */

(function () {
  'use strict';

  /* ── Helpers ───────────────────────────────────────────── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ─────────────────────────────────────────────────────────
     1. NAVBAR — sticky + mobile toggle
  ───────────────────────────────────────────────────────── */
  const navbar    = $('#navbar');
  const navToggle = $('#navToggle');
  const navLinks  = $('#navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    handleBackToTop();
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll when menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  $$('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ─────────────────────────────────────────────────────────
     2. PARALLAX HERO — mouse & scroll
  ───────────────────────────────────────────────────────── */
  const hero      = $('#hero');
  const layers    = $$('.parallax-layer');
  const heroContent = $('.hero-content');
  const heroCup   = $('.hero-cup-wrapper');

  // Mouse parallax
  hero.addEventListener('mousemove', (e) => {
    const { width, height } = hero.getBoundingClientRect();
    const cx = (e.clientX - width / 2) / width;   // -0.5 … 0.5
    const cy = (e.clientY - height / 2) / height;

    layers.forEach(layer => {
      const depth = parseFloat(layer.dataset.depth) || 0.2;
      layer.style.transform = `translate(${cx * depth * 40}px, ${cy * depth * 40}px)`;
    });

    if (heroCup) {
      heroCup.style.transform = `translateY(-50%) translate(${cx * 12}px, ${cy * 8}px)`;
    }
  });

  // Scroll parallax on hero content
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
    }
    if (heroCup) {
      heroCup.style.transform = `translateY(calc(-50% + ${scrollY * 0.15}px))`;
    }
  }, { passive: true });

  /* ─────────────────────────────────────────────────────────
     3. SCROLL-REVEAL — Intersection Observer
  ───────────────────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  $$('.reveal-up, .reveal-fade, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  /* ─────────────────────────────────────────────────────────
     4. MENU TABS
  ───────────────────────────────────────────────────────── */
  const tabBtns   = $$('.tab-btn');
  const tabPanels = $$('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = $(`#tab-${target}`);
      if (panel) {
        panel.classList.add('active');
        panel.hidden = false;
        // Re-observe new panel items for reveal animations
        $$('.reveal-up, .reveal-fade', panel).forEach(el => {
          el.classList.remove('revealed');
          revealObserver.observe(el);
        });
      }
    });
  });

  /* ─────────────────────────────────────────────────────────
     5. 3D TILT CARDS
  ───────────────────────────────────────────────────────── */
  function initTilt(card) {
    const inner = card.querySelector('.menu-card-inner, .about-card');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 … 0.5
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      const maxRot = 12;
      inner.style.transform = `rotateY(${x * maxRot}deg) rotateX(${-y * maxRot}deg) scale3d(1.02,1.02,1.02)`;
      inner.style.boxShadow = `${-x * 20}px ${-y * 20}px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,165,116,0.2)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = '';
      inner.style.boxShadow = '';
    });
  }

  $$('.tilt-card').forEach(initTilt);

  // Also tilt the about-card specifically
  const aboutCardWrap = $('.about-card-wrap');
  if (aboutCardWrap) {
    const aboutCard = $('.about-card', aboutCardWrap);
    if (aboutCard) {
      aboutCardWrap.addEventListener('mousemove', (e) => {
        const rect = aboutCardWrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        aboutCard.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg) scale(1.02)`;
        aboutCard.style.boxShadow = `${-x * 30}px ${y * 20}px 50px rgba(0,0,0,0.5)`;
      });
      aboutCardWrap.addEventListener('mouseleave', () => {
        aboutCard.style.transform = '';
        aboutCard.style.boxShadow = '';
      });
    }
  }

  /* ─────────────────────────────────────────────────────────
     6. 3D GALLERY CAROUSEL
  ───────────────────────────────────────────────────────── */
  const items      = $$('.carousel-item');
  const stage      = $('#carouselStage');
  const prevBtn    = $('#carouselPrev');
  const nextBtn    = $('#carouselNext');
  const dotsWrap   = $('#carouselDots');
  const total      = items.length;
  let current      = 0;
  let autoPlayTimer;

  // Build dots
  items.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function positionItems() {
    const angleStep = 360 / total;
    const radius    = Math.max(300, window.innerWidth * 0.28);

    items.forEach((item, i) => {
      const angle  = angleStep * (i - current);
      const rad    = angle * (Math.PI / 180);
      const x      = Math.sin(rad) * radius;
      const z      = Math.cos(rad) * radius - radius;
      const scale  = Math.max(0.6, (z + radius) / (2 * radius));
      const opacity = Math.max(0.3, scale);

      item.style.transform  = `translateX(${x}px) translateZ(${z}px) scale(${scale})`;
      item.style.opacity    = opacity;
      item.style.zIndex     = Math.round(scale * 10);
      item.classList.toggle('active', i === current);
    });

    // Update dots
    $$('.dot', dotsWrap).forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    positionItems();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoPlay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoPlay(); });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAutoPlay(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoPlay(); }
  });

  // Touch / swipe
  let touchStartX = 0;
  if (stage) {
    stage.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        goTo(dx < 0 ? current + 1 : current - 1);
        resetAutoPlay();
      }
    });
  }

  function startAutoPlay() {
    autoPlayTimer = setInterval(() => goTo(current + 1), 4000);
  }
  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  positionItems();
  startAutoPlay();
  window.addEventListener('resize', positionItems, { passive: true });

  /* ─────────────────────────────────────────────────────────
     7. TESTIMONIAL SLIDER
  ───────────────────────────────────────────────────────── */
  const track      = $('#testimonialTrack');
  const slides     = $$('.testimonial-slide', track);
  const tDotsWrap  = $('#tDots');
  const tPrev      = $('#tPrev');
  const tNext      = $('#tNext');
  let tCurrent     = 0;
  let tTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `dot${i === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
    dot.addEventListener('click', () => tGoTo(i));
    tDotsWrap.appendChild(dot);
  });

  function tGoTo(index) {
    tCurrent = ((index % slides.length) + slides.length) % slides.length;
    track.style.transform = `translateX(-${tCurrent * 100}%)`;
    $$('.dot', tDotsWrap).forEach((dot, i) => dot.classList.toggle('active', i === tCurrent));
    // Update aria-current: clear old, set new
    slides.forEach(s => s.removeAttribute('aria-current'));
    if (slides[tCurrent]) slides[tCurrent].setAttribute('aria-current', 'true');
  }

  tPrev.addEventListener('click', () => { tGoTo(tCurrent - 1); tResetAuto(); });
  tNext.addEventListener('click', () => { tGoTo(tCurrent + 1); tResetAuto(); });

  function tResetAuto() {
    clearInterval(tTimer);
    tTimer = setInterval(() => tGoTo(tCurrent + 1), 5000);
  }
  tTimer = setInterval(() => tGoTo(tCurrent + 1), 5000);

  // Swipe
  let tTouchStart = 0;
  if (track) {
    track.addEventListener('touchstart', e => { tTouchStart = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - tTouchStart;
      if (Math.abs(dx) > 40) { tGoTo(dx < 0 ? tCurrent + 1 : tCurrent - 1); tResetAuto(); }
    });
  }

  /* ─────────────────────────────────────────────────────────
     8. CONTACT FORM
  ───────────────────────────────────────────────────────── */
  const form       = $('#contactForm');
  const formStatus = $('#formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name  = $('#name', form).value.trim();
      const email = $('#email', form).value.trim();
      const msg   = $('#message', form).value.trim();

      if (!name || !email || !msg) {
        formStatus.textContent = 'Please fill in all required fields.';
        formStatus.style.color = '#e88';
        return;
      }
      // Basic email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formStatus.textContent = 'Please enter a valid email address.';
        formStatus.style.color = '#e88';
        return;
      }

      // Simulate submission
      const submitBtn = form.querySelector('[type=submit]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        formStatus.textContent = '✓ Thank you! We\'ll be in touch soon.';
        formStatus.style.color = '#a8d5a2';
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }, 1200);
    });
  }

  /* ─────────────────────────────────────────────────────────
     9. BACK-TO-TOP BUTTON
  ───────────────────────────────────────────────────────── */
  const backToTop = $('#backToTop');

  function handleBackToTop() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─────────────────────────────────────────────────────────
     10. FOOTER YEAR
  ───────────────────────────────────────────────────────── */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ─────────────────────────────────────────────────────────
     11. SMOOTH SCROLL for anchor links
  ───────────────────────────────────────────────────────── */
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = $(id);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
