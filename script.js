/* ==========================================================
   Diwali Digital Diya - Interactive Engine v2.0
   Features:
   - Sitar Audio + Web Audio Procedural Synth
   - Fireworks Engine + Floating Sky Lanterns & Falling Petals
   - 5-Diyas (Panch Deepak) Interactive Lighting Row
   - 8-Fold Symmetric Rangoli Drawing Studio Canvas
   - 4 Royal Color Themes (Crimson, Midnight, Gold, Emerald)
   - Greeting Card Image Download (Canvas Exporter)
   - Temple Bell Harmonics
   ========================================================== */

let isAudioPlaying = false;
let audioCtx = null;
let bgMusicInterval = null;
let diyaCount = 108;

// --- DOM Loaded Setup ---
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  initStars();
  initFireworksCanvas();
  initAmbientEffectsCanvas();
  initRangoliDrawingCanvas();
  setupThemeSwitcher();
  setupDiyaInteraction();
  setupAudioButton();
  loadURLParams();
});

// --- Dynamic Twinkling Stars Background ---
function initStars() {
  const container = document.getElementById('stars');
  if (!container) return;
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

// --- OPTION: 4 Festive Color Themes ---
function setupThemeSwitcher() {
  const buttons = document.querySelectorAll('.theme-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.getAttribute('data-theme');
      document.body.className = `theme-${theme}`;
      playTone(650, 'sine', 0.2, 0.1);
    });
  });
}

// --- OPTION: Sacred Central Diya ---
function setupDiyaInteraction() {
  const diya = document.getElementById('main-diya');
  const flame = document.getElementById('svg-flame');
  const halo = document.getElementById('diya-aura');
  const statusMsg = document.getElementById('diya-status-msg');
  const tally = document.getElementById('diyas-count');

  if (!diya) return;

  diya.addEventListener('click', () => {
    diyaCount++;
    tally.textContent = diyaCount.toLocaleString();

    // Sacred chime chords
    playTone(523.25, 'sine', 0.8, 0.2); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.8, 0.25), 120); // E5
    setTimeout(() => playTone(783.99, 'sine', 1.0, 0.3), 240); // G5
    setTimeout(() => playTone(1046.50, 'sine', 1.2, 0.4), 360); // C6

    triggerConfettiFromDiya();

    flame.classList.remove('unlit');
    flame.classList.add('lit');
    halo.style.opacity = '1';
    halo.style.transform = 'scale(1.4)';
    setTimeout(() => {
      halo.style.transform = 'scale(1)';
    }, 400);

    statusMsg.innerHTML = '✨ <em>Diya rekindled! Prayers, light & joy sent to the universe!</em> ✨';
  });
}

function triggerConfettiFromDiya() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.52, x: 0.5 },
      colors: ['#FFD700', '#FF8F00', '#FF4500', '#E22B55', '#FFFFFF']
    });
  }
}

// --- OPTION: Sacred 5-Diyas (Panch Deepak) Lighting ---
function toggleMiniDiya(num) {
  const unit = document.getElementById(`mini-diya-${num}`);
  if (!unit) return;
  unit.classList.toggle('lit');

  const freqs = [392, 440, 523, 587, 659];
  playTone(freqs[num - 1] || 523, 'sine', 0.6, 0.2);

  if (unit.classList.contains('lit')) {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.65, x: 0.2 + num * 0.1 }
      });
    }
  }
}

function lightAllMiniDiyas() {
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
      const unit = document.getElementById(`mini-diya-${i}`);
      if (unit && !unit.classList.contains('lit')) {
        unit.classList.add('lit');
      }
      playTone(400 + i * 80, 'sine', 0.5, 0.18);
    }, i * 150);
  }
  setTimeout(() => triggerEffect('blessing'), 800);
}

function resetMiniDiyas() {
  for (let i = 1; i <= 5; i++) {
    const unit = document.getElementById(`mini-diya-${i}`);
    if (unit) unit.classList.remove('lit');
  }
  playTone(250, 'sine', 0.3, 0.1);
}

// --- Web Audio Synthesizer & Sitar Controls ---
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

    gainNode.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn('Audio blocked:', e);
  }
}

function playTempleBells() {
  initAudioContext();
  // Deep resonance bell (Gong/Temple Ghanti)
  playTone(440, 'sine', 3.0, 0.3);
  playTone(880, 'sine', 2.0, 0.15);
  playTone(1320, 'sine', 1.5, 0.1);
  setTimeout(() => {
    playTone(523.25, 'sine', 2.5, 0.25);
    playTone(1046.5, 'sine', 1.8, 0.12);
  }, 250);
}

const festiveRagaScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

