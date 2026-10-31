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

