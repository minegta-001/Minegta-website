/* --------------------------------------------------------------------------
   1. MASTER LUXURY PROCEDURAL SOUND ENGINE (EMBEDDED WEB AUDIO API)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = true;
const soundToggle = document.getElementById('soundToggle');

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Global unlock on initial user engagement
['pointerdown', 'keydown', 'scroll'].forEach(evt => {
  window.addEventListener(evt, () => getAudioContext(), { once: true, passive: true });
});

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    function makeTone(freq, endFreq, gainVal, dur, waveType = 'sine', filterFreq = 0) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq && endFreq !== freq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + dur);
      }
      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      if (filterFreq) {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterFreq, now);
        osc.connect(filter);
        filter.connect(gain);
      } else {
        osc.connect(gain);
      }
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.05);
    }

    switch(type) {
      case 'hover':
        // Soft airy glass hover shimmer
        makeTone(580, 840, 0.012, 0.06, 'sine', 2200);
        break;

      case 'click':
        // Tactile luxury snap (dual tone: punch + crisp)
        makeTone(180, 80, 0.045, 0.06, 'sine');
        makeTone(920, 1400, 0.03, 0.08, 'triangle', 2600);
        break;

      case 'tilt':
        // Magnetic 3D tilt depth resonance
        makeTone(340, 480, 0.014, 0.12, 'sine', 1800);
        break;

      case 'modal-open':
        // Imperial emerald vault swell (deep cinematic rise)
        makeTone(95, 220, 0.07, 0.28, 'sine');
        makeTone(380, 760, 0.035, 0.24, 'triangle', 1600);
        break;

      case 'modal-close':
        // Gentle dissipation sweep down
        makeTone(440, 180, 0.035, 0.18, 'sine', 1400);
        break;

      case 'swipe':
      case 'nav':
        // Aerodynamic transition whoosh
        makeTone(320, 680, 0.03, 0.14, 'sine', 1900);
        makeTone(640, 320, 0.018, 0.16, 'triangle');
        break;

      case 'zoom':
        // Camera lens shutter & cinematic focus snap
        makeTone(720, 1280, 0.04, 0.07, 'triangle');
        makeTone(1400, 900, 0.025, 0.09, 'sine');
        break;

      case 'filter':
        // Holographic category slide arpeggio
        [0, 0.03, 0.06].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime([520, 680, 880][i], now + delay);
          gain.gain.setValueAtTime(0.022, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.09);
        });
        break;

      case 'reveal':
        // Ethereal celestial shimmer for sections scrolling into view
        [0, 0.04, 0.08].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime([587.33, 739.99, 880.00][i], now + delay);
          gain.gain.setValueAtTime(0.016, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.2);
        });
        break;

      case 'qr':
        // High-tech verification pulse
        makeTone(880, 1320, 0.04, 0.12, 'sine', 3000);
        break;

      case 'copy':
        // Rich satisfying reward chime (coin / gold shimmer)
        [0, 0.06].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime([1046.5, 1318.5][i], now + delay);
          gain.gain.setValueAtTime(0.045, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.28);
        });
        break;

      case 'pay':
      case 'success':
        // Grand royal emerald fanfare chord (C4, G4, C5, E5)
        [0, 0.06, 0.12, 0.18].forEach((delay, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime([261.63, 392.00, 523.25, 659.25][i], now + delay);
          gain.gain.setValueAtTime(0.055, now + delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + delay);
          osc.stop(now + delay + 0.48);
        });
        break;

      case 'tab':
        // Sleek mechanical glass tab glide
        makeTone(440, 720, 0.03, 0.08, 'sine');
        break;

      case 'toggle':
        // Crisp tactile switch
        makeTone(620, 980, 0.035, 0.06, 'triangle');
        break;

      case 'toast':
        // Modern crystal notification ping
        makeTone(660, 990, 0.035, 0.14, 'sine', 2800);
        break;

      case 'warning':
        // Deep velvet warning tone
        makeTone(220, 140, 0.06, 0.22, 'sawtooth', 600);
        break;

      case 'dock':
        // Subtle floating header lock click
        makeTone(820, 420, 0.015, 0.05, 'sine');
        break;

      case 'sparkle':
        // Whisper particle interaction
        makeTone(1600 + Math.random() * 400, 2200, 0.008, 0.07, 'sine', 3500);
        break;

      default:
        makeTone(540, 780, 0.02, 0.06, 'sine');
    }
  } catch(e) {}
}

soundToggle.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggle.classList.toggle('is-muted', !soundEnabled);
  if (soundEnabled) playSound('toggle');
});

/* --------------------------------------------------------------------------
   2. ULTRA-SMOOTH GREEN SNOW & GOLDEN RAIN CANVAS WEATHER ENGINE
   -------------------------------------------------------------------------- */
(function() {
  const canvas = document.getElementById('weatherCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let W = window.innerWidth;
  let H = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let snowFlakes = [];
  let rainDrops = [];
  let lastTime = performance.now();
  let rafId = 0;
  
  // Mouse position for interactive particle physics
  let mouse = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: 0, lastY: 0 };
  let lastSparkleSound = 0;
  
  window.addEventListener('mousemove', e => {
    mouse.vx = (e.clientX - mouse.lastX) * 0.25;
    mouse.vy = (e.clientY - mouse.lastY) * 0.25;
    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    // Scale count with screen area
    const totalFlakes = Math.min(180, Math.max(70, Math.floor(W / 9)));
    const totalRain = Math.min(75, Math.max(30, Math.floor(W / 24)));
    
    snowFlakes = Array.from({ length: totalFlakes }, () => makeSnow(true));
    rainDrops = Array.from({ length: totalRain }, () => makeRain(true));
  }

  function makeSnow(initial) {
    const isGold = Math.random() < 0.28;
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : -15 - Math.random() * 60,
      r: 1.1 + Math.random() * 2.8,
      baseSpeed: 0.35 + Math.random() * 0.85,
      drift: 0.4 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.35 + Math.random() * 0.55,
      isGold: isGold,
      color: isGold ? 'rgba(255, 246, 204, ' : (Math.random() < 0.4 ? 'rgba(16, 255, 158, ' : 'rgba(110, 231, 183, '),
      vx: 0,
      vy: 0
    };
  }

  function makeRain(initial) {
    return {
      x: Math.random() * (W + 150) - 75,
      y: initial ? Math.random() * H : -30 - Math.random() * 120,
      len: 12 + Math.random() * 22,
      speed: 5.5 + Math.random() * 6.5,
      wind: 0.9 + Math.random() * 1.1,
      alpha: 0.12 + Math.random() * 0.22,
      color: Math.random() < 0.4 ? 'rgba(247, 231, 178, ' : 'rgba(0, 245, 155, '
    };
  }

  function animate(now) {
    const dt = Math.min(32, now - lastTime);
    lastTime = now;
    const t = now * 0.001;
    ctx.clearRect(0, 0, W, H);

    /* --- SILKY GREEN & GOLD RAIN --- */
    ctx.lineCap = 'round';
    for (let i = 0; i < rainDrops.length; i++) {
      const d = rainDrops[i];
      d.y += d.speed * dt * 0.06;
      d.x += d.wind * dt * 0.06;

      if (d.y > H + 40 || d.x > W + 80) {
        Object.assign(d, makeRain(false));
      }

      const grad = ctx.createLinearGradient(d.x, d.y, d.x + d.wind * 2, d.y + d.len);
      grad.addColorStop(0, d.color + '0)');
      grad.addColorStop(0.5, d.color + d.alpha + ')');
      grad.addColorStop(1, d.color + '0)');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.wind * 1.5, d.y + d.len);
      ctx.stroke();
    }

    /* --- SMOOTH GLOWING GREEN & GOLD SNOW WITH MOUSE DRIFT --- */
    for (let i = 0; i < snowFlakes.length; i++) {
      const f = snowFlakes[i];

      // Natural harmonic float
      f.y += (f.baseSpeed + f.vy) * dt * 0.055;
      f.x += (Math.sin(t * 0.6 + f.phase) * f.drift + f.vx) * dt * 0.045;

      // Mouse interactive fluid repulsion
      const dx = f.x - mouse.x;
      const dy = f.y - mouse.y;
      const distSq = dx * dx + dy * dy;
      const repelDist = 120;
      if (distSq < repelDist * repelDist && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / repelDist) * 1.8;
        f.vx += (dx / dist) * force;
        f.vy += (dy / dist) * force;

        const spdSq = mouse.vx * mouse.vx + mouse.vy * mouse.vy;
        if (spdSq > 35 && now - lastSparkleSound > 280) {
          lastSparkleSound = now;
          playSound('sparkle');
        }
      }
      f.vx *= 0.94;
      f.vy *= 0.94;

      if (f.y > H + 15) {
        Object.assign(f, makeSnow(false));
      }
      if (f.x < -20) f.x = W + 15;
      if (f.x > W + 20) f.x = -15;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = f.color + f.alpha + ')';
      
      // Soft glow
      if (f.r > 2.0) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = f.isGold ? 'rgba(255, 230, 150, 0.9)' : 'rgba(0, 245, 155, 0.9)';
      } else {
        ctx.shadowBlur = 6;
        ctx.shadowColor = f.isGold ? 'rgba(247, 231, 178, 0.6)' : 'rgba(0, 245, 155, 0.6)';
      }
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    rafId = requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      lastTime = performance.now();
      rafId = requestAnimationFrame(animate);
    }
  });
  rafId = requestAnimationFrame(animate);
})();

