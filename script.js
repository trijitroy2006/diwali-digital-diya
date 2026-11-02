/* ==========================================================
   Diwali Digital Diya - Interactive Logic & Audio Engine
   Features:
   - Web Audio API Festive Ambient Sitar & Temple Bells synthesizer
   - Canvas Fireworks Particle Simulation Engine
   - Interactive SVG Diya lighting / blow toggle & tap celebration
   - URL Hash State (Custom recipient, message, sender)
   - Confetti & Cracker Sound Effects
   ========================================================== */

// --- Global State ---
let isDiyaLit = true;
let isAudioPlaying = false;
let audioCtx = null;
let bgMusicInterval = null;
let diyaCount = 108;

// --- Initialize Lucide Icons & Particles on Load ---
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  initStars();
  initFireworksCanvas();
  loadURLParams();
  setupDiyaInteraction();
  setupAudioButton();
});

// --- Dynamic Twinkling Stars Background ---
function initStars() {
  const container = document.getElementById('stars');
  const count = 55;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    const size = Math.random() * 2.5 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
    star.style.animationDelay = `${Math.random() * 4}s`;
    container.appendChild(star);
  }
}

// --- Interactive Diya Lamp ---
function setupDiyaInteraction() {
  const diya = document.getElementById('main-diya');
  const flame = document.getElementById('svg-flame');
  const halo = document.getElementById('diya-aura');
  const statusMsg = document.getElementById('diya-status-msg');
  const tally = document.getElementById('diyas-count');

  diya.addEventListener('click', () => {
    // Rekindle & celebration burst
    diyaCount++;
    tally.textContent = diyaCount.toLocaleString();

    // Trigger spark sound & chime
    playTone(523.25, 'sine', 0.8, 0.2); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.8, 0.25), 120); // E5
    setTimeout(() => playTone(783.99, 'sine', 1.0, 0.3), 240); // G5
    setTimeout(() => playTone(1046.50, 'sine', 1.2, 0.4), 360); // C6

    // Burst confetti from the Diya position
    triggerConfettiFromDiya();

    // Visual flame pop
    flame.classList.remove('unlit');
    flame.classList.add('lit');
    halo.style.opacity = '1';
    halo.style.transform = 'scale(1.4)';
    setTimeout(() => {
      halo.style.transform = 'scale(1)';
    }, 400);

    statusMsg.innerHTML = '✨ <em>Diya rekindled! Prayers, light & joy sent to the heavens!</em> ✨';
  });
}

function triggerConfettiFromDiya() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.52, x: 0.5 },
      colors: ['#FFD700', '#FF8F00', '#FF4500', '#E22B55', '#FFFFFF']
    });
  }
}

// --- Web Audio API: Procedural Festive Melody & Bells ---
// Pure zero-external-dependency sound synthesizer
function initAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type = 'sine', duration = 0.5, gainLevel = 0.15) {
  try {
    initAudioContext();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    // Envelope
    gainNode.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn('Audio not allowed yet:', e);
  }
}

// Traditional Raag Bhairav / Yaman inspired Indian Pentatonic Scale frequencies (Hz)
const festiveRagaScale = [
  261.63, // Sa (C4)
  293.66, // Re (D4)
  329.63, // Ga (E4)
  392.00, // Pa (G4)
  440.00, // Dha (A4)
  523.25, // Tar Sa (C5)
  587.33, // Tar Re (D5)
  659.25  // Tar Ga (E5)
];

function playFestiveMelodyStep() {
  if (!isAudioPlaying) return;
  const note = festiveRagaScale[Math.floor(Math.random() * festiveRagaScale.length)];
  const isBell = Math.random() > 0.6;
  if (isBell) {
    // Temple Bell Harmonic Sound
    playTone(note * 2, 'sine', 1.8, 0.12);
  } else {
    // Sitar pluck sound with overtone
    playTone(note, 'triangle', 0.9, 0.2);
    playTone(note * 1.5, 'sine', 0.4, 0.08);
  }
}

