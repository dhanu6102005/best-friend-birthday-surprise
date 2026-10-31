
/* --- scripts/confetti.js --- */
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



/* --- scripts/particles.js --- */
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



/* --- scripts/dataStore.js --- */
/**
 * DataStore: Central State Management with LocalStorage and IndexedDB Persistence
 * Handles photos, captions, letter content, music settings, timeline, and wishes.
 */

const DEFAULT_DATA = {
  bestieName: "My Dearest KEMPA💙💎",
  nickname: "Favorite Human❤️",
  birthdayDate: "2026-11-1",
  welcomeHeading: "HEY BESTIE! ❤️",
  welcomeSubheading: "Someone special has a beautiful surprise waiting for you...",
  celebrationTitle: "HAPPY BIRTHDAY MY DEAR BEST FRIEND! 🎂❤️",
  celebrationMessage: "Today is not just another day. Today is the birthday of one of the most special people in my life. I am so lucky to have you as my best friend. May your life always be filled with happiness, love, success and beautiful memories.",
  
  // Real friendship photos
  photos: [
    {
      id: "p1",
      url: "assets/images/friendship-1.jpg",
      caption: "Every picture has a beautiful story.",
      story: "Sharing smiles, laughs, and making ordinary days feel truly extraordinary together.",
      date: "Our Sweet Memory"
    },
    {
      id: "p2",
      url: "assets/images/friendship-2.jpg",
      caption: "The best moments are always with you.",
      story: "Sunny day walks, endless talks, and spontaneous selfies that capture our true happiness.",
      date: "Days Full of Sunshine"
    },
    {
      id: "p3",
      url: "assets/images/friendship-3.jpg",
      caption: "Some friendships are forever.",
      story: "No matter how busy life gets, knowing you are always there means everything to me.",
      date: "Always By My Side"
    },
    {
      id: "p4",
      url: "assets/images/friendship-4.jpg",
      caption: "Laughing until our stomachs hurt.",
      story: "Those chaotic moments, shared looks, and inside jokes that only the two of us understand!",
      date: "Pure Joy & Giggles"
    },
    {
      id: "p5",
      url: "assets/images/friendship-5.jpg",
      caption: "Dressed up & celebrating life together.",
      story: "Looking stunning in traditional festive vibes, creating memories we will cherish for a lifetime.",
      date: "Special Celebrations"
    }
  ],

  // Friendship Journey (Timeline with Photos)
  journey: [
    {
      id: "j1",
      step: "01",
      title: "The Day We Met",
      date: "The Magical Beginning",
      desc: "The universe quietly conspired to bring our paths together. Little did we know that day would give me the best friend anyone could ever ask for.",
      image: "assets/images/friendship-3.jpg",
      icon: "sparkles",
      color: "from-pink-500 to-rose-400"
    },
    {
      id: "j2",
      step: "02",
      title: "Our First Conversation",
      date: "Breaking The Ice",
      desc: "From polite awkward hellos to realizing we share the exact same chaotic sense of humor. Within minutes, we were chatting like we had known each other forever.",
      image: null,
      icon: "message-circle",
      color: "from-purple-500 to-indigo-400"
    },
    {
      id: "j3",
      step: "03",
      title: "Our Funny Moments",
      date: "Pure Comedy & Inside Jokes",
      desc: "All those ridiculous inside jokes that nobody else understands. Laughing until tears roll down our cheeks and our stomachs hurt from smiling.",
      image: "assets/images/friendship-4.jpg",
      icon: "smile",
      color: "from-amber-400 to-pink-500"
    },
    {
      id: "j4",
      step: "04",
      title: "Our Crazy Memories",
      date: "Partners in Crime",
      desc: "Spontaneous plans, fun adventures, walking together, terrible decisions that made the best stories, and secrets we promised to take to the grave.",
      image: "assets/images/friendship-2.jpg",
      icon: "zap",
      color: "from-rose-500 to-purple-600"
    },
    {
      id: "j5",
      step: "05",
      title: "Our Unforgettable Days",
      date: "Through Thick and Thin",
      desc: "The days when life tested us, and we stood strong for each other. Being each other's cheerleader, personal therapist, and emotional anchor.",
      image: "assets/images/friendship-5.jpg",
      icon: "shield-heart",
      color: "from-cyan-400 to-blue-500"
    },
    {
      id: "j6",
      step: "06",
      title: "Our Friendship Forever",
      date: "Today & For All Tomorrow",
      desc: "Years may pass and seasons may change, but the bond we share will only grow deeper and stronger. Here is to a lifetime more of celebrating you!",
      image: "assets/images/friendship-1.jpg",
      icon: "infinity",
      color: "from-pink-500 to-amber-300"
    }
  ],

  // Special Birthday Letter
  letter: {
    greeting: "Dear Bestie,",
    paragraphs: [
      "First of all, a very happy birthday to you! ❤️",
      "I don't know how to explain how special you are to me. You are not just my friend; you are one of the most beautiful parts of my life.",
      "Thank you for all the happiness, laughter, support and unforgettable memories.",
      "I know we may have misunderstandings sometimes. We may fight, argue and make mistakes, but nothing can change the value of our friendship.",
      "I am really sorry for everything that hurt you, knowingly or unknowingly.",
      "I wish you endless happiness, good health, success and all the beautiful things you deserve.",
      "Never stop smiling. Keep shining and achieve everything you dream of.",
      "Once again, HAPPY BIRTHDAY MY DEAR BESTIE! ❤️",
      "Our friendship is special, and I hope it stays forever."
    ],
    signOff: "With lots of love,\nYour Best Friend ❤️"
  },

  // Birthday Wishes
  wishes: [
    {
      id: "w1",
      icon: "😊",
      title: "Endless Smiles",
      text: "May your smile never fade, even on the gloomiest days.",
      likes: 42
    },
    {
      id: "w2",
      icon: "✨",
      title: "Dreams Fulfilled",
      text: "May all your dreams come true and turn into your reality.",
      likes: 67
    },
    {
      id: "w3",
      icon: "🌸",
      title: "Unconditional Joy",
      text: "May happiness follow you everywhere your gentle feet tread.",
      likes: 54
    },
    {
      id: "w4",
      icon: "🌟",
      title: "Grand Success",
      text: "May you achieve great success in everything you set your heart on.",
      likes: 89
    },
    {
      id: "w5",
      icon: "📸",
      title: "Golden Memories",
      text: "May your life be filled with beautiful, cherished memories.",
      likes: 73
    },
    {
      id: "w6",
      icon: "♾️❤️",
      title: "Eternal Friendship",
      text: "May our friendship last forever, through every turn of life.",
      likes: 120
    }
  ],

  // Hidden Surprise Message
  surpriseMessage: "Thank you for being a part of my life. No matter how far life takes us, you will always have a special place in my heart. I may not express it every day, but your friendship means a lot to me. Stay happy, stay blessed and keep smiling forever. ❤️🫂",

  // Music Settings
  music: {
    songTitle: "Kadhaippoma - Our Friendship Anthem 🎶❤️",
    artist: "Dedicated to My Bestie",
    customAudioUrl: "assets/audio/friendship-song.mp3",
    volume: 0.65
  }
};

class DataStore {
  constructor() {
    this.STORAGE_KEY = 'birthday_surprise_data_v6_final';
    this.data = this.loadData();
    this.listeners = [];
  }

  loadData() {
    try {
      // Clear legacy storage keys to prevent stale caches
      localStorage.removeItem('birthday_surprise_data_v1');
      localStorage.removeItem('birthday_surprise_data_v2');

      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const validUserPhotos = (parsed.photos && parsed.photos.length && parsed.photos[0].url && parsed.photos[0].url.startsWith('data:')) ? parsed.photos : DEFAULT_DATA.photos;
        return {
          ...DEFAULT_DATA,
          ...parsed,
          photos: validUserPhotos,
          journey: DEFAULT_DATA.journey,
          letter: { ...DEFAULT_DATA.letter, ...(parsed.letter || {}) },
          music: { ...DEFAULT_DATA.music, ...(parsed.music || {}) }
        };
      }
    } catch (e) {
      console.warn("Could not load from localStorage, using defaults:", e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  saveData() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
      this.notifyListeners();
    } catch (e) {
      console.error("Failed to save data to localStorage:", e);
      alert("Storage limit reached! Please use smaller images or clear some photos.");
    }
  }