/* --------------------------------------------------------------------------
   3. DUAL-ELEMENT MAGNETIC CURSOR & PARTICLE SPARK TRAILS
   -------------------------------------------------------------------------- */
(function() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
  
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let ringX = targetX;
  let ringY = targetY;
  let lastSpark = 0;

  window.addEventListener('mousemove', e => {
    targetX = e.clientX;
    targetY = e.clientY;
    dot.style.left = targetX + 'px';
    dot.style.top = targetY + 'px';

    // Spawn tiny emerald/gold trailing sparks on move
    const now = performance.now();
    if (now - lastSpark > 45) {
      lastSpark = now;
      createSpark(targetX, targetY);
    }
  }, { passive: true });

  function createSpark(x, y) {
    const spark = document.createElement('div');
    spark.className = 'cursor-spark';
    const isGold = Math.random() < 0.4;
    const size = 3 + Math.random() * 4;
    const color = isGold ? '#fff6d1' : '#00f59b';
    const shadow = isGold ? 'rgba(247, 231, 178, 0.8)' : 'rgba(0, 245, 155, 0.8)';
    
    spark.style.width = size + 'px';
    spark.style.height = size + 'px';
    spark.style.background = color;
    spark.style.boxShadow = `0 0 10px ${shadow}`;
    spark.style.left = x + 'px';
    spark.style.top = y + 'px';
    
    const angle = Math.random() * Math.PI * 2;
    const dist = 10 + Math.random() * 20;
    spark.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    spark.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    
    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 750);
  }

  function loop() {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(loop);
  }
  loop();

  // Hover triggers (all buttons, links, cards, modals, inputs & auth triggers)
  const hoverables = 'a, button, .card, .filter, .social-btn, input, .cc-thumb, .btn-auth-nav, .user-pill, .user-dropdown-item, .auth-tab, .auth-switch-link, .modal-close, .copy-btn, .btn-upi-app, .btn-paid, .btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverables)) {
      ring.classList.add('hover');
      dot.classList.add('hover');
      playSound('hover');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverables)) {
      ring.classList.remove('hover');
      dot.classList.remove('hover');
    }
  });
})();

/* --------------------------------------------------------------------------
   4. 3D CARD TILT & SPECULAR REFLECTION
   -------------------------------------------------------------------------- */
let lastTiltSound = 0;
function setupCardTilt() {
  document.querySelectorAll('.card.product').forEach(card => {
    if (card._hasTilt) return;
    card._hasTilt = true;
    card.addEventListener('mouseenter', () => {
      playSound('tilt');
    });
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);

      const now = performance.now();
      if (now - lastTiltSound > 220 && (Math.abs(rotateX) > 4 || Math.abs(rotateY) > 4)) {
        lastTiltSound = now;
        playSound('tilt');
      }
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}
setupCardTilt();

/* --------------------------------------------------------------------------
   5. NAVBAR SCROLL & MENU
   -------------------------------------------------------------------------- */
const nav = document.getElementById('nav');
const menu = document.getElementById('menu');
const progress = document.getElementById('progress');
let wasScrolled = false;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const isScrolled = scrollY > 30;
  if (isScrolled !== wasScrolled) {
    wasScrolled = isScrolled;
    playSound('dock');
  }
  nav.classList.toggle('scrolled', isScrolled);
  const totalH = document.body.scrollHeight - window.innerHeight;
  if (totalH > 0) {
    progress.style.width = ((scrollY / totalH) * 100) + '%';
  }
}, { passive: true });

menu.onclick = () => {
  nav.classList.toggle('open');
  playSound('toggle');
};

/* --------------------------------------------------------------------------
   6. CC IMAGE ZOOM LIGHTBOX WITH NEXT / PREV NAVIGATION
   -------------------------------------------------------------------------- */
const ccLightbox = document.getElementById('ccLightbox');
const ccLightboxImg = document.getElementById('ccLightboxImage');
const ccLightboxClose = document.getElementById('ccLightboxClose');
const ccLightboxPrev = document.getElementById('ccLightboxPrev');
const ccLightboxNext = document.getElementById('ccLightboxNext');
const ccLightboxLabel = document.getElementById('ccLightboxLabel');

let ccCards = [];
let currentCCIndex = 0;

function openLightbox(index) {
  ccCards = Array.from(document.querySelectorAll('.cc-card'));
  if (ccCards.length === 0) return;
  if (index < 0) index = ccCards.length - 1;
  if (index >= ccCards.length) index = 0;
  currentCCIndex = index;
  
  const card = ccCards[currentCCIndex];
  const img = card.querySelector('img');
  const title = card.querySelector('h3')?.textContent || '4K CC';
  
  ccLightboxImg.src = img.currentSrc || img.src;
  ccLightboxImg.alt = img.alt || title;
  ccLightboxImg.classList.remove('zoomed');
  ccLightboxLabel.textContent = `${title} — 4K CINEMATIC PREVIEW (${currentCCIndex + 1} OF ${ccCards.length}) — CLICK TO ZOOM`;
  
  ccLightbox.classList.add('show');
  ccLightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cc-lightbox-open');
  playSound('modal-open');
  if (typeof recordZoomView === 'function') recordZoomView(title);
}

function closeLightbox() {
  ccLightbox.classList.remove('show');
  ccLightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cc-lightbox-open');
  playSound('modal-close');
}

function setupLightboxCards() {
  ccCards = Array.from(document.querySelectorAll('.cc-card'));
  ccCards.forEach((card, idx) => {
    const thumb = card.querySelector('.cc-thumb');
    if (thumb) {
      thumb.onclick = e => {
        e.stopPropagation();
        openLightbox(idx);
      };
    }
  });
}

ccLightboxClose.onclick = closeLightbox;
ccLightboxPrev.onclick = () => {
  playSound('swipe');
  openLightbox(currentCCIndex - 1);
};
ccLightboxNext.onclick = () => {
  playSound('swipe');
  openLightbox(currentCCIndex + 1);
};

// Click on lightbox image toggles zoom level
ccLightboxImg.onclick = e => {
  e.stopPropagation();
  ccLightboxImg.classList.toggle('zoomed');
  playSound('zoom');
};

// Close on outside click
ccLightbox.onclick = e => {
  if (e.target === ccLightbox) closeLightbox();
};

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!ccLightbox.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') {
    playSound('swipe');
    openLightbox(currentCCIndex - 1);
  }
  if (e.key === 'ArrowRight') {
    playSound('swipe');
    openLightbox(currentCCIndex + 1);
  }
});

/* --------------------------------------------------------------------------
   7. STORE CATEGORY FILTERS
   -------------------------------------------------------------------------- */
const filterBtns = document.querySelectorAll('.filter');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    playSound('filter');
    
    document.querySelectorAll('.product').forEach(p => {
      if (cat === 'all' || p.dataset.cat === cat) {
        p.style.display = 'flex';
        p.style.flexDirection = 'column';
        p.style.animation = 'fadeUp 0.45s ease both';
      } else {
        p.style.display = 'none';
      }
    });
  });
});

/* --------------------------------------------------------------------------
   8. UPI CHECKOUT MODAL & PAYMENT QR
   -------------------------------------------------------------------------- */
const modal = document.getElementById('modal');
const modalClose = document.getElementById('close');
const productName = document.getElementById('productName');
const paymentQR = document.getElementById('paymentQR');
const payAmount = document.getElementById('payAmount');
const copyBtn = document.getElementById('copyBtn');
const upiPay = document.getElementById('upiPay');
const paidBtn = document.getElementById('paidBtn');
const downloadArea = document.getElementById('downloadArea');
const downloadBtn = document.getElementById('downloadBtn');

const UPI_ID = 'ankitgirirg@okicici';
let selectedProduct = null;

// Download mappings (if you have file links, you can paste them here)
const DOWNLOAD_URLS = {
  'CC 1': '',
  'CC 2': '',
  'CC 3': '',
  'CC 4': '',
  'CC 5': '',
  'Transition Pack 01': '',
  'System Preset 01': ''
};

function buildUPI(amount, name) {
  return 'upi://pay?pa=' + encodeURIComponent(UPI_ID) +
         '&pn=' + encodeURIComponent('MINE PRESETS') +
         '&am=' + encodeURIComponent(Number(amount).toFixed(2)) +
         '&cu=INR&tn=' + encodeURIComponent(name + ' - MINE PRESETS');
}

