/**
 * main.js — Portfolio Josefina Soler Rossi
 * Custom Cursor, Mobile Nav, Page Transitions,
 * Scroll Progress, Nav Scroll Behavior
 */

'use strict';

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    rafId = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state on interactive elements
  const interactives = 'a, button, [data-cursor-hover], input, textarea, label, .project-card, .mock-post, .skill-item';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) {
      cursor.classList.add('is-hover');
      follower.classList.add('is-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) {
      cursor.classList.remove('is-hover');
      follower.classList.remove('is-hover');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    bar.style.width = scrolled + '%';
  }, { passive: true });
}

/* ============================================================
   NAV SCROLL BEHAVIOR
   ============================================================ */
function initNavScroll() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  let lastScroll = 0;
  const SCROLL_THRESHOLD = 20;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > SCROLL_THRESHOLD) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });
}

/* ============================================================
   MOBILE NAV
   ============================================================ */
function initMobileNav() {
  const hamburger = document.querySelector('.nav-hamburger');
  const overlay = document.querySelector('.nav-mobile-overlay');
  const mobileLinks = document.querySelectorAll('.nav-mobile-link');

  if (!hamburger || !overlay) return;

  let isOpen = false;

  function openNav() {
    isOpen = true;
    hamburger.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    isOpen = false;
    hamburger.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    isOpen ? closeNav() : openNav();
  });

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeNav();
  });
}

/* ============================================================
   PAGE TRANSITIONS
   ============================================================ */
function initPageTransitions() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  // Animate in on load
  overlay.classList.add('is-entering');
  overlay.addEventListener('animationend', () => {
    overlay.classList.remove('is-entering');
  }, { once: true });

  // Intercept internal link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Only intercept same-origin, non-hash, non-external links
    if (
      href.startsWith('#') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('http') ||
      link.target === '_blank'
    ) return;

    e.preventDefault();

    overlay.classList.add('is-leaving');
    overlay.addEventListener('animationend', () => {
      window.location.href = href;
    }, { once: true });
  });
}

/* ============================================================
   SMOOTH SCROLL (for same-page anchor links)
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 72;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   ACTIVE NAV LINK (highlight current page)
   ============================================================ */
function initActiveNavLinks() {
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    // Normalize paths for comparison
    const linkPath = new URL(href, window.location.href).pathname;
    if (currentPath === linkPath || (currentPath.endsWith(linkPath) && linkPath !== '/')) {
      link.classList.add('is-active');
    }
  });
}

/* ============================================================
   HERO GRADIENT ANIMATION (home page)
   ============================================================ */
function initHeroGradient() {
  const hero = document.querySelector('.hero-gradient');
  if (!hero) return;
  // The animation is handled by CSS keyframes — just ensure class is applied
  hero.classList.add('is-animated');
}

/* ============================================================
   PARTICLE SYSTEM (home hero)
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W = canvas.width = canvas.offsetWidth;
  let H = canvas.height = canvas.offsetHeight;

  const PARTICLE_COUNT = 60;
  const particles = [];

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.size = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawLine(p1, p2, dist, maxDist) {
    const alpha = (1 - dist / maxDist) * 0.15;
    ctx.strokeStyle = `rgba(255,59,92,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,59,92,${p.opacity})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          drawLine(p, q, dist, 120);
        }
      }
    });

    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }, { passive: true });
}

/* ============================================================
   INIT ALL
   ============================================================ */
function init() {
  initCursor();
  initScrollProgress();
  initNavScroll();
  initMobileNav();
  initPageTransitions();
  initSmoothScroll();
  initActiveNavLinks();
  initHeroGradient();
  initParticles();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
