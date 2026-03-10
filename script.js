/* ============================================================
   HEADER — scroll shadow
   ============================================================ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */
const navBurger = document.getElementById('navBurger');
const navLinks  = document.getElementById('navLinks');

navBurger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('mobile-open');
  navBurger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('mobile-open');
    navBurger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   SMOOTH ANCHOR SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h')
    ) || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   FADE-IN ON SCROLL
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 70);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.10 }
);

fadeEls.forEach(el => observer.observe(el));

/* ============================================================
   STAGGER CARDS inside grid containers
   ============================================================ */
document.querySelectorAll('.sluzby-grid, .usp-grid, .testimonials, .proces-steps').forEach(grid => {
  grid.querySelectorAll('.fade-in').forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
  });
});

/* ============================================================
   CONTACT FORM — Formspree AJAX
   ============================================================ */
const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name  = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');

    // ── Validace povinných polí ──
    let valid = true;
    [document.getElementById('name'), document.getElementById('phone')].forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#e05a3c';
        input.style.boxShadow   = '0 0 0 3px rgba(224,90,60,0.15)';
        valid = false;
        input.addEventListener('input', () => {
          input.style.borderColor = '';
          input.style.boxShadow   = '';
        }, { once: true });
      }
    });
    if (!valid) return;

    // ── Stav odesílání ──
    submitBtn.disabled = true;
    submitBtn.textContent = 'Odesílám…';

    try {
      const data = new FormData(form);
      const res  = await fetch(form.action, {
        method:  'POST',
        body:    data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // ── Úspěch ──
        form.innerHTML = `
          <div class="form-success">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#3A7D44" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>Poptávka odeslána!</h3>
            <p>Díky, <strong>${name}</strong>! Ozveme se vám do 24 hodin na číslo ${phone}.</p>
          </div>`;
      } else {
        // ── Chyba ze serveru ──
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Chyba serveru');
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Odeslat poptávku';
      alert(`Formulář se nepodařilo odeslat: ${err.message}\n\nZkuste nás prosím kontaktovat telefonicky.`);
    }
  });
}

/* ============================================================
   ACTIVE NAV LINK on scroll (highlight current section)
   ============================================================ */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const id   = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach(l => l.style.color = '');
        link.style.color = '#3A7D44';
      }
    });
  },
  { rootMargin: '-45% 0px -45% 0px' }
);

sections.forEach(s => navObserver.observe(s));