  get() {
    return this.data;
  }

  update(key, value) {
    this.data[key] = value;
    this.saveData();
  }

  addPhoto(photoObj) {
    this.data.photos.unshift(photoObj);
    this.saveData();
  }

  removePhoto(photoId) {
    this.data.photos = this.data.photos.filter(p => p.id !== photoId);
    this.saveData();
  }

  updatePhotoCaption(photoId, newCaption) {
    const photo = this.data.photos.find(p => p.id === photoId);
    if (photo) {
      photo.caption = newCaption;
      this.saveData();
    }
  }

  updateJourney(journeyIndex, updatedObj) {
    if (this.data.journey[journeyIndex]) {
      this.data.journey[journeyIndex] = { ...this.data.journey[journeyIndex], ...updatedObj };
      this.saveData();
    }
  }

  updateLetter(newLetterObj) {
    this.data.letter = { ...this.data.letter, ...newLetterObj };
    this.saveData();
  }

  incrementWishLike(wishId) {
    const wish = this.data.wishes.find(w => w.id === wishId);
    if (wish) {
      wish.likes = (wish.likes || 0) + 1;
      this.saveData();
      return wish.likes;
    }
    return 0;
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.saveData();
  }

  exportConfigJSON() {
    const jsonStr = JSON.stringify(this.data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bestie-birthday-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importConfigJSON(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      this.data = {
        ...DEFAULT_DATA,
        ...parsed,
        letter: { ...DEFAULT_DATA.letter, ...(parsed.letter || {}) },
        music: { ...DEFAULT_DATA.music, ...(parsed.music || {}) }
      };
      this.saveData();
      return true;
    } catch (e) {
      console.error("Invalid configuration JSON:", e);
      return false;
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    for (const cb of this.listeners) {
      try {
        cb(this.data);
      } catch (e) {
        console.error("Error in listener:", e);
      }
    }
  }
}

window.store = new DataStore();


/* --- scripts/audioPlayer.js --- */
/**
 * High-fidelity Background Music Player & Audio Engine
 * Supports custom MP3 upload (persisted in IndexedDB), playback controls,
 * progress scrubbing, volume/mute, and a built-in gentle Web Audio piano lullaby fallback!
 */

class BirthdayAudioEngine {
  constructor() {
    const existingAudio = document.getElementById('main-birthday-audio');
    this.audioElement = existingAudio || new Audio('assets/audio/friendship-song.mp3');
    this.audioElement.loop = true;
    this.isPlaying = false;
    this.volume = 0.75;
    this.isMuted = false;
    this.customAudioBlobUrl = null;

    // Web Audio Synthesizer fallback
    this.audioCtx = null;
    this.synthInterval = null;
    this.synthPlaying = false;
    this.synthNoteIndex = 0;
    this.melodyPlaybackTimer = null;

    this.initAudio();
    this.setupUI();
    this.loadCustomAudioFromStorage();
  }

  initAudio() {
    this.defaultAudioUrl = 'assets/audio/friendship-song.mp3';
    if (!this.audioElement.src || this.audioElement.src === '' || this.audioElement.src.endsWith('/')) {
      this.audioElement.src = this.defaultAudioUrl;
    }
    this.audioElement.volume = this.volume;

    this.audioElement.addEventListener('loadedmetadata', () => {
      if (this.timeTotal && !isNaN(this.audioElement.duration)) {
        this.timeTotal.textContent = this.formatTime(this.audioElement.duration);
      }
    });

    this.audioElement.addEventListener('timeupdate', () => {
      this.updateProgressBar();
    });

    this.audioElement.addEventListener('ended', () => {
      if (!this.audioElement.loop) {
        this.pause();
      }
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn("Audio element error, falling back to Web Audio melody:", e);
      if (this.isPlaying) {
        this.startSynthMelody();
      }
    });
  }

  setupUI() {
    // Select elements from the DOM
    this.playBtn = document.getElementById('music-play-btn');
    this.volumeSlider = document.getElementById('music-volume-slider');
    this.muteBtn = document.getElementById('music-mute-btn');
    this.progressBar = document.getElementById('music-progress-bar');
    this.progressContainer = document.getElementById('music-progress-container');
    this.timeCurrent = document.getElementById('music-time-current');
    this.timeTotal = document.getElementById('music-time-total');
    this.songTitleEl = document.getElementById('music-song-title');
    this.vinylDisc = document.getElementById('music-vinyl-disc');
    this.equalizerBars = document.querySelectorAll('.eq-bar');
    this.uploadInput = document.getElementById('music-upload-input');
    this.uploadBtn = document.getElementById('music-upload-trigger');

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
    }

    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => this.toggleMute());
    }

    if (this.progressContainer) {
      this.progressContainer.addEventListener('click', (e) => {
        this.seek(e);
      });
    }

