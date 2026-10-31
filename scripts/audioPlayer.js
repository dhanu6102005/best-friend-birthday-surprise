/**
 * High-fidelity Background Music Player & Audio Engine
 * Supports custom MP3 upload (persisted in IndexedDB), playback controls,
 * progress scrubbing, volume/mute, and a built-in gentle Web Audio piano lullaby fallback!
 */

class BirthdayAudioEngine {
  constructor() {
    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.isPlaying = false;
    this.volume = 0.65;
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
    this.audioElement.src = this.defaultAudioUrl;
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

      // If user uploaded a custom audio file or valid source
      if (this.audioElement.src && this.audioElement.src !== '' && !this.audioElement.src.endsWith('#')) {
        await this.audioElement.play();
      } else {
        // Fall back to built-in soothing Web Audio melody
        this.startSynthMelody();
      }
    } catch (err) {
      console.warn("Audio autoplay blocked or failed, waiting for user gesture:", err);
      // Fall back to synth
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

