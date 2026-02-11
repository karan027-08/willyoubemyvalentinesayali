/* ===================================
   Valentine's Day Website
   Production-ready vanilla JavaScript
   =================================== */

'use strict';

/* ===================================
   STATE MANAGER MODULE
   =================================== */

const StateManager = {
  config: {
    personalization: {
      lover_name: 'My Valentine',
      your_name: 'Me',
      special_place: 'our favorite spot',
      date: '2024-02-14',
      memory: 'that perfect day'
    },
    messages: {
      subhead: 'Because every day with you feels like February 14th',
      noButtonTeases: [
        'Are you sure? 🥺',
        'Think again... 💭',
        'Really? My heart... 💔',
        'One more chance? 🙏',
        'Please reconsider 😢',
        'You\'re breaking my heart 💔',
        'Don\'t do this to me 😭'
      ],
      yesMessages: {
        cute: [
          'You\'re my favorite notification 💕',
          'I love you more than {{your_name}} loves coffee ☕',
          'You make my heart go beep boop 🤖❤️',
          'You\'re the peanut butter to my jelly 🥜',
          'I\'m bananas for you! 🍌',
          'You\'re my sunshine on a cloudy day ☀️',
          'Together we\'re pawfect! 🐾'
        ],
        dramatic: [
          'This is the beginning of our forever ❤️',
          'I’ve planned everything… you just have to hold my hand and spend the day with me ❤️'
          // 'You\'ve turned my world from black and white to colours 🌈',
          // 'With you, I found my forever 💍',
          // 'You are my today and all of my tomorrows ⏳',
          // 'In your arms, I found my home 🏡'
        ],
        poetic: [
          'You are the reason I believe in serendipity ✨',
          'In your eyes, I found my home 🏡',
          'You turned my ordinary into extraordinary 🌟',
          'Like stars need darkness to shine, I need you to feel alive 🌌',
          'You are the verse in my favorite song 🎵',
          'With you, every moment becomes a memory worth keeping 📸',
          'You are the dream I never want to wake from 💭'
        ]
      }
    },
    photos: [
      { url: 'First Date.jpg', caption: 'Our first date at {{special_place}}', alt: 'Romantic couple moment' },
      { url: 'Sunset.jpg', caption: 'That sunset we\'ll never forget', alt: 'Beautiful sunset' },
      { url: 'Laugh.jpeg', caption: 'When {{lover_name}} made me laugh', alt: 'Happy couple laughing' },
      { url: 'beach.jpeg', caption: 'Perfect day at the beach', alt: 'Beach memories' },
      { url: 'Adventure.jpg', caption: 'Adventures with you', alt: 'Adventure together' },
      { url: 'moment.jpeg', caption: 'Every moment with {{your_name}}', alt: 'Romantic moment' }
    ],
    audio: {
      url: '',
      enabled: true,
      volume: 0.5
    },
    theme: {
      mode: 'dark',
      tone: 'dramatic'
    }
  },

  /**
   * Load configuration from localStorage
   */
  load() {
    try {
      const saved = localStorage.getItem('valentine-config');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.config = this.deepMerge(this.config, parsed);
      }
    } catch (error) {
      console.warn('Could not load saved configuration:', error);
    }
  },

  /**
   * Save configuration to localStorage
   */
  save() {
    try {
      localStorage.setItem('valentine-config', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Could not save configuration:', error);
    }
  },

  /**
   * Get nested property value
   * @param {string} path - Dot-notation path (e.g., 'personalization.lover_name')
   */
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  },

  /**
   * Set nested property value
   * @param {string} path - Dot-notation path
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, this.config);
    target[last] = value;
    this.save();
  },

  /**
   * Interpolate placeholders in text
   * @param {string} text - Text with {{placeholders}}
   * @returns {string} Interpolated text
   */
  interpolate(text) {
    if (!text) return '';
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return this.config.personalization[key] || match;
    });
  },

  /**
   * Deep merge objects
   */
  deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  },

  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
};


/* ===================================
   ANIMATION ENGINE MODULE
   =================================== */

