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
   2. APPLE TITANIUM AMBIENT PARTICLE ENGINE (MONOCHROMATIC STARDUST)
   -------------------------------------------------------------------------- */
(function() {
  const canvas = document.getElementById('weatherCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let W = window.innerWidth;
  let H = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let particles = [];
  let lastTime = performance.now();
  let rafId = 0;
  
  // Subtle mouse tracking for gentle inertial particle dispersion
  let mouse = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: 0, lastY: 0 };
  
  window.addEventListener('mousemove', e => {
    mouse.vx = (e.clientX - mouse.lastX) * 0.2;
    mouse.vy = (e.clientY - mouse.lastY) * 0.2;
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
    
    const count = Math.min(120, Math.max(50, Math.floor(W / 14)));
    particles = Array.from({ length: count }, () => makeParticle(true));
  }

  function makeParticle(initial) {
    return {
      x: Math.random() * W,
      y: initial ? Math.random() * H : -10 - Math.random() * 40,
      r: 0.8 + Math.random() * 1.8,
      baseSpeedY: 0.15 + Math.random() * 0.35,
      drift: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.2 + Math.random() * 0.5,
      vx: 0,
      vy: 0
    };
  }

  function animate(now) {
    const dt = Math.min(32, now - lastTime);
    lastTime = now;
    const t = now * 0.001;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.y += (p.baseSpeedY + p.vy) * dt * 0.06;
      p.x += (Math.sin(t * 0.5 + p.phase) * p.drift + p.vx) * dt * 0.06;

      // Smooth subtle mouse interaction
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const distSq = dx * dx + dy * dy;
      const repelDist = 130;
      if (distSq < repelDist * repelDist && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / repelDist) * 1.5;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
      p.vx *= 0.94;
      p.vy *= 0.94;

      if (p.y > H + 15) {
        Object.assign(p, makeParticle(false));
      }
      if (p.x < -20) p.x = W + 15;
      if (p.x > W + 20) p.x = -15;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
      ctx.shadowBlur = p.r > 1.8 ? 10 : 4;
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
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
    desc: 'Your Footage Deserves This 4K Look. High-dynamic-range curve balance and filmic punch.',
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
    id: 'sys-cleaner',
    name: 'Mine Pc Cleaner',
    price: 200,
    cat: 'system',
    tag: 'FAST BOOST',
    desc: 'You can boost it faster this way. Cleans cache, frees memory, and eliminates timeline lag.',
    artSvg: 'cleaner'
  },
  {
    id: 'sys-megasuite',
    name: 'MINE MEGASUITE',
    price: 2000,
    cat: 'system',
    tag: 'EXTENSIONS (Short cuts)',
    desc: 'Fast & powerful After Effects tools for creators. One-click animations, markers, and workflow macros.',
    artSvg: 'megasuite'
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
  badge: 'TITANIUM 4K MASTER COLLECTION'
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
const DEFAULT_CLOUD_CONFIG = {
  databaseURL: 'https://minegta-web-files-default-rtdb.firebaseio.com'
};

function getCloudConfig() {
  try {
    const raw = localStorage.getItem(CLOUD_CONFIG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.databaseURL && parsed.databaseURL.trim().length > 8) {
        return parsed;
      }
    }
  } catch(e) {}
  return DEFAULT_CLOUD_CONFIG;
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

// Render Products in Live Store (Cleanly Segregated into CC, System, and Transition sections)
function renderStoreProducts() {
  const containerCC = document.getElementById('productsCC');
  const containerSys = document.getElementById('productsSystem');
  const containerTrans = document.getElementById('productsTransition');
  if (!containerCC && !containerSys && !containerTrans) return;

  const catalog = getCatalog();
  const settings = getSiteSettings();

  const ccItems = catalog.filter(p => p.cat === 'cc');
  const sysItems = catalog.filter(p => p.cat === 'system');
  const transItems = catalog.filter(p => p.cat === 'transition');

  // Update category navigation pill counters
  const countCCEl = document.getElementById('countCCNav');
  const countSysEl = document.getElementById('countSysNav');
  const countTransEl = document.getElementById('countTransNav');
  if (countCCEl) countCCEl.textContent = ccItems.length;
  if (countSysEl) countSysEl.textContent = sysItems.length;
  if (countTransEl) countTransEl.textContent = transItems.length;

  let globalCCIndex = 0;
  function renderCard(p) {
    const isCC = p.cat === 'cc';
    const ccIndex = isCC ? globalCCIndex++ : null;
    
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
              <linearGradient id="bgG1_${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050507"/><stop offset="0.5" stop-color="#121216"/><stop offset="1" stop-color="#050507"/></linearGradient>
              <linearGradient id="titaniumGrad_${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff"/><stop offset="50%" stop-color="#a1a1a6"/><stop offset="100%" stop-color="#55555a"/></linearGradient>
              <filter id="glowG1_${p.id}"><feGaussianBlur stdDeviation="20"/></filter>
            </defs>
            <rect width="900" height="520" fill="url(#bgG1_${p.id})"/>
            <circle cx="700" cy="120" r="140" fill="#ffffff" opacity="0.04" filter="url(#glowG1_${p.id})"/>
            <circle cx="180" cy="400" r="130" fill="#a1a1a6" opacity="0.03" filter="url(#glowG1_${p.id})"/>
            <g opacity="0.08" stroke="#ffffff">
              <path d="M0 90H900M0 180H900M0 270H900M0 360H900M0 450H900"/>
              <path d="M90 0V520M180 0V520M270 0V520M360 0V520M450 0V520M540 0V520M630 0V520M720 0V520M810 0V520"/>
            </g>
            <g transform="translate(450 255)">
              <rect x="-280" y="-90" width="560" height="180" rx="22" fill="#0d0d11" stroke="url(#titaniumGrad_${p.id})" stroke-width="1.5"/>
              <text x="0" y="-12" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="44" font-weight="800" letter-spacing="8">TRANSITIONS</text>
              <text x="0" y="34" text-anchor="middle" fill="#86868b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600" letter-spacing="4">SEAMLESS CAMERA MOVES</text>
              <line x1="-120" y1="56" x2="120" y2="56" stroke="url(#titaniumGrad_${p.id})" stroke-width="1.5"/>
            </g>
          </svg>
          <span class="tag">${p.tag || 'Transitions'}</span>
        </div>
      `;
    } else if (p.artSvg === 'cleaner') {
      thumbHtml = `
        <div class="thumb">
          <svg class="upcoming-art" viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PC Cleaner & Fast Booster">
            <defs>
              <linearGradient id="bgCl_${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050507"/><stop offset="0.5" stop-color="#14141e"/><stop offset="1" stop-color="#050507"/></linearGradient>
              <linearGradient id="cleanerGrad_${p.id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#80d0ff"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#3a80df"/></linearGradient>
            </defs>
            <rect width="900" height="520" fill="url(#bgCl_${p.id})"/>
            <g transform="translate(450 240)">
              <rect x="-280" y="-100" width="560" height="200" rx="22" fill="#0a0d14" stroke="url(#cleanerGrad_${p.id})" stroke-width="1.5"/>
              <text x="0" y="-20" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="44" font-weight="800" letter-spacing="4">PC CLEANER</text>
              <text x="0" y="24" text-anchor="middle" fill="#70a0d0" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700" letter-spacing="3">FAST CACHE PURGE • RAM BOOST</text>
              <text x="0" y="60" text-anchor="middle" fill="#86868b" font-family="monospace" font-size="12">1-CLICK OPTIMIZER</text>
            </g>
          </svg>
          <span class="tag">${p.tag || 'FAST BOOST'}</span>
        </div>
      `;
    } else if (p.artSvg === 'megasuite') {
      thumbHtml = `
        <div class="thumb">
          <svg class="upcoming-art" viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="MINE MEGASUITE AE Tools">
            <defs>
              <linearGradient id="bgMs_${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#080507"/><stop offset="0.5" stop-color="#180c10"/><stop offset="1" stop-color="#050507"/></linearGradient>
              <linearGradient id="msGrad_${p.id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#ff4466"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#ff7788"/></linearGradient>
            </defs>
            <rect width="900" height="520" fill="url(#bgMs_${p.id})"/>
            <g transform="translate(450 240)">
              <rect x="-280" y="-100" width="560" height="200" rx="22" fill="#12090c" stroke="url(#msGrad_${p.id})" stroke-width="1.5"/>
              <text x="0" y="-20" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="44" font-weight="800" letter-spacing="4">MINE MEGASUITE</text>
              <text x="0" y="24" text-anchor="middle" fill="#ff7088" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700" letter-spacing="3">AE SHORTCUTS &amp; EXTENSIONS</text>
              <text x="0" y="60" text-anchor="middle" fill="#86868b" font-family="monospace" font-size="12">WORKFLOW ACCELERATOR</text>
            </g>
          </svg>
          <span class="tag">${p.tag || 'EXTENSIONS'}</span>
        </div>
      `;
    } else {
      thumbHtml = `
        <div class="thumb">
          <svg class="upcoming-art" viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Upcoming system preset">
            <defs>
              <linearGradient id="bgS1_${p.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050507"/><stop offset="0.5" stop-color="#14141a"/><stop offset="1" stop-color="#050507"/></linearGradient>
              <linearGradient id="silverGrad_${p.id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#a1a1a6"/><stop offset="50%" stop-color="#ffffff"/><stop offset="100%" stop-color="#6e6e73"/></linearGradient>
            </defs>
            <rect width="900" height="520" fill="url(#bgS1_${p.id})"/>
            <g transform="translate(450 255)">
              <rect x="-280" y="-90" width="560" height="180" rx="22" fill="#0c0c10" stroke="url(#silverGrad_${p.id})" stroke-width="1.5"/>
              <text x="0" y="-12" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-size="44" font-weight="800" letter-spacing="8">SYSTEM 01</text>
              <text x="0" y="34" text-anchor="middle" fill="#86868b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600" letter-spacing="4">FULL WORKFLOW ENGINE</text>
              <line x1="-120" y1="56" x2="120" y2="56" stroke="url(#silverGrad_${p.id})" stroke-width="1.5"/>
            </g>
          </svg>
          <span class="tag">${p.tag || 'System'}</span>
        </div>
      `;
    }

    return `
      <article class="card product ${isCC ? 'cc-card' : ''}" data-cat="${p.cat}" data-id="${p.id}" ${isCC ? `data-index="${ccIndex}"` : ''} style="display: flex; flex-direction: column;">
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
  }

  if (containerCC) containerCC.innerHTML = ccItems.map(renderCard).join('');
  if (containerSys) containerSys.innerHTML = sysItems.map(renderCard).join('');
  if (containerTrans) containerTrans.innerHTML = transItems.map(renderCard).join('');

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
  renderAdminGtaApplications();
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
        ${p.img ? `<img src="${p.img}" alt="${p.name}" class="catalog-item-img">` : `<div class="catalog-item-img" style="background:#121216; display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:11px; font-weight:800;">${p.tag || 'SYS'}</div>`}
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
  if (badge) badge.value = settings.badge || 'TITANIUM 4K MASTER COLLECTION';
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
    if (tabName === 'applications') renderAdminGtaApplications();
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
setupMotionLab();
setupMineGtaSection();
setupBenchmarkSimulator();
setupCinemaWaveform();
setupHeroStageTilt();

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
document.querySelectorAll('.links a, .nav-cta, .actions a, .social-btn, .store-nav-pill').forEach(link => {
  link.addEventListener('click', () => {
    playSound('click');
  });
  link.addEventListener('mouseenter', () => {
    playSound('hover');
  });
});

/* --------------------------------------------------------------------------
   12. KINETIC MOTION GRAPHICS & DYNAMIC COLOR SCIENCE SUITE
   -------------------------------------------------------------------------- */

// A. Kinetic Motion Graphics & Waveform Oscilloscope Suite (Interactive S-Curve & Radar)
function setupMotionLab() {
  const canvas = document.getElementById('motionLabCanvas');
  const wrap = document.getElementById('motionCanvasWrap');
  if (!canvas || !wrap) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const modeChips = document.querySelectorAll('.scope-mode-chip');
  const telLuma = document.getElementById('telLuma');
  const telDelta = document.getElementById('telDelta');
  const telFreq = document.getElementById('telFreq');

  let activeMode = 'scurve'; // 'scurve' | 'parade' | 'beatsync' | 'vector'
  let animId = null;
  let isVisible = true;
  let time = 0;
  let lastBeatTime = 0;
  let beatPulse = 0;

  // Pointer tracking & smooth lerp
  let pointerActive = false;
  let rawPointerX = 0.5;
  let rawPointerY = 0.5;
  let smoothPointerX = 0.5;
  let smoothPointerY = 0.5;

  // Vector mode phosphor particles
  const vectorParticles = [];
  for (let i = 0; i < 90; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.pow(Math.random(), 0.7) * 0.75;
    vectorParticles.push({
      angle,
      dist,
      baseDist: dist,
      speed: (Math.random() - 0.5) * 0.02,
      jitter: Math.random() * Math.PI * 2,
      size: Math.random() < 0.2 ? 2.5 : 1.5
    });
  }

  // Audio spectrum bins
  const SPECTRUM_BINS = 48;
  const binHeights = new Float32Array(SPECTRUM_BINS);
  const binTargets = new Float32Array(SPECTRUM_BINS);

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Pointer interactions on canvas wrapper
  function updatePointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    rawPointerX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    rawPointerY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    pointerActive = true;
  }

  wrap.addEventListener('pointerenter', () => { pointerActive = true; });
  wrap.addEventListener('pointerdown', (e) => {
    updatePointerPos(e);
    playSound('click');
  });
  wrap.addEventListener('pointermove', updatePointerPos);
  wrap.addEventListener('pointerleave', () => {
    pointerActive = false;
    rawPointerX = 0.5;
    rawPointerY = 0.5;
  });

  // Mode switcher chips
  modeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const mode = chip.dataset.mode;
      if (!mode || mode === activeMode) return;
      activeMode = mode;
      modeChips.forEach(c => c.classList.toggle('active', c === chip));
      playSound('click');
      playSound('zoom');

      // Update telemetry readouts instantly
      if (telFreq) {
        if (mode === 'scurve') telFreq.innerHTML = '24Hz — 48kHz <small>[BEAT-SYNCED]</small>';
        else if (mode === 'parade') telFreq.innerHTML = '3-CH MONOCHROME <small>[ACEScg REC.709]</small>';
        else if (mode === 'beatsync') telFreq.innerHTML = '128.0 BPM <small>[TRANSIENT LOCK]</small>';
        else if (mode === 'vector') telFreq.innerHTML = '360° POLAR GAMUT <small>[LEGAL BOUNDS]</small>';
      }
    });
  });

  // Intersection observer for zero CPU overhead offscreen
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animId) {
      animId = requestAnimationFrame(renderLoop);
    }
  }, { threshold: 0.05 });
  observer.observe(canvas);

  // Main Render Loop (120 FPS capable)
  function renderLoop(timestamp) {
    if (!isVisible) {
      animId = null;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    if (w <= 0 || h <= 0) {
      animId = requestAnimationFrame(renderLoop);
      return;
    }

    time += 0.024;
    smoothPointerX += (rawPointerX - smoothPointerX) * 0.08;
    smoothPointerY += (rawPointerY - smoothPointerY) * 0.08;

    // Simulate rhythmic beat kick
    if (timestamp - lastBeatTime > 468) { // ~128 BPM
      lastBeatTime = timestamp;
      beatPulse = 1.0;
    }
    beatPulse *= 0.92;

    // Clear background
    ctx.clearRect(0, 0, w, h);

    // Draw Graticule Lines
    drawGraticuleGrid(w, h);

    // Render active mode
    if (activeMode === 'scurve') {
      renderCinemaSCurve(w, h);
    } else if (activeMode === 'parade') {
      renderRgbParade(w, h);
    } else if (activeMode === 'beatsync') {
      renderBeatSyncAudio(w, h);
    } else if (activeMode === 'vector') {
      renderVectorscopeRadar(w, h);
    }

    // Interactive pointer HUD crosshair & readout
    if (pointerActive) {
      drawInteractiveReticle(w, h);
    }

    // Dynamic Telemetry updates (every ~10 frames)
    if (Math.floor(time * 30) % 10 === 0) {
      updateTelemetryValues();
    }

    animId = requestAnimationFrame(renderLoop);
  }

  // --- Sub-renderer: Graticule Grid ---
  function drawGraticuleGrid(w, h) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.setLineDash([4, 6]);

    // Horizontal IRE steps (1000, 800, 600, 400, 200, 0)
    const steps = [0.12, 0.28, 0.44, 0.60, 0.76, 0.92];
    const labels = ['1023 IRE', '800 IRE', '600 IRE', '400 IRE', '200 IRE', '0 IRE'];

    steps.forEach((ratio, idx) => {
      const y = h * ratio;
      ctx.beginPath();
      ctx.moveTo(48, y);
      ctx.lineTo(w - 24, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(labels[idx], 8, y + 3);
    });

    // Vertical dividing sections
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.setLineDash([2, 8]);
    for (let x = 120; x < w - 40; x += (w - 160) / 4) {
      ctx.beginPath();
      ctx.moveTo(x, h * 0.1);
      ctx.lineTo(x, h * 0.94);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Mode 1: Cinema S-Curve (Direct homage to Image 2) ---
  function renderCinemaSCurve(w, h) {
    const leftPad = 64;
    const rightPad = 32;
    const usableW = w - leftPad - rightPad;

    // 1. Far-Left Vertical Luma Exposure Density Bar (matching Image 2)
    ctx.save();
    const barX = 46;
    const barW = 12;
    const barYTop = h * 0.12;
    const barH = h * 0.8;

    // Outer subtle boundary
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barYTop, barW, barH);

    // Gradient density
    const grad = ctx.createLinearGradient(0, barYTop + barH, 0, barYTop);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.18)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(barX + 1, barYTop + 1, barW - 2, barH - 2);

    // Active exposure marker tick
    const activeIreRatio = 0.82 - (smoothPointerY - 0.5) * 0.2;
    const markerY = barYTop + barH * (1 - Math.max(0.05, Math.min(0.95, activeIreRatio)));
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.fillRect(barX - 2, markerY - 1.5, barW + 4, 3);
    ctx.restore();

    // 2. Secondary Harmonic Wave (Thinner, woven wave)
    ctx.save();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    for (let i = 0; i <= usableW; i += 3) {
      const x = leftPad + i;
      const nx = i / usableW;
      const k = 6.0 + (smoothPointerY - 0.5) * 2.5;
      const x0 = 0.5 + (smoothPointerX - 0.5) * 0.2;
      const s = 1 / (1 + Math.exp(-k * (nx - x0)));
      const harmonic = Math.sin(nx * 14 + time * 1.5) * 0.05 + Math.cos(nx * 26 - time * 0.9) * 0.025;
      const y = h * (0.88 - s * 0.72 + harmonic);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // 3. Primary Glowing White S-Curve (The Hero Beam)
    ctx.save();
    ctx.lineWidth = 3.6;
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    for (let i = 0; i <= usableW; i += 2) {
      const x = leftPad + i;
      const nx = i / usableW;
      const k = 6.8 + (smoothPointerY - 0.5) * 3.2;
      const x0 = 0.48 + (smoothPointerX - 0.5) * 0.25;
      const s = 1 / (1 + Math.exp(-k * (nx - x0)));
      const ripple = Math.sin(nx * 18 + time * 1.8) * 0.028 + Math.sin(nx * 36 - time * 2.2) * 0.012;
      const y = h * (0.86 - s * 0.72 + ripple);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // 4. Stippled Phosphor Sparkle Points (exact match to Image 2 dots!)
    ctx.save();
    for (let j = 0; j < 56; j++) {
      const pxRatio = ((j * 0.018 + (time * 0.045)) % 1);
      const px = leftPad + pxRatio * usableW;
      const k = 6.8 + (smoothPointerY - 0.5) * 3.2;
      const x0 = 0.48 + (smoothPointerX - 0.5) * 0.25;
      const s = 1 / (1 + Math.exp(-k * (pxRatio - x0)));
      const jitterY = (Math.sin(j * 4.2 + time * 3) * 16) + (Math.cos(j * 7.1) * 8);
      const py = h * (0.86 - s * 0.72) + jitterY;

      const alpha = 0.45 + Math.sin(j + time * 4) * 0.4;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
      const sz = (j % 4 === 0) ? 2.4 : 1.4;
      ctx.fillRect(px, py, sz, sz);
    }
    ctx.restore();

    // 5. Cathode Ray Tube Scan Line Sweep
    ctx.save();
    const sweepProgress = (time * 0.28) % 1.2 - 0.1;
    const sweepX = leftPad + sweepProgress * usableW;
    if (sweepX >= leftPad && sweepX <= leftPad + usableW) {
      const sweepGrad = ctx.createLinearGradient(sweepX - 28, 0, sweepX + 28, 0);
      sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.28)');
      sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(sweepX - 28, h * 0.08, 56, h * 0.84);
    }
    ctx.restore();
  }

  // --- Mode 2: RGB Parade Monochrome ---
  function renderRgbParade(w, h) {
    const startX = 64;
    const usableW = w - startX - 32;
    const channelW = usableW / 3;
    const channels = [
      { name: 'R - RED LUMA', offset: 0, phase: 0 },
      { name: 'G - GREEN LUMA', offset: 1, phase: 2.1 },
      { name: 'B - BLUE LUMA', offset: 2, phase: 4.2 }
    ];

    channels.forEach(ch => {
      const cx = startX + ch.offset * channelW;

      // Channel header
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(ch.name, cx + 12, h * 0.12);

      // Channel partition border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(cx + channelW - 8, h * 0.1);
      ctx.lineTo(cx + channelW - 8, h * 0.92);
      ctx.stroke();

      // Density Waveform Envelope (Multi-harmonic high frequency trace)
      ctx.save();
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.lineWidth = layer === 1 ? 2.2 : 1.2;
        ctx.strokeStyle = layer === 1 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.35)';
        if (layer === 1) {
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.shadowBlur = 10;
        }

        for (let ix = 8; ix < channelW - 20; ix += 3) {
          const nx = ix / (channelW - 28);
          const t = time * 2.2 + ch.phase + layer * 1.4;
          const noise1 = Math.sin(nx * 12 + t) * 0.18;
          const noise2 = Math.sin(nx * 28 - t * 1.5) * 0.08;
          const noise3 = Math.cos(nx * 44 + t * 0.8) * 0.04;
          const mouseLift = (0.5 - smoothPointerY) * 0.2 * (layer === 1 ? 1 : 0.6);
          const baseLevel = 0.55 + (ch.offset - 1) * 0.06;
          const y = h * (baseLevel - (noise1 + noise2 + noise3 + mouseLift));

          if (ix === 8) ctx.moveTo(cx + ix, y);
          else ctx.lineTo(cx + ix, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // Phosphor noise grains within the channel
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let g = 0; g < 24; g++) {
        const gx = cx + 10 + (Math.sin(g * 3.7 + time * 2) * 0.5 + 0.5) * (channelW - 32);
        const gy = h * (0.35 + (Math.cos(g * 5.1 + time * 1.8) * 0.5 + 0.5) * 0.48);
        ctx.fillRect(gx, gy, 1.4, 1.4);
      }
    });
  }

  // --- Mode 3: Beat-Sync Audio Equalizer Spectrum ---
  function renderBeatSyncAudio(w, h) {
    const startX = 64;
    const usableW = w - startX - 32;
    const barW = usableW / SPECTRUM_BINS;

    // Simulate transient bounce and beat energy
    for (let i = 0; i < SPECTRUM_BINS; i++) {
      const freqRatio = i / SPECTRUM_BINS;
      const bassInfluence = Math.exp(-freqRatio * 3.5) * beatPulse * 0.55;
      const noise = (Math.sin(i * 0.45 + time * 4.5) * 0.5 + 0.5) * 0.35;
      const mouseBoost = (1 - Math.abs(freqRatio - smoothPointerX)) * (1 - smoothPointerY) * 0.4;
      binTargets[i] = Math.max(0.08, Math.min(0.92, bassInfluence + noise + mouseBoost));
      binHeights[i] += (binTargets[i] - binHeights[i]) * 0.24;
    }

    // Draw Spectrum Bars
    ctx.save();
    for (let i = 0; i < SPECTRUM_BINS; i++) {
      const bh = binHeights[i] * h * 0.68;
      const bx = startX + i * barW + barW * 0.15;
      const bw = barW * 0.7;
      const by = h * 0.86 - bh;

      // Bar Body Gradient
      const grad = ctx.createLinearGradient(0, h * 0.86, 0, by);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
      grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.45)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(bx, by, bw, bh);

      // Glowing Cap
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fillRect(bx, by - 2, bw, 2);
    }
    ctx.restore();

    // Continuous Harmonic Spline on top
    ctx.save();
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let i = 0; i < SPECTRUM_BINS; i++) {
      const bx = startX + i * barW + barW * 0.5;
      const by = h * 0.86 - binHeights[i] * h * 0.68 - 4;
      if (i === 0) ctx.moveTo(bx, by);
      else {
        const prevBx = startX + (i - 1) * barW + barW * 0.5;
        const prevBy = h * 0.86 - binHeights[i - 1] * h * 0.68 - 4;
        const cx = (prevBx + bx) / 2;
        const cy = (prevBy + by) / 2;
        ctx.quadraticCurveTo(prevBx, prevBy, cx, cy);
      }
    }
    ctx.stroke();
    ctx.restore();
  }

  // --- Mode 4: Vectorscope Radar Reticle ---
  function renderVectorscopeRadar(w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w * 0.38, h * 0.42);

    ctx.save();
    // Concentric Saturation Circles (20%, 40%, 60%, 80%, 100%)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1.0].forEach(factor => {
      ctx.beginPath();
      ctx.arc(cx, cy, radius * factor, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs (I & Q axes)
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - radius * 1.1, cy);
    ctx.lineTo(cx + radius * 1.1, cy);
    ctx.moveTo(cx, cy - radius * 1.1);
    ctx.lineTo(cx, cy + radius * 1.1);
    ctx.stroke();

    // Skin Tone Reference Line (135° angle, cinema standard)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.setLineDash([]);
    ctx.beginPath();
    const skinAngle = -Math.PI * 0.72; // ~130°
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(skinAngle) * radius * 1.05, cy + Math.sin(skinAngle) * radius * 1.05);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('SKIN TONE I-AXIS', cx + Math.cos(skinAngle) * radius * 1.08 - 20, cy + Math.sin(skinAngle) * radius * 1.08 - 6);

    // Six Legal Color Gamut Target Boxes (R, Mg, B, Cy, G, Yl)
    const targets = [
      { name: 'R', angle: 0.18 * Math.PI },
      { name: 'Mg', angle: 0.48 * Math.PI },
      { name: 'B', angle: 0.85 * Math.PI },
      { name: 'Cy', angle: 1.18 * Math.PI },
      { name: 'G', angle: 1.48 * Math.PI },
      { name: 'Yl', angle: 1.85 * Math.PI }
    ];
    targets.forEach(tgt => {
      const tx = cx + Math.cos(tgt.angle) * radius * 0.75;
      const ty = cy + Math.sin(tgt.angle) * radius * 0.75;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.strokeRect(tx - 6, ty - 6, 12, 12);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(tgt.name, tx - 3, ty + 18);
    });

    // Rotating Radar Sweep Beam
    const sweepAngle = time * 1.8;
    const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, sweepAngle - 0.4, sweepAngle, false);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fill();
    ctx.restore();

    // Radar Lead Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.6;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepAngle) * radius, cy + Math.sin(sweepAngle) * radius);
    ctx.stroke();

    // Chroma Vector Particle Cluster (Dancing inside the legal gamut)
    const mouseOffX = (smoothPointerX - 0.5) * 50;
    const mouseOffY = (smoothPointerY - 0.5) * 50;
    vectorParticles.forEach(p => {
      p.angle += p.speed;
      p.dist = p.baseDist + Math.sin(time * 3 + p.jitter) * 0.05;
      const px = cx + Math.cos(p.angle) * radius * p.dist + mouseOffX;
      const py = cy + Math.sin(p.angle) * radius * p.dist + mouseOffY;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.fillRect(px, py, p.size, p.size);
    });
    ctx.restore();
  }

  // --- Pointer HUD Reticle & Tooltip ---
  function drawInteractiveReticle(w, h) {
    const px = w * smoothPointerX;
    const py = h * smoothPointerY;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.setLineDash([2, 4]);
    ctx.lineWidth = 1;

    // Crosshair lines
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, h);
    ctx.moveTo(0, py);
    ctx.lineTo(w, py);
    ctx.stroke();

    // Target box
    ctx.setLineDash([]);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.strokeRect(px - 7, py - 7, 14, 14);

    // Reticle Tooltip Pill
    const ireVal = Math.round((1 - smoothPointerY) * 1023);
    const text = `IRE: ${ireVal} • SIG: ${(smoothPointerX * 100).toFixed(0)}%`;
    ctx.font = '10px "JetBrains Mono", monospace';
    const tw = ctx.measureText(text).width + 16;
    const boxX = Math.min(w - tw - 10, Math.max(10, px + 12));
    const boxY = Math.min(h - 26, Math.max(10, py - 18));

    ctx.fillStyle = 'rgba(10, 10, 14, 0.88)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.fillRect(boxX, boxY, tw, 20);
    ctx.strokeRect(boxX, boxY, tw, 20);

    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.fillText(text, boxX + 8, boxY + 14);
    ctx.restore();
  }

  // --- Dynamic Telemetry Strip Text Update ---
  function updateTelemetryValues() {
    if (telLuma) {
      const activeIre = Math.round(820 + Math.sin(time * 3) * 28 + (1 - smoothPointerY) * 120);
      telLuma.innerHTML = `0 — 1023 <small>[ACTIVE: ${Math.min(1023, Math.max(0, activeIre))}]</small>`;
    }
    if (telDelta) {
      const delta = (0.04 + Math.sin(time * 2) * 0.02).toFixed(3);
      telDelta.innerHTML = `DELTA &lt; ${delta}% <small>[ZERO BANDING]</small>`;
    }
  }

  animId = requestAnimationFrame(renderLoop);
}

