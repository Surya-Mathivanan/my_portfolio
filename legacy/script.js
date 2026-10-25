/* ============================================================
   SURYA MATHIVANAN PORTFOLIO — script.js
   Enhanced: 3D Tilt · Cursor Glow · Nav Glass · Counters
   ============================================================ */

/* ── Early theme apply (prevents FOUC) ──────────────────────── */
(function earlyThemeApply() {
  const saved       = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme       = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

/* ── EmailJS ────────────────────────────────────────────────── */
try {
  if (typeof emailjs !== 'undefined') emailjs.init('YOUR_EMAILJS_PUBLIC_KEY');
} catch (e) { console.warn('EmailJS not initialised:', e.message); }

/* ── Reduce-motion support ──────────────────────────────────── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  document.documentElement.style.setProperty('--trans', 'none');
  document.documentElement.style.setProperty('--trans-slow', 'none');
}

/* ── Page Loader ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      animateHeroEntrance();
      startStatCounters();
    }, 500);
  }, 600);
});

/* ── Hero Entrance Animation ─────────────────────────────────── */
function animateHeroEntrance() {
  const targets = document.querySelectorAll(
    '.hero-eyebrow, .hero-name, .hero-bio, .hero-badges, .hero-cta, .hero-avatar-wrap, .hero-scroll-indicator'
  );
  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.1}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`;
    requestAnimationFrame(() => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 60);
    });
  });
}

/* ── Stat counter animation ─────────────────────────────────── */
function startStatCounters() {
  document.querySelectorAll('.snum').forEach(el => {
    const raw = el.textContent.replace(/[^0-9]/g, '');
    const target = parseInt(raw, 10);
    const suffix = el.textContent.replace(/[0-9]/g, '');
    if (isNaN(target)) return;
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start = Math.min(start + increment, target);
      el.textContent = Math.floor(start) + suffix;
      if (start >= target) clearInterval(timer);
    }, step);
  });
}

/* ── Cursor Glow ─────────────────────────────────────────────── */
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow || prefersReducedMotion) return;
  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let visible = false;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      glow.style.opacity = '1';
      visible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
    visible = false;
  });

  /* Smooth lag follow */
  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + 'px';
    glow.style.top  = glowY + 'px';
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}

/* ── 3D Card Tilt ────────────────────────────────────────────── */
function initCardTilt() {
  if (prefersReducedMotion) return;
  const isMobile = () => window.innerWidth < 769;

  document.querySelectorAll('.project-card').forEach(card => {
    let bounds;

    function getBounds() { bounds = card.getBoundingClientRect(); }

    card.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      getBounds();
      card.style.transition = 'box-shadow 0.35s ease, border-color 0.35s ease';
    });

    card.addEventListener('mousemove', e => {
      if (isMobile()) return;
      if (!bounds) getBounds();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const cx = bounds.width  / 2;
      const cy = bounds.height / 2;
      const rotateX = ((y - cy) / cy) * -6;  /* max 6 deg */
      const rotateY = ((x - cx) / cx) *  6;

      card.style.transform = `
        perspective(800px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(10px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s ease, border-color 0.35s ease';
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      bounds = null;
    });
  });
}

