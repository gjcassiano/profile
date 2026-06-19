// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Close on outside click
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== HERO PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles');
  const count = 50;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const x = Math.random() * 100;
    const delay = Math.random() * 12;
    const duration = 8 + Math.random() * 12;
    const size = 1 + Math.random() * 3;
    const drift = (Math.random() - 0.5) * 120;

    p.style.cssText = `
      left: ${x}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      width: ${size}px;
      height: ${size}px;
      --drift: ${drift}px;
      background: ${Math.random() > 0.5 ? '#6366f1' : '#22d3ee'};
    `;
    container.appendChild(p);
  }
}

createParticles();

// ===== INTERSECTION OBSERVER - REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Add reveal class to elements
function setupReveal() {
  const selectors = [
    '.service-card',
    '.tech-card',
    '.client-card',
    '.sobre-text',
    '.sobre-visual',
    '.highlight-item',
    '.contact-card',
    '.cta-trust .trust-item'
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 80}ms`;
      revealObserver.observe(el);
    });
  });
}

setupReveal();

// ===== TECH BAR ANIMATION =====
const techObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.tech-bar').forEach(bar => {
        setTimeout(() => bar.classList.add('animated'), 200);
      });
      techObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const techGrid = document.querySelector('.tech-grid');
if (techGrid) techObserver.observe(techGrid);

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// ===== MOUSE PARALLAX ON HERO =====
const hero = document.getElementById('hero');
hero.addEventListener('mousemove', (e) => {
  const { innerWidth, innerHeight } = window;
  const x = (e.clientX / innerWidth - 0.5) * 20;
  const y = (e.clientY / innerHeight - 0.5) * 10;
  document.querySelector('.hero-bg-image').style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
});

hero.addEventListener('mouseleave', () => {
  document.querySelector('.hero-bg-image').style.transform = 'translate(0, 0) scale(1)';
});

// ===== PHONE LINKS are real — no placeholder interception needed =====

// ===== SMOOTH ENTRANCE ANIMATION ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
});

// ===== NAV LINKS ACTIVE STYLE =====
const style = document.createElement('style');
style.textContent = `
  .nav-links a.active {
    color: var(--purple-light) !important;
    background: rgba(99, 102, 241, 0.08);
  }
`;
document.head.appendChild(style);

// ===== Service card stagger entrance =====
document.querySelectorAll('.service-card[data-delay]').forEach(card => {
  const delay = card.getAttribute('data-delay');
  card.style.transitionDelay = `${delay}ms`;
});

console.log('%c DevStudio Portfolio ', 'background:#6366f1;color:#fff;font-size:16px;font-weight:bold;padding:8px 16px;border-radius:8px;');
console.log('%c Built with ❤️ and Node.js, React, AWS ', 'color:#94a3b8;font-size:12px;');