    if (this.uploadBtn && this.uploadInput) {
      this.uploadBtn.addEventListener('click', () => this.uploadInput.click());
      this.uploadInput.addEventListener('change', (e) => this.handleCustomAudioUpload(e));
    }
  }

  // Built-in Synthesizer: Sweet, warm, celesta/chime melody
  // Plays a beautiful soft acoustic variation of the birthday celebration melody
  getMelodyNotes() {
    // Frequencies (Hz): C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25, D5=587.33, E5=659.25, F5=698.46
    return [
      { note: 392.00, dur: 0.4 }, // Sol
      { note: 392.00, dur: 0.4 }, // Sol
      { note: 440.00, dur: 0.8 }, // La
      { note: 392.00, dur: 0.8 }, // Sol
      { note: 523.25, dur: 0.8 }, // Do (octave)
      { note: 493.88, dur: 1.4 }, // Si
      { note: 0, dur: 0.3 },      // rest
      { note: 392.00, dur: 0.4 }, // Sol
      { note: 392.00, dur: 0.4 }, // Sol
      { note: 440.00, dur: 0.8 }, // La
      { note: 392.00, dur: 0.8 }, // Sol
      { note: 587.33, dur: 0.8 }, // Re
      { note: 523.25, dur: 1.4 }, // Do
      { note: 0, dur: 0.3 },      // rest
      { note: 392.00, dur: 0.4 }, // Sol
      { note: 392.00, dur: 0.4 }, // Sol
      { note: 783.99, dur: 0.8 }, // Sol (high)
      { note: 659.25, dur: 0.8 }, // Mi
      { note: 523.25, dur: 0.8 }, // Do
      { note: 493.88, dur: 0.8 }, // Si
      { note: 440.00, dur: 1.2 }, // La
      { note: 0, dur: 0.3 },      // rest
      { note: 698.46, dur: 0.4 }, // Fa
      { note: 698.46, dur: 0.4 }, // Fa
      { note: 659.25, dur: 0.8 }, // Mi
      { note: 523.25, dur: 0.8 }, // Do
      { note: 587.33, dur: 0.8 }, // Re
      { note: 523.25, dur: 1.8 }, // Do (finale)
      { note: 0, dur: 0.8 }       // pause before loop
    ];
  }

  playSynthTone(freq, duration) {
    if (!this.audioCtx || this.isMuted || freq === 0) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      // Warm, bell-like timbre (sine + triangle harmonic)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      const attack = 0.05;
      const decay = duration * 0.9;
      const peakVol = this.volume * 0.35;

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(peakVol, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + attack + decay + 0.05);
    } catch (e) {
      console.warn("Synth tone error:", e);
    }
  }

  startSynthMelody() {
    if (this.synthPlaying) return;
    this.synthPlaying = true;

    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const melody = this.getMelodyNotes();
    let currentIdx = 0;
    let fakeSeconds = 0;

    const playNext = () => {
      if (!this.synthPlaying) return;
      const step = melody[currentIdx];
      this.playSynthTone(step.note, step.dur);

      currentIdx = (currentIdx + 1) % melody.length;
      const delayMs = step.dur * 1000;

      // Update fake progress for synth
      fakeSeconds += step.dur;
      if (this.timeCurrent) {
        this.timeCurrent.textContent = this.formatTime(fakeSeconds % 60);
      }
      if (this.timeTotal) {
        this.timeTotal.textContent = "01:00";
      }
      if (this.progressBar) {
        const percent = ((fakeSeconds % 60) / 60) * 100;
        this.progressBar.style.width = `${percent}%`;
      }

      this.melodyPlaybackTimer = setTimeout(playNext, delayMs);
    };

    playNext();
  }

  stopSynthMelody() {
    this.synthPlaying = false;
    if (this.melodyPlaybackTimer) {
      clearTimeout(this.melodyPlaybackTimer);
      this.melodyPlaybackTimer = null;
    }
  }

  // Play / Pause handler
  async play() {
    try {
      this.isPlaying = true;
      this.updateUIPlayingState(true);

      if (this.audioElement) {
        if (!this.audioElement.src || this.audioElement.src.endsWith('/')) {
          this.audioElement.src = 'assets/audio/friendship-song.mp3';
        }
        this.audioElement.volume = this.volume;
        const p = this.audioElement.play();
        if (p !== undefined) {
          p.catch(err => {
            console.warn("Audio play error, falling back to melody:", err);
            this.startSynthMelody();
          });
        }
      }
    } catch (err) {
      console.warn("Audio playback error:", err);
      this.startSynthMelody();
    }
  }

  pause() {
    this.isPlaying = false;
    this.updateUIPlayingState(false);
    if (!this.audioElement.paused) {
      this.audioElement.pause();
    }
    this.stopSynthMelody();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audioElement.volume = this.volume;
    if (this.volumeSlider) {
      this.volumeSlider.value = this.volume;
    }
    if (this.volume === 0) {
      this.isMuted = true;
    } else {
      this.isMuted = false;
    }
    this.updateMuteIcon();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audioElement.muted = this.isMuted;
    if (this.isMuted) {
      if (this.volumeSlider) this.volumeSlider.value = 0;
    } else {
      if (this.volumeSlider) this.volumeSlider.value = this.volume || 0.65;
      this.audioElement.volume = this.volume || 0.65;
    }
    this.updateMuteIcon();
  }

  updateMuteIcon() {
    if (!this.muteBtn) return;
    if (this.isMuted || this.volume === 0) {
      this.muteBtn.innerHTML = `
        <svg class="w-5 h-5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      `;
    } else {
      this.muteBtn.innerHTML = `
        <svg class="w-5 h-5 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      `;
    }
  }

  seek(event) {
    if (!this.audioElement.duration || isNaN(this.audioElement.duration)) return;
    const rect = this.progressContainer.getBoundingClientRect();
    const pos = (event.clientX - rect.left) / rect.width;
    this.audioElement.currentTime = pos * this.audioElement.duration;
  }

  updateProgressBar() {
    if (!this.audioElement.duration) return;
    const current = this.audioElement.currentTime;
    const duration = this.audioElement.duration;
    const percent = (current / duration) * 100;

    if (this.progressBar) {
      this.progressBar.style.width = `${percent}%`;
    }
    if (this.timeCurrent) {
      this.timeCurrent.textContent = this.formatTime(current);
    }
    if (this.timeTotal) {
      this.timeTotal.textContent = this.formatTime(duration);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  updateUIPlayingState(isPlaying) {
    if (this.playBtn) {
      if (isPlaying) {
        this.playBtn.innerHTML = `
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        `;
        this.playBtn.setAttribute('title', 'Pause Music');
      } else {
        this.playBtn.innerHTML = `
          <svg class="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        `;
        this.playBtn.setAttribute('title', 'Play Music');
      }
    }

    if (this.vinylDisc) {
      if (isPlaying) {
        this.vinylDisc.classList.add('animate-spin-slow');
      } else {
        this.vinylDisc.classList.remove('animate-spin-slow');
      }
    }

    if (this.equalizerBars) {
      this.equalizerBars.forEach(bar => {
        if (isPlaying) {
          bar.classList.add('active');
        } else {
          bar.classList.remove('active');
        }
      });
    }
  }

  // Handle file input for custom MP3
  async handleCustomAudioUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.includes('audio') && !file.name.endsWith('.mp3')) {
      alert("Please select a valid audio file (MP3, WAV, M4A, etc.)");
      return;
    }

    try {
      this.stopSynthMelody();
      const objectUrl = URL.createObjectURL(file);
      this.audioElement.src = objectUrl;

      const title = file.name.replace(/\.[^/.]+$/, "");
      if (this.songTitleEl) {
        this.songTitleEl.textContent = title;
      }

      // Save to IndexedDB so it persists across reloads!
      await this.saveAudioToIndexedDB(file);

      // Play uploaded music
      await this.play();
      window.confetti.burst({ count: 40 });
    } catch (err) {
      console.error("Audio upload error:", err);
    }
  }

  // IndexedDB Storage for persisting large MP3 files locally
  getDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('BirthdayAudioDB', 1);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('audioStore')) {
          db.createObjectStore('audioStore');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveAudioToIndexedDB(file) {
    try {
      const db = await this.getDB();
      const tx = db.transaction('audioStore', 'readwrite');
      const store = tx.objectStore('audioStore');
      store.put(file, 'customSong');
      store.put(file.name, 'customSongName');
    } catch (e) {
      console.warn("Could not save audio to IndexedDB:", e);
    }
  }

  async loadCustomAudioFromStorage() {
    try {
      const db = await this.getDB();
      const tx = db.transaction('audioStore', 'readonly');
      const store = tx.objectStore('audioStore');
      const fileReq = store.get('customSong');
      const nameReq = store.get('customSongName');

      fileReq.onsuccess = () => {
        const blob = fileReq.result;
        if (blob) {
          const url = URL.createObjectURL(blob);
          this.audioElement.src = url;
          nameReq.onsuccess = () => {
            if (nameReq.result && this.songTitleEl) {
              this.songTitleEl.textContent = nameReq.result.replace(/\.[^/.]+$/, "");
            }
          };
        } else {
          this.audioElement.src = this.defaultAudioUrl;
          if (this.songTitleEl) {
            this.songTitleEl.textContent = "Kadhaippoma - Our Friendship Anthem 🎶❤️";
          }
        }
      };
    } catch (e) {
      this.audioElement.src = this.defaultAudioUrl;
      if (this.songTitleEl) {
        this.songTitleEl.textContent = "Kadhaippoma - Our Friendship Anthem 🎶❤️";
      }
    }
  }
}

// Instantiate audio engine when document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.audioEngine = new BirthdayAudioEngine();
});



/* --- scripts/lightbox.js --- */
/**
 * Full-screen Photo Lightbox & Slideshow Engine
 * Supports zoom, previous/next navigation, autoplay slideshow, and keyboard shortcuts.
 */

class Lightbox {
  constructor() {
    this.currentIndex = 0;
    this.photos = [];
    this.isPlayingSlideshow = false;
    this.slideshowTimer = null;
    this.slideshowDelay = 4000;
    this.zoomLevel = 1;

    this.createLightboxDOM();
    this.bindEvents();
  }

