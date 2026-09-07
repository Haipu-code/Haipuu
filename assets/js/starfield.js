/**
 * Interactive Galaxy Starfield Engine
 * Creates a dynamic cosmos with twinkling stars, shooting stars, and constellation mouse reactivity.
 */
(function () {
  'use strict';

  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  // Star parameters
  const STAR_COUNT = 220;
  const stars = [];
  const meteors = [];

  // Mouse interaction
  const mouse = {
    x: null,
    y: null,
    radius: 140
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    initStars();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Rainbow / Galaxy colors for stars
  const starColors = [
    '#ffffff',
    '#f0f4ff',
    '#b8d5ff',
    '#ffcce0',
    '#ffe4b5',
    '#d6b4fc'
  ];

  class Star {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -10;
      this.size = Math.random() * 1.8 + 0.5;
      this.color = starColors[Math.floor(Math.random() * starColors.length)];
      this.baseAlpha = Math.random() * 0.7 + 0.3;
      this.alpha = this.baseAlpha;
      this.twinkleSpeed = Math.random() * 0.03 + 0.008;
      this.twinkleAngle = Math.random() * Math.PI * 2;
      this.speedY = Math.random() * 0.25 + 0.05;
      this.speedX = (Math.random() - 0.5) * 0.1;
    }

    update() {
      if (!prefersReducedMotion) {
        this.y += this.speedY;
        this.x += this.speedX;

        // Twinkle
        this.twinkleAngle += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.twinkleAngle) * 0.3;
        if (this.alpha < 0.1) this.alpha = 0.1;
        if (this.alpha > 1) this.alpha = 1;

        if (this.y > height + 10 || this.x < -10 || this.x > width + 10) {
          this.reset(false);
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();

      // Soft glow for larger stars
      if (this.size > 1.4) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha * 0.25;
        ctx.fill();
      }
    }
  }

  class Meteor {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * (width * 0.8) + (width * 0.1);
      this.y = Math.random() * (height * 0.4);
      this.length = Math.random() * 90 + 60;
      this.speed = Math.random() * 10 + 12;
      this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2; // roughly 45 deg
      this.thickness = Math.random() * 2 + 1;
      this.life = 1;
      this.decay = Math.random() * 0.02 + 0.015;
      this.active = false;
    }

    trigger() {
      this.reset();
      this.active = true;
    }

    update() {
      if (!this.active) return;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.life -= this.decay;
      if (this.life <= 0 || this.x > width || this.y > height) {
        this.active = false;
      }
    }

    draw() {
      if (!this.active) return;

      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.6, 'rgba(157, 78, 221, 0.4)');
      grad.addColorStop(1, 'rgba(0, 229, 255, 1)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(this.x, this.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.thickness;
      ctx.lineCap = 'round';
      ctx.globalAlpha = this.life;
      ctx.stroke();

      // Bright shooting star head
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.thickness * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = this.life;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  }

  function initStars() {
    stars.length = 0;
    const count = Math.min(STAR_COUNT, Math.floor((width * height) / 4500));
    for (let i = 0; i < count; i++) {
      stars.push(new Star());
    }
  }

  // Meteor pool
  for (let i = 0; i < 3; i++) {
    meteors.push(new Meteor());
  }

  // Periodic meteor generator
  let lastMeteorTime = 0;
  function scheduleMeteors(time) {
    if (prefersReducedMotion) return;
    if (time - lastMeteorTime > 3800 + Math.random() * 4000) {
      const inactive = meteors.find(m => !m.active);
      if (inactive) {
        inactive.trigger();
        lastMeteorTime = time;
      }
    }
  }

  // Draw constellation connections to mouse
  function drawConstellations() {
    if (mouse.x === null || mouse.y === null || prefersReducedMotion) return;

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const dx = mouse.x - s.x;
      const dy = mouse.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        const alpha = (1 - dist / mouse.radius) * 0.4;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Star-to-star nearby links
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dxx = s.x - s2.x;
        const dyy = s.y - s2.y;
        const starDist = Math.sqrt(dxx * dxx + dyy * dyy);

        if (starDist < 55) {
          const linkAlpha = (1 - starDist / 55) * 0.15;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = `rgba(100, 200, 255, ${linkAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop(time) {
    ctx.clearRect(0, 0, width, height);

    // Update & draw stars
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }

    // Constellation lines
    drawConstellations();

    // Meteors
    scheduleMeteors(time);
    for (let i = 0; i < meteors.length; i++) {
      meteors[i].update();
      meteors[i].draw();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }

  resize();
  requestAnimationFrame(loop);
})();