function renderPaymentQR() {
  if (!selectedProduct) return;
  const upiUrl = buildUPI(selectedProduct.price, selectedProduct.name);
  new QRious({
    element: paymentQR,
    value: upiUrl,
    size: 360,
    level: 'H',
    foreground: '#030805',
    background: '#ffffff'
  });
  payAmount.textContent = '₹' + selectedProduct.price;
  downloadArea.style.display = 'none';
  playSound('qr');
}

// Auth & Buy integration defined below

function closeModal() {
  modal.classList.remove('show');
  playSound('modal-close');
}
modalClose.onclick = closeModal;
modal.onclick = e => { if (e.target === modal) closeModal(); };
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
});

copyBtn.onclick = async () => {
  try {
    await navigator.clipboard.writeText(UPI_ID);
    copyBtn.textContent = '✓ Copied to Clipboard';
    copyBtn.classList.add('copied');
    playSound('copy');
    setTimeout(() => {
      copyBtn.textContent = '📋 Copy UPI ID';
      copyBtn.classList.remove('copied');
    }, 2000);
  } catch(e) {}
};

upiPay.onclick = () => {
  if (!selectedProduct) return;
  playSound('click');
  window.location.href = buildUPI(selectedProduct.price, selectedProduct.name);
};

paidBtn.onclick = () => {
  if (!selectedProduct) return;
  playSound('success');
  const url = DOWNLOAD_URLS[selectedProduct.name];
  if (url) {
    downloadBtn.href = url;
    downloadArea.style.display = 'block';
  } else {
    downloadArea.style.display = 'block';
    downloadBtn.href = "mailto:minegta611@gmail.com?subject=Payment%20Confirmation%20for%20" + encodeURIComponent(selectedProduct.name);
    downloadBtn.textContent = "Email Screenshot for Instant Delivery ↗";
    downloadBtn.removeAttribute('download');
  }
};

/* --------------------------------------------------------------------------
   9. DIRECT INSTANT BUY SYSTEM & NOTIFICATIONS
   -------------------------------------------------------------------------- */
const toastContainer = document.getElementById('toastContainer');

// Toast Notification
function showToast(message, type = 'success') {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'error' ? '⚠️' : (type === 'info' ? 'ℹ️' : '✓');
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;
  toastContainer.appendChild(toast);
  playSound(type === 'error' ? 'warning' : 'toast');
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px) scale(0.95)';
    setTimeout(() => toast.remove(), 320);
  }, 4000);
}

// Storage Keys
const ADMIN_STORAGE_KEY = 'mine_admin_creds_v2';
const ADMIN_SESSION_KEY = 'mine_admin_session_v2';
const ADMIN_LOCK_KEY = 'mine_admin_lock_v2';
const ADMIN_AUDIT_KEY = 'mine_admin_audit_v2';
const CATALOG_STORAGE_KEY = 'mine_catalog_v2';
const SETTINGS_STORAGE_KEY = 'mine_site_settings_v2';
const CLOUD_CONFIG_KEY = 'mine_cloud_config_v2';
const ANALYTICS_VIEWS_KEY = 'mine_stat_total_views_v2';
const ANALYTICS_UNIQUE_KEY = 'mine_stat_unique_visitors_v2';
const ANALYTICS_DISCORD_KEY = 'mine_stat_discord_clicks_v2';
const ANALYTICS_ZOOM_KEY = 'mine_stat_zoom_views_v2';
const ANALYTICS_DAILY_KEY = 'mine_stat_daily_traffic_v2';
const ANALYTICS_ACTIVITY_KEY = 'mine_stat_activity_v2';
const PWD_SALT = 'MINE_IMPERIAL_EMERALD_SALT_2026_99x8a';

// Real-Time Cloud Engine State
let firebaseApp = null;
let firebaseDb = null;
let isCloudLive = false;
let cloudPresetsCount = 0;

// Default Master Credentials:
// ID: mineadmin
// Password: Mine@Imperial2026!

// Default Catalog Configuration
const DEFAULT_PRESETS = [
  {
    id: 'cc-1',
    name: 'CC 1',
    price: 400,
    cat: 'cc',
    tag: '4K CC',
    desc: 'This 4K CC Will Be Found Nowhere Else. Razor-sharp contrast with cinematic skin tones.',
    img: 'images/Mine-cc1_.png'
  },
  {
    id: 'cc-2',
    name: 'CC 2',
    price: 350,
    cat: 'cc',
    tag: '4K CC',
    desc: 'Exclusive 4K CC — Made Different. Rich golden highlights with moody cinematic depth.',
    img: 'images/Mine-cc2_.png'
  },
  {
    id: 'cc-3',
    name: 'CC 3',
    price: 500,
    cat: 'cc',
    tag: '4K CC',
    desc: 'Your Footage Deserves This 4K Look. High-dynamic-range emerald balance and filmic punch.',
    img: 'images/Mine-cc3_.png'
  },
  {
    id: 'cc-4',
    name: 'CC 4',
    price: 300,
    cat: 'cc',
    tag: '4K CC',
    desc: 'One 4K CC. Infinite Cinematic Vibes. Designed for fast social and reel color grading.',
    img: 'images/Mine-cc4_.png'
  },
  {
    id: 'cc-5',
    name: 'CC 5',
    price: 850,
    cat: 'cc',
    tag: '4K CC',
    desc: 'Not Everywhere. Just Here. The definitive flagship 4K color grading preset.',
    img: 'images/Mine-cc5_.png'
  },
  {
    id: 'trans-1',
    name: 'Transition Pack 01',
    price: 249,
    cat: 'transition',
    tag: 'Transitions',
    desc: 'Ultra-fast seamless zooms, whip moves, and camera impacts for gaming & reels.',
    artSvg: 'transition'
  },
  {
    id: 'sys-1',
    name: 'System Preset 01',
    price: 299,
    cat: 'system',
    tag: 'System',
    desc: 'Complete creator workflow setup for consistent Hollywood-grade grading.',
    artSvg: 'system'
  }
];

const DEFAULT_SETTINGS = {
  discordUrl: 'https://discord.gg/aunjV6zMj',
  email: 'minegta611@gmail.com',
  badge: 'Emerald & Imperial Gold 4K Edition'
};

// Cryptographic SHA-256 via Web Crypto API
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text + PWD_SALT);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ==========================================================================
// CLIENT-SIDE HIGH-PERFORMANCE 4K CANVAS IMAGE COMPRESSION
// ==========================================================================
function compressImageFile(file, maxWidth = 1280, maxHeight = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image'));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxWidth || h > maxHeight) {
          const ratio = Math.min(maxWidth / w, maxHeight / h);
          w = Math.max(1, Math.round(w * ratio));
          h = Math.max(1, Math.round(h * ratio));
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);

        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        const origKb = Math.round(file.size / 1024);
        const compKb = Math.round((dataUrl.length * 3 / 4) / 1024);
        resolve({ dataUrl, origKb, compKb, width: w, height: h });
      };
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ==========================================================================
// GLOBAL CLOUD DATABASE SYNCHRONIZATION ENGINE (FIREBASE RTDB & REST)
// ==========================================================================
function getCloudConfig() {
  try {
    const raw = localStorage.getItem(CLOUD_CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { databaseURL: '' };
}

function saveCloudConfig(cfg) {
  try {
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cfg));
  } catch(e) {}
}

function isCloudConfigured() {
  const cfg = getCloudConfig();
  return Boolean(cfg && cfg.databaseURL && cfg.databaseURL.trim().length > 8);
}

function cleanDatabaseUrl(rawUrl) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url.replace(/\/+$/, '');
}

function updateCloudUIState(connected, remoteCount = null) {
  isCloudLive = connected;
  if (remoteCount !== null) cloudPresetsCount = remoteCount;

  // Header status pill
  const pill = document.getElementById('adminCloudStatusPill');
  const label = document.getElementById('cloudStatusLabel');
  if (pill && label) {
    if (connected) {
      pill.classList.add('connected');
      label.textContent = 'Cloud Live ✓';
      pill.title = 'Cloud Database Connected — All visitors see live updates';
    } else {
      pill.classList.remove('connected');
      label.textContent = isCloudConfigured() ? 'Cloud Offline' : 'Local Mode';
      pill.title = 'Operating in local browser storage only';
    }
  }

  // Cloud tab status card
  const badge = document.getElementById('cloudLiveSyncBadge');
  const title = document.getElementById('cloudConnStatusTitle');
  const sub = document.getElementById('cloudConnStatusSub');
  const card = document.querySelector('.cloud-overview-card');
  const remoteCountEl = document.getElementById('cloudStatRemoteCount');
  const localCountEl = document.getElementById('cloudStatLocalCount');

  const localCatalog = getCatalog();
  if (localCountEl) localCountEl.textContent = localCatalog.length;
  if (remoteCountEl && remoteCount !== null) remoteCountEl.textContent = remoteCount;

  if (connected) {
    if (badge) { badge.textContent = '🟢 LIVE CONNECTED'; badge.className = 'tag-status neon'; }
    if (title) title.textContent = 'Cloud Sync: Active & Live 🟢';
    if (sub) sub.textContent = 'All changes, uploads, and pricing are synced to Cloud and visible to EVERY visitor worldwide!';
    if (card) card.classList.add('connected');
  } else {
    if (badge) { badge.textContent = isCloudConfigured() ? '🟡 OFFLINE' : '🟡 LOCAL ONLY'; badge.className = 'tag-status'; }
    if (title) title.textContent = isCloudConfigured() ? 'Cloud Sync: Connection Failed' : 'Cloud Sync: Local Mode Only';
    if (sub) sub.textContent = isCloudConfigured() ? 'Could not reach Firebase database. Check URL or rules.' : 'Presets are currently saved in this local browser only. Connect Cloud Database below so all visitors worldwide can see newly uploaded presets!';
    if (card) card.classList.remove('connected');
  }
}