function playFestiveMelodyStep() {
  if (!isAudioPlaying) return;
  const note = festiveRagaScale[Math.floor(Math.random() * festiveRagaScale.length)];
  if (Math.random() > 0.6) {
    playTone(note * 2, 'sine', 1.8, 0.12);
  } else {
    playTone(note, 'triangle', 0.9, 0.2);
    playTone(note * 1.5, 'sine', 0.4, 0.08);
  }
}

function setupAudioButton() {
  const btn = document.getElementById('toggle-audio-btn');
  const label = document.getElementById('audio-btn-label');
  const icon = document.getElementById('audio-icon');
  const audioTrack = document.getElementById('festive-audio-track');

  if (!btn) return;

  btn.addEventListener('click', () => {
    initAudioContext();
    isAudioPlaying = !isAudioPlaying;

    if (isAudioPlaying) {
      label.textContent = 'Music: ON 🪔';
      icon.setAttribute('data-lucide', 'volume-2');

      if (audioTrack) {
        audioTrack.volume = 0.65;
        audioTrack.play().catch(e => {
          console.warn('Fallback to procedural synth:', e);
          bgMusicInterval = setInterval(playFestiveMelodyStep, 650);
          playFestiveMelodyStep();
        });
      } else {
        bgMusicInterval = setInterval(playFestiveMelodyStep, 650);
        playFestiveMelodyStep();
      }
    } else {
      label.textContent = 'Music: OFF';
      icon.setAttribute('data-lucide', 'volume-x');
      if (audioTrack) audioTrack.pause();
      if (bgMusicInterval) clearInterval(bgMusicInterval);
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

// --- OPTION: Sky Fireworks Particle Canvas Engine ---
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

  setInterval(() => {
    if (Math.random() > 0.4) launchAutoFirework();
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

// --- OPTION: Ambient Floating Petals & Sky Lanterns Canvas ---
let ambientCanvas, ambientCtx, ambientItems = [];

function initAmbientEffectsCanvas() {
  ambientCanvas = document.getElementById('ambient-effects-canvas');
  if (!ambientCanvas) return;
  ambientCtx = ambientCanvas.getContext('2d');

  function resize() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  requestAnimationFrame(loopAmbientEffects);
}

function spawnSkyLantern() {
  if (!ambientCanvas) return;
  ambientItems.push({
    type: 'lantern',
    x: Math.random() * ambientCanvas.width,
    y: ambientCanvas.height + 40,
    speedY: Math.random() * 1.5 + 0.8,
    speedX: Math.sin(Math.random() * 2) * 0.5,
    size: Math.random() * 15 + 20,
    alpha: 1
  });
}

function spawnFlowerShower() {
  if (!ambientCanvas) return;
  for (let i = 0; i < 40; i++) {
    ambientItems.push({
      type: 'petal',
      x: Math.random() * ambientCanvas.width,
      y: -20,
      speedY: Math.random() * 2 + 1.2,
      speedX: Math.sin(Math.random() * 4) * 1.2,
      rotation: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.05,
      color: ['#FF1493', '#FF69B4', '#FFA07A', '#FFD700'][Math.floor(Math.random() * 4)],
      size: Math.random() * 6 + 6,
      alpha: 1
    });
  }
}

function loopAmbientEffects() {
  requestAnimationFrame(loopAmbientEffects);
  if (!ambientCanvas || !ambientCtx) return;

  ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

  for (let i = ambientItems.length - 1; i >= 0; i--) {
    const item = ambientItems[i];

    if (item.type === 'lantern') {
      item.y -= item.speedY;
      item.x += item.speedX;

      ambientCtx.save();
      ambientCtx.globalAlpha = item.alpha;
      ambientCtx.fillStyle = '#FFA726';
      ambientCtx.shadowColor = '#FFD54F';
      ambientCtx.shadowBlur = 15;
      // Draw warm glowing lantern
      ambientCtx.beginPath();
      ambientCtx.roundRect(item.x, item.y, item.size, item.size * 1.3, 4);
      ambientCtx.fill();
      // Inner yellow flame
      ambientCtx.fillStyle = '#FFFDE7';
      ambientCtx.beginPath();
      ambientCtx.arc(item.x + item.size / 2, item.y + item.size * 0.9, item.size * 0.25, 0, Math.PI * 2);
      ambientCtx.fill();
      ambientCtx.restore();

      if (item.y < -60) ambientItems.splice(i, 1);
    } else if (item.type === 'petal') {
      item.y += item.speedY;
      item.x += item.speedX;
      item.rotation += item.rotSpeed;

      ambientCtx.save();
      ambientCtx.translate(item.x, item.y);
      ambientCtx.rotate(item.rotation);
      ambientCtx.fillStyle = item.color;
      ambientCtx.beginPath();
      ambientCtx.ellipse(0, 0, item.size, item.size * 0.6, 0, 0, Math.PI * 2);
      ambientCtx.fill();
      ambientCtx.restore();

      if (item.y > ambientCanvas.height + 20) ambientItems.splice(i, 1);
    }
  }
}

// --- Cracker Trigger Shelf Effects ---
function triggerEffect(type) {
  initAudioContext();
  switch (type) {
    case 'chakra':
      playTone(600, 'sawtooth', 0.8, 0.15);
      setTimeout(() => playTone(800, 'sawtooth', 0.6, 0.12), 200);
      setTimeout(() => playTone(1100, 'sawtooth', 0.6, 0.1), 400);

      if (typeof confetti === 'function') {
        const end = Date.now() + 1000;
        (function frame() {
          confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FFD700', '#FF9900', '#FF0055'] });
          confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#00FFFF', '#FFD700', '#FF4081'] });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      }
      break;

    case 'rocket':
      playTone(300, 'triangle', 0.5, 0.2);
      setTimeout(() => playTone(180, 'square', 0.4, 0.3), 500);
      for (let k = 0; k < 3; k++) setTimeout(launchAutoFirework, k * 200);
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

    case 'ladi':
      // 1000-Wala fast cracker pops
      for (let p = 0; p < 12; p++) {
        setTimeout(() => {
          playTone(200 + Math.random() * 300, 'square', 0.08, 0.25);
          if (typeof confetti === 'function') {
            confetti({
              particleCount: 15,
              spread: 60,
              origin: { x: 0.4 + Math.random() * 0.2, y: 0.6 + Math.random() * 0.1 },
              colors: ['#FF0000', '#FFD700', '#FFFFFF']
            });
          }
        }, p * 90);
      }
      break;

    case 'lanterns':
      playTone(523, 'sine', 1.5, 0.2);
      for (let l = 0; l < 8; l++) setTimeout(spawnSkyLantern, l * 250);
      break;

    case 'blessing':
      playTone(523.25, 'sine', 1.0, 0.2);
      playTone(659.25, 'sine', 1.2, 0.18);
      spawnFlowerShower();
      break;
  }
}

// --- OPTION: Interactive Rangoli Artist Studio Canvas ---
let rCanvas, rCtx, isDrawing = false, rangoliColor = '#FFD700';

function initRangoliDrawingCanvas() {
  rCanvas = document.getElementById('custom-rangoli-canvas');
  if (!rCanvas) return;
  rCtx = rCanvas.getContext('2d');

  // Palette swatches
  const swatches = document.querySelectorAll('.color-swatch');
  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      rangoliColor = swatch.getAttribute('data-color');
    });
  });

  function getCanvasCoords(e) {
    const rect = rCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const scaleX = rCanvas.width / rect.width;
    const scaleY = rCanvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX - rCanvas.width / 2,
      y: (clientY - rect.top) * scaleY - rCanvas.height / 2
    };
  }

  function startDraw(e) {
    isDrawing = true;
    drawSymmetric(e);
  }

  function draw(e) {
    if (!isDrawing) return;
    drawSymmetric(e);
  }

  function stopDraw() {
    isDrawing = false;
  }

  function drawSymmetric(e) {
    const pt = getCanvasCoords(e);
    rCtx.save();
    rCtx.translate(rCanvas.width / 2, rCanvas.height / 2);
    rCtx.fillStyle = rangoliColor;
    rCtx.shadowColor = rangoliColor;
    rCtx.shadowBlur = 8;

    const folds = 8;
    for (let i = 0; i < folds; i++) {
      rCtx.save();
      rCtx.rotate((i * 2 * Math.PI) / folds);
      rCtx.beginPath();
      rCtx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
      rCtx.fill();
      // Mirror
      rCtx.beginPath();
      rCtx.arc(-pt.x, pt.y, 4, 0, Math.PI * 2);
      rCtx.fill();
      rCtx.restore();
    }
    rCtx.restore();
  }

  rCanvas.addEventListener('mousedown', startDraw);
  rCanvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  rCanvas.addEventListener('touchstart', startDraw, { passive: true });
  rCanvas.addEventListener('touchmove', draw, { passive: true });
  window.addEventListener('touchend', stopDraw);

  // Draw initial guide mandala
  presetMandala();
}

function clearRangoliCanvas() {
  if (!rCanvas || !rCtx) return;
  rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);
  playTone(280, 'sine', 0.2, 0.1);
}

function presetMandala() {
  clearRangoliCanvas();
  if (!rCanvas || !rCtx) return;
  const cx = rCanvas.width / 2;
  const cy = rCanvas.height / 2;

  rCtx.save();
  rCtx.translate(cx, cy);

  const colors = ['#FFD700', '#E91E63', '#00E5FF', '#FF5722'];
  for (let ring = 1; ring <= 4; ring++) {
    const radius = ring * 35;
    rCtx.fillStyle = colors[ring - 1];
    rCtx.shadowColor = colors[ring - 1];
    rCtx.shadowBlur = 10;

    const count = ring * 8;
    for (let j = 0; j < count; j++) {
      const angle = (j * 2 * Math.PI) / count;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      rCtx.beginPath();
      rCtx.arc(x, y, ring === 4 ? 4 : 5, 0, Math.PI * 2);
      rCtx.fill();
    }
  }
  rCtx.restore();
}

// --- OPTION: Preset Wishes ---
const presetTexts = {
  1: "May the gleaming light of diyas illuminate your path with supreme happiness, good health, and abundant peace this Diwali and all year through! 🌟🪔",
  2: "Wishing you soaring success, groundbreaking milestones, and limitless opportunities in all your endeavors! Have an auspicious and glorious Diwali! 🚀💼",
  3: "May your home be filled with warm laughter, delightful sweets, affectionate moments, and the loving blessings of Goddess Lakshmi and Lord Ganesha! 🌸✨",
  4: "शुभं करोति कल्याणमारोग्यं धनसंपदा । शत्रुबुद्धिविनाशाय दीपज्योतिर्नमोऽस्तु ते ॥ May the holy lamp bring auspiciousness, prosperity, and radiant health! 🕉️",
  5: "To an amazing soul: Thank you for lighting up my world like a sparkling Diwali diya! Wishing you unconditional love and joyful memories! 💖✨"
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

  document.getElementById('greeting-banner').scrollIntoView({ behavior: 'smooth' });

  triggerConfettiFromDiya();
  playTone(880, 'sine', 0.4, 0.2);
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

  const message = `✨ *Happy Diwali!* ✨\n\n${to}, I have lighted a special Digital Diya for you! 🪔\n\nExperience the festive glow, music, and interactive greeting here:\n${shareURL}\n\n— With warm wishes from ${from} 💫`;
  const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');
}

// --- OPTION: Download Greeting as an Image ---
function downloadGreetingCard() {
  const recipient = document.getElementById('display-recipient').textContent;
  const message = document.getElementById('display-message').textContent;
  const sender = document.getElementById('display-sender').textContent;

  const cardCanvas = document.createElement('canvas');
  cardCanvas.width = 800;
  cardCanvas.height = 600;
  const c = cardCanvas.getContext('2d');

  // Background
  const grad = c.createRadialGradient(400, 300, 50, 400, 300, 500);
  grad.addColorStop(0, '#3e0b29');
  grad.addColorStop(0.7, '#1c0516');
  grad.addColorStop(1, '#08020d');
  c.fillStyle = grad;
  c.fillRect(0, 0, 800, 600);

  // Border
  c.strokeStyle = '#FFD700';
  c.lineWidth = 4;
  c.strokeRect(30, 30, 740, 540);

  // Inner border
  c.strokeStyle = 'rgba(255, 215, 0, 0.4)';
  c.lineWidth = 1.5;
  c.strokeRect(42, 42, 716, 516);

  // Header
  c.fillStyle = '#FFD700';
  c.font = 'bold 36px serif';
  c.textAlign = 'center';
  c.fillText('✨ शुभ दीपावली ✨', 400, 100);

  // Recipient
  c.fillStyle = '#FFAE19';
  c.font = '22px sans-serif';
  c.fillText('Warmest Wishes To', 400, 150);

  c.fillStyle = '#FFFFFF';
  c.font = 'bold 38px serif';
  c.fillText(recipient, 400, 205);

  // Message (word-wrapped)
  c.font = 'italic 20px sans-serif';
  c.fillStyle = '#F6D6DE';
  wrapText(c, message, 400, 280, 620, 30);

  // Diya emoji / icon representation
  c.font = '60px sans-serif';
  c.fillText('🪔', 400, 450);

  // Sender
  c.fillStyle = '#FFD700';
  c.font = 'bold 22px sans-serif';
  c.fillText(sender, 400, 520);

  // Download Trigger
  const a = document.createElement('a');
  a.download = `Diwali_Wish_${recipient.replace(/\s+/g, '_')}.png`;
  a.href = cardCanvas.toDataURL('image/png');
  a.click();
  playTone(880, 'sine', 0.3, 0.2);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
