/**
 * animations.js — Portfolio Josefina Soler Rossi
 * Intersection Observer, Count-Up, Stagger Animations,
 * Skill Bars, Timeline Reveals, Confetti
 */

'use strict';

/* ============================================================
   INTERSECTION OBSERVER — Scroll Animations
   ============================================================ */
const observerConfig = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Once visible, stop observing for performance
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerConfig);

// Observe all animatable elements
function initScrollAnimations() {
  const targets = document.querySelectorAll(
    '.fade-in, .slide-left, .slide-right, .slide-up, .scale-up'
  );
  targets.forEach(el => scrollObserver.observe(el));
}

/* ============================================================
   COUNT-UP ANIMATION
   ============================================================ */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

function animateCountUp(el) {
  const target = parseFloat(el.dataset.target);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const duration = parseInt(el.dataset.duration) || 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = target * eased;
    el.textContent = prefix + current.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(update);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCountUp(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

function initCountUp() {
  document.querySelectorAll('[data-count]').forEach(el => {
    countObserver.observe(el);
  });
}

/* ============================================================
   SKILL BARS
   ============================================================ */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-bar-fill');
      if (fill) {
        const width = fill.dataset.width || '0%';
        setTimeout(() => {
          fill.style.width = width;
        }, 100);
      }
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

function initSkillBars() {
  document.querySelectorAll('.skill-bar').forEach(bar => {
    skillObserver.observe(bar);
  });
}

/* ============================================================
   SVG TIMELINE DRAW
   ============================================================ */
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-drawn');
      timelineObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

function initTimelineDraw() {
  document.querySelectorAll('.timeline-line').forEach(el => {
    timelineObserver.observe(el);
  });
}

/* ============================================================
   STAGGER CHILDREN
   ============================================================ */
function initStaggerContainers() {
  document.querySelectorAll('[data-stagger]').forEach(container => {
    const children = container.children;
    const delay = parseFloat(container.dataset.stagger) || 0.1;

    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * delay}s`;
    });
  });
}

/* ============================================================
   PARALLAX (subtle, for hero sections)
   ============================================================ */
let ticking = false;
const parallaxElements = [];

function collectParallaxElements() {
  document.querySelectorAll('[data-parallax]').forEach(el => {
    parallaxElements.push({
      el,
      speed: parseFloat(el.dataset.parallax) || 0.3
    });
  });
}

function updateParallax() {
  const scrollY = window.scrollY;
  parallaxElements.forEach(({ el, speed }) => {
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
  ticking = false;
}

function initParallax() {
  collectParallaxElements();
  if (parallaxElements.length === 0) return;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   CONFETTI (EHCO page)
   ============================================================ */
function createConfettiParticle(container) {
  const particle = document.createElement('div');
  particle.className = 'confetti-particle';

  const colors = ['#c45c2a', '#f4c430', '#ffffff', '#3d2b1f', '#e8955a'];
  const shapes = ['circle', 'square', 'triangle'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];

  particle.style.cssText = `
    position: absolute;
    width: ${Math.random() * 8 + 4}px;
    height: ${Math.random() * 8 + 4}px;
    background: ${colors[Math.floor(Math.random() * colors.length)]};
    left: ${Math.random() * 100}%;
    top: -20px;
    border-radius: ${shape === 'circle' ? '50%' : shape === 'square' ? '2px' : '0'};
    animation: confettiFall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s infinite;
    opacity: ${Math.random() * 0.7 + 0.3};
    transform: rotate(${Math.random() * 360}deg);
  `;

  if (shape === 'triangle') {
    particle.style.background = 'none';
    particle.style.borderLeft = `${parseInt(particle.style.width) / 2}px solid transparent`;
    particle.style.borderRight = `${parseInt(particle.style.width) / 2}px solid transparent`;
    particle.style.borderBottom = `${parseInt(particle.style.width)}px solid ${colors[Math.floor(Math.random() * colors.length)]}`;
  }

  container.appendChild(particle);
}

function initConfetti() {
  const container = document.querySelector('.confetti-container');
  if (!container) return;

  for (let i = 0; i < 40; i++) {
    createConfettiParticle(container);
  }
}

/* ============================================================
   NUMBER TICKER (for large stat reveals)
   ============================================================ */
function initStatReveal() {
  const stats = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  stats.forEach(stat => statObserver.observe(stat));
}

/* ============================================================
   HORIZONTAL SCROLL TIMELINE
   ============================================================ */
function initHorizontalTimeline() {
  const timeline = document.querySelector('.timeline-horizontal');
  if (!timeline) return;

  const items = timeline.querySelectorAll('.timeline-h-item');
  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        itemObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => itemObserver.observe(item));
}

/* ============================================================
   DECORATIVE LINE DRAW
   ============================================================ */
function initLineDraws() {
  document.querySelectorAll('.draw-line').forEach(line => {
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
          lineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    lineObserver.observe(line);
  });
}

/* ============================================================
   HOVER LIKE/COMMENT counters (EHCO posts)
   ============================================================ */
function initPostHovers() {
  document.querySelectorAll('.mock-post').forEach(post => {
    post.addEventListener('mouseenter', () => {
      const overlay = post.querySelector('.post-overlay');
      if (overlay) overlay.style.opacity = '1';
    });
    post.addEventListener('mouseleave', () => {
      const overlay = post.querySelector('.post-overlay');
      if (overlay) overlay.style.opacity = '0';
    });
  });
}

/* ============================================================
   INIT ALL
   ============================================================ */
function initAnimations() {
  initScrollAnimations();
  initCountUp();
  initSkillBars();
  initTimelineDraw();
  initStaggerContainers();
  initParallax();
  initConfetti();
  initStatReveal();
  initHorizontalTimeline();
  initLineDraws();
  initPostHovers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

// Export for use in main.js
window.JSRAnimations = {
  init: initAnimations,
  countUp: animateCountUp,
};