  createLightboxDOM() {
    const el = document.createElement('div');
    el.id = 'photo-lightbox';
    el.className = 'lightbox-backdrop hidden fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl transition-all duration-300';
    el.innerHTML = `
      <!-- Close Button -->
      <button id="lightbox-close-btn" class="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur transition-all border border-white/20 shadow-lg group">
        <svg class="w-6 h-6 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <!-- Slideshow Toolbar -->
      <div class="absolute top-5 left-5 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
        <button id="lightbox-play-slideshow" class="flex items-center gap-1.5 text-xs font-medium text-pink-200 hover:text-white transition">
          <svg id="slideshow-icon" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span id="slideshow-text">Play Slideshow</span>
        </button>
        <div class="w-px h-3 bg-white/20"></div>
        <button id="lightbox-zoom-in" class="text-white/80 hover:text-white p-1" title="Zoom In">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"/>
          </svg>
        </button>
        <button id="lightbox-zoom-reset" class="text-xs text-white/70 hover:text-white px-1">100%</button>
        <button id="lightbox-zoom-out" class="text-white/80 hover:text-white p-1" title="Zoom Out">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"/>
          </svg>
        </button>
      </div>

      <!-- Main Stage Container -->
      <div class="relative w-full max-w-5xl max-h-[85vh] flex flex-col items-center justify-center">
        <!-- Navigation Buttons -->
        <button id="lightbox-prev-btn" class="absolute left-2 sm:-left-14 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-pink-600/60 text-white backdrop-blur border border-white/20 shadow-xl transition-all hover:scale-110">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>

        <button id="lightbox-next-btn" class="absolute right-2 sm:-right-14 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-pink-600/60 text-white backdrop-blur border border-white/20 shadow-xl transition-all hover:scale-110">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
          </svg>
        </button>

        <!-- Image Wrapper -->
        <div class="overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl bg-black/40 flex items-center justify-center max-h-[70vh] w-auto">
          <img id="lightbox-img" src="" alt="Memory" class="max-w-full max-h-[70vh] object-contain transition-transform duration-200 select-none cursor-grab active:cursor-grabbing" />
        </div>

        <!-- Caption & Memory Info Card -->
        <div class="mt-4 text-center max-w-xl px-4 py-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15">
          <p id="lightbox-caption" class="text-base sm:text-lg font-medium text-pink-100 font-serif"></p>
          <p id="lightbox-story" class="text-xs sm:text-sm text-pink-200/80 mt-1 italic"></p>
          <div class="flex items-center justify-center gap-3 mt-2 text-xs text-pink-300/70">
            <span id="lightbox-date"></span>
            <span>•</span>
            <span id="lightbox-counter"></span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(el);

    this.lightboxEl = el;
    this.imgEl = el.querySelector('#lightbox-img');
    this.captionEl = el.querySelector('#lightbox-caption');
    this.storyEl = el.querySelector('#lightbox-story');
    this.dateEl = el.querySelector('#lightbox-date');
    this.counterEl = el.querySelector('#lightbox-counter');
    this.prevBtn = el.querySelector('#lightbox-prev-btn');
    this.nextBtn = el.querySelector('#lightbox-next-btn');
    this.closeBtn = el.querySelector('#lightbox-close-btn');
    this.slideshowBtn = el.querySelector('#lightbox-play-slideshow');
    this.slideshowIcon = el.querySelector('#slideshow-icon');
    this.slideshowText = el.querySelector('#slideshow-text');
    this.zoomInBtn = el.querySelector('#lightbox-zoom-in');
    this.zoomOutBtn = el.querySelector('#lightbox-zoom-out');
    this.zoomResetBtn = el.querySelector('#lightbox-zoom-reset');
  }

  bindEvents() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.lightboxEl.addEventListener('click', (e) => {
      if (e.target === this.lightboxEl) this.close();
    });

    this.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });

    this.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    this.slideshowBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleSlideshow();
    });

    this.zoomInBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.zoom(0.25);
    });

    this.zoomOutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.zoom(-0.25);
    });

    this.zoomResetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setZoom(1);
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (this.lightboxEl.classList.contains('hidden')) return;

      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === ' ') {
        e.preventDefault();
        this.toggleSlideshow();
      }
    });
  }

  open(photos, startIndex = 0) {
    this.photos = photos;
    this.currentIndex = startIndex;
    this.lightboxEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.setZoom(1);
    this.renderCurrent();
  }

  close() {
    this.stopSlideshow();
    this.lightboxEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  renderCurrent() {
    if (!this.photos || this.photos.length === 0) return;
    const photo = this.photos[this.currentIndex];

    this.imgEl.style.opacity = '0';
    setTimeout(() => {
      this.imgEl.src = photo.url;
      this.captionEl.textContent = photo.caption || "Every picture has a beautiful story.";
      this.storyEl.textContent = photo.story || "";
      this.dateEl.textContent = photo.date || "Precious Memory";
      this.counterEl.textContent = `${this.currentIndex + 1} of ${this.photos.length}`;
      this.imgEl.style.opacity = '1';
    }, 120);

    this.setZoom(1);
  }

  next() {
    if (!this.photos || this.photos.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.renderCurrent();
  }

  prev() {
    if (!this.photos || this.photos.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.renderCurrent();
  }

  zoom(delta) {
    this.setZoom(this.zoomLevel + delta);
  }

  setZoom(level) {
    this.zoomLevel = Math.max(0.75, Math.min(2.5, level));
    this.imgEl.style.transform = `scale(${this.zoomLevel})`;
    this.zoomResetBtn.textContent = `${Math.round(this.zoomLevel * 100)}%`;
  }

  toggleSlideshow() {
    if (this.isPlayingSlideshow) {
      this.stopSlideshow();
    } else {
      this.startSlideshow();
    }
  }

  startSlideshow() {
    this.isPlayingSlideshow = true;
    this.slideshowText.textContent = "Pause";
    this.slideshowIcon.innerHTML = `
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    `;
    this.slideshowTimer = setInterval(() => {
      this.next();
    }, this.slideshowDelay);
  }

  stopSlideshow() {
    this.isPlayingSlideshow = false;
    this.slideshowText.textContent = "Play Slideshow";
    this.slideshowIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`;
    if (this.slideshowTimer) {
      clearInterval(this.slideshowTimer);
      this.slideshowTimer = null;
    }
  }
}

window.lightbox = new Lightbox();



/* --- scripts/customizer.js --- */
/**
 * Interactive Customizer Panel
 * Provides in-browser customization for photos, captions, letter, name, date,
 * journey milestones, wishes, music upload, and export/import config.
 */

class Customizer {
  constructor() {
    this.createCustomizerDOM();
    this.bindEvents();
  }