const AnimationEngine = {
  canvas: null,
  ctx: null,
  particles: [],
  animationFrame: null,

  /**
   * Initialize canvas and start background particles
   */
  init() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();

    window.addEventListener('resize', () => this.resizeCanvas());
    this.startBackgroundParticles();
    this.updateParticles();
  },

  /**
   * Resize canvas to window size
   */
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  /**
   * Create a particle object
   */
  createParticle(x, y, type = 'heart') {
    return {
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * -3 - 1,
      life: 1,
      decay: Math.random() * 0.01 + 0.005,
      size: Math.random() * 20 + 10,
      type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    };
  },

  /**
   * Update and render all particles
   */
  updateParticles() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => {
      // Update physics
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // gravity
      p.life -= p.decay;
      p.rotation += p.rotationSpeed;

      if (p.life > 0) {
        this.drawParticle(p);
        return true;
      }
      return false;
    });

    this.animationFrame = requestAnimationFrame(() => this.updateParticles());
  },

  /**
   * Draw a single particle
   */
  drawParticle(p) {
    this.ctx.save();
    this.ctx.globalAlpha = p.life;
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);

    if (p.type === 'heart') {
      this.ctx.fillStyle = '#ff2d55';
      this.ctx.font = `${p.size}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('❤️', 0, 0);
    } else if (p.type === 'confetti') {
      const colors = ['#ff2d55', '#e63946', '#ffd700', '#ff69b4'];
      this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    }

    this.ctx.restore();
  },

  /**
   * Trigger confetti burst animation
   */
  triggerConfetti() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 100; i++) {
      const angle = (Math.PI * 2 * i) / 100;
      const velocity = Math.random() * 5 + 3;

      const particle = this.createParticle(centerX, centerY, i % 2 === 0 ? 'confetti' : 'heart');
      particle.vx = Math.cos(angle) * velocity;
      particle.vy = Math.sin(angle) * velocity;

      this.particles.push(particle);
    }
  },

  /**
   * Start generating background particles
   */
  startBackgroundParticles() {
    setInterval(() => {
      if (this.particles.length < 20) {
        const x = Math.random() * window.innerWidth;
        const y = window.innerHeight + 20;
        const particle = this.createParticle(x, y, 'heart');
        particle.vy = Math.random() * -2 - 0.5;
        particle.vx = (Math.random() - 0.5) * 0.5;
        this.particles.push(particle);
      }
    }, 2000);
  },

  /**
   * Animate letter-by-letter reveal
   */
  animateLetterReveal(element) {
    const text = element.textContent;
    const heartIcon = element.querySelector('.heart-icon');
    const heartHTML = heartIcon ? heartIcon.outerHTML : '';

    // Remove heart icon temporarily
    const textOnly = text.replace(heartHTML, '').trim();
    element.textContent = '';
    element.style.opacity = '1';

    const chars = [...textOnly];
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.animation = `letterReveal 0.5s ${i * 0.05}s forwards`;
      element.appendChild(span);
    });

    // Re-add heart icon
    if (heartIcon) {
      setTimeout(() => {
        element.innerHTML += ' ' + heartHTML;
      }, chars.length * 50);
    }
  }
};


/* ===================================
   NO BUTTON CONTROLLER MODULE
   =================================== */

const NoButtonController = {
  attempts: 0,
  button: null,

  /**
   * Initialize NO button behavior
   */
  init(button) {
    this.button = button;
    this.button.addEventListener('mouseenter', (e) => this.handleHover(e));
    this.button.addEventListener('click', (e) => this.handleClick(e));
    this.button.addEventListener('touchstart', (e) => this.handleClick(e));
    this.button.addEventListener('keydown', (e) => this.handleKeyboard(e));
  },

  /**
   * Handle mouse hover
   */
  handleHover(event) {
    this.moveButton();
    this.attempts++;
    this.updateButtonText();
    this.checkMilestones();
  },

  /**
   * Handle click attempt
   */
  handleClick(event) {
    event.preventDefault();
    this.handleHover(event);
  },

  /**
   * Handle keyboard interaction (accessibility)
   */
  handleKeyboard(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.showConfirmModal();
    }
  },

  /**
   * Move button to random position
   */
  moveButton() {
    const maxX = window.innerWidth - this.button.offsetWidth - 40;
    const maxY = window.innerHeight - this.button.offsetHeight - 40;

    const newX = Math.max(20, Math.random() * maxX);
    const newY = Math.max(20, Math.random() * maxY);

    this.button.style.position = 'fixed';
    this.button.style.left = `${newX}px`;
    this.button.style.top = `${newY}px`;
    this.button.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  },

  /**
   * Update button text with tease message
   */
  updateButtonText() {
    const teases = StateManager.get('messages.noButtonTeases');
    this.button.textContent = teases[this.attempts % teases.length];
  },

  /**
   * Check for milestone events
   */
  checkMilestones() {
    if (this.attempts === 4) {
      this.showTooltip('Think twice ♥');
    } else if (this.attempts === 8) {
      this.showTooltip('Still no? 💔');
    } else if (this.attempts === 12) {
      this.showTooltip('I\'ll wait forever... ⏳');
    } else if (this.attempts === 16) {
      this.showTooltip('Please? 🥺');
    }
    // Button keeps looping forever - never disappears!
  },

  /**
   * Show tooltip near button
   */
  showTooltip(message) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip glass-card';
    tooltip.textContent = message;
    tooltip.style.position = 'fixed';
    tooltip.style.left = `${this.button.offsetLeft}px`;
    tooltip.style.top = `${this.button.offsetTop - 60}px`;
    tooltip.style.padding = '0.5rem 1rem';
    tooltip.style.fontSize = '0.9rem';
    tooltip.style.zIndex = '1000';
    tooltip.style.animation = 'fadeIn 0.3s ease-out';

    document.body.appendChild(tooltip);

    setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 300);
    }, 2500);
  },

  /**
   * Show confirmation modal for keyboard users
   */
  showConfirmModal() {
    const modal = document.createElement('dialog');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="glass-card" style="padding: 2rem; text-align: center;">
        <p style="font-size: 1.3rem; margin-bottom: 1.5rem;">Are you really sure? 🥺</p>
        <div class="button-group">
          <button id="modal-no" class="btn btn-primary">Wait, let me reconsider</button>
          <button id="modal-yes" class="btn btn-secondary">Yes, I'm sure</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    modal.showModal();

    modal.querySelector('#modal-no').addEventListener('click', () => {
      modal.close();
      modal.remove();
    });

    modal.querySelector('#modal-yes').addEventListener('click', () => {
      modal.close();
      modal.remove();
      // Just keep the button moving, don't make it disappear
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.close();
        modal.remove();
      }
    });
  }
};


/* ===================================
   AUDIO MANAGER MODULE
   =================================== */

const AudioManager = {
  audio: null,
  playPauseBtn: null,
  volumeSlider: null,

  /**
   * Initialize audio player
   */
  init() {
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.volume = StateManager.get('audio.volume');

    const url = StateManager.get('audio.url');
    if (url) {
      this.audio.src = url;
    }

    this.playPauseBtn = document.getElementById('play-pause');
    this.volumeSlider = document.getElementById('volume');

    if (this.playPauseBtn && this.volumeSlider) {
      this.bindControls();
    }

    // Only attempt autoplay if audio URL is set
    if (url && StateManager.get('audio.enabled')) {
      this.attemptAutoplay();
    }
  },

  /**
   * Bind audio control events
   */
  bindControls() {
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));

    this.audio.addEventListener('play', () => {
      this.playPauseBtn.innerHTML = '<span>⏸️</span>';
      this.playPauseBtn.setAttribute('aria-label', 'Pause');
    });

    this.audio.addEventListener('pause', () => {
      this.playPauseBtn.innerHTML = '<span>▶️</span>';
      this.playPauseBtn.setAttribute('aria-label', 'Play');
    });

    this.audio.addEventListener('error', (e) => {
      console.warn('Audio error:', e);
      document.getElementById('audio-player').style.display = 'none';
    });
  },

  /**
   * Attempt autoplay with fallback
   */
  async attemptAutoplay() {
    try {
      this.audio.muted = true;
      await this.audio.play();
      this.showUnmutePrompt();
    } catch (error) {
      console.log('Autoplay blocked, waiting for user interaction');
    }
  },

  /**
   * Show unmute permission prompt
   */
  showUnmutePrompt() {
    const prompt = document.getElementById('unmute-prompt');
    if (!prompt) return;

    prompt.style.display = 'block';

    document.getElementById('unmute-yes').addEventListener('click', () => {
      this.audio.muted = false;
      prompt.style.display = 'none';
    });

    document.getElementById('unmute-no').addEventListener('click', () => {
      this.audio.pause();
      prompt.style.display = 'none';
    });
  },

  /**
   * Toggle play/pause
   */
  togglePlayPause() {
    if (this.audio.paused) {
      this.audio.play().catch(err => console.warn('Play failed:', err));
    } else {
      this.audio.pause();
    }
  },

  /**
   * Set volume
   */
  setVolume(value) {
    this.audio.volume = value;
    StateManager.set('audio.volume', value);
  },

  /**
   * Update audio source
   */
  updateSource(url) {
    this.audio.src = url;
    StateManager.set('audio.url', url);
  }
};


/* ===================================
   LIGHTBOX MODULE
   =================================== */

const Lightbox = {
  currentIndex: 0,
  photos: [],
  element: null,
  image: null,
  caption: null,

  /**
   * Initialize lightbox
   */
  init() {
    this.element = document.getElementById('lightbox');
    this.image = document.getElementById('lightbox-image');
    this.caption = document.getElementById('lightbox-caption');

    document.getElementById('lightbox-close').addEventListener('click', () => this.close());
    document.getElementById('lightbox-prev').addEventListener('click', () => this.prev());
    document.getElementById('lightbox-next').addEventListener('click', () => this.next());

    // Close on backdrop click
    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) {
        this.close();
      }
    });

    // Keyboard navigation
    this.bindKeyboard();
  },

  /**
   * Open lightbox with photo at index
   */
  open(index) {
    this.currentIndex = index;
    this.photos = StateManager.get('photos');

    if (!this.photos || this.photos.length === 0) return;

    this.updateImage();
    this.element.classList.add('active');
    this.element.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus first focusable element
    document.getElementById('lightbox-close').focus();
  },

  /**
   * Close lightbox
   */
  close() {
    this.element.classList.remove('active');
    this.element.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  },

  /**
   * Show next photo
   */
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.updateImage();
  },

  /**
   * Show previous photo
   */
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.updateImage();
  },

  /**
   * Update displayed image
   */
  updateImage() {
    const photo = this.photos[this.currentIndex];

    this.image.style.opacity = '0';

    setTimeout(() => {
      this.image.src = photo.url;
      this.image.alt = photo.alt || photo.caption;
      this.caption.textContent = StateManager.interpolate(photo.caption);
      this.image.style.opacity = '1';
    }, 200);

    // Handle image load error
    this.image.onerror = () => {
      this.image.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23333" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="%23999" font-size="20">Image not found</text></svg>';
    };
  },

  /**
   * Bind keyboard controls
   */
  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (!this.element.classList.contains('active')) return;

      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });
  }
};


/* ===================================
   SETTINGS MANAGER MODULE
   =================================== */

const SettingsManager = {
  modal: null,
  form: null,

  /**
   * Initialize settings modal
   */
  init() {
    this.modal = document.getElementById('settings-modal');
    this.form = document.getElementById('settings-form');

    // Settings button removed from UI, but keep modal functionality for future use
    // document.getElementById('settings-btn').addEventListener('click', () => this.open());
    document.getElementById('close-settings').addEventListener('click', () => this.close());

    this.form.addEventListener('submit', (e) => this.save(e));
    document.getElementById('add-photo').addEventListener('click', () => this.addPhoto());

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  },

  /**
   * Open settings modal
   */
  open() {
    this.populateForm();
    this.modal.showModal();
  },

  /**
   * Close settings modal
   */
  close() {
    this.modal.close();
  },

  /**
   * Populate form with current settings
   */
  populateForm() {
    const config = StateManager.config;

    // Personalization
    document.getElementById('lover_name').value = config.personalization.lover_name;
    document.getElementById('your_name').value = config.personalization.your_name;
    document.getElementById('special_place').value = config.personalization.special_place;
    document.getElementById('date').value = config.personalization.date;
    document.getElementById('memory').value = config.personalization.memory;

    // Messages
    document.getElementById('subhead').value = config.messages.subhead;
    document.getElementById('theme_tone').value = config.theme.tone;

    // Audio
    document.getElementById('audio-enabled').checked = config.audio.enabled;

    // Photos
    this.renderPhotoList();
  },

  /**
   * Save form data
   */
  save(event) {
    event.preventDefault();

    // Update personalization
    StateManager.set('personalization.lover_name', Validator.sanitizeHTML(document.getElementById('lover_name').value));
    StateManager.set('personalization.your_name', Validator.sanitizeHTML(document.getElementById('your_name').value));
    StateManager.set('personalization.special_place', Validator.sanitizeHTML(document.getElementById('special_place').value));
    StateManager.set('personalization.date', document.getElementById('date').value);
    StateManager.set('personalization.memory', Validator.sanitizeHTML(document.getElementById('memory').value));

    // Update messages
    StateManager.set('messages.subhead', Validator.sanitizeHTML(document.getElementById('subhead').value));
    StateManager.set('theme.tone', document.getElementById('theme_tone').value);

    // Update audio
    StateManager.set('audio.enabled', document.getElementById('audio-enabled').checked);

    // Update UI
    UIController.updateContent();

    this.close();
  },

  /**
   * Render photo list
   */
  renderPhotoList() {
    const container = document.getElementById('photo-uploader');
    const photos = StateManager.get('photos');

    container.innerHTML = photos.map((photo, index) => `
      <div class="photo-item">
        <img src="${photo.url}" alt="${photo.caption}" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'60\\' height=\\'60\\'><rect fill=\\'%23333\\' width=\\'60\\' height=\\'60\\'/></svg>'">
        <input type="text" value="${photo.caption}" data-index="${index}" placeholder="Caption" class="photo-caption-input">
        <button type="button" class="remove-photo" data-index="${index}">Remove</button>
      </div>
    `).join('');

    // Bind caption update events
    container.querySelectorAll('.photo-caption-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        const photos = StateManager.get('photos');
        photos[index].caption = Validator.sanitizeHTML(e.target.value);
        StateManager.set('photos', photos);
      });
    });

    // Bind remove events
    container.querySelectorAll('.remove-photo').forEach(btn => {
      btn.addEventListener('click', (e) => this.removePhoto(parseInt(e.target.dataset.index)));
    });
  },

  /**
   * Add new photo
   */
  addPhoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        Validator.validatePhotoUpload(file);
        const url = await this.uploadPhoto(file);
        const photos = StateManager.get('photos');
        photos.push({
          url,
          caption: 'New memory',
          alt: 'Uploaded photo',
          date: new Date().toISOString()
        });
        StateManager.set('photos', photos);
        this.renderPhotoList();
      } catch (error) {
        alert(error.message);
      }
    };

    input.click();
  },

  /**
   * Remove photo at index
   */
  removePhoto(index) {
    const photos = StateManager.get('photos');
    photos.splice(index, 1);
    StateManager.set('photos', photos);
    this.renderPhotoList();
  },

  /**
   * Upload photo (convert to base64)
   */
  async uploadPhoto(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
};


/* ===================================
   E-CARD GENERATOR MODULE
   =================================== */

const ECardGenerator = {
  /**
   * Generate and download e-card
   */
  async generate() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(1, '#1a0e1e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add selected photo if available
    const photos = StateManager.get('photos');
    if (photos && photos.length > 0) {
      try {
        const img = await this.loadImage(photos[0].url);
        const aspectRatio = img.width / img.height;
        const targetHeight = 400;
        const targetWidth = targetHeight * aspectRatio;
        const x = (canvas.width - targetWidth) / 2;
        ctx.drawImage(img, x, 50, targetWidth, targetHeight);
      } catch (error) {
        console.warn('Could not load image for e-card:', error);
      }
    }

    // Add decorative hearts
    ctx.font = '40px Arial';
    ctx.fillText('❤️', 100, 100);
    ctx.fillText('❤️', canvas.width - 150, 100);
    ctx.fillText('💕', 150, canvas.height - 80);
    ctx.fillText('💕', canvas.width - 200, canvas.height - 80);

    // Add main message
    ctx.fillStyle = '#ff2d55';
    ctx.font = 'bold 48px Playfair Display, serif';
    ctx.textAlign = 'center';

    const tone = StateManager.get('theme.tone');
    const messages = StateManager.get(`messages.yesMessages.${tone}`);
    const message = messages[0];
    const interpolated = StateManager.interpolate(message);

    this.wrapText(ctx, interpolated, canvas.width / 2, 500, canvas.width - 200, 60);

    // Add date
    ctx.fillStyle = '#f8f8f8';
    ctx.font = '24px Inter, sans-serif';
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillText(date, canvas.width / 2, 590);

    // Convert to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `valentine-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  },

  /**
   * Load image from URL
   */
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  },

  /**
   * Wrap text to fit width
   */
  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Center vertically
    const startY = y - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, i) => {
      ctx.fillText(line, x, startY + (i * lineHeight));
    });
  }
};