// B. Interactive 1-Click System Performance Simulator (Master Systems Vault)
function setupBenchmarkSimulator() {
  const btn = document.getElementById('btnRunBenchmark');
  const meterNum = document.getElementById('meterNum');
  const meterFill = document.getElementById('meterFill');
  const meterStatus = document.getElementById('meterStatus');
  const fpsVal = document.getElementById('bmFpsVal');
  const cacheVal = document.getElementById('bmCacheVal');
  const lagVal = document.getElementById('bmLagVal');

  if (!btn || !meterNum) return;

  let isRunning = false;
  btn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    btn.disabled = true;

    playSound('click');
    if (meterStatus) meterStatus.textContent = '⚡ PURGING DISK CACHE & OVERCLOCKING AE...';
    if (meterFill) meterFill.style.strokeDashoffset = '340';

    let currentFps = 28;
    meterNum.textContent = currentFps;
    if (fpsVal) fpsVal.textContent = '28 FPS (LAGGING)';
    if (cacheVal) cacheVal.textContent = 'SCANNING...';
    if (lagVal) lagVal.textContent = '48.5 ms';

    const interval = setInterval(() => {
      currentFps += Math.floor(Math.random() * 12) + 8;
      if (currentFps >= 120) {
        currentFps = 120;
        clearInterval(interval);

        meterNum.textContent = '120+';
        if (meterFill) meterFill.style.strokeDashoffset = '70';
        if (meterStatus) meterStatus.textContent = '✓ 4.2 GB FREED • 120 FPS LOCKED!';
        if (fpsVal) fpsVal.textContent = '120+ FPS (MAX)';
        if (cacheVal) cacheVal.textContent = '4.2 GB FREED';
        if (lagVal) lagVal.textContent = '0.0 ms';

        playSound('pay');
        showToast('🚀 System Cleared! Timeline playback accelerated to 120 FPS with zero lag.', 'success');
        isRunning = false;
        btn.disabled = false;
      } else {
        meterNum.textContent = currentFps;
      }
    }, 60);
  });
}