/* ── Magnetic Buttons ────────────────────────────────────────── */
function initMagneticButtons() {
  if (prefersReducedMotion) return;
  const isMobile = () => window.innerWidth < 769;

  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      if (isMobile()) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-1px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ── All DOM-ready code ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Drawer ────────────────────────────────────────── */
  const hamburgerBtn  = document.getElementById('hamburgerBtn');
  const mobileDrawer  = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const drawerClose   = document.getElementById('drawerClose');

  function openDrawer() {
    mobileDrawer  && mobileDrawer.classList.add('open');
    mobileOverlay && mobileOverlay.classList.add('open');
    if (hamburgerBtn) {
      hamburgerBtn.classList.add('open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    mobileDrawer  && mobileDrawer.classList.remove('open');
    mobileOverlay && mobileOverlay.classList.remove('open');
    if (hamburgerBtn) {
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      mobileDrawer && mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
    });
  }
  if (drawerClose)   drawerClose.addEventListener('click',   closeDrawer);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeDrawer);

  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closeDrawer);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 769) closeDrawer();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ── Smooth scroll ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 65;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });

  /* ── Scroll: nav glass + hide/show + active links + back-to-top ── */
  const mainNav   = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');
  const navLinks  = document.querySelectorAll('.nav-links a');
  const sections  = document.querySelectorAll('main section[id]');

  let lastScrollY   = 0;
  let scrollTicking = false;

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;

        if (mainNav) {
          /* Hide on scroll-down, reveal on scroll-up */
          if (sy > lastScrollY && sy > 80) {
            mainNav.classList.add('nav-hidden');
          } else {
            mainNav.classList.remove('nav-hidden');
          }
          /* Glass when scrolled */
          mainNav.classList.toggle('scrolled', sy > 30);
          lastScrollY = sy;
        }

        if (backToTop) backToTop.classList.toggle('visible', sy > 400);

        /* Active section */
        let current = '';
        sections.forEach(sec => {
          if (sy >= sec.offsetTop - 120) current = sec.getAttribute('id');
        });
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });

        scrollTicking = false;
      });
      scrollTicking = true;
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Scroll-reveal with stagger ─────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.skill-group, .exp-item, .achieve-item, .edu-card, .edu-timeline-item, .contact-info-card, .section-header, .contact-form-wrap, .offer-banner'
  ).forEach(el => {
    el.classList.add('fade-in');
    revealObs.observe(el);
  });

  /* Section headers slide-in from left */
  document.querySelectorAll('.section-label').forEach(el => {
    el.classList.add('fade-in-left');
    revealObs.observe(el);
  });

  /* ── Skill bars animate on view ──────────────────────────────── */
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
          const targetW = fill.style.width;
          fill.style.width = '0';
          setTimeout(() => { fill.style.width = targetW; }, 150 + i * 70);
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-group').forEach(g => skillObs.observe(g));

  /* ── Project cards staggered entrance ────────────────────────── */
  const projGrid = document.querySelector('.projects-grid');
  if (projGrid) {
    const projObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.project-card').forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.97)';
            card.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.06}s`;
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 60 + i * 60);
          });
          projObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.03 });
    projObs.observe(projGrid);
  }

  /* ── Achieve items counter animation on view ─────────────────── */
  const achieveObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.achieve-num').forEach(el => {
          animateCounter(el);
        });
        achieveObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const achieveGrid = document.querySelector('.achieve-grid');
  if (achieveGrid) achieveObs.observe(achieveGrid);

  /* ── Contact Form ─────────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const responseMsg = document.getElementById('responseMessage');
  const submitBtn   = document.querySelector('.submit-btn');

  if (contactForm) {
    contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
      input.addEventListener('blur',  () => validateField(input));
      input.addEventListener('focus', () => clearFieldError(input));
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateForm(contactForm)) return;
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
      }
      const params = {
        from_name:  `${val('firstName')} ${val('lastName')}`,
        from_email: val('email'),
        subject:    val('subject'),
        message:    val('message'),
      };
      try {
        if (typeof emailjs === 'undefined') throw new Error('EmailJS SDK not loaded');
        await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params);
        setResponse(responseMsg, 'success', '<i class="fas fa-check-circle"></i> Message sent! I\'ll get back to you soon.');
        contactForm.reset();
        clearAllErrors(contactForm);
        ['firstName','lastName','email','subject','message'].forEach(id => localStorage.removeItem(`c_${id}`));
      } catch (err) {
        console.error('EmailJS error:', err);
        setResponse(responseMsg, 'error', '<i class="fas fa-exclamation-circle"></i> Failed to send. Email me at kit26.ad59@gmail.com');
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          submitBtn.disabled = false;
        }
      }
    });

    try {
      contactForm.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        const saved = localStorage.getItem(`c_${input.id}`);
        if (saved) input.value = saved;
        input.addEventListener('input', () => localStorage.setItem(`c_${input.id}`, input.value));
      });
    } catch (_) {}
  }

  /* ── Theme toggle ────────────────────────────────────────────── */
  const html     = document.documentElement;
  const themeKey = 'portfolio-theme';

  function syncUI(theme) {
    const isLight    = theme === 'light';
    const desktopChk = document.getElementById('themeToggleDesktop');
    const drawerChk  = document.getElementById('themeToggle');
    if (desktopChk) desktopChk.checked = isLight;
    if (drawerChk)  drawerChk.checked  = isLight;
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(themeKey, theme);
    syncUI(theme);
  }

  syncUI(html.getAttribute('data-theme') || 'dark');

  document.getElementById('themeToggleDesktop')?.addEventListener('change', (e) => {
    applyTheme(e.target.checked ? 'light' : 'dark');
  });
  document.getElementById('themeToggle')?.addEventListener('change', (e) => {
    applyTheme(e.target.checked ? 'light' : 'dark');
  });

  /* ── Init interactive effects ────────────────────────────────── */
  initCursorGlow();
  initCardTilt();
  initMagneticButtons();

}); // end DOMContentLoaded

/* ── Counter animation helper ───────────────────────────────── */
function animateCounter(el) {
  const text   = el.textContent;
  const raw    = text.replace(/[^0-9]/g, '');
  const target = parseInt(raw, 10);
  const suffix = text.replace(/[0-9]/g, '');
  if (isNaN(target)) return;
  let current = 0;
  const duration = 1400;
  const steps = 60;
  const inc = target / steps;
  let count = 0;
  const timer = setInterval(() => {
    count++;
    current = Math.min(Math.round(inc * count), target);
    el.textContent = current + suffix;
    if (count >= steps) clearInterval(timer);
  }, duration / steps);
}

/* ── Form helpers ────────────────────────────────────────────── */
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function validateForm(form) {
  return Array.from(form.querySelectorAll('.form-input, .form-textarea'))
    .map(f => validateField(f)).every(Boolean);
}

function validateField(field) {
  const v = field.value.trim();
  let ok = true, msg = '';
  if (!v) { msg = 'Required'; ok = false; }
  else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { msg = 'Valid email'; ok = false; }
  else if (field.tagName === 'TEXTAREA' && v.length < 10) { msg = '10+ characters'; ok = false; }
  else if (field.type === 'text' && v.length < 2) { msg = '2+ characters'; ok = false; }
  field.style.borderColor = ok ? 'var(--neon-green)' : '#ff6b8a';
  removeFieldError(field);
  if (!ok) addFieldError(field, msg);
  return ok;
}

function addFieldError(field, msg) {
  const div = document.createElement('div');
  div.className = 'field-error';
  div.style.cssText = 'color:#ff6b8a;font-size:11px;margin-top:3px;font-family:"DM Mono",monospace;';
  div.textContent = msg;
  field.parentNode.appendChild(div);
}
function removeFieldError(field)  { field.parentNode.querySelector('.field-error')?.remove(); }
function clearFieldError(field)   { field.style.borderColor = ''; removeFieldError(field); }
function clearAllErrors(form)     { form.querySelectorAll('.form-input, .form-textarea').forEach(clearFieldError); }

function setResponse(el, type, html) {
  if (!el) return;
  el.className = `response-message ${type}`;
  el.innerHTML = html;
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => { el.style.opacity = '1'; el.innerHTML = ''; el.className = 'response-message'; }, 400);
  }, type === 'success' ? 6000 : 8000);
}