  createCustomizerDOM() {
    // Floating Trigger Button
    const trigger = document.createElement('button');
    trigger.id = 'customizer-trigger';
    trigger.className = 'fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-pink-600/80 hover:bg-pink-500 text-white shadow-lg backdrop-blur-md border border-pink-400/30 transition-all hover:scale-105 group';
    trigger.innerHTML = `
      <svg class="w-4 h-4 animate-spin-slow group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <span class="text-xs font-semibold tracking-wide">Personalize ⚙️</span>
    `;
    document.body.appendChild(trigger);

    // Modal Drawer Container
    const modal = document.createElement('div');
    modal.id = 'customizer-modal';
    modal.className = 'hidden fixed inset-0 z-[100001] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl transition-all';
    modal.innerHTML = `
      <div class="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#1f0a2d] to-[#12041d] rounded-3xl border border-pink-500/30 shadow-2xl flex flex-col overflow-hidden text-pink-50">
        
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-5 border-b border-pink-500/20 bg-pink-950/40">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
              <span class="text-xl">✨</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white font-serif">Personalize Bestie's Surprise</h2>
              <p class="text-xs text-pink-300/80">Customize names, photos, letter, memories, music & wishes</p>
            </div>
          </div>
          <button id="customizer-close-btn" class="p-2 rounded-full hover:bg-white/10 text-pink-300 hover:text-white transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex overflow-x-auto gap-2 px-6 py-3 border-b border-pink-500/10 bg-black/20 text-xs font-medium scrollbar-thin">
          <button data-tab="tab-general" class="customizer-tab-btn px-4 py-2 rounded-xl bg-pink-600 text-white whitespace-nowrap shadow-sm">👤 General & Names</button>
          <button data-tab="tab-photos" class="customizer-tab-btn px-4 py-2 rounded-xl hover:bg-white/10 text-pink-200 whitespace-nowrap">📸 Photos & Captions</button>
          <button data-tab="tab-letter" class="customizer-tab-btn px-4 py-2 rounded-xl hover:bg-white/10 text-pink-200 whitespace-nowrap">💌 Heartfelt Letter</button>
          <button data-tab="tab-journey" class="customizer-tab-btn px-4 py-2 rounded-xl hover:bg-white/10 text-pink-200 whitespace-nowrap">🫂 Journey Timeline</button>
          <button data-tab="tab-wishes" class="customizer-tab-btn px-4 py-2 rounded-xl hover:bg-white/10 text-pink-200 whitespace-nowrap">🌹 Birthday Wishes</button>
          <button data-tab="tab-music" class="customizer-tab-btn px-4 py-2 rounded-xl hover:bg-white/10 text-pink-200 whitespace-nowrap">🎵 Music & Song</button>
          <button data-tab="tab-export" class="customizer-tab-btn px-4 py-2 rounded-xl hover:bg-white/10 text-pink-200 whitespace-nowrap">🚀 Permanent Deploy</button>
        </div>

        <!-- Tab Contents Body (Scrollable) -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar text-sm">
          
          <!-- TAB 1: GENERAL -->
          <div id="tab-general" class="tab-content space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-medium text-pink-300 mb-1">Best Friend's Name</label>
                <input id="input-bestie-name" type="text" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400" placeholder="e.g. Sarah / Ananya / Alex">
              </div>
              <div>
                <label class="block text-xs font-medium text-pink-300 mb-1">Cute Nickname</label>
                <input id="input-nickname" type="text" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400" placeholder="e.g. Favorite Human ❤️">
              </div>
              <div>
                <label class="block text-xs font-medium text-pink-300 mb-1">Birthday Date</label>
                <input id="input-birthday-date" type="date" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400">
              </div>
              <div>
                <label class="block text-xs font-medium text-pink-300 mb-1">Opening Heading</label>
                <input id="input-welcome-heading" type="text" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400" placeholder="HEY BESTIE! ❤️">
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-pink-300 mb-1">Celebration Message</label>
              <textarea id="input-celebration-message" rows="3" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400"></textarea>
            </div>
          </div>

          <!-- TAB 2: PHOTOS -->
          <div id="tab-photos" class="tab-content hidden space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-pink-900/20 border border-pink-500/20">
              <div>
                <h4 class="font-semibold text-white">Upload Your Best Friend's Photos 📸</h4>
                <p class="text-xs text-pink-300/80">Select JPG, JPEG, PNG or WEBP photos from your device</p>
              </div>
              <div>
                <input id="photo-upload-input" type="file" multiple accept="image/*" class="hidden">
                <button id="photo-upload-btn" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium shadow-md transition-all flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  <span>Upload Photos</span>
                </button>
              </div>
            </div>

            <div id="customizer-photos-list" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Dynamically populated photos -->
            </div>
          </div>

          <!-- TAB 3: LETTER -->
          <div id="tab-letter" class="tab-content hidden space-y-4">
            <div>
              <label class="block text-xs font-medium text-pink-300 mb-1">Letter Greeting</label>
              <input id="input-letter-greeting" type="text" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400" placeholder="Dear Bestie,">
            </div>

            <div>
              <label class="block text-xs font-medium text-pink-300 mb-1">Letter Content (One paragraph per line)</label>
              <textarea id="input-letter-body" rows="9" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400 font-serif leading-relaxed"></textarea>
            </div>

            <div>
              <label class="block text-xs font-medium text-pink-300 mb-1">Letter Sign-off</label>
              <textarea id="input-letter-signoff" rows="2" class="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-pink-500/30 text-white focus:outline-none focus:border-pink-400"></textarea>
            </div>
          </div>

          <!-- TAB 4: JOURNEY -->
          <div id="tab-journey" class="tab-content hidden space-y-4">
            <p class="text-xs text-pink-300/80">Customize the 6 milestone moments in your friendship story:</p>
            <div id="customizer-journey-list" class="space-y-4">
              <!-- Dynamically populated journey milestones -->
            </div>
          </div>

          <!-- TAB 5: WISHES -->
          <div id="tab-wishes" class="tab-content hidden space-y-4">
            <p class="text-xs text-pink-300/80">Customize your personalized birthday wishes:</p>
            <div id="customizer-wishes-list" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Dynamically populated wishes -->
            </div>
          </div>

          <!-- TAB 6: MUSIC -->
          <div id="tab-music" class="tab-content hidden space-y-4">
            <div class="p-5 rounded-2xl bg-pink-900/20 border border-pink-500/20 space-y-3">
              <h4 class="font-semibold text-white">Upload Your Special Friendship Song 🎵</h4>
              <p class="text-xs text-pink-300/80">
                You can upload your favorite MP3 track legally. It will be stored locally in IndexedDB so it will continue playing whenever you revisit the website.
              </p>
              <div class="pt-2">
                <input id="tab-music-upload-input" type="file" accept="audio/*" class="hidden">
                <button id="tab-music-upload-btn" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 text-white font-medium shadow-md transition flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                  </svg>
                  <span>Select MP3 Song File</span>
                </button>
              </div>
            </div>
          </div>

          <!-- TAB 7: PERMANENT DEPLOYMENT & EXPORT -->
          <div id="tab-export" class="tab-content hidden space-y-5">
            <div class="p-5 rounded-2xl bg-purple-900/30 border border-purple-500/30 space-y-3">
              <h4 class="font-semibold text-white text-base">How to Permanently Deploy on Vercel For Your Bestie 🚀</h4>
              <p class="text-xs text-purple-200/90 leading-relaxed">
                When you personalize the website in your browser, the data is saved in your browser's local storage.
                To deploy the customized version to Vercel so your best friend can view it directly on their phone:
              </p>
              <ol class="list-decimal list-inside text-xs text-purple-200/80 space-y-1.5 pl-1">
                <li>Click <strong>"Export Config (JSON)"</strong> below to download your complete configuration.</li>
                <li>Or simply replace the files/photos in the project folder and push to GitHub!</li>
                <li>Deploy to Vercel with one click: run <code class="bg-black/40 px-1 py-0.5 rounded text-pink-300">vercel</code> in terminal or connect your GitHub repository on <a href="https://vercel.com" target="_blank" class="underline text-pink-300">vercel.com</a>.</li>
                <li>Your friend gets their own live romantic link (e.g. <code class="bg-black/40 px-1 py-0.5 rounded text-pink-300">https://happy-birthday-bestie.vercel.app</code>) that works on any phone or laptop!</li>
              </ol>
            </div>

            <div class="flex flex-wrap gap-3">
              <button id="btn-export-config" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-medium shadow-md transition flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>Export Configuration JSON</span>
              </button>

              <input id="input-import-config" type="file" accept=".json" class="hidden">
              <button id="btn-import-config" class="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium transition flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"/>
                </svg>
                <span>Import Configuration JSON</span>
              </button>

              <button id="btn-reset-default" class="px-5 py-2.5 rounded-xl bg-red-600/30 hover:bg-red-600/50 text-red-200 border border-red-500/30 font-medium transition">
                Reset to Default Data
              </button>
            </div>
          </div>

        </div>

        <!-- Footer Actions -->
        <div class="px-6 py-4 border-t border-pink-500/20 bg-pink-950/60 flex items-center justify-between">
          <span class="text-xs text-pink-300/70">Changes apply instantly & save automatically ✨</span>
          <button id="customizer-save-close-btn" class="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-pink-500/30 transition-all hover:scale-105">
            Done & Enjoy Surprise 🎉
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    this.modalEl = modal;
    this.triggerBtn = trigger;
    this.closeBtn = modal.querySelector('#customizer-close-btn');
    this.saveCloseBtn = modal.querySelector('#customizer-save-close-btn');
  }

  bindEvents() {
    this.triggerBtn.addEventListener('click', () => this.open());
    this.closeBtn.addEventListener('click', () => this.close());
    this.saveCloseBtn.addEventListener('click', () => {
      this.saveGeneralSettings();
      this.close();
      window.confetti.burst({ count: 60 });
    });

    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) this.close();
    });

    // Tab switching
    const tabs = this.modalEl.querySelectorAll('.customizer-tab-btn');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('bg-pink-600', 'text-white');
          t.classList.add('hover:bg-white/10', 'text-pink-200');
        });
        btn.classList.add('bg-pink-600', 'text-white');
        btn.classList.remove('hover:bg-white/10', 'text-pink-200');

        const tabId = btn.getAttribute('data-tab');
        this.modalEl.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        const active = this.modalEl.querySelector(`#${tabId}`);
        if (active) active.classList.remove('hidden');
      });
    });

    // Photo uploader
    const photoUploadBtn = this.modalEl.querySelector('#photo-upload-btn');
    const photoUploadInput = this.modalEl.querySelector('#photo-upload-input');
    photoUploadBtn.addEventListener('click', () => photoUploadInput.click());
    photoUploadInput.addEventListener('change', (e) => this.handlePhotoFiles(e));

    // Music uploader from tab
    const tabMusicBtn = this.modalEl.querySelector('#tab-music-upload-btn');
    const tabMusicInput = this.modalEl.querySelector('#tab-music-upload-input');
    tabMusicBtn.addEventListener('click', () => tabMusicInput.click());
    tabMusicInput.addEventListener('change', (e) => {
      if (window.audioEngine) window.audioEngine.handleCustomAudioUpload(e);
    });

    // Export / Import
    const exportBtn = this.modalEl.querySelector('#btn-export-config');
    const importBtn = this.modalEl.querySelector('#btn-import-config');
    const importInput = this.modalEl.querySelector('#input-import-config');
    const resetBtn = this.modalEl.querySelector('#btn-reset-default');

    exportBtn.addEventListener('click', () => window.store.exportConfigJSON());
    importBtn.addEventListener('click', () => importInput.click());
    importInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const ok = window.store.importConfigJSON(event.target.result);
        if (ok) {
          alert("Configuration imported successfully!");
          this.populateFields();
        } else {
          alert("Invalid configuration file.");
        }
      };
      reader.readAsText(file);
    });

    resetBtn.addEventListener('click', () => {
      if (confirm("Reset everything to default birthday surprises?")) {
        window.store.resetToDefault();
        this.populateFields();
      }
    });

    // Live binding for inputs
    this.bindLiveInputs();
  }

  bindLiveInputs() {
    const bind = (id, key) => {
      const el = this.modalEl.querySelector(`#${id}`);
      if (el) {
        el.addEventListener('input', (e) => {
          window.store.update(key, e.target.value);
        });
      }
    };

    bind('input-bestie-name', 'bestieName');
    bind('input-nickname', 'nickname');
    bind('input-birthday-date', 'birthdayDate');
    bind('input-welcome-heading', 'welcomeHeading');
    bind('input-celebration-message', 'celebrationMessage');

    // Letter inputs
    const letterGreeting = this.modalEl.querySelector('#input-letter-greeting');
    const letterBody = this.modalEl.querySelector('#input-letter-body');
    const letterSignoff = this.modalEl.querySelector('#input-letter-signoff');

    const updateLetter = () => {
      window.store.updateLetter({
        greeting: letterGreeting.value,
        paragraphs: letterBody.value.split('\n').filter(p => p.trim() !== ''),
        signOff: letterSignoff.value
      });
    };

    letterGreeting.addEventListener('input', updateLetter);
    letterBody.addEventListener('input', updateLetter);
    letterSignoff.addEventListener('input', updateLetter);
  }

  open() {
    this.populateFields();
    this.modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modalEl.classList.add('hidden');
    document.body.style.overflow = '';
  }

  populateFields() {
    const data = window.store.get();

    // General
    this.modalEl.querySelector('#input-bestie-name').value = data.bestieName || '';
    this.modalEl.querySelector('#input-nickname').value = data.nickname || '';
    this.modalEl.querySelector('#input-birthday-date').value = data.birthdayDate || '';
    this.modalEl.querySelector('#input-welcome-heading').value = data.welcomeHeading || '';
    this.modalEl.querySelector('#input-celebration-message').value = data.celebrationMessage || '';

    // Letter
    this.modalEl.querySelector('#input-letter-greeting').value = data.letter.greeting || '';
    this.modalEl.querySelector('#input-letter-body').value = (data.letter.paragraphs || []).join('\n\n');
    this.modalEl.querySelector('#input-letter-signoff').value = data.letter.signOff || '';

    // Photos list
    this.renderPhotosList(data.photos);

    // Journey list
    this.renderJourneyList(data.journey);

    // Wishes list
    this.renderWishesList(data.wishes);
  }

  saveGeneralSettings() {
    const data = window.store.get();
    data.bestieName = this.modalEl.querySelector('#input-bestie-name').value;
    data.nickname = this.modalEl.querySelector('#input-nickname').value;
    data.birthdayDate = this.modalEl.querySelector('#input-birthday-date').value;
    data.welcomeHeading = this.modalEl.querySelector('#input-welcome-heading').value;
    data.celebrationMessage = this.modalEl.querySelector('#input-celebration-message').value;
    window.store.saveData();
  }

  renderPhotosList(photos) {
    const container = this.modalEl.querySelector('#customizer-photos-list');
    container.innerHTML = '';

    photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'p-3 rounded-2xl bg-white/5 border border-pink-500/20 flex flex-col gap-2 relative group';
      card.innerHTML = `
        <div class="relative h-32 rounded-xl overflow-hidden bg-black/40">
          <img src="${photo.url}" alt="${photo.caption}" class="w-full h-full object-cover"/>
          <button data-delete-id="${photo.id}" class="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white transition shadow" title="Delete Photo">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
        <input type="text" data-caption-id="${photo.id}" value="${photo.caption || ''}" placeholder="Photo caption..." class="w-full text-xs px-2.5 py-1.5 rounded-lg bg-black/40 border border-pink-500/20 text-pink-100 focus:outline-none focus:border-pink-400">
      `;

      card.querySelector(`[data-delete-id="${photo.id}"]`).addEventListener('click', () => {
        window.store.removePhoto(photo.id);
        this.renderPhotosList(window.store.get().photos);
      });

      card.querySelector(`[data-caption-id="${photo.id}"]`).addEventListener('input', (e) => {
        window.store.updatePhotoCaption(photo.id, e.target.value);
      });

      container.appendChild(card);
    });
  }

  handlePhotoFiles(event) {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto = {
          id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          url: e.target.result,
          caption: "A special moment together ❤️",
          story: "Our beautiful smiles and memories.",
          date: "Forever Memory"
        };
        window.store.addPhoto(newPhoto);
        this.renderPhotosList(window.store.get().photos);
      };
      reader.readAsDataURL(file);
    });

    event.target.value = '';
  }

  renderJourneyList(journey) {
    const container = this.modalEl.querySelector('#customizer-journey-list');
    container.innerHTML = '';

    journey.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-2xl bg-white/5 border border-pink-500/20 space-y-2';
      card.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-pink-400 tracking-wider uppercase">Step ${item.step}</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input type="text" data-journey-title="${idx}" value="${item.title}" placeholder="Milestone Title" class="text-xs px-3 py-2 rounded-xl bg-black/30 border border-pink-500/20 text-white">
          <input type="text" data-journey-date="${idx}" value="${item.date}" placeholder="Date or Phase" class="text-xs px-3 py-2 rounded-xl bg-black/30 border border-pink-500/20 text-white">
        </div>
        <textarea rows="2" data-journey-desc="${idx}" class="w-full text-xs px-3 py-2 rounded-xl bg-black/30 border border-pink-500/20 text-white">${item.desc}</textarea>
      `;

      card.querySelector(`[data-journey-title="${idx}"]`).addEventListener('input', (e) => {
        window.store.updateJourney(idx, { title: e.target.value });
      });
      card.querySelector(`[data-journey-date="${idx}"]`).addEventListener('input', (e) => {
        window.store.updateJourney(idx, { date: e.target.value });
      });
      card.querySelector(`[data-journey-desc="${idx}"]`).addEventListener('input', (e) => {
        window.store.updateJourney(idx, { desc: e.target.value });
      });

      container.appendChild(card);
    });
  }

  renderWishesList(wishes) {
    const container = this.modalEl.querySelector('#customizer-wishes-list');
    container.innerHTML = '';

    wishes.forEach((wish, idx) => {
      const card = document.createElement('div');
      card.className = 'p-3 rounded-2xl bg-white/5 border border-pink-500/20 space-y-2';
      card.innerHTML = `
        <div class="flex items-center gap-2">
          <input type="text" data-wish-icon="${idx}" value="${wish.icon}" class="w-10 text-center text-sm py-1 rounded-lg bg-black/30 border border-pink-500/20 text-white">
          <input type="text" data-wish-title="${idx}" value="${wish.title}" class="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-black/30 border border-pink-500/20 text-white font-medium">
        </div>
        <textarea rows="2" data-wish-text="${idx}" class="w-full text-xs px-2.5 py-1.5 rounded-lg bg-black/30 border border-pink-500/20 text-white">${wish.text}</textarea>
      `;

      card.querySelector(`[data-wish-icon="${idx}"]`).addEventListener('input', (e) => {
        const w = window.store.get().wishes;
        w[idx].icon = e.target.value;
        window.store.saveData();
      });
      card.querySelector(`[data-wish-title="${idx}"]`).addEventListener('input', (e) => {
        const w = window.store.get().wishes;
        w[idx].title = e.target.value;
        window.store.saveData();
      });
      card.querySelector(`[data-wish-text="${idx}"]`).addEventListener('input', (e) => {
        const w = window.store.get().wishes;
        w[idx].text = e.target.value;
        window.store.saveData();
      });

      container.appendChild(card);
    });
  }
}

window.customizer = new Customizer();



/* --- scripts/app.js --- */
/**
 * Main Application Controller
 * Handles welcome surprise, celebration triggers, interactive cake,
 * envelope opening, typewriter effects, timeline, wishes, and data updates.
 */

class BirthdayApp {
  constructor() {
    this.candlesBlown = false;
    this.surpriseUnlocked = false;
    this.letterOpened = false;

    this.init();
  }

  init() {
    this.renderAll();
    this.bindWelcomeEvents();
    this.bindCakeEvents();
    this.bindLetterEvents();
    this.bindSurpriseEvents();
    this.bindFinaleEvents();
    this.bindScrollAnimations();
    this.bindEffectToggles();

    // Subscribe to DataStore updates
    window.store.subscribe(() => {
      this.renderAll();
    });
  }

  renderAll() {
    const data = window.store.get();

    // 1. Welcome Screen
    const welcomeHeading = document.getElementById('welcome-heading');
    const welcomeSub = document.getElementById('welcome-subheading');
    if (welcomeHeading) welcomeHeading.textContent = data.welcomeHeading;
    if (welcomeSub) welcomeSub.textContent = data.welcomeSubheading;

    // 2. Celebration Hero
    const celebTitle = document.getElementById('celebration-title');
    const celebMsg = document.getElementById('celebration-message');
    if (celebTitle) celebTitle.textContent = data.celebrationTitle;
    if (celebMsg) celebMsg.textContent = data.celebrationMessage;

    // Bestie Name mentions
    document.querySelectorAll('.bestie-name-placeholder').forEach(el => {
      el.textContent = data.bestieName;
    });

    // 3. Photo Gallery
    this.renderPhotoGallery(data.photos);

    // 4. Friendship Journey (Timeline)
    this.renderTimeline(data.journey);

    // 5. Letter Content
    this.renderLetter(data.letter);

    // 6. Wishes
    this.renderWishes(data.wishes);

    // 7. Surprise Message
    const surpriseTextEl = document.getElementById('surprise-message-text');
    if (surpriseTextEl) surpriseTextEl.textContent = data.surpriseMessage;
  }

  // -------------------------------------------------------------
  // WELCOME SURPRISE EVENTS
  // -------------------------------------------------------------
  bindWelcomeEvents() {
    const giftBox = document.getElementById('welcome-gift-box');
    const openBtn = document.getElementById('btn-open-welcome-surprise');
    const welcomeSection = document.getElementById('section-welcome');
    const celebrationSection = document.getElementById('section-celebration');

    const triggerSurprise = () => {
      if (giftBox) giftBox.classList.add('opened');

      // Giant explosion of confetti & hearts
      window.confetti.burst({ count: 120, speed: 14 });
      window.confetti.showerHearts(40);

      // Start music playback on first interaction
      if (window.audioEngine) {
        window.audioEngine.play();
      }

      // Smooth transition to celebration screen
      setTimeout(() => {
        if (celebrationSection) {
          celebrationSection.scrollIntoView({ behavior: 'smooth' });
          window.confetti.launchCannons();
        }
      }, 700);
    };

    if (giftBox) giftBox.addEventListener('click', triggerSurprise);
    if (openBtn) openBtn.addEventListener('click', triggerSurprise);

    const celebScrollBtn = document.getElementById('btn-lets-celebrate');
    if (celebScrollBtn) {
      celebScrollBtn.addEventListener('click', () => {
        const gallery = document.getElementById('section-gallery');
        if (gallery) {
          gallery.scrollIntoView({ behavior: 'smooth' });
          window.confetti.burst({ count: 40 });
        }
      });
    }
  }

  // -------------------------------------------------------------
  // INTERACTIVE BIRTHDAY CAKE & BLOWABLE CANDLES
  // -------------------------------------------------------------
  bindCakeEvents() {
    const candlesGroup = document.getElementById('cake-candles-group');
    const candleStatus = document.getElementById('cake-wish-prompt');

    if (candlesGroup) {
      candlesGroup.addEventListener('click', () => {
        if (!this.candlesBlown) {
          this.candlesBlown = true;
          candlesGroup.querySelectorAll('.candle').forEach(c => c.classList.add('blown'));

          // Celebration reaction
          window.confetti.burst({ count: 80, speed: 12 });
          window.confetti.showerHearts(30);

          if (candleStatus) {
            candleStatus.innerHTML = `
              <span class="text-emerald-400 font-semibold animate-pulse">
                ✨ Wish Made! May all your dreams come true! 🎂💫
              </span>
            `;
          }
        } else {
          // Re-light candles
          this.candlesBlown = false;
          candlesGroup.querySelectorAll('.candle').forEach(c => c.classList.remove('blown'));
          if (candleStatus) {
            candleStatus.textContent = "Click candles to make a wish & blow them out! 🕯️✨";
          }
        }
      });
    }
  }

  // -------------------------------------------------------------
  // PHOTO GALLERY RENDERING & LIGHTBOX
  // -------------------------------------------------------------
  renderPhotoGallery(photos) {
    const grid = document.getElementById('photos-grid-container');
    if (!grid) return;

    grid.innerHTML = '';
    photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'group relative rounded-3xl overflow-hidden glass-panel-glow cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl';
      card.innerHTML = `
        <div class="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-black/40">
          <img src="${photo.url}" alt="${photo.caption}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
          
          <!-- Hover View Button -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold tracking-wide border border-white/30 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
              View Memory 🔍
            </span>
          </div>

          <!-- Caption & Date Badge -->
          <div class="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col justify-end">
            <span class="text-[11px] font-semibold tracking-wider uppercase text-pink-300 mb-1">${photo.date || 'Forever Memory'}</span>
            <p class="text-sm sm:text-base font-semibold text-white font-serif line-clamp-2">${photo.caption}</p>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        if (window.lightbox) {
          window.lightbox.open(photos, idx);
        }
      });

      grid.appendChild(card);
    });

    // Gallery quick upload button trigger
    const quickUploadBtn = document.getElementById('gallery-quick-upload-btn');
    if (quickUploadBtn) {
      quickUploadBtn.onclick = () => {
        if (window.customizer) {
          window.customizer.open();
          // switch to photos tab
          const tabBtn = document.querySelector('[data-tab="tab-photos"]');
          if (tabBtn) tabBtn.click();
        }
      };
    }
  }

  // -------------------------------------------------------------
  // FRIENDSHIP JOURNEY (TIMELINE) RENDERING
  // -------------------------------------------------------------
  renderTimeline(journey) {
    const container = document.getElementById('journey-timeline-container');
    if (!container) return;

    container.innerHTML = '';
    journey.forEach((item, idx) => {
      const isEven = idx % 2 === 0;
      const card = document.createElement('div');
      card.className = `relative flex items-center justify-between md:justify-normal w-full mb-10 ${
        isEven ? 'md:flex-row-reverse' : ''
      }`;

      card.innerHTML = `
        <!-- Timeline Center Node Badge -->
        <div class="absolute left-4 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 border-4 border-[#160826] flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-pink-500/50 z-10 transition-transform hover:scale-125">
          ${item.step}
        </div>

        <!-- Content Card -->
        <div class="w-full pl-14 md:pl-0 md:w-[45%] ${isEven ? 'md:pr-10' : 'md:pl-10'}">
          <div class="p-5 sm:p-6 rounded-3xl glass-panel-glow hover:-translate-y-1 transition-all duration-300">
            ${item.image ? `
              <div class="mb-4 rounded-2xl overflow-hidden aspect-[16/10] bg-black/40 border border-pink-500/25 shadow-lg group">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer" onclick="window.lightbox && window.lightbox.open([{url: '${item.image}', caption: '${item.title}', story: '${item.desc}', date: '${item.date}'}], 0)" title="Click to view full memory"/>
              </div>
            ` : ''}
            <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-pink-500/20 text-pink-300 border border-pink-500/30 mb-2">
              ${item.date}
            </span>
            <h3 class="text-xl font-bold text-white font-serif mb-2">${item.title}</h3>
            <p class="text-sm text-pink-100/80 leading-relaxed font-sans">${item.desc}</p>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // -------------------------------------------------------------
  // SPECIAL BIRTHDAY LETTER (INTERACTIVE ENVELOPE)
  // -------------------------------------------------------------
  bindLetterEvents() {
    const envelope = document.getElementById('digital-envelope');
    const openBtn = document.getElementById('btn-open-letter');
    const letterParchment = document.getElementById('letter-parchment-container');

    const openLetter = () => {
      if (envelope) envelope.classList.add('opened');
      this.letterOpened = true;

      window.confetti.burst({ count: 60, speed: 10 });
      window.confetti.showerHearts(25);

      setTimeout(() => {
        if (letterParchment) {
          letterParchment.classList.remove('hidden');
          letterParchment.scrollIntoView({ behavior: 'smooth' });
          this.playLetterTypewriter();
        }
      }, 500);
    };

    if (envelope) envelope.addEventListener('click', openLetter);
    if (openBtn) openBtn.addEventListener('click', openLetter);

    const editLetterBtn = document.getElementById('btn-quick-edit-letter');
    if (editLetterBtn) {
      editLetterBtn.onclick = () => {
        if (window.customizer) {
          window.customizer.open();
          const tabBtn = document.querySelector('[data-tab="tab-letter"]');
          if (tabBtn) tabBtn.click();
        }
      };
    }
  }

  renderLetter(letter) {
    const greetingEl = document.getElementById('letter-greeting-text');
    const bodyEl = document.getElementById('letter-body-container');
    const signoffEl = document.getElementById('letter-signoff-text');

    if (greetingEl) greetingEl.textContent = letter.greeting;

    if (bodyEl) {
      bodyEl.innerHTML = '';
      (letter.paragraphs || []).forEach(p => {
        const para = document.createElement('p');
        para.className = 'mb-4 leading-relaxed';
        para.textContent = p;
        bodyEl.appendChild(para);
      });
    }

    if (signoffEl) {
      signoffEl.innerHTML = (letter.signOff || '').replace(/\n/g, '<br>');
    }
  }

  playLetterTypewriter() {
    const bodyEl = document.getElementById('letter-body-container');
    if (!bodyEl) return;
    const paras = bodyEl.querySelectorAll('p');
    paras.forEach((p, idx) => {
      p.style.opacity = '0';
      p.style.transform = 'translateY(10px)';
      p.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      setTimeout(() => {
        p.style.opacity = '1';
        p.style.transform = 'translateY(0)';
      }, idx * 250);
    });
  }

  // -------------------------------------------------------------
  // BIRTHDAY WISHES RENDERING & HEART REACTIONS
  // -------------------------------------------------------------
  renderWishes(wishes) {
    const container = document.getElementById('wishes-cards-container');
    if (!container) return;

    container.innerHTML = '';
    wishes.forEach(wish => {
      const card = document.createElement('div');
      card.className = 'group p-6 rounded-3xl glass-panel-glow flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden';
      card.innerHTML = `
        <div>
          <div class="text-3xl mb-3 transform group-hover:scale-125 transition-transform duration-300">${wish.icon}</div>
          <h4 class="text-lg font-bold text-white font-serif mb-2">${wish.title}</h4>
          <p class="text-sm text-pink-100/80 leading-relaxed">${wish.text}</p>
        </div>

        <div class="mt-5 pt-3 border-t border-pink-500/15 flex items-center justify-between">
          <span class="text-xs text-pink-300/60">A wish from the heart</span>
          <button data-wish-like="${wish.id}" class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 hover:bg-pink-500/40 text-pink-200 text-xs font-semibold transition border border-pink-500/30">
            <span class="text-pink-400">❤️</span>
            <span class="like-count">${wish.likes || 42}</span>
          </button>
        </div>
      `;

      const likeBtn = card.querySelector(`[data-wish-like="${wish.id}"]`);
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newCount = window.store.incrementWishLike(wish.id);
        likeBtn.querySelector('.like-count').textContent = newCount;
        window.confetti.showerHearts(8);
      });

      container.appendChild(card);
    });
  }

  // -------------------------------------------------------------
  // HIDDEN SURPRISE UNLOCK SECTION
  // -------------------------------------------------------------
  bindSurpriseEvents() {
    const surpriseBox = document.getElementById('mystery-gift-box');
    const unlockBtn = document.getElementById('btn-unlock-surprise');
    const revealCard = document.getElementById('surprise-revealed-card');

    const unlock = () => {
      if (this.surpriseUnlocked) return;
      this.surpriseUnlocked = true;

      if (surpriseBox) surpriseBox.classList.add('opened');

      // Grand celebration fireworks explosion
      window.confetti.launchFirework();
      setTimeout(() => window.confetti.launchFirework(), 300);
      setTimeout(() => window.confetti.launchCannons(), 500);

      setTimeout(() => {
        if (revealCard) {
          revealCard.classList.remove('hidden');
          revealCard.scrollIntoView({ behavior: 'smooth' });
        }
      }, 600);
    };

    if (surpriseBox) surpriseBox.addEventListener('click', unlock);
    if (unlockBtn) unlockBtn.addEventListener('click', unlock);
  }

  // -------------------------------------------------------------
  // FINALE SCREEN (FIREWORKS & VIRTUAL HUGS)
  // -------------------------------------------------------------
  bindFinaleEvents() {
    const fireworksBtn = document.getElementById('btn-launch-fireworks');
    const hugBtn = document.getElementById('btn-send-virtual-hug');

    if (fireworksBtn) {
      fireworksBtn.addEventListener('click', () => {
        window.confetti.launchCannons();
        window.confetti.launchFirework();
        setTimeout(() => window.confetti.launchFirework(), 250);
        setTimeout(() => window.confetti.launchFirework(), 500);
      });
    }

    if (hugBtn) {
      hugBtn.addEventListener('click', () => {
        window.confetti.showerHearts(60);
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-24 left-1/2 -translate-x-1/2 z-[99999] px-6 py-3 rounded-full bg-pink-600 text-white font-semibold shadow-2xl backdrop-blur-md border border-pink-400 flex items-center gap-2 animate-bounce';
        toast.innerHTML = `<span>🫂 Massive Warm Hug Delivered to Bestie! ❤️</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
      });
    }
  }

  // -------------------------------------------------------------
  // VISUAL EFFECTS TOGGLES
  // -------------------------------------------------------------
  bindEffectToggles() {
    const toggleHearts = document.getElementById('toggle-floating-hearts');
    const togglePetals = document.getElementById('toggle-falling-petals');

    if (toggleHearts) {
      toggleHearts.addEventListener('click', () => {
        if (window.ambientParticles) {
          window.ambientParticles.enableHearts = !window.ambientParticles.enableHearts;
          toggleHearts.classList.toggle('active', window.ambientParticles.enableHearts);
        }
      });
    }

    if (togglePetals) {
      togglePetals.addEventListener('click', () => {
        if (window.ambientParticles) {
          window.ambientParticles.enablePetals = !window.ambientParticles.enablePetals;
          togglePetals.classList.toggle('active', window.ambientParticles.enablePetals);
        }
      });
    }
  }

  // -------------------------------------------------------------
  // SCROLL REVEAL ANIMATIONS
  // -------------------------------------------------------------
  bindScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-8');
      observer.observe(el);
    });
  }
}

// Start Birthday App when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.birthdayApp = new BirthdayApp();
});