function setupAudioButton() {
  const btn = document.getElementById('toggle-audio-btn');
  const label = document.getElementById('audio-btn-label');
  const icon = document.getElementById('audio-icon');
  const audioTrack = document.getElementById('festive-audio-track');

  btn.addEventListener('click', () => {
    initAudioContext();
    isAudioPlaying = !isAudioPlaying;

    if (isAudioPlaying) {
      label.textContent = 'Festive Music: ON 🪔';
      icon.setAttribute('data-lucide', 'volume-2');

      // Play real recorded traditional Sitar audio track
      if (audioTrack) {
        audioTrack.volume = 0.65;
        audioTrack.play().catch(e => {
          console.warn('Real audio play blocked, falling back to Web Audio synth:', e);
          bgMusicInterval = setInterval(playFestiveMelodyStep, 650);
          playFestiveMelodyStep();
        });
      } else {
        bgMusicInterval = setInterval(playFestiveMelodyStep, 650);
        playFestiveMelodyStep();
      }
    } else {
      label.textContent = 'Festive Music: OFF';
      icon.setAttribute('data-lucide', 'volume-x');
      if (audioTrack) {
        audioTrack.pause();
      }
      if (bgMusicInterval) {
        clearInterval(bgMusicInterval);
      }
    }
    if (window.lucide) lucide.createIcons();
  });

  const fireworkHeaderBtn = document.getElementById('theme-firework-btn');
  if (fireworkHeaderBtn) {
    fireworkHeaderBtn.addEventListener('click', () => {
      triggerEffect('rocket');
    });
  }
}

// --- Fireworks Canvas Engine ---
let canvas, ctx, fireworks = [], particles = [];

function initFireworksCanvas() {
  canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  requestAnimationFrame(loopFireworks);

  // Auto shoot celebratory firework every few seconds
  setInterval(() => {
    if (Math.random() > 0.4) {
      launchAutoFirework();
    }
  }, 2200);
}

class Firework {
  constructor(sx, sy, tx, ty, color) {
    this.x = sx;
    this.y = sy;
    this.tx = tx;
    this.ty = ty;
    this.color = color || `hsl(${Math.random() * 60 + 20}, 100%, 60%)`;
    this.distanceToTarget = Math.hypot(tx - sx, ty - sy);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 4;
    this.acceleration = 1.05;
    this.brightness = Math.random() * 30 + 50;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.acceleration;

    const vx = Math.cos(this.angle) * this.speed;
    const vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = Math.hypot(this.x + vx - this.coordinates[this.coordinates.length - 1][0], this.y + vy - this.coordinates[this.coordinates.length - 1][1]) + this.distanceTraveled;

    if (this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.tx, this.ty, this.color);
      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 8 + 1;
    this.friction = 0.95;
    this.gravity = 0.8;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.012;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
      particles.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
}

function createParticles(x, y, color) {
  const count = 40;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color));
  }
}

function launchAutoFirework() {
  if (!canvas) return;
  const sx = Math.random() * canvas.width;
  const sy = canvas.height;
  const tx = Math.random() * (canvas.width * 0.8) + (canvas.width * 0.1);
  const ty = Math.random() * (canvas.height * 0.45) + 50;
  const hues = ['#FFD700', '#FF3E3E', '#FF007F', '#00F0FF', '#76FF03', '#FFA000'];
  const color = hues[Math.floor(Math.random() * hues.length)];
  fireworks.push(new Firework(sx, sy, tx, ty, color));
}

function loopFireworks() {
  requestAnimationFrame(loopFireworks);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';

  let i = fireworks.length;
  while (i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }

  let j = particles.length;
  while (j--) {
    particles[j].draw();
    particles[j].update(j);
  }
}

// --- Cracker Trigger Shelf Effects ---
function triggerEffect(type) {
  initAudioContext();
  switch (type) {
    case 'chakra':
      // Whistling spinning chakra sound
      playTone(600, 'sawtooth', 0.8, 0.15);
      setTimeout(() => playTone(800, 'sawtooth', 0.6, 0.12), 200);
      setTimeout(() => playTone(1100, 'sawtooth', 0.6, 0.1), 400);

      if (typeof confetti === 'function') {
        const end = Date.now() + 1000;
        (function frame() {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFD700', '#FF9900', '#FF0055']
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#00FFFF', '#FFD700', '#FF4081']
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      }
      break;

    case 'rocket':
      playTone(300, 'triangle', 0.5, 0.2);
      setTimeout(() => {
        playTone(180, 'square', 0.4, 0.3); // boom
      }, 500);

      // Launch 3 sky fireworks
      for (let k = 0; k < 3; k++) {
        setTimeout(launchAutoFirework, k * 200);
      }
      break;

    case 'sparkler':
      playTone(1200, 'sine', 0.3, 0.08);
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 100,
          origin: { y: 0.65 },
          colors: ['#FFFFFF', '#FFD700', '#FFE600']
        });
      }
      break;

    case 'blessing':
      playTone(523.25, 'sine', 1.0, 0.2);
      playTone(659.25, 'sine', 1.2, 0.18);
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 60,
          shapes: ['square'],
          spread: 120,
          origin: { y: 0.2 },
          colors: ['#FF69B4', '#FF1493', '#FFA07A', '#FFD700']
        });
      }
      break;
  }
}

