/**
 * Ambient Particles Engine: Floating Hearts, Falling Rose Petals, and Cursor Sparkles
 */

class AmbientParticles {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.id = 'ambient-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';
    document.body.prepend(this.canvas);

    this.hearts = [];
    this.petals = [];
    this.sparkles = [];
    this.enableHearts = true;
    this.enablePetals = true;
    this.enableSparkles = true;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.initCursorSparkles();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  initParticles() {
    // Generate initial ambient hearts
    const heartCount = Math.min(25, Math.floor(this.width / 50));
    for (let i = 0; i < heartCount; i++) {
      this.hearts.push(this.createHeart(true));
    }

    // Generate initial rose petals
    const petalCount = Math.min(20, Math.floor(this.width / 60));
    for (let i = 0; i < petalCount; i++) {
      this.petals.push(this.createPetal(true));
    }
  }

  createHeart(randomY = false) {
    const colors = [
      'rgba(255, 77, 109, 0.45)',
      'rgba(255, 117, 143, 0.4)',
      'rgba(247, 37, 133, 0.35)',
      'rgba(224, 170, 255, 0.4)',
      'rgba(255, 200, 221, 0.45)'
    ];

    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 30,
      size: Math.random() * 18 + 12,
      speedY: Math.random() * 0.8 + 0.4,
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayDistance: Math.random() * 40 + 20,
      initialX: Math.random() * this.width,
      swayOffset: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.3,
      pulse: Math.random() * Math.PI,
      pulseSpeed: 0.03
    };
  }

  createPetal(randomY = false) {
    const colors = [
      '#ff4d6d', '#e63946', '#ff758f', '#ff85a1', '#d90429'
    ];

    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -30,
      size: Math.random() * 12 + 10,
      speedY: Math.random() * 1.2 + 0.6,
      speedX: Math.random() * 0.6 - 0.3,
      swaySpeed: Math.random() * 0.03 + 0.015,
      swayOffset: Math.random() * Math.PI * 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      flipSpeed: Math.random() * 0.03 + 0.02,
      flip: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.4 + 0.4
    };
  }

  initCursorSparkles() {
    let lastX = 0, lastY = 0;
    const addSparkle = (x, y) => {
      if (!this.enableSparkles) return;
      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist < 10) return; // limit density
      lastX = x;
      lastY = y;

      const colors = ['#ffd166', '#ff85a1', '#e0aaff', '#ffffff', '#4cc9f0'];
      for (let i = 0; i < 2; i++) {
        this.sparkles.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 16,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
          size: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          decay: Math.random() * 0.04 + 0.02
        });
      }
    };

    window.addEventListener('mousemove', (e) => addSparkle(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) addSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
  }

  drawHeart(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 30, size / 30);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-15, -15, -30, 5, 0, 30);
    ctx.bezierCurveTo(30, 5, 15, -15, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  drawPetal(ctx, petal) {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate((petal.rotation * Math.PI) / 180);
    const flipScale = Math.sin(petal.flip);
    ctx.scale(1, flipScale);
    ctx.fillStyle = petal.color;
    ctx.globalAlpha = petal.opacity;

    // Organic petal shape
    ctx.beginPath();
    ctx.moveTo(0, -petal.size);
    ctx.bezierCurveTo(petal.size * 0.8, -petal.size * 0.5, petal.size * 0.8, petal.size * 0.8, 0, petal.size);
    ctx.bezierCurveTo(-petal.size * 0.8, petal.size * 0.8, -petal.size * 0.8, -petal.size * 0.5, 0, -petal.size);
    ctx.fill();
    ctx.restore();
  }

  drawSparkle(ctx, sparkle) {
    ctx.save();
    ctx.translate(sparkle.x, sparkle.y);
    ctx.globalAlpha = Math.max(0, sparkle.life);
    ctx.fillStyle = sparkle.color;

    // 4-point star sparkle
    const s = sparkle.size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.quadraticCurveTo(0, 0, s, 0);
    ctx.quadraticCurveTo(0, 0, 0, s);
    ctx.quadraticCurveTo(0, 0, -s, 0);
    ctx.quadraticCurveTo(0, 0, 0, -s);
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render & update floating hearts
    if (this.enableHearts) {
      for (let i = 0; i < this.hearts.length; i++) {
        const h = this.hearts[i];
        h.swayOffset += h.swaySpeed;
        h.x = h.initialX + Math.sin(h.swayOffset) * h.swayDistance;
        h.y -= h.speedY;
        h.pulse += h.pulseSpeed;

        const currentSize = h.size * (1 + Math.sin(h.pulse) * 0.08);
        this.drawHeart(this.ctx, h.x, h.y, currentSize, h.color);

        if (h.y < -40) {
          this.hearts[i] = this.createHeart(false);
        }
      }
    }

    // Render & update falling rose petals
    if (this.enablePetals) {
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.swayOffset += p.swaySpeed;
        p.x += Math.sin(p.swayOffset) * 1.2 + p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        this.drawPetal(this.ctx, p);

        if (p.y > this.height + 40 || p.x < -40 || p.x > this.width + 40) {
          this.petals[i] = this.createPetal(false);
        }
      }
    }

    // Render & update cursor sparkles
    if (this.enableSparkles) {
      for (let i = this.sparkles.length - 1; i >= 0; i--) {
        const s = this.sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= s.decay;

        if (s.life <= 0) {
          this.sparkles.splice(i, 1);
        } else {
          this.drawSparkle(this.ctx, s);
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Instantiate ambient particles engine on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.ambientParticles = new AmbientParticles();
});