/* ===================================
   VALIDATOR MODULE
   =================================== */

const Validator = {
  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Validate URL
   */
  validateURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate date string
   */
  validateDate(dateStr) {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
  },

  /**
   * Validate photo upload
   */
  validatePhotoUpload(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, GIF, or WebP.');
    }

    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }

    return true;
  },

  /**
   * Validate audio upload
   */
  validateAudioUpload(file) {
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid audio format. Please upload MP3, WAV, or OGG.');
    }

    if (file.size > maxSize) {
      throw new Error('Audio file too large. Maximum size is 10MB.');
    }

    return true;
  }
};


/* ===================================
   UI CONTROLLER MODULE
   =================================== */

const UIController = {
  elements: {},

  /**
   * Initialize UI controller
   */
  init() {
    this.cacheElements();
    this.bindEvents();
    this.updateContent();
    this.initAnimations();
  },

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      landing: document.getElementById('landing'),
      success: document.getElementById('success'),
      yesBtn: document.getElementById('yes-btn'),
      noBtn: document.getElementById('no-btn'),
      themeToggle: document.getElementById('theme-toggle'),
      photoGallery: document.getElementById('photo-gallery'),
      heroSubtitle: document.querySelector('.hero-subtitle'),
      successTitle: document.querySelector('.success-title'),
      messages: document.querySelectorAll('.message')
    };
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    this.elements.yesBtn.addEventListener('click', () => this.handleYesClick());
    this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Initialize NO button controller
    NoButtonController.init(this.elements.noBtn);
  },

  /**
   * Handle YES button click
   */
  handleYesClick() {
    // Animate button
    this.elements.yesBtn.style.transform = 'scale(1.2)';
    this.elements.yesBtn.style.opacity = '0';

    // Transition to success screen
    setTimeout(() => {
      this.transitionToSuccess();
    }, 500);
  },

  /**
   * Transition to success screen
   */
  transitionToSuccess() {
    this.elements.landing.classList.remove('active');
    this.elements.success.classList.add('active');

    // Reveal messages with delays
    this.revealSuccessMessages();

    // Render photo gallery
    this.renderPhotoGallery();
  },

  /**
   * Reveal success messages with timing
   */
  revealSuccessMessages() {
    const tone = StateManager.get('theme.tone');
    const messages = StateManager.get(`messages.yesMessages.${tone}`);

    this.elements.messages.forEach((msgElement, index) => {
      const delay = parseInt(msgElement.dataset.delay) || 0;

      setTimeout(() => {
        if (messages[index]) {
          msgElement.textContent = StateManager.interpolate(messages[index]);
          msgElement.style.animationDelay = '0s';
        }
      }, delay);
    });
  },

  /**
   * Render photo gallery
   */
  renderPhotoGallery() {
    const photos = StateManager.get('photos');

    this.elements.photoGallery.innerHTML = photos.map((photo, index) => `
      <div class="photo-item" data-index="${index}" role="button" tabindex="0" aria-label="View photo: ${photo.caption}">
        <img src="${photo.url}" alt="${photo.alt || photo.caption}" loading="lazy">
        <div class="photo-caption">${StateManager.interpolate(photo.caption)}</div>
      </div>
    `).join('');

    // Bind click events
    this.elements.photoGallery.querySelectorAll('.photo-item').forEach(item => {
      const index = parseInt(item.dataset.index);

      item.addEventListener('click', () => Lightbox.open(index));

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          Lightbox.open(index);
        }
      });
    });

    // Handle image errors
    this.elements.photoGallery.querySelectorAll('img').forEach(img => {
      img.onerror = () => {
        img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect fill="%23333" width="400" height="300"/><text x="50%" y="50%" text-anchor="middle" fill="%23999" font-size="16">Image not found</text></svg>';
      };
    });
  },

  /**
   * Update dynamic content
   */
  updateContent() {
    // Update hero subtitle
    const subhead = StateManager.get('messages.subhead');
    this.elements.heroSubtitle.textContent = StateManager.interpolate(subhead);

    // Re-render photo gallery if on success screen
    if (this.elements.success.classList.contains('active')) {
      this.renderPhotoGallery();
    }
  },

  /**
   * Toggle theme
   */
  toggleTheme() {
    const currentTheme = StateManager.get('theme.mode');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    StateManager.set('theme.mode', newTheme);

    // Update icon
    const icon = this.elements.themeToggle.querySelector('.theme-icon');
    icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
  },

  /**
   * Initialize animations
   */
  initAnimations() {
    // Animate hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      setTimeout(() => {
        AnimationEngine.animateLetterReveal(heroTitle);
      }, 300);
    }
  }
};


