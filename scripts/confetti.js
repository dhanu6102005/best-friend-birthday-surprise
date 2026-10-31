/**
 * High-performance Canvas Confetti & Fireworks Engine
 * Generates celebratory particle showers, heart bursts, and fireworks.
 */

class ConfettiEngine {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.id = 'confetti-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    document.body.appendChild(this.canvas);

    this.particles = [];
    this.fireworks = [];
    this.animationFrame = null;
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  colors = [
    '#ff4d6d', '#ff758f', '#ff85a1', '#f72585', '#b5179e',
    '#7209b7', '#3a0ca3', '#ffd166', '#ffb703', '#fb8500',
    '#06d6a0', '#4cc9f0', '#ffffff', '#e0aaff', '#c77dff'
  ];

  // Creates a burst of confetti from a point or across the top/bottom
  burst(options = {}) {
    const count = options.count || 100;
    const originX = options.x !== undefined ? options.x : this.width / 2;
    const originY = options.y !== undefined ? options.y : this.height / 2;
    const spread = options.spread || 360;
    const speed = options.speed || 8;
    const shapes = options.shapes || ['rect', 'circle', 'heart'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI / 180) * (options.angle !== undefined ? (options.angle + (Math.random() - 0.5) * spread) : Math.random() * 360);
      const velocity = (Math.random() * 0.7 + 0.3) * speed;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - (options.lift || 3),
        size: Math.random() * 10 + 6,
        color: color,
        shape: shape,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
        fadeSpeed: Math.random() * 0.008 + 0.004,
        gravity: 0.18,
        wobble: Math.random() * Math.PI,
        wobbleSpeed: Math.random() * 0.1 + 0.05
      });
    }

    if (!this.animationFrame) {
      this.animate();
    }
  }

  // Celebratory cannon blast from both bottom corners
  launchCannons() {
    this.burst({ x: this.width * 0.1, y: this.height * 0.9, angle: -60, spread: 50, speed: 18, count: 80, lift: 10 });
    this.burst({ x: this.width * 0.9, y: this.height * 0.9, angle: -120, spread: 50, speed: 18, count: 80, lift: 10 });
    setTimeout(() => {
      this.burst({ x: this.width * 0.2, y: this.height * 0.9, angle: -70, spread: 45, speed: 16, count: 60, lift: 9 });
      this.burst({ x: this.width * 0.8, y: this.height * 0.9, angle: -110, spread: 45, speed: 16, count: 60, lift: 9 });
    }, 250);
  }

  // Romantic shower of hearts
  showerHearts(count = 50) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: -20,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        size: Math.random() * 16 + 10,
        color: ['#ff4d6d', '#ff758f', '#ffb3c1', '#f72585', '#e0aaff'][Math.floor(Math.random() * 5)],
        shape: 'heart',
        rotation: Math.random() * 40 - 20,
        rotationSpeed: (Math.random() - 0.5) * 2,
        opacity: 1,
        fadeSpeed: 0.003,
        gravity: 0.05,
        wobble: Math.random() * Math.PI,
        wobbleSpeed: 0.04
      });
    }
    if (!this.animationFrame) this.animate();
  }

  // Fireworks rocket that explodes into sparks
  launchFirework(targetX, targetY) {
    const startX = targetX || (Math.random() * 0.6 + 0.2) * this.width;
    const endY = targetY || (Math.random() * 0.4 + 0.15) * this.height;

    this.fireworks.push({
      x: startX,
      y: this.height,
      targetY: endY,
      vx: (Math.random() - 0.5) * 2,
      vy: -(Math.random() * 4 + 12),
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      trail: [],
      exploded: false
    });

    if (!this.animationFrame) this.animate();
  }

  explodeFirework(x, y, color) {
    const sparkCount = 80;
    for (let i = 0; i < sparkCount; i++) {
      const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.2;
      const speed = Math.random() * 7 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.3 ? color : '#ffffff',
        shape: 'circle',
        rotation: 0,
        rotationSpeed: 0,
        opacity: 1,
        fadeSpeed: Math.random() * 0.02 + 0.015,
        gravity: 0.08,
        wobble: 0,
        wobbleSpeed: 0
      });
    }
  }

  drawHeart(ctx, x, y, size, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 30, size / 30);
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-15, -15, -30, 5, 0, 30);
    ctx.bezierCurveTo(30, 5, 15, -15, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Update & draw fireworks
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      fw.x += fw.vx;
      fw.y += fw.vy;
      fw.trail.push({ x: fw.x, y: fw.y, alpha: 1 });

      // Draw trail
      this.ctx.save();
      for (let t = 0; t < fw.trail.length; t++) {
        const tr = fw.trail[t];
        tr.alpha -= 0.05;
        this.ctx.fillStyle = fw.color;
        this.ctx.globalAlpha = Math.max(0, tr.alpha);
        this.ctx.fillRect(tr.x, tr.y, 3, 3);
      }
      this.ctx.restore();
      fw.trail = fw.trail.filter(t => t.alpha > 0);

      // Check explosion condition
      if (fw.y <= fw.targetY || fw.vy >= 0) {
        this.explodeFirework(fw.x, fw.y, fw.color);
        this.fireworks.splice(i, 1);
      }
    }

    // Update & draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx + Math.sin(p.wobble) * 1.5;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.fadeSpeed;

      if (p.opacity <= 0 || p.y > this.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.opacity);

      if (p.shape === 'heart') {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.opacity);
      } else if (p.shape === 'circle') {
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        // Rectangle ribbon
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0 || this.fireworks.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.animationFrame = null;
    }
  }
}

// Global singleton
window.confetti = new ConfettiEngine();

