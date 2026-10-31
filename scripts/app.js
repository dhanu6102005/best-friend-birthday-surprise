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