// B. Apple Cinema Waveform / Oscilloscope Engine (Bento Grid)
function setupCinemaWaveform() {
  const canvas = document.getElementById('waveformCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animFrameId = null;
  let isVisible = true;
  let time = 0;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Pause rendering when canvas is outside viewport to maximize performance
  const obs = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animFrameId) {
      renderWaveform();
    }
  }, { threshold: 0.05 });
  obs.observe(canvas);

  function renderWaveform() {
    if (!isVisible) {
      animFrameId = null;
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 520;
    const h = rect.height || 160;

    ctx.clearRect(0, 0, w, h);

    // 1. Graticule Scale Lines (Luma IRE levels)
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.setLineDash([4, 4]);

    const ireSteps = [0.15, 0.35, 0.55, 0.75, 0.9];
    ireSteps.forEach(ratio => {
      const y = h * ratio;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // 2. Dynamic Waveform S-Curves (Cinema Optics Simulation)
    time += 0.035;

    // Harmonic Envelope
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    for (let x = 0; x < w; x += 3) {
      const nx = x / w;
      const baseS = 1 / (1 + Math.exp(-6 * (nx - 0.5)));
      const ripple = Math.sin(nx * 12 + time) * 0.06 + Math.cos(nx * 22 - time * 0.8) * 0.03;
      const y = h * (0.88 - baseS * 0.72 + ripple);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Core Phosphor Luminous Beam
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let x = 0; x < w; x += 2) {
      const nx = x / w;
      const baseS = 1 / (1 + Math.exp(-6.8 * (nx - 0.48)));
      const noise = Math.sin(nx * 16 + time * 1.4) * 0.04 + Math.sin(nx * 32 - time * 1.8) * 0.02;
      const y = h * (0.86 - baseS * 0.72 + noise);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // High-Density Phosphor Grain
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 42; i++) {
      const px = ((i * 13 + (time * 45)) % w);
      const nx = px / w;
      const baseS = 1 / (1 + Math.exp(-6.8 * (nx - 0.48)));
      const jitter = (Math.sin(i * 3.7 + time * 2) * 12);
      const py = h * (0.86 - baseS * 0.72) + jitter;
      const sz = (i % 3 === 0) ? 2 : 1.2;
      ctx.fillRect(px, py, sz, sz);
    }

    // Modern Scan Line Sweep
    const sweepX = (time * 70) % (w + 40) - 20;
    if (sweepX >= 0 && sweepX <= w) {
      const grad = ctx.createLinearGradient(sweepX - 20, 0, sweepX + 20, 0);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(sweepX - 20, 0, 40, h);
    }

    animFrameId = requestAnimationFrame(renderWaveform);
  }

  renderWaveform();
}

// C. Hero 3D Kinetic Stage Gyroscope Tilt & Specular Shine
function setupHeroStageTilt() {
  const stage = document.getElementById('heroStage');
  const card = document.getElementById('heroKineticCard');
  if (!stage || !card) return;

  let bounds = null;
  let rafId = null;
  let targetRotateX = 0;
  let targetRotateY = 0;
  let currentRotateX = 0;
  let currentRotateY = 0;

  function updateTilt() {
    currentRotateX += (targetRotateX - currentRotateX) * 0.08;
    currentRotateY += (targetRotateY - currentRotateY) * 0.08;

    card.style.transform = `perspective(1000px) rotateX(${currentRotateX.toFixed(2)}deg) rotateY(${currentRotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

    if (Math.abs(targetRotateX - currentRotateX) > 0.01 || Math.abs(targetRotateY - currentRotateY) > 0.01) {
      rafId = requestAnimationFrame(updateTilt);
    } else {
      rafId = null;
    }
  }

  function onPointerMove(e) {
    if (!bounds) bounds = stage.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    const xRatio = Math.max(0, Math.min(1, mouseX / bounds.width));
    const yRatio = Math.max(0, Math.min(1, mouseY / bounds.height));

    card.style.setProperty('--stage-x', `${(xRatio * 100).toFixed(1)}%`);
    card.style.setProperty('--stage-y', `${(yRatio * 100).toFixed(1)}%`);

    targetRotateX = ((0.5 - yRatio) * 16);
    targetRotateY = ((xRatio - 0.5) * 16);

    if (!rafId) {
      rafId = requestAnimationFrame(updateTilt);
    }
  }

  function onPointerLeave() {
    targetRotateX = 0;
    targetRotateY = 0;
    card.style.setProperty('--stage-x', '50%');
    card.style.setProperty('--stage-y', '50%');
    if (!rafId) {
      rafId = requestAnimationFrame(updateTilt);
    }
  }

  stage.addEventListener('pointerenter', () => {
    bounds = stage.getBoundingClientRect();
  });
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerleave', onPointerLeave);
}

/* --------------------------------------------------------------------------
   13. MINE GTA — AFTER EFFECTS PROFESSIONAL COURSE & ADMISSIONS CONTROLLER
   Direct Application Delivery to: amangta599990@gmail.com
   -------------------------------------------------------------------------- */
const GTA_APPLICATIONS_KEY = 'mine_gta_applications_v1';

function getGtaApplications() {
  try {
    return JSON.parse(localStorage.getItem(GTA_APPLICATIONS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveGtaApplication(record) {
  try {
    const list = getGtaApplications();
    list.unshift(record);
    localStorage.setItem(GTA_APPLICATIONS_KEY, JSON.stringify(list));
  } catch (e) {}
}

// Global Course Month Selector (Invoked by Month Cards)
window.selectCourseMonth = function(monthString) {
  const selectEl = document.getElementById('gtaCourse');
  if (selectEl) {
    selectEl.value = monthString;
  }
  const applySection = document.getElementById('apply');
  if (applySection) {
    applySection.scrollIntoView({ behavior: 'smooth' });
  }
  playSound('click');
  showToast(`Selected: ${monthString}`, 'info');

  const nameInput = document.getElementById('gtaName');
  if (nameInput) {
    setTimeout(() => nameInput.focus(), 600);
  }
};

function setupMineGtaSection() {
  const container = document.getElementById('course') || document.getElementById('mine-gta');
  if (!container) return;

  const tabBtns = container.querySelectorAll('.gta-tab-btn');
  const panels = container.querySelectorAll('.gta-month-panel');
  const roadmapContainer = container.querySelector('.gta-roadmap-container');
  const applyForm = document.getElementById('gtaApplyForm');
  const submitBtn = document.getElementById('gtaSubmitBtn');
  const btnSpinner = document.getElementById('gtaBtnSpinner');
  const statusBox = document.getElementById('gtaFormStatus');
  const whatsappLink = document.getElementById('gtaWhatsappLink');
  const gmailDirectBtn = document.getElementById('btnSendFromMyGmail');

  // Real-time Gmail compose link updater as student types
  function updateDirectGmailLink() {
    const name = (document.getElementById('gtaName')?.value || '').trim();
    const city = (document.getElementById('gtaAddress')?.value || '').trim();
    const email = (document.getElementById('gtaEmail')?.value || '').trim();
    const phone = (document.getElementById('gtaPhone')?.value || '').trim();
    const course = document.getElementById('gtaCourse')?.value || 'Complete 4-Month Masterclass';
    const notes = (document.getElementById('gtaNotes')?.value || '').trim();

    const subject = `MINE GTA Course Application - ${name || 'New Student'}`;
    const body = 
`Hello Aman Sir,

I want to enroll in the MINE GTA After Effects Professional Course.

• Student Name: ${name || '[Your Name]'}
• Address / City: ${city || '[Your City]'}
• Student Personal Gmail: ${email || '[Your Gmail]'}
• Phone / WhatsApp: ${phone || '[Your Phone]'}
• Selected Program: ${course}
• Goals / Message: ${notes || 'Ready to learn!'}

Please review my application and share the enrollment & payment details.

Thank you,
${name || 'Student'}`;

    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=amangta599990@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (gmailDirectBtn) {
      gmailDirectBtn.href = gmailWebUrl;
      gmailDirectBtn.title = `Send directly from your logged-in Gmail to amangta599990@gmail.com`;
    }
  }

  ['gtaName', 'gtaAddress', 'gtaEmail', 'gtaPhone', 'gtaCourse', 'gtaNotes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateDirectGmailLink);
      el.addEventListener('change', updateDirectGmailLink);
    }
  });
  updateDirectGmailLink();

  // 1. Month Tab Navigation (if present)
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetMonth = btn.dataset.month;
      if (!targetMonth) return;

      tabBtns.forEach(b => b.classList.toggle('active', b === btn));
      playSound('click');
      playSound('reveal');

      if (targetMonth === 'all') {
        if (roadmapContainer) roadmapContainer.classList.add('show-all');
        panels.forEach(p => p.classList.add('active'));
      } else {
        if (roadmapContainer) roadmapContainer.classList.remove('show-all');
        panels.forEach(p => {
          p.classList.toggle('active', p.dataset.panel === targetMonth);
        });
      }
    });
  });

  // 2. Application Form Submission (Locked to amangta599990@gmail.com)
  if (applyForm) {
    applyForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('gtaName');
      const addrInput = document.getElementById('gtaAddress');
      const emailInput = document.getElementById('gtaEmail');
      const phoneInput = document.getElementById('gtaPhone');
      const courseInput = document.getElementById('gtaCourse');
      const levelInput = document.getElementById('gtaLevel');
      const notesInput = document.getElementById('gtaNotes');

      const name = nameInput ? nameInput.value.trim() : '';
      const address = addrInput ? addrInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const course = courseInput ? courseInput.value : 'Complete 4-Month Masterclass';
      const level = levelInput ? levelInput.value : 'Intermediate';
      const notes = notesInput ? notesInput.value.trim() : '';

      // Validation
      if (!name || name.length < 2) {
        showStatus('Please enter your full student name.', 'error');
        if (nameInput) nameInput.focus();
        playSound('warning');
        return;
      }
      if (!address || address.length < 3) {
        showStatus('Please enter your address or city.', 'error');
        if (addrInput) addrInput.focus();
        playSound('warning');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showStatus('Please enter a valid Gmail / Email address.', 'error');
        if (emailInput) emailInput.focus();
        playSound('warning');
        return;
      }
      const phoneClean = phone.replace(/[^0-9+]/g, '');
      if (!phoneClean || phoneClean.length < 8) {
        showStatus('Please enter a valid WhatsApp / Phone number with country code.', 'error');
        if (phoneInput) phoneInput.focus();
        playSound('warning');
        return;
      }

      // UI Loading state
      if (submitBtn) submitBtn.disabled = true;
      if (btnSpinner) btnSpinner.style.display = 'inline-block';
      const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
      if (btnText) btnText.textContent = 'Dispatching to amangta599990@gmail.com...';

      const applicationId = 'GTA-' + Math.floor(100000 + Math.random() * 900000);
      const appRecord = {
        id: applicationId,
        name,
        address,
        email,
        phone,
        course,
        level,
        notes: notes || 'None',
        timestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleString()
      };

      // FormSubmit payload (Direct to amangta599990@gmail.com with _replyto: student's Gmail)
      const payload = {
        _subject: `🔥 [MINE GTA COURSE APPLICATION] ${name} - ${course} (${applicationId})`,
        _template: 'table',
        _captcha: 'false',
        _replyto: email,
        "Application ID": applicationId,
        "Student Full Name": name,
        "Address / City": address,
        "Student Gmail": email,
        "WhatsApp / Phone": phone,
        "Selected Course Program": course,
        "Current Experience Level": level,
        "Student Goals & Notes": notes || 'Not provided',
        "Application Date": appRecord.formattedDate
      };

      try {
        await fetch('https://formsubmit.co/ajax/amangta599990@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        // Always save locally so owner never loses applications even offline
        saveGtaApplication(appRecord);

        playSound('pay');
        showToast('✓ Application Dispatched to amangta599990@gmail.com! 🚀', 'success');

        const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=amangta599990@gmail.com&su=${encodeURIComponent(`MINE GTA Application Confirmation (${applicationId}) - ${name}`)}&body=${encodeURIComponent(`Hello Aman Sir, I just submitted my application for ${course}.\nMy Phone: ${phone}\nMy Gmail: ${email}`)}`;

        showStatus(
          `<strong>✓ Application Dispatched to amangta599990@gmail.com!</strong><br>` +
          `Thank you, <strong>${name}</strong> (Enrollment ID: <code>${applicationId}</code>). ` +
          `Selected Course: <strong>${course}</strong>.<br>` +
          `Aman Sir will contact you directly at your Gmail (<strong>${email}</strong>) and WhatsApp within 24 hours.<br><br>` +
          `<a href="${composeUrl}" target="_blank" style="display:inline-block; margin-top:8px; padding:8px 18px; border-radius:999px; background:#ffffff; color:#000000; font-weight:700; text-decoration:none;">✉️ Open My Gmail to Send Direct Copy &rarr;</a>`,
          'success'
        );

        applyForm.reset();
        updateDirectGmailLink();
      } catch (err) {
        // Fallback save and notice
        saveGtaApplication(appRecord);
        playSound('pay');

        showStatus(
          `<strong>✓ Application Recorded (ID: ${applicationId})!</strong><br>` +
          `Details captured for <strong>${name}</strong>. Selected Program: <strong>${course}</strong>.<br>` +
          `Click below to send directly from your personal Gmail app to <strong>amangta599990@gmail.com</strong>.`,
          'success'
        );
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnSpinner) btnSpinner.style.display = 'none';
        if (btnText) btnText.textContent = 'Submit Application To Aman Sir ↗';
      }
    });
  }

  function showStatus(html, type) {
    if (!statusBox) return;
    statusBox.className = `gta-form-status ${type}`;
    statusBox.innerHTML = html;
    statusBox.style.display = 'block';
  }
}