// --- Preset Wishes ---
const presetTexts = {
  1: "May the gleaming light of diyas illuminate your path with supreme happiness, good health, and abundant peace this Diwali and all year through! 🌟🪔",
  2: "Wishing you soaring success, groundbreaking milestones, and limitless opportunities in all your endeavors! Have an auspicious and glorious Diwali! 🚀💼",
  3: "May your home be filled with warm laughter, delightful sweets, affectionate moments, and the loving blessings of Goddess Lakshmi and Lord Ganesha! 🌸✨"
};

function applyPreset(index) {
  const textarea = document.getElementById('input-message');
  if (textarea && presetTexts[index]) {
    textarea.value = presetTexts[index];
    playTone(700, 'sine', 0.2, 0.1);
  }
}

// --- Customizer & URL State Management ---
function updateGreeting() {
  const recipientInput = document.getElementById('input-recipient').value.trim();
  const senderInput = document.getElementById('input-sender').value.trim();
  const messageInput = document.getElementById('input-message').value.trim();

  if (recipientInput) {
    document.getElementById('display-recipient').textContent = recipientInput;
  }
  if (senderInput) {
    document.getElementById('display-sender').textContent = `— From ${senderInput}`;
  }
  if (messageInput) {
    document.getElementById('display-message').textContent = `"${messageInput}"`;
  }

  // Smooth scroll up to card
  document.getElementById('greeting-banner').scrollIntoView({ behavior: 'smooth' });

  // Celebration trigger
  triggerConfettiFromDiya();
  playTone(880, 'sine', 0.4, 0.2);

  // Update URL hash parameters
  updateURLHash(recipientInput, senderInput, messageInput);
}

function updateURLHash(to, from, msg) {
  const params = new URLSearchParams();
  if (to) params.set('to', to);
  if (from) params.set('from', from);
  if (msg) params.set('msg', msg);
  window.location.hash = params.toString();
}

function loadURLParams() {
  const hash = window.location.hash.substring(1);
  if (!hash) return;

  const params = new URLSearchParams(hash);
  const to = params.get('to');
  const from = params.get('from');
  const msg = params.get('msg');

  if (to) {
    document.getElementById('display-recipient').textContent = decodeURIComponent(to);
    document.getElementById('input-recipient').value = decodeURIComponent(to);
  }
  if (from) {
    document.getElementById('display-sender').textContent = `— From ${decodeURIComponent(from)}`;
    document.getElementById('input-sender').value = decodeURIComponent(from);
  }
  if (msg) {
    document.getElementById('display-message').textContent = `"${decodeURIComponent(msg)}"`;
    document.getElementById('input-message').value = decodeURIComponent(msg);
  }
}

function copyShareableLink() {
  updateGreeting();
  const shareURL = window.location.href;
  navigator.clipboard.writeText(shareURL).then(() => {
    const notify = document.getElementById('copy-notification');
    notify.style.display = 'block';
    setTimeout(() => {
      notify.style.display = 'none';
    }, 3500);
  });
}

function shareToWhatsApp() {
  updateGreeting();
  const to = document.getElementById('input-recipient').value || 'Dear friend';
  const from = document.getElementById('input-sender').value || 'Me';
  const shareURL = window.location.href;

  const message = `✨ *Happy Diwali!* ✨\n\n${to}, I have lighted a special Digital Diya for you! 🪔\n\nExperience the festive glow and greetings here:\n${shareURL}\n\n— With warm wishes from ${from} 💫`;
  const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
}
