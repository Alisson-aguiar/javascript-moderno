/* ============================================
   JavaScript Moderno — App principal
   ============================================ */

import { initThemeToggle } from './theme-toggle.js';

document.addEventListener('route:loaded', () => {
  if (window.umami) {
    window.umami.track('pageview', {
      path: location.hash || '#introducao'
    });
  }
});

// Ano dinâmico no footer
document.getElementById('year').textContent = new Date().getFullYear();

// Marca link ativo conforme scroll (IntersectionObserver)
const _sections = document.querySelectorAll('section[id]');
const _navLinks = document.querySelectorAll('.navbar-js .nav-link');

document.getElementById('year').textContent = new Date().getFullYear();
initThemeToggle();

// Fade-in suave
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
        obs.unobserve(target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.card-js, .level-card, .tip').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  observer.observe(el);
});

// Efeito de digitação no hero (opcional, elegante)
const heroTitle = document.querySelector('.hero-title .text-gold');
if (heroTitle) {
  const text = heroTitle.textContent;
  heroTitle.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      heroTitle.textContent += text[i++];
      setTimeout(type, 90);
    }
  };
  setTimeout(type, 400);
}

// Fade-in suave dos cards ao entrar na viewport
const fadeObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
        obs.unobserve(target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.card-js, .level-card, .tip').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  fadeObserver.observe(el);
});