async function initCloudSync() {
  const cfg = getCloudConfig();
  if (!cfg.databaseURL) {
    updateCloudUIState(false);
    return;
  }

  const dbUrl = cleanDatabaseUrl(cfg.databaseURL);

  // Try Firebase SDK first
  if (typeof firebase !== 'undefined' && firebase.database) {
    try {
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp({ databaseURL: dbUrl });
      } else {
        firebaseApp = firebase.app();
      }
      firebaseDb = firebase.database();

      // Realtime listener for catalog
      firebaseDb.ref('catalog').on('value', (snapshot) => {
        const remoteData = snapshot.val();
        if (Array.isArray(remoteData) && remoteData.length > 0) {
          localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(remoteData));
          renderStoreProducts();
          renderAdminCatalog();
          updateCloudUIState(true, remoteData.length);
        } else if (snapshot.exists()) {
          updateCloudUIState(true, 0);
        }
      }, (err) => {
        console.warn('Firebase RTDB listener error:', err);
        checkCloudRest(dbUrl);
      });

      // Realtime listener for site settings
      firebaseDb.ref('settings').on('value', (snapshot) => {
        const remoteSettings = snapshot.val();
        if (remoteSettings && typeof remoteSettings === 'object') {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(remoteSettings));
          applySiteSettings(remoteSettings);
        }
      });

      updateCloudUIState(true);
      return;
    } catch(err) {
      console.warn('Firebase SDK init warning:', err);
    }
  }

  // REST Fallback for environments without SDK
  await checkCloudRest(dbUrl);
}

async function checkCloudRest(dbUrl) {
  try {
    const res = await fetch(`${dbUrl}/catalog.json`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(data));
        renderStoreProducts();
        renderAdminCatalog();
        updateCloudUIState(true, data.length);
      } else {
        updateCloudUIState(true, 0);
      }
    } else {
      updateCloudUIState(false);
    }
  } catch(e) {
    updateCloudUIState(false);
  }
}

async function saveCatalogToCloud(catalog) {
  const cfg = getCloudConfig();
  if (!cfg.databaseURL) return false;
  const dbUrl = cleanDatabaseUrl(cfg.databaseURL);

  // Try Firebase SDK
  if (firebaseDb) {
    try {
      await firebaseDb.ref('catalog').set(catalog);
      updateCloudUIState(true, catalog.length);
      return true;
    } catch(err) {
      console.warn('SDK write error, falling back to REST:', err);
    }
  }

  // REST PUT Fallback
  try {
    const res = await fetch(`${dbUrl}/catalog.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(catalog)
    });
    if (res.ok) {
      updateCloudUIState(true, catalog.length);
      return true;
    }
  } catch(err) {
    console.error('REST cloud write error:', err);
  }
  return false;
}

async function saveSettingsToCloud(settings) {
  const cfg = getCloudConfig();
  if (!cfg.databaseURL) return false;
  const dbUrl = cleanDatabaseUrl(cfg.databaseURL);

  if (firebaseDb) {
    try {
      await firebaseDb.ref('settings').set(settings);
      return true;
    } catch(err) {}
  }

  try {
    const res = await fetch(`${dbUrl}/settings.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return res.ok;
  } catch(err) {
    return false;
  }
}

async function fetchCatalogFromCloud() {
  const cfg = getCloudConfig();
  if (!cfg.databaseURL) return null;
  const dbUrl = cleanDatabaseUrl(cfg.databaseURL);

  if (firebaseDb) {
    try {
      const snap = await firebaseDb.ref('catalog').once('value');
      const val = snap.val();
      if (Array.isArray(val) && val.length > 0) return val;
    } catch(e) {}
  }

  try {
    const res = await fetch(`${dbUrl}/catalog.json`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch(e) {}
  return null;
}

function renderAdminCloudSync() {
  const cfg = getCloudConfig();
  const urlInput = document.getElementById('cloudDatabaseUrl');
  if (urlInput && !urlInput.value && cfg.databaseURL) {
    urlInput.value = cfg.databaseURL;
  }
  updateCloudUIState(isCloudLive);
}

// Helpers for Catalog & Settings
function getCatalog() {
  try {
    const data = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!data) {
      saveCatalog(DEFAULT_PRESETS);
      return DEFAULT_PRESETS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRESETS;
  } catch(e) {
    return DEFAULT_PRESETS;
  }
}

function saveCatalog(catalog) {
  try {
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(catalog));
  } catch(e) {}
}

function getSiteSettings() {
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(data) || DEFAULT_SETTINGS;
  } catch(e) {
    return DEFAULT_SETTINGS;
  }
}

function saveSiteSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    applySiteSettings(settings);
  } catch(e) {}
}

function applySiteSettings(settings) {
  const discordUrl = settings.discordUrl || 'https://discord.gg/aunjV6zMj';
  document.querySelectorAll('a.buy, a.social-discord').forEach(el => {
    el.href = discordUrl;
  });
  const badgeEl = document.querySelector('.hero .badge');
  if (badgeEl && settings.badge) {
    badgeEl.innerHTML = `<span class="dot"></span> ${settings.badge}`;
  }
}

