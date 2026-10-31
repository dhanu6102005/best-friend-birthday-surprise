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

