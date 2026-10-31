/**
 * DataStore: Central State Management with LocalStorage and IndexedDB Persistence
 * Handles photos, captions, letter content, music settings, timeline, and wishes.
 */

const DEFAULT_DATA = {
  bestieName: "My Dearest Bestie",
  nickname: "Favorite Human ❤️",
  birthdayDate: "2026-11-14",
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
    this.STORAGE_KEY = 'birthday_surprise_data_v2';
    this.data = this.loadData();
    this.listeners = [];
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deep merge with defaults to avoid missing keys
        return {
          ...DEFAULT_DATA,
          ...parsed,
          photos: parsed.photos || DEFAULT_DATA.photos,
          journey: parsed.journey || DEFAULT_DATA.journey,
          wishes: parsed.wishes || DEFAULT_DATA.wishes,
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