// Admin Panel GTA Admissions Renderer
function sanitizeGta(str) {
  const d = document.createElement('div');
  d.textContent = String(str || '');
  return d.innerHTML;
}

function renderAdminGtaApplications() {
  const apps = getGtaApplications();
  const countEl = document.getElementById('gtaAppsCount');
  if (countEl) countEl.textContent = apps.length;

  const listEl = document.getElementById('gtaAppsList');
  if (!listEl) return;

  if (apps.length === 0) {
    listEl.innerHTML = `
      <div style="padding:40px 20px; text-align:center; color:var(--text-muted); background:rgba(255,255,255,0.02); border-radius:12px; border:1px dashed rgba(255,255,255,0.1);">
        <p style="font-size:15px; margin-bottom:6px; color:#ffffff;">No student applications received yet.</p>
        <span style="font-size:12px; color:var(--text-dim);">When students submit the MINE GTA form on the site, their profile will be delivered directly to <strong>amangta599990@gmail.com</strong> and also appear here.</span>
      </div>
    `;
    return;
  }

  listEl.innerHTML = apps.map(app => {
    const waText = encodeURIComponent(`Hello ${app.name}, this is Aman from MINE GTA regarding your course application (${app.id}).`);
    const cleanPhone = (app.phone || '').replace(/[^0-9]/g, '');
    const waUrl = `https://wa.me/${cleanPhone}?text=${waText}`;
    const mailUrl = `mailto:${app.email}?subject=MINE%20GTA%20Course%20Admission%20-%20Confirmation%20for%20${encodeURIComponent(app.name)}`;

    return `
      <div class="admin-app-card" style="background:rgba(20,16,30,0.85); border:1px solid rgba(168,85,247,0.3); border-radius:14px; padding:18px 20px; margin-bottom:14px; display:flex; flex-direction:column; gap:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <span style="font-family:'JetBrains Mono',monospace; font-size:11px; background:rgba(147,51,234,0.25); color:#d8b4fe; padding:3px 8px; border-radius:6px; font-weight:700;">${app.id}</span>
            <strong style="font-size:16px; color:#ffffff; margin-left:8px;">${sanitizeGta(app.name)}</strong>
          </div>
          <span style="font-size:11px; color:#a1a1aa; font-family:'JetBrains Mono',monospace;">${app.formattedDate || ''}</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; font-size:13px; color:#d4d4d8; background:rgba(0,0,0,0.3); padding:12px 14px; border-radius:8px;">
          <div><b>📍 Address:</b> ${sanitizeGta(app.address)}</div>
          <div><b>✉️ Gmail:</b> <a href="${mailUrl}" style="color:#c084fc; text-decoration:underline;">${sanitizeGta(app.email)}</a></div>
          <div><b>📱 Phone:</b> <a href="${waUrl}" target="_blank" style="color:#4ade80; text-decoration:underline;">${sanitizeGta(app.phone)}</a></div>
          <div><b>⚡ Level:</b> <span style="color:#e9d5ff;">${sanitizeGta(app.level || 'Intermediate')}</span></div>
        </div>

        ${app.notes && app.notes !== 'None' ? `
          <div style="font-size:12.5px; color:#a1a1aa; font-style:italic; background:rgba(255,255,255,0.03); padding:8px 12px; border-radius:6px;">
            <b>Goal:</b> "${sanitizeGta(app.notes)}"
          </div>
        ` : ''}

        <div style="display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap; margin-top:4px;">
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-sm-ghost" style="border-color:#22c55e; color:#4ade80;">💬 WhatsApp Student</a>
          <a href="${mailUrl}" class="btn-sm-ghost" style="border-color:#a855f7; color:#d8b4fe;">✉️ Email Student</a>
        </div>
      </div>
    `;
  }).join('');
}

// Bind GTA admin toolbar buttons
const btnRefreshGtaApps = document.getElementById('btnRefreshGtaApps');
if (btnRefreshGtaApps) {
  btnRefreshGtaApps.onclick = () => {
    renderAdminGtaApplications();
    playSound('hover');
    showToast('GTA applications list refreshed!', 'info');
  };
}
const btnClearGtaApps = document.getElementById('btnClearGtaApps');
if (btnClearGtaApps) {
  btnClearGtaApps.onclick = () => {
    if (confirm('Clear local application records? (Note: emails already sent to amangta599990@gmail.com will not be affected)')) {
      localStorage.removeItem(GTA_APPLICATIONS_KEY);
      renderAdminGtaApplications();
      playSound('trash');
      showToast('Local application records cleared.', 'info');
    }
  };
}