// Render Products in Live Store (Always Vertical 4K Showcase)
function renderStoreProducts() {
  const container = document.querySelector('.products');
  if (!container) return;
  const catalog = getCatalog();
  const settings = getSiteSettings();
  const currentFilter = document.querySelector('.filter.active')?.dataset.filter || 'all';

  let ccCount = 0;
  container.innerHTML = catalog.map((p) => {
    const isVisible = currentFilter === 'all' || p.cat === currentFilter;
    const isCC = p.cat === 'cc';
    const ccIndex = isCC ? ccCount++ : null;
    
    let thumbHtml = '';
    if (p.img) {
      thumbHtml = `
        <div class="thumb ${isCC ? 'cc-thumb' : ''}">
          <span class="tag">${p.tag || (isCC ? '4K CC' : 'Pack')}</span>
          ${isCC ? '<span class="zoom-hint">🔍 Click to Zoom</span>' : ''}
          <img src="${p.img}" alt="${p.name}" loading="lazy" decoding="async">
        </div>
      `;
    } else if (p.artSvg === 'transition') {
      thumbHtml = `
        <div class="thumb">
          <svg class="upcoming-art" viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Upcoming transition system">
            <defs>
              <linearGradient id="bgG1_${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#020704"/><stop offset="0.5" stop-color="#071b10"/><stop offset="1" stop-color="#020704"/></linearGradient>
              <linearGradient id="emeraldGold_${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#00f59b"/><stop offset="50%" stop-color="#f7e7b2"/><stop offset="100%" stop-color="#10b981"/></linearGradient>
              <filter id="glowG1_${p.id}"><feGaussianBlur stdDeviation="15"/></filter>
            </defs>
            <rect width="900" height="520" fill="url(#bgG1_${p.id})"/>
            <circle cx="700" cy="120" r="140" fill="#00f59b" opacity="0.16" filter="url(#glowG1_${p.id})"/>
            <circle cx="180" cy="400" r="130" fill="#f7e7b2" opacity="0.12" filter="url(#glowG1_${p.id})"/>
            <g opacity="0.15" stroke="#00f59b">
              <path d="M0 90H900M0 180H900M0 270H900M0 360H900M0 450H900"/>
              <path d="M90 0V520M180 0V520M270 0V520M360 0V520M450 0V520M540 0V520M630 0V520M720 0V520M810 0V520"/>
            </g>
            <g transform="translate(450 255)">
              <rect x="-280" y="-90" width="560" height="180" rx="22" fill="#041209" stroke="url(#emeraldGold_${p.id})" stroke-width="2"/>
              <text x="0" y="-14" text-anchor="middle" fill="#f7e7b2" font-family="Cinzel, serif" font-size="56" font-weight="800" letter-spacing="8">TRANSITIONS</text>
              <text x="0" y="32" text-anchor="middle" fill="#00f59b" font-family="Inter, sans-serif" font-size="16" letter-spacing="5">PACK 01 — LOADING DROP</text>
              <line x1="-140" y1="56" x2="140" y2="56" stroke="url(#emeraldGold_${p.id})" stroke-width="2"/>
            </g>
          </svg>
          <span class="tag">${p.tag || 'Transitions'}</span>
        </div>
      `;
    } else {
      thumbHtml = `
        <div class="thumb">
          <svg class="upcoming-art" viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Upcoming system preset">
            <defs>
              <linearGradient id="bgS1_${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#020704"/><stop offset="0.5" stop-color="#0a2214"/><stop offset="1" stop-color="#020704"/></linearGradient>
              <linearGradient id="goldGreen_${p.id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#f7e7b2"/><stop offset="50%" stop-color="#00f59b"/><stop offset="100%" stop-color="#ffd700"/></linearGradient>
            </defs>
            <rect width="900" height="520" fill="url(#bgS1_${p.id})"/>
            <g transform="translate(450 255)">
              <rect x="-280" y="-90" width="560" height="180" rx="22" fill="#030d07" stroke="url(#goldGreen_${p.id})" stroke-width="2"/>
              <text x="0" y="-14" text-anchor="middle" fill="#00f59b" font-family="Cinzel, serif" font-size="56" font-weight="800" letter-spacing="8">SYSTEM 01</text>
              <text x="0" y="32" text-anchor="middle" fill="#f7e7b2" font-family="Inter, sans-serif" font-size="16" letter-spacing="5">FULL WORKFLOW ENGINE</text>
              <line x1="-140" y1="56" x2="140" y2="56" stroke="url(#goldGreen_${p.id})" stroke-width="2"/>
            </g>
          </svg>
          <span class="tag">${p.tag || 'System'}</span>
        </div>
      `;
    }

    return `
      <article class="card product ${isCC ? 'cc-card' : ''}" data-cat="${p.cat}" data-id="${p.id}" ${isCC ? `data-index="${ccIndex}"` : ''} style="display: ${isVisible ? 'flex' : 'none'}; flex-direction: column;">
        <div class="card-shine"></div>
        ${thumbHtml}
        <div class="card-body">
          <h3>${p.name}</h3>
          <p class="${isCC ? 'cc-cinematic' : ''}">${p.desc}</p>
          <div class="price-row">
            <div class="price"><span class="price-symbol">₹</span>${p.price}</div>
            <a class="buy" href="${settings.discordUrl}" target="_blank" rel="noopener noreferrer" data-name="${p.name}" data-price="${p.price}">Buy now <span class="buy-arrow">↗</span></a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  setupLightboxCards();
  setupCardTilt();
  setupBuyButtons();
}

function setupBuyButtons() {
  document.querySelectorAll('.buy').forEach(btn => {
    btn.onclick = () => {
      playSound('click');
      const name = btn.dataset.name || 'Preset';
      recordDiscordClick(name);
      showToast(`🎮 Opening Discord for ${name} — DM us to complete your purchase!`, 'info');
    };
  });
}

// Analytics Helpers
function initAnalytics() {
  try {
    let vid = localStorage.getItem('mine_vid_v2');
    const isNew = !vid;
    if (isNew) {
      vid = 'cr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem('mine_vid_v2', vid);
      const unique = parseInt(localStorage.getItem(ANALYTICS_UNIQUE_KEY) || '0', 10) + 1;
      localStorage.setItem(ANALYTICS_UNIQUE_KEY, unique.toString());
    }

    const total = parseInt(localStorage.getItem(ANALYTICS_VIEWS_KEY) || '0', 10) + 1;
    localStorage.setItem(ANALYTICS_VIEWS_KEY, total.toString());

    const today = new Date().toISOString().split('T')[0];
    let daily = {};
    try { daily = JSON.parse(localStorage.getItem(ANALYTICS_DAILY_KEY)) || {}; } catch(e){}
    daily[today] = (daily[today] || 0) + 1;
    localStorage.setItem(ANALYTICS_DAILY_KEY, JSON.stringify(daily));

    if (isNew) {
      logActivity('New Creator visited website', '👀');
    }
  } catch(e) {}
}

function recordDiscordClick(name) {
  try {
    const cur = parseInt(localStorage.getItem(ANALYTICS_DISCORD_KEY) || '0', 10) + 1;
    localStorage.setItem(ANALYTICS_DISCORD_KEY, cur.toString());
    logActivity(`Purchase inquiry for ${name}`, '💎');
  } catch(e) {}
}

function recordZoomView(title) {
  try {
    const cur = parseInt(localStorage.getItem(ANALYTICS_ZOOM_KEY) || '0', 10) + 1;
    localStorage.setItem(ANALYTICS_ZOOM_KEY, cur.toString());
    logActivity(`4K Zoom Preview: ${title}`, '🔍');
  } catch(e) {}
}

function logActivity(text, icon = '⚡') {
  try {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(ANALYTICS_ACTIVITY_KEY)) || []; } catch(e){}
    const item = {
      text,
      icon,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    list.unshift(item);
    if (list.length > 30) list = list.slice(0, 30);
    localStorage.setItem(ANALYTICS_ACTIVITY_KEY, JSON.stringify(list));
  } catch(e) {}
}

function logSecurityAudit(action, status = 'success') {
  try {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(ADMIN_AUDIT_KEY)) || []; } catch(e){}
    list.unshift({
      action,
      status,
      time: new Date().toLocaleString()
    });
    if (list.length > 25) list = list.slice(0, 25);
    localStorage.setItem(ADMIN_AUDIT_KEY, JSON.stringify(list));
  } catch(e) {}
}

/* --------------------------------------------------------------------------
   11. IMPERIAL ADMIN COMMAND CENTER & SECURITY CONTROLLER
   -------------------------------------------------------------------------- */
const adminPortalModal = document.getElementById('adminPortalModal');
const adminPortalClose = document.getElementById('adminPortalClose');
const openAdminBtn = document.getElementById('openAdminBtn');
const adminLoginView = document.getElementById('adminLoginView');
const adminDashboardView = document.getElementById('adminDashboardView');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminUserField = document.getElementById('adminUserField');
const adminPassField = document.getElementById('adminPassField');
const toggleAdminPwd = document.getElementById('toggleAdminPwd');
const adminLockMsg = document.getElementById('adminLockMsg');
const adminLoginSubmit = document.getElementById('adminLoginSubmit');
const adminLogoutBtn = document.getElementById('adminLogoutBtn');

let adminLockTimer = null;
let currentUploadedImage = null;

// Initialize Admin Credentials if not set
async function initAdminCredentials() {
  try {
    const existing = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!existing) {
      const defaultHash = await sha256('Mine@Imperial2026!');
      const defaultCreds = {
        username: 'mineadmin',
        passwordHash: defaultHash,
        updatedAt: Date.now()
      };
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(defaultCreds));
    }
  } catch(e) {}
}

function getAdminLockState() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_LOCK_KEY)) || { attempts: 0, lockedUntil: 0 };
  } catch(e) {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function saveAdminLockState(state) {
  try {
    localStorage.setItem(ADMIN_LOCK_KEY, JSON.stringify(state));
  } catch(e) {}
}

function checkAdminRateLimit() {
  const lock = getAdminLockState();
  const now = Date.now();
  if (lock.lockedUntil && now < lock.lockedUntil) {
    const left = Math.ceil((lock.lockedUntil - now) / 1000);
    if (adminLockMsg) {
      adminLockMsg.style.display = 'block';
      adminLockMsg.textContent = `🛑 High-Security Lock active. Too many failed attempts. Try again in ${left}s.`;
    }
    if (adminLoginSubmit) adminLoginSubmit.disabled = true;
    if (!adminLockTimer) {
      adminLockTimer = setInterval(() => {
        const remaining = Math.ceil((lock.lockedUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          clearInterval(adminLockTimer);
          adminLockTimer = null;
          if (adminLockMsg) adminLockMsg.style.display = 'none';
          if (adminLoginSubmit) adminLoginSubmit.disabled = false;
          saveAdminLockState({ attempts: 0, lockedUntil: 0 });
        } else if (adminLockMsg) {
          adminLockMsg.textContent = `🛑 High-Security Lock active. Too many failed attempts. Try again in ${remaining}s.`;
        }
      }, 1000);
    }
    return false;
  }
  if (adminLockMsg) adminLockMsg.style.display = 'none';
  if (adminLoginSubmit) adminLoginSubmit.disabled = false;
  return true;
}

function recordAdminFailedAttempt() {
  const lock = getAdminLockState();
  lock.attempts = (lock.attempts || 0) + 1;
  if (lock.attempts >= 5) {
    lock.lockedUntil = Date.now() + 60 * 1000; // 60s lockdown
    showToast('Brute-force protection: Locked for 60s.', 'error');
  } else {
    showToast(`Invalid credentials. ${5 - lock.attempts} attempts remaining before lock.`, 'error');
  }
  saveAdminLockState(lock);
  checkAdminRateLimit();
}

function resetAdminFailedAttempts() {
  saveAdminLockState({ attempts: 0, lockedUntil: 0 });
  if (adminLockMsg) adminLockMsg.style.display = 'none';
  if (adminLoginSubmit) adminLoginSubmit.disabled = false;
}

function getAdminSession() {
  try {
    const sessionStr = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionStr) return null;
    const session = JSON.parse(sessionStr);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return session;
  } catch(e) {
    return null;
  }
}

function setAdminSession(username) {
  const session = {
    username,
    token: 'adm_' + Math.random().toString(36).substring(2) + Date.now(),
    expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
  };
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

// Modal Toggle & State Switching
function openAdminPortal() {
  if (!adminPortalModal) return;
  adminPortalModal.classList.add('show');
  playSound('modal-open');
  
  const session = getAdminSession();
  if (session) {
    showAdminDashboard();
  } else {
    showAdminLogin();
  }
}

function closeAdminPortal() {
  if (!adminPortalModal) return;
  adminPortalModal.classList.remove('show');
  playSound('modal-close');
}

function showAdminLogin() {
  if (adminLoginView) adminLoginView.style.display = 'block';
  if (adminDashboardView) adminDashboardView.style.display = 'none';
  checkAdminRateLimit();
}

function showAdminDashboard() {
  if (adminLoginView) adminLoginView.style.display = 'none';
  if (adminDashboardView) adminDashboardView.style.display = 'flex';
  renderAdminDashboard();
}

// Render Dashboard Data across all tabs
function renderAdminDashboard() {
  renderAdminAnalytics();
  renderAdminCatalog();
  renderAdminSettings();
  renderAdminSecurity();
  renderAdminCloudSync();
}

// Analytics Rendering
function renderAdminAnalytics() {
  const totalViews = localStorage.getItem(ANALYTICS_VIEWS_KEY) || '0';
  const uniqueVisitors = localStorage.getItem(ANALYTICS_UNIQUE_KEY) || '0';
  const discordClicks = localStorage.getItem(ANALYTICS_DISCORD_KEY) || '0';
  const zoomViews = localStorage.getItem(ANALYTICS_ZOOM_KEY) || '0';

  const today = new Date().toISOString().split('T')[0];
  let daily = {};
  try { daily = JSON.parse(localStorage.getItem(ANALYTICS_DAILY_KEY)) || {}; } catch(e){}
  const todayViews = daily[today] || 0;

  const statTotal = document.getElementById('statTotalViews');
  const statToday = document.getElementById('statTodayViews');
  const statUnique = document.getElementById('statUniqueVisitors');
  const statDiscord = document.getElementById('statDiscordClicks');
  const statLightbox = document.getElementById('statLightboxViews');

  if (statTotal) statTotal.textContent = totalViews;
  if (statToday) statToday.textContent = `+${todayViews} today`;
  if (statUnique) statUnique.textContent = uniqueVisitors;
  if (statDiscord) statDiscord.textContent = discordClicks;
  if (statLightbox) statLightbox.textContent = zoomViews;

  // Render 7-day chart
  const chartBars = document.getElementById('adminChartBars');
  if (chartBars) {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }
    const maxVal = Math.max(1, ...days.map(d => daily[d] || 0));
    chartBars.innerHTML = days.map(d => {
      const count = daily[d] || 0;
      const pct = Math.max(8, Math.round((count / maxVal) * 100));
      const dayLabel = new Date(d).toLocaleDateString([], { weekday: 'short' });
      return `
        <div class="chart-bar-item">
          <div class="chart-bar-fill" style="height:${pct}%;" data-count="${count}"></div>
          <span class="chart-bar-label">${dayLabel}</span>
        </div>
      `;
    }).join('');
  }

  // Render Activity List
  const activityList = document.getElementById('adminActivityList');
  if (activityList) {
    let activities = [];
    try { activities = JSON.parse(localStorage.getItem(ANALYTICS_ACTIVITY_KEY)) || []; } catch(e){}
    if (activities.length === 0) {
      activityList.innerHTML = `<div class="activity-item" style="color:var(--text-dim); justify-content:center;">No recent events recorded yet.</div>`;
    } else {
      activityList.innerHTML = activities.map(act => `
        <div class="activity-item">
          <div class="activity-item-left">
            <span class="activity-dot"></span>
            <span>${act.icon || '⚡'} ${act.text}</span>
          </div>
          <span class="activity-time">${act.time}</span>
        </div>
      `).join('');
    }
  }
}

// Catalog Management in Admin
function renderAdminCatalog() {
  const catalog = getCatalog();
  const countEl = document.getElementById('adminCatalogCount');
  if (countEl) countEl.textContent = catalog.length;

  const listEl = document.getElementById('adminCatalogList');
  if (!listEl) return;

  listEl.innerHTML = catalog.map(p => `
    <div class="catalog-item-card" data-id="${p.id}">
      <div class="catalog-item-left">
        ${p.img ? `<img src="${p.img}" alt="${p.name}" class="catalog-item-img">` : `<div class="catalog-item-img" style="background:#041209; display:flex; align-items:center; justify-content:center; color:var(--emerald-neon); font-size:11px; font-weight:800;">${p.tag || 'SYS'}</div>`}
        <div class="catalog-item-info">
          <h5>${p.name}</h5>
          <span class="catalog-item-badge">${p.tag || p.cat.toUpperCase()}</span>
        </div>
      </div>
      <div class="catalog-item-mid">
        <span class="price-tag-label">Price ₹:</span>
        <input type="number" class="catalog-price-input" value="${p.price}" min="0">
        <button type="button" class="btn-save-price" onclick="handlePriceUpdate('${p.id}', this)">Save</button>
      </div>
      <div class="catalog-item-right">
        <button type="button" class="btn-del-preset" onclick="handleDeletePreset('${p.id}')">Delete ✕</button>
      </div>
    </div>
  `).join('');
}

// Global window hooks for inline actions
window.handlePriceUpdate = function(id, btn) {
  const row = btn.closest('.catalog-item-card');
  const input = row?.querySelector('.catalog-price-input');
  if (!input) return;
  const newPrice = parseInt(input.value, 10);
  if (isNaN(newPrice) || newPrice < 0) {
    showToast('Invalid price entered.', 'error');
    return;
  }
  const catalog = getCatalog();
  const item = catalog.find(x => x.id === id);
  if (item) {
    item.price = newPrice;
    saveCatalog(catalog);
    renderStoreProducts();
    renderAdminCatalog();
    if (isCloudConfigured()) {
      saveCatalogToCloud(catalog);
    }
    showToast(`Price for ${item.name} updated to ₹${newPrice}!`, 'success');
    logActivity(`Price updated: ${item.name} → ₹${newPrice}`, '💰');
    playSound('pay');
  }
};

window.handleDeletePreset = function(id) {
  const catalog = getCatalog();
  const item = catalog.find(x => x.id === id);
  if (!item) return;
  if (!confirm(`Are you sure you want to remove "${item.name}" from the store?`)) return;

  const filtered = catalog.filter(x => x.id !== id);
  saveCatalog(filtered);
  renderStoreProducts();
  renderAdminCatalog();
  if (isCloudConfigured()) {
    saveCatalogToCloud(filtered);
  }
  showToast(`Preset "${item.name}" removed from store.`, 'info');
  logActivity(`Preset deleted: ${item.name}`, '🗑️');
  playSound('hover');
};

// Settings in Admin
function renderAdminSettings() {
  const settings = getSiteSettings();
  const disc = document.getElementById('settingDiscordUrl');
  const email = document.getElementById('settingContactEmail');
  const badge = document.getElementById('settingHeroBadge');

  if (disc) disc.value = settings.discordUrl || 'https://discord.gg/aunjV6zMj';
  if (email) email.value = settings.email || 'minegta611@gmail.com';
  if (badge) badge.value = settings.badge || 'Emerald & Imperial Gold 4K Edition';
}

// Security in Admin
function renderAdminSecurity() {
  const credsStr = localStorage.getItem(ADMIN_STORAGE_KEY);
  let username = 'mineadmin';
  try { username = JSON.parse(credsStr).username || 'mineadmin'; } catch(e){}
  
  const userField = document.getElementById('secNewUsername');
  if (userField) userField.value = username;

  // Render Audit Log
  const auditEl = document.getElementById('adminAuditLog');
  if (auditEl) {
    let list = [];
    try { list = JSON.parse(localStorage.getItem(ADMIN_AUDIT_KEY)) || []; } catch(e){}
    if (list.length === 0) {
      auditEl.innerHTML = `<div class="audit-entry success"><span>Initial master security keys established.</span><span>Ready</span></div>`;
    } else {
      auditEl.innerHTML = list.map(item => `
        <div class="audit-entry ${item.status === 'warn' ? 'warn' : 'success'}">
          <span>${item.action}</span>
          <span>${item.time}</span>
        </div>
      `).join('');
    }
  }
}

// Tab Switching Controller
document.querySelectorAll('.admin-tab').forEach(tabBtn => {
  tabBtn.addEventListener('click', () => {
    playSound('tab');
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.remove('active'));
    
    tabBtn.classList.add('active');
    const tabName = tabBtn.dataset.tab;
    const targetPane = document.getElementById(`tabPane-${tabName}`);
    if (targetPane) targetPane.classList.add('active');

    if (tabName === 'analytics') renderAdminAnalytics();
    if (tabName === 'catalog') renderAdminCatalog();
    if (tabName === 'cloud') renderAdminCloudSync();
  });
});

// Admin Login Form Submit
if (adminLoginForm) {
  adminLoginForm.onsubmit = async (e) => {
    e.preventDefault();
    if (!checkAdminRateLimit()) return;

    const userInput = adminUserField.value.trim();
    const passInput = adminPassField.value;

    if (!userInput || !passInput) {
      showToast('Please enter both Admin ID and Password.', 'error');
      return;
    }

    const credsStr = localStorage.getItem(ADMIN_STORAGE_KEY);
    let creds = { username: 'mineadmin', passwordHash: '' };
    try { creds = JSON.parse(credsStr); } catch(e){}

    const enteredHash = await sha256(passInput);
    if (userInput.toLowerCase() === creds.username.toLowerCase() && enteredHash === creds.passwordHash) {
      resetAdminFailedAttempts();
      setAdminSession(creds.username);
      logSecurityAudit(`Master Admin '${creds.username}' logged in successfully`, 'success');
      logActivity(`Master Admin session started`, '🛡️');
      showToast(`Welcome back, ${creds.username}! Command Center unlocked.`, 'success');
      playSound('pay');
      showAdminDashboard();
      adminUserField.value = '';
      adminPassField.value = '';
    } else {
      recordAdminFailedAttempt();
      logSecurityAudit(`Failed login attempt for ID: '${userInput}'`, 'warn');
      playSound('warning');
    }
  };
}

// Admin Logout
if (adminLogoutBtn) {
  adminLogoutBtn.onclick = () => {
    clearAdminSession();
    showToast('Admin session locked and ended.', 'info');
    logSecurityAudit('Admin session terminated', 'success');
    playSound('modal-close');
    showAdminLogin();
  };
}

// Toggle Add Preset Drawer
const toggleAddPresetBtn = document.getElementById('toggleAddPresetBtn');
const closeAddPresetBtn = document.getElementById('closeAddPresetBtn');
const adminAddFormWrap = document.getElementById('adminAddFormWrap');

if (toggleAddPresetBtn && adminAddFormWrap) {
  toggleAddPresetBtn.onclick = () => {
    const isHidden = adminAddFormWrap.style.display === 'none';
    adminAddFormWrap.style.display = isHidden ? 'block' : 'none';
    playSound(isHidden ? 'modal-open' : 'modal-close');
    if (isHidden) {
      document.getElementById('newPresetName')?.focus();
    }
  };
}
if (closeAddPresetBtn && adminAddFormWrap) {
  closeAddPresetBtn.onclick = () => {
    adminAddFormWrap.style.display = 'none';
    playSound('modal-close');
  };
}

// Image File Upload Reader for New Preset
const newPresetFile = document.getElementById('newPresetFile');
const newPresetImgUrl = document.getElementById('newPresetImgUrl');
const previewImg = document.getElementById('previewImg');
const previewTitle = document.getElementById('previewTitle');
const previewDesc = document.getElementById('previewDesc');
const previewPrice = document.getElementById('previewPrice');
const previewTag = document.getElementById('previewTag');

if (newPresetFile) {
  newPresetFile.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const statusEl = document.getElementById('uploadCompressionStatus');
      if (statusEl) {
        statusEl.style.display = 'flex';
        statusEl.innerHTML = '<span>⏳ Compressing &amp; optimizing 4K image...</span>';
      }
      try {
        const comp = await compressImageFile(file);
        currentUploadedImage = comp.dataUrl;
        if (previewImg) previewImg.src = currentUploadedImage;
        if (newPresetImgUrl) newPresetImgUrl.value = '';
        if (statusEl) {
          statusEl.innerHTML = `<span>✓ Optimized: <b>${comp.origKb} KB</b> → <b>${comp.compKb} KB</b> (4K WebP) — ready for fast cloud sync!</span>`;
        }
        playSound('toggle');
        showToast(`Image "${file.name}" optimized & loaded (${comp.compKb} KB)!`, 'info');
      } catch(err) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          currentUploadedImage = ev.target.result;
          if (previewImg) previewImg.src = currentUploadedImage;
          if (newPresetImgUrl) newPresetImgUrl.value = '';
          if (statusEl) statusEl.style.display = 'none';
          playSound('toggle');
          showToast(`Image "${file.name}" loaded!`, 'info');
        };
        reader.readAsDataURL(file);
      }
    }
  };
}

if (newPresetImgUrl) {
  newPresetImgUrl.oninput = (e) => {
    const url = e.target.value.trim();
    if (url && previewImg) {
      currentUploadedImage = url;
      previewImg.src = url;
    }
  };
}

// Real-Time Live Preview Updates
['newPresetName', 'newPresetPrice', 'newPresetDesc', 'newPresetTag'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.oninput = () => {
      if (id === 'newPresetName' && previewTitle) previewTitle.textContent = el.value || 'Preset Title';
      if (id === 'newPresetPrice' && previewPrice) previewPrice.textContent = '₹' + (el.value || '0');
      if (id === 'newPresetDesc' && previewDesc) previewDesc.textContent = el.value || 'Description will appear here...';
      if (id === 'newPresetTag' && previewTag) previewTag.textContent = el.value || '4K CC';
    };
  }
});

// Submit New Preset (Published Locally AND Pushed to Cloud)
const newPresetForm = document.getElementById('newPresetForm');
if (newPresetForm) {
  newPresetForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('newPresetName').value.trim();
    const price = parseInt(document.getElementById('newPresetPrice').value, 10);
    const cat = document.getElementById('newPresetCategory').value;
    const tag = document.getElementById('newPresetTag').value.trim() || (cat === 'cc' ? '4K CC' : 'Pack');
    const desc = document.getElementById('newPresetDesc').value.trim();
    const img = currentUploadedImage || newPresetImgUrl.value.trim() || 'images/Mine-cc1_.png';

    if (!name || isNaN(price) || !desc) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    const publishBtn = document.getElementById('publishPresetBtn');
    if (publishBtn) {
      publishBtn.disabled = true;
      publishBtn.textContent = 'Publishing & Syncing to Cloud... ⏳';
    }

    const newPreset = {
      id: 'custom_' + Date.now(),
      name,
      price,
      cat,
      tag,
      desc,
      img
    };

    const catalog = getCatalog();
    catalog.unshift(newPreset);
    saveCatalog(catalog);

    renderStoreProducts();
    renderAdminCatalog();

    let cloudSynced = false;
    if (isCloudConfigured()) {
      cloudSynced = await saveCatalogToCloud(catalog);
    }

    if (publishBtn) {
      publishBtn.disabled = false;
      publishBtn.textContent = 'Publish Preset to Live Website 🚀';
    }

    if (cloudSynced) {
      showToast(`🚀 "${name}" successfully published to LIVE WEBSITE! Visible to all visitors!`, 'success');
      logActivity(`Published & Cloud-synced: ${name} (₹${price})`, '🎉');
      playSound('pay');
    } else if (isCloudConfigured()) {
      showToast(`✓ "${name}" saved locally, but cloud sync failed. Check ☁️ Cloud Live Sync tab.`, 'warn');
      logActivity(`Published locally (cloud sync failed): ${name}`, '⚠️');
      playSound('warning');
    } else {
      showToast(`✓ "${name}" saved in browser! To show to all visitors, connect your free Cloud in ☁️ Cloud Live Sync tab.`, 'info');
      logActivity(`Published new preset (Local): ${name} (₹${price})`, '🎉');
      playSound('pay');
    }

    // Reset Form
    newPresetForm.reset();
    currentUploadedImage = null;
    const statusEl = document.getElementById('uploadCompressionStatus');
    if (statusEl) statusEl.style.display = 'none';
    if (adminAddFormWrap) adminAddFormWrap.style.display = 'none';
  };
}

// Reset Catalog to Factory Defaults
const resetCatalogBtn = document.getElementById('resetCatalogBtn');
if (resetCatalogBtn) {
  resetCatalogBtn.onclick = () => {
    if (confirm('Are you sure you want to reset the store catalog back to the original default presets?')) {
      saveCatalog(DEFAULT_PRESETS);
      renderStoreProducts();
      renderAdminCatalog();
      showToast('Catalog restored to default factory presets.', 'info');
      logActivity('Catalog reset to factory presets', '🔄');
      playSound('toggle');
    }
  };
}

// Clear Analytics Activity
const adminClearActivityBtn = document.getElementById('adminClearActivityBtn');
if (adminClearActivityBtn) {
  adminClearActivityBtn.onclick = () => {
    localStorage.removeItem(ANALYTICS_ACTIVITY_KEY);
    renderAdminAnalytics();
    showToast('Activity log cleared.', 'info');
    playSound('hover');
  };
}

// Save Live Site Settings
const adminSettingsForm = document.getElementById('adminSettingsForm');
if (adminSettingsForm) {
  adminSettingsForm.onsubmit = (e) => {
    e.preventDefault();
    const discordUrl = document.getElementById('settingDiscordUrl').value.trim();
    const email = document.getElementById('settingContactEmail').value.trim();
    const badge = document.getElementById('settingHeroBadge').value.trim();

    if (!discordUrl) {
      showToast('Discord URL cannot be empty.', 'error');
      return;
    }

    saveSiteSettings({ discordUrl, email, badge });
    renderStoreProducts();
    if (isCloudConfigured()) {
      saveSettingsToCloud({ discordUrl, email, badge });
    }
    showToast('Site settings updated & applied live! ✓', 'success');
    logActivity('Discord & Site configuration updated', '⚙️');
    playSound('pay');
  };
}

// Update Master Admin Credentials Form
const adminSecurityForm = document.getElementById('adminSecurityForm');
if (adminSecurityForm) {
  adminSecurityForm.onsubmit = async (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('secNewUsername').value.trim();
    const newPassword = document.getElementById('secNewPassword').value;
    const confirmPassword = document.getElementById('secConfirmPassword').value;

    if (!newUsername) {
      showToast('Username cannot be empty.', 'error');
      return;
    }

    const credsStr = localStorage.getItem(ADMIN_STORAGE_KEY);
    let creds = { username: 'mineadmin', passwordHash: '' };
    try { creds = JSON.parse(credsStr); } catch(e){}

    creds.username = newUsername;

    if (newPassword) {
      if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
      }
      if (newPassword !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
      }
      creds.passwordHash = await sha256(newPassword);
    }

    creds.updatedAt = Date.now();
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(creds));
    logSecurityAudit(`Admin credentials updated for ID: '${newUsername}'`, 'success');
    showToast('Master Admin credentials successfully updated! 🔐', 'success');
    playSound('pay');
    document.getElementById('secNewPassword').value = '';
    document.getElementById('secConfirmPassword').value = '';
    renderAdminSecurity();
  };
}

// Password toggle in login view
if (toggleAdminPwd) {
  toggleAdminPwd.onclick = () => {
    const isPwd = adminPassField.type === 'password';
    adminPassField.type = isPwd ? 'text' : 'password';
    const openEye = toggleAdminPwd.querySelector('.eye-open');
    const closedEye = toggleAdminPwd.querySelector('.eye-closed');
    if (openEye && closedEye) {
      openEye.style.display = isPwd ? 'none' : 'block';
      closedEye.style.display = isPwd ? 'block' : 'none';
    }
    playSound('toggle');
  };
}

// Event Listeners for Open / Close & Hotkey
if (openAdminBtn) {
  openAdminBtn.onclick = () => openAdminPortal();
}
if (adminPortalClose) {
  adminPortalClose.onclick = () => closeAdminPortal();
}
if (adminPortalModal) {
  adminPortalModal.onclick = (e) => {
    if (e.target === adminPortalModal) closeAdminPortal();
  };
}

// Secret Keyboard Shortcut: Ctrl + Shift + A or Cmd + Shift + A
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && adminPortalModal && adminPortalModal.classList.contains('show')) {
    closeAdminPortal();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
    e.preventDefault();
    if (adminPortalModal && adminPortalModal.classList.contains('show')) {
      closeAdminPortal();
    } else {
      openAdminPortal();
    }
  }
});

// Event Listeners for Cloud Live Sync Tab Controls
const btnSaveCloudConfig = document.getElementById('btnSaveCloudConfig');
const btnPushToCloud = document.getElementById('btnPushToCloud');
const btnPullFromCloud = document.getElementById('btnPullFromCloud');
const btnExportJson = document.getElementById('btnExportJson');
const btnCopyPresetCode = document.getElementById('btnCopyPresetCode');

if (btnSaveCloudConfig) {
  btnSaveCloudConfig.onclick = async () => {
    const urlInput = document.getElementById('cloudDatabaseUrl');
    const rawUrl = urlInput ? urlInput.value.trim() : '';
    if (!rawUrl) {
      showToast('Please enter your Firebase Database URL.', 'error');
      return;
    }

    const cleaned = cleanDatabaseUrl(rawUrl);
    btnSaveCloudConfig.disabled = true;
    btnSaveCloudConfig.textContent = 'Testing Connection... ⏳';

    saveCloudConfig({ databaseURL: cleaned });

    try {
      const res = await fetch(`${cleaned}/catalog.json`);
      if (res.ok) {
        showToast('✓ Cloud Database connected successfully! Initializing Realtime engine...', 'success');
        playSound('pay');
        await initCloudSync();
        renderAdminCloudSync();
        logActivity('Cloud Database connected: ' + cleaned, '☁️');
      } else {
        showToast(`Warning: Server returned status ${res.status}. Check database rules (".read": true, ".write": true).`, 'error');
        updateCloudUIState(false);
      }
    } catch(err) {
      showToast('Could not connect to URL. Please check spelling or internet connection.', 'error');
      updateCloudUIState(false);
    } finally {
      btnSaveCloudConfig.disabled = false;
      btnSaveCloudConfig.textContent = '⚡ Connect & Test Cloud Database';
    }
  };
}

if (btnPushToCloud) {
  btnPushToCloud.onclick = async () => {
    if (!isCloudConfigured()) {
      showToast('Please enter and connect your Firebase Database URL first.', 'error');
      return;
    }
    btnPushToCloud.disabled = true;
    btnPushToCloud.textContent = 'Pushing Presets... ⏳';
    
    const catalog = getCatalog();
    const success = await saveCatalogToCloud(catalog);
    btnPushToCloud.disabled = false;
    btnPushToCloud.textContent = '🚀 Push All Local Presets to Cloud Now';

    if (success) {
      showToast(`🎉 Success! All ${catalog.length} presets synced to Cloud. Live for all visitors!`, 'success');
      playSound('pay');
      logActivity(`Pushed ${catalog.length} presets to live cloud`, '🚀');
    } else {
      showToast('Failed to push to Cloud. Check Firebase Database rules and permissions.', 'error');
    }
  };
}

if (btnPullFromCloud) {
  btnPullFromCloud.onclick = async () => {
    if (!isCloudConfigured()) {
      showToast('Please enter and connect your Firebase Database URL first.', 'error');
      return;
    }
    btnPullFromCloud.disabled = true;
    btnPullFromCloud.textContent = 'Pulling from Cloud... ⏳';
    
    const remote = await fetchCatalogFromCloud();
    btnPullFromCloud.disabled = false;
    btnPullFromCloud.textContent = '📥 Pull Latest from Cloud';

    if (Array.isArray(remote) && remote.length > 0) {
      saveCatalog(remote);
      renderStoreProducts();
      renderAdminCatalog();
      renderAdminCloudSync();
      showToast(`✓ Loaded ${remote.length} presets from Cloud!`, 'success');
      playSound('pay');
      logActivity(`Pulled ${remote.length} presets from cloud`, '📥');
    } else {
      showToast('No presets found in cloud database or could not reach cloud.', 'info');
    }
  };
}

if (btnExportJson) {
  btnExportJson.onclick = () => {
    const catalog = getCatalog();
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mine_presets_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Catalog backup downloaded as JSON! 💾', 'info');
    playSound('hover');
  };
}

if (btnCopyPresetCode) {
  btnCopyPresetCode.onclick = () => {
    const catalog = getCatalog();
    const code = `const DEFAULT_PRESETS = ${JSON.stringify(catalog, null, 2)};`;
    navigator.clipboard.writeText(code).then(() => {
      showToast('DEFAULT_PRESETS code copied to clipboard! 📋', 'success');
      playSound('copy');
    }).catch(() => {
      showToast('Unable to copy code to clipboard.', 'error');
    });
  };
}

// Initialize on page load
initAdminCredentials();
initAnalytics();
initCloudSync();
applySiteSettings(getSiteSettings());
renderStoreProducts();

/* --------------------------------------------------------------------------
   10. INTERSECTION OBSERVER SCROLL REVEALS & TACTILE NAV
   -------------------------------------------------------------------------- */
const revealedSet = new Set();
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (!revealedSet.has(entry.target)) {
        revealedSet.add(entry.target);
        playSound('reveal');
      }
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Tactile sound on all navigation, action, and social links
document.querySelectorAll('.links a, .nav-cta, .actions a, .social-btn').forEach(link => {
  link.addEventListener('click', () => {
    playSound('click');
  });
  link.addEventListener('mouseenter', () => {
    playSound('hover');
  });
});