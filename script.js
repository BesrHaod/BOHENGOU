document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeader();
  initNav();
  initReveal();
  initCounters();
  initCursorGlow();
  initContactForm();
});

function initPreloader() {
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 2000);
  });
}

function initHeader() {
  const header = document.getElementById('header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.1}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = parseInt(counter.dataset.target, 10);
          animateCounter(counter, target);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
}

function animateCounter(el, target) {
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(pointer: coarse)').matches) return;

  let x = 0, y = 0;
  let cx = 0, cy = 0;

  document.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
  });

  function animate() {
    cx += (x - cx) * 0.08;
    cy += (y - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(animate);
  }

  animate();
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const subject = data.get('subject');
    const message = data.get('message');

    const mailto = `mailto:pydeads022@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;

    window.location.href = mailto;

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Opening Email Client...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
}