/* ===================================
   ERROR HANDLER & FEATURE DETECTION
   =================================== */

const ErrorHandler = {
  /**
   * Initialize error handling and feature detection
   */
  init() {
    const support = this.checkFeatureSupport();

    if (!support.localStorage) {
      console.warn('localStorage not available, settings will not persist');
      StateManager.save = () => { }; // No-op
    }

    if (!support.canvas) {
      console.warn('Canvas not supported, disabling particle effects');
      AnimationEngine.init = () => { }; // No-op
    }

    if (!support.backdropFilter) {
      document.body.classList.add('no-backdrop-filter');
    }

    if (!support.dialog) {
      this.polyfillDialog();
    }

    // Global error handler
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
    });
  },

  /**
   * Check browser feature support
   */
  checkFeatureSupport() {
    return {
      localStorage: this.hasLocalStorage(),
      canvas: this.hasCanvas(),
      audio: this.hasAudio(),
      backdropFilter: this.hasBackdropFilter(),
      dialog: this.hasDialog()
    };
  },

  hasLocalStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  },

  hasCanvas() {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext && canvas.getContext('2d'));
  },

  hasAudio() {
    return !!document.createElement('audio').canPlayType;
  },

  hasBackdropFilter() {
    return CSS.supports('backdrop-filter', 'blur(10px)') ||
      CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
  },

  hasDialog() {
    return typeof HTMLDialogElement === 'function';
  },

  /**
   * Simple dialog polyfill
   */
  polyfillDialog() {
    if (!HTMLDialogElement) {
      HTMLElement.prototype.showModal = function () {
        this.style.display = 'flex';
        this.setAttribute('open', '');
      };

      HTMLElement.prototype.close = function () {
        this.style.display = 'none';
        this.removeAttribute('open');
      };
    }
  }
};

/* ===================================
   MAIN INITIALIZATION
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('💕 Initializing Valentine website...');

  // Initialize modules in order
  ErrorHandler.init();
  StateManager.load();

  // Apply saved theme
  const savedTheme = StateManager.get('theme.mode');
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Update theme icon
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
  }

  // Initialize all modules
  AnimationEngine.init();
  UIController.init();
  AudioManager.init();
  Lightbox.init();
  SettingsManager.init();

  console.log('💕 Valentine website loaded successfully!');
});

// Handle audio file upload
document.addEventListener('DOMContentLoaded', () => {
  const musicUpload = document.getElementById('music-upload');
  if (musicUpload) {
    musicUpload.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        Validator.validateAudioUpload(file);

        // Convert to data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target.result;
          AudioManager.updateSource(url);
          alert('Audio uploaded successfully! It will play on the success screen.');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        alert(error.message);
      }
    });
  }
});

