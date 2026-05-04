/* =========================================================
   PAIGE WOODS — main.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── Nav scroll shadow ──────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ── Mobile menu ────────────────────────────────────────
  const toggle    = document.querySelector('.nav-toggle');
  const mobileNav = document.getElementById('navMobile');
  const closeBtn  = document.querySelector('.nav-mobile-close');

  function openMenu() {
    document.body.classList.add('nav-open');
    if (mobileNav) mobileNav.removeAttribute('aria-hidden');
    if (toggle)    toggle.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    document.body.classList.remove('nav-open');
    if (mobileNav) mobileNav.setAttribute('aria-hidden', 'true');
    if (toggle)    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) closeMenu();
  });

  // ── Scroll reveal ──────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');

  // Stagger siblings inside grid/list parents
  [
    '.services-grid',
    '.testimonials-grid',
    '.philosophy-grid',
  ].forEach(sel => {
    document.querySelectorAll(sel).forEach(parent => {
      parent.querySelectorAll('.reveal, .reveal-scale').forEach((el, i) => {
        el.style.transitionDelay = `${i * 90}ms`;
      });
    });
  });

  document.querySelectorAll('.faq-list .reveal, .faq-list .reveal-scale').forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
  });

  document.querySelectorAll('.process-steps .step.reveal-step-right').forEach(el => {
    const stepObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        el.classList.add('visible');
        stepObserver.disconnect();
      }
    }, { threshold: 0.3 });
    stepObserver.observe(el);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealEls.forEach(el => observer.observe(el));

  // ── Slide-from-left: observe the PARENT section, not the
  //    off-screen element (translateX hides it from IO) ──
  document.querySelectorAll('.reveal-slide-left').forEach(el => {
    const trigger = el.closest('section') || el.parentElement;
    const slideObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        el.classList.add('visible');
        slideObserver.disconnect();
      }
    }, { threshold: 0.08 });
    slideObserver.observe(trigger);
  });

  // ── Hero load animation ────────────────────────────────
  const heroItems = document.querySelectorAll('.hero-animate');
  if (heroItems.length) {
    heroItems.forEach((el, i) => {
      el.style.opacity       = '0';
      el.style.transform     = 'translateY(1.5rem)';
      el.style.transition    = 'opacity 0.65s ease-out, transform 0.65s ease-out';
      el.style.transitionDelay = `${i * 160}ms`;
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroItems.forEach(el => {
          el.style.opacity   = '1';
          el.style.transform = 'none';
        });
      });
    });
  }

  // ── FAQ accordion ──────────────────────────────────────
  document.querySelectorAll('.faq-a').forEach(a => {
    a.style.maxHeight  = '0';
    a.style.opacity    = '0';
    a.style.overflow   = 'hidden';
    a.style.transition = 'max-height 0.38s ease, opacity 0.38s ease';
  });

  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answer     = btn.nextElementSibling;
      const chevron    = btn.querySelector('.faq-chevron');

      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const ch = b.querySelector('.faq-chevron');
        if (ch) ch.style.transform = '';
        const a = b.nextElementSibling;
        if (a) { a.style.maxHeight = '0'; a.style.opacity = '0'; }
      });

      if (!isExpanded) {
        btn.setAttribute('aria-expanded', 'true');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
        if (answer) {
          answer.removeAttribute('hidden');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          answer.style.opacity   = '1';
        }
      }
    });
  });

  // ── Parallax ───────────────────────────────────────────
  initParallax();

});

/* =========================================================
   Parallax — runs outside DOMContentLoaded so it can be
   called after dynamic content loads too if needed.
   ========================================================= */

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const imgs = Array.from(document.querySelectorAll('[data-parallax]'));
  if (!imgs.length) return;

  // Cache container references once — avoids repeated closest() in scroll loop
  const entries = imgs.map(img => ({
    img,
    container: img.closest(
      '.hero-image, .about-photo-col, .process-photo, .philosophy-bg, .testimonials-img-wrap'
    ) || img.parentElement,
    speed: parseFloat(img.dataset.parallax) || 0.1,
  }));

  let ticking = false;

  function tick() {
    const vh = window.innerHeight;
    entries.forEach(({ img, container, speed }) => {
      const rect   = container.getBoundingClientRect();
      const offset = (rect.top + rect.height * 0.5 - vh * 0.5) * speed;
      img.style.transform = `translateY(${offset.toFixed(2)}px)`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(tick);
      ticking = true;
    }
  }, { passive: true });

  // Set initial position before first scroll
  tick();
}
