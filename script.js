/* ══════════════════════════════════════════════
   TurboTV – script.js
   ══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── SPEED LINES CANVAS ──────────────────── */
  const canvas = document.getElementById('speed-canvas');
  const ctx = canvas.getContext('2d');
  let lines = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  function randomLine() {
    const fromRight = Math.random() < 0.5;
    const y         = Math.random() * H;
    const length    = 80 + Math.random() * 220;
    const speed     = 4  + Math.random() * 10;
    const opacity   = 0.08 + Math.random() * 0.18;
    const thickness = 0.5  + Math.random() * 1.5;

    return {
      x: fromRight ? W + 10 : -length - 10,
      y,
      length,
      speed:     fromRight ? -speed : speed,
      opacity,
      thickness,
      color: Math.random() < 0.7
        ? `rgba(0,198,255,${opacity})`
        : `rgba(30,136,229,${opacity})`,
    };
  }

  /* Pre-populate lines across the canvas */
  for (let i = 0; i < 60; i++) {
    const l = randomLine();
    l.x = Math.random() * W;
    lines.push(l);
  }

  function drawLines() {
    ctx.clearRect(0, 0, W, H);

    for (let i = lines.length - 1; i >= 0; i--) {
      const l = lines[i];

      ctx.beginPath();
      ctx.strokeStyle = l.color;
      ctx.lineWidth   = l.thickness;
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(l.x + (l.speed > 0 ? l.length : -l.length), l.y);
      ctx.stroke();

      l.x += l.speed;

      const gone = l.speed > 0
        ? l.x > W + l.length
        : l.x < -l.length - 10;

      if (gone) lines[i] = randomLine();
    }

    requestAnimationFrame(drawLines);
  }

  drawLines();

  /* ─── SCROLL-TRIGGERED ANIMATIONS ────────── */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.15 }
  );

  /* Cards and why-items start hidden via inline style,
     then the observer adds .visible to trigger the transition */
  document.querySelectorAll('.card, .why-item').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ${i * 0.1}s ease, transform 0.6s ${i * 0.1}s ease`;

    observer.observe(el);
  });

  /* Add the .visible class styles dynamically */
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .card.visible,
    .why-item.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(styleSheet);

  /* ─── SMOOTH SCROLL for internal links ───── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
