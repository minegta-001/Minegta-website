/* ==========================================================================
   AMAN MOTION LAB — HIGH PERFORMANCE KINETIC OSCILLOSCOPE ENGINE
   120 FPS Hardware Accelerated Canvas, Signal Modulation & Audio Feedback
   ========================================================================== */

(function () {
  'use strict';

  // 1. Audio Engine (Web Audio API Synthesizer)
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  let synthOsc = null;
  let synthGain = null;
  let synthAudioActive = false;

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playUiSound(type) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'mode') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  }

  function startLiveSynthTone(freq) {
    if (!synthAudioActive) return;
    try {
      const ctx = getAudioContext();
      if (!synthOsc) {
        synthOsc = ctx.createOscillator();
        synthGain = ctx.createGain();
        synthOsc.type = 'sine';
        synthOsc.frequency.setValueAtTime(freq, ctx.currentTime);
        synthGain.gain.setValueAtTime(0.03, ctx.currentTime);
        synthOsc.connect(synthGain);
        synthGain.connect(ctx.destination);
        synthOsc.start();
      } else {
        synthOsc.frequency.setTargetAtTime(freq, ctx.currentTime, 0.03);
      }
    } catch (e) {}
  }

  function stopLiveSynthTone() {
    if (synthGain && audioCtx) {
      synthGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.05);
      setTimeout(() => {
        if (synthOsc) {
          synthOsc.stop();
          synthOsc.disconnect();
          synthOsc = null;
          synthGain = null;
        }
      }, 100);
    }
  }

  // 2. Oscilloscope Canvas & Render Loop
  const canvas = document.getElementById('labCanvas');
  const wrap = document.getElementById('labCanvasWrap');
  if (!canvas || !wrap) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // UI Elements
  const modeChips = document.querySelectorAll('.scope-mode-chip');
  const telLuma = document.getElementById('telLuma');
  const telDelta = document.getElementById('telDelta');
  const telFreq = document.getElementById('telFreq');
  const sliderGain = document.getElementById('sliderGain');
  const sliderFreq = document.getElementById('sliderFreq');
  const lblGainVal = document.getElementById('lblGainVal');
  const lblFreqVal = document.getElementById('lblFreqVal');
  const btnToggleBloom = document.getElementById('btnToggleBloom');
  const lblBloomVal = document.getElementById('lblBloomVal');
  const btnToggleSynthAudio = document.getElementById('btnToggleSynthAudio');
  const lblAudioVal = document.getElementById('lblAudioVal');

  // State
  let activeMode = 'scurve'; // 'scurve' | 'parade' | 'beatsync' | 'vector'
  let animId = null;
  let isVisible = true;
  let time = 0;
  let lastBeatTime = 0;
  let beatPulse = 0;

  let signalGain = 1.0;
  let signalFreq = 1.0;
  let bloomGlow = true;

  // Pointer tracking & smooth lerp
  let pointerActive = false;
  let rawPointerX = 0.5;
  let rawPointerY = 0.5;
  let smoothPointerX = 0.5;
  let smoothPointerY = 0.5;

  // Vector mode particles
  const vectorParticles = [];
  for (let i = 0; i < 110; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.pow(Math.random(), 0.7) * 0.78;
    vectorParticles.push({
      angle,
      dist,
      baseDist: dist,
      speed: (Math.random() - 0.5) * 0.025,
      jitter: Math.random() * Math.PI * 2,
      size: Math.random() < 0.25 ? 2.6 : 1.4
    });
  }

  // Audio spectrum bins
  const SPECTRUM_BINS = 56;
  const binHeights = new Float32Array(SPECTRUM_BINS);
  const binTargets = new Float32Array(SPECTRUM_BINS);

  // Resize canvas with DPR support
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

  // Pointer interactions
  function updatePointerPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    rawPointerX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    rawPointerY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    pointerActive = true;

    if (synthAudioActive) {
      const livePitch = 180 + (1 - rawPointerY) * 600;
      startLiveSynthTone(livePitch);
    }
  }

  wrap.addEventListener('pointerenter', () => { pointerActive = true; });
  wrap.addEventListener('pointerdown', (e) => {
    updatePointerPos(e);
    playUiSound('click');
  });
  wrap.addEventListener('pointermove', updatePointerPos);
  wrap.addEventListener('pointerleave', () => {
    pointerActive = false;
    rawPointerX = 0.5;
    rawPointerY = 0.5;
    if (synthAudioActive) {
      startLiveSynthTone(260 * signalFreq);
    }
  });

  // Mode switcher chips
  modeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const mode = chip.dataset.mode;
      if (!mode || mode === activeMode) return;
      activeMode = mode;
      modeChips.forEach(c => c.classList.toggle('active', c === chip));
      playUiSound('mode');

      if (telFreq) {
        if (mode === 'scurve') telFreq.innerHTML = '24Hz — 48kHz <small>[BEAT-SYNCED]</small>';
        else if (mode === 'parade') telFreq.innerHTML = '3-CH MONOCHROME <small>[ACEScg REC.709]</small>';
        else if (mode === 'beatsync') telFreq.innerHTML = '128.0 BPM <small>[TRANSIENT LOCK]</small>';
        else if (mode === 'vector') telFreq.innerHTML = '360° POLAR GAMUT <small>[LEGAL BOUNDS]</small>';
      }
    });
  });

  // Slider Controls
  if (sliderGain) {
    sliderGain.addEventListener('input', (e) => {
      signalGain = parseFloat(e.target.value);
      if (lblGainVal) lblGainVal.textContent = signalGain.toFixed(2) + 'x';
    });
  }

  if (sliderFreq) {
    sliderFreq.addEventListener('input', (e) => {
      signalFreq = parseFloat(e.target.value);
      if (lblFreqVal) lblFreqVal.textContent = signalFreq.toFixed(2) + 'x';
      if (synthAudioActive) {
        startLiveSynthTone(260 * signalFreq);
      }
    });
  }

  // Bloom Glow Toggle
  if (btnToggleBloom) {
    btnToggleBloom.addEventListener('click', () => {
      bloomGlow = !bloomGlow;
      btnToggleBloom.classList.toggle('active', bloomGlow);
      if (lblBloomVal) lblBloomVal.textContent = bloomGlow ? 'ON' : 'OFF';
      playUiSound('click');
    });
  }

  // Synth Audio Toggle
  if (btnToggleSynthAudio) {
    btnToggleSynthAudio.addEventListener('click', () => {
      synthAudioActive = !synthAudioActive;
      btnToggleSynthAudio.classList.toggle('active', synthAudioActive);
      if (lblAudioVal) lblAudioVal.textContent = synthAudioActive ? 'LIVE' : 'MUTED';
      playUiSound('click');
      if (synthAudioActive) {
        getAudioContext();
        startLiveSynthTone(260 * signalFreq);
      } else {
        stopLiveSynthTone();
      }
    });
  }

  // Intersection Observer
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

    // Simulate 128 BPM beat
    if (timestamp - lastBeatTime > 468) {
      lastBeatTime = timestamp;
      beatPulse = 1.0;
    }
    beatPulse *= 0.92;

    // Clear canvas
    ctx.clearRect(0, 0, w, h);

    // Draw Graticule
    drawGraticuleGrid(w, h);

    // Draw active mode
    if (activeMode === 'scurve') {
      renderCinemaSCurve(w, h);
    } else if (activeMode === 'parade') {
      renderRgbParade(w, h);
    } else if (activeMode === 'beatsync') {
      renderBeatSyncAudio(w, h);
    } else if (activeMode === 'vector') {
      renderVectorscopeRadar(w, h);
    }

    // Pointer crosshair HUD
    if (pointerActive) {
      drawInteractiveReticle(w, h);
    }

    // Telemetry update
    if (Math.floor(time * 30) % 10 === 0) {
      updateTelemetryValues();
    }

    animId = requestAnimationFrame(renderLoop);
  }

  // Graticule Lines
  function drawGraticuleGrid(w, h) {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.setLineDash([4, 6]);

    const steps = [0.12, 0.28, 0.44, 0.60, 0.76, 0.92];
    const labels = ['1023 IRE', '800 IRE', '600 IRE', '400 IRE', '200 IRE', '0 IRE'];

    steps.forEach((ratio, idx) => {
      const y = h * ratio;
      ctx.beginPath();
      ctx.moveTo(56, y);
      ctx.lineTo(w - 24, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(labels[idx], 8, y + 3);
    });

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

  // Mode 1: Cinema S-Curve
  function renderCinemaSCurve(w, h) {
    const leftPad = 70;
    const rightPad = 36;
    const usableW = w - leftPad - rightPad;

    // Vertical Luma Bar
    ctx.save();
    const barX = 52;
    const barW = 12;
    const barYTop = h * 0.12;
    const barH = h * 0.8;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barYTop, barW, barH);

    const grad = ctx.createLinearGradient(0, barYTop + barH, 0, barYTop);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
    grad.addColorStop(0.7, 'rgba(255, 255, 255, 0.5)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(barX + 1, barYTop + 1, barW - 2, barH - 2);

    const activeIreRatio = (0.82 - (smoothPointerY - 0.5) * 0.2) * signalGain;
    const markerY = barYTop + barH * (1 - Math.max(0.05, Math.min(0.95, activeIreRatio)));
    ctx.fillStyle = '#ffffff';
    if (bloomGlow) {
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
    }
    ctx.fillRect(barX - 2, markerY - 1.5, barW + 4, 3);
    ctx.restore();

    // S-Curve Paths
    const mouseInfluence = (smoothPointerY - 0.5) * 1.5;
    const freqMod = ((smoothPointerX - 0.5) * 3 + 4) * signalFreq;

    const layers = [
      { alpha: 0.12, width: 9, color: 'rgba(255, 255, 255, 0.12)', offset: -0.06 },
      { alpha: 0.25, width: 4.5, color: 'rgba(255, 255, 255, 0.28)', offset: 0 },
      { alpha: 0.95, width: 2.2, color: '#ffffff', offset: 0 }
    ];

    layers.forEach(layer => {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = layer.width;
      ctx.strokeStyle = layer.color;
      if (bloomGlow && layer.alpha > 0.5) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 14;
      }

      for (let i = 0; i <= usableW; i += 2) {
        const tNorm = i / usableW;
        const normalizedSigmoid = 1 / (1 + Math.exp(-((tNorm - 0.5) * (7 + mouseInfluence * 2))));
        const harmonicRipple = Math.sin(tNorm * freqMod * Math.PI + time * 2) * 0.04 * (1 - Math.abs(tNorm - 0.5) * 1.6);
        const beatBump = Math.sin(tNorm * Math.PI) * beatPulse * 0.05;
        const finalNormalized = (normalizedSigmoid + harmonicRipple + beatBump + layer.offset) * signalGain;
        const clampedNorm = Math.max(0.02, Math.min(0.98, finalNormalized));
        const px = leftPad + i;
        const py = h * 0.92 - clampedNorm * (h * 0.8);

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    });

    // Phosphor point
    const focalX = leftPad + usableW * smoothPointerX;
    const focalTNorm = smoothPointerX;
    const focalNorm = 1 / (1 + Math.exp(-((focalTNorm - 0.5) * (7 + mouseInfluence * 2)))) * signalGain;
    const focalY = h * 0.92 - Math.max(0.02, Math.min(0.98, focalNorm)) * (h * 0.8);

    ctx.save();
    ctx.beginPath();
    ctx.arc(focalX, focalY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    if (bloomGlow) {
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 18;
    }
    ctx.fill();
    ctx.restore();
  }

  // Mode 2: RGB Parade
  function renderRgbParade(w, h) {
    const channels = [
      { name: 'RED (R)', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)', offset: 0 },
      { name: 'GREEN (G)', color: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)', offset: 2.1 },
      { name: 'BLUE (B)', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', offset: 4.2 }
    ];

    const leftPad = 60;
    const totalW = w - leftPad - 30;
    const colW = totalW / 3;

    channels.forEach((ch, idx) => {
      const startX = leftPad + idx * colW + 12;
      const chW = colW - 24;

      ctx.save();
      ctx.fillStyle = ch.color;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(ch.name, startX, h * 0.1);

      ctx.beginPath();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = ch.color;
      if (bloomGlow) {
        ctx.shadowColor = ch.color;
        ctx.shadowBlur = 10;
      }

      for (let x = 0; x <= chW; x += 3) {
        const nx = x / chW;
        const wave1 = Math.sin((nx * 4 * signalFreq) + time * 3 + ch.offset);
        const wave2 = Math.cos((nx * 9) - time * 2);
        const noise = (Math.random() - 0.5) * 0.12;
        const val = (0.5 + (wave1 * 0.22 + wave2 * 0.12 + noise) * (1 - smoothPointerY * 0.4)) * signalGain;
        const clamped = Math.max(0.05, Math.min(0.95, val));
        const px = startX + x;
        const py = h * 0.92 - clamped * (h * 0.78);

        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    });
  }

  // Mode 3: Beat-Sync Audio Waveforms
  function renderBeatSyncAudio(w, h) {
    const leftPad = 64;
    const usableW = w - leftPad - 36;
    const barW = usableW / SPECTRUM_BINS;

    for (let i = 0; i < SPECTRUM_BINS; i++) {
      if (Math.random() < 0.35) {
        const falloff = 1 - Math.abs(i - SPECTRUM_BINS * 0.3) / SPECTRUM_BINS;
        binTargets[i] = (Math.random() * 0.75 * falloff + beatPulse * 0.35) * signalGain;
      }
      binHeights[i] += (binTargets[i] - binHeights[i]) * 0.18;
    }

    ctx.save();
    for (let i = 0; i < SPECTRUM_BINS; i++) {
      const bh = Math.max(4, binHeights[i] * (h * 0.75));
      const bx = leftPad + i * barW + 2;
      const by = h * 0.92 - bh;

      const grad = ctx.createLinearGradient(0, h * 0.92, 0, by);
      grad.addColorStop(0, 'rgba(34, 211, 238, 0.2)');
      grad.addColorStop(0.6, '#22d3ee');
      grad.addColorStop(1, '#ffffff');

      ctx.fillStyle = grad;
      if (bloomGlow && binHeights[i] > 0.6) {
        ctx.shadowColor = '#22d3ee';
        ctx.shadowBlur = 12;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.fillRect(bx, by, Math.max(2, barW - 4), bh);
    }
    ctx.restore();
  }

  // Mode 4: Vectorscope Radar
  function renderVectorscopeRadar(w, h) {
    const cx = w * 0.52;
    const cy = h * 0.52;
    const maxR = Math.min(w * 0.36, h * 0.4);

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1.0].forEach(rRatio => {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * rRatio, 0, Math.PI * 2);
      ctx.stroke();
    });

    const targets = [
      { name: 'R', angle: -0.4 },
      { name: 'Mg', angle: 0.6 },
      { name: 'B', angle: 1.7 },
      { name: 'Cy', angle: 2.7 },
      { name: 'G', angle: 3.8 },
      { name: 'Yl', angle: 4.8 }
    ];

    targets.forEach(t => {
      const tx = cx + Math.cos(t.angle) * (maxR * 0.85);
      const ty = cy + Math.sin(t.angle) * (maxR * 0.85);
      ctx.strokeRect(tx - 4, ty - 4, 8, 8);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(t.name, tx + 6, ty + 3);
    });

    ctx.fillStyle = '#22d3ee';
    if (bloomGlow) {
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 8;
    }

    vectorParticles.forEach(p => {
      p.angle += p.speed * signalFreq;
      const modDist = (p.baseDist + Math.sin(time * 2 + p.jitter) * 0.05) * signalGain;
      const px = cx + Math.cos(p.angle) * (maxR * modDist);
      const py = cy + Math.sin(p.angle) * (maxR * modDist);

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // Pointer Reticle HUD
  function drawInteractiveReticle(w, h) {
    const rx = w * smoothPointerX;
    const ry = h * smoothPointerY;

    ctx.save();
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);

    ctx.beginPath();
    ctx.moveTo(rx, 0);
    ctx.lineTo(rx, h);
    ctx.moveTo(0, ry);
    ctx.lineTo(w, ry);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(rx, ry, 6, 0, Math.PI * 2);
    ctx.stroke();

    const ireEst = Math.round((1 - smoothPointerY) * 1023 * signalGain);
    ctx.fillStyle = '#22d3ee';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`${ireEst} IRE`, rx + 10, ry - 8);
    ctx.restore();
  }

  // Telemetry Readouts
  function updateTelemetryValues() {
    if (telLuma) {
      const activeIre = Math.round((1 - smoothPointerY) * 1023 * signalGain);
      telLuma.innerHTML = `0 — 1023 <small>[ACTIVE: ${activeIre}]</small>`;
    }
    if (telDelta) {
      const jitter = (0.04 + Math.random() * 0.03).toFixed(2);
      telDelta.innerHTML = `DELTA &lt; ${jitter}% <small>[ZERO BANDING]</small>`;
    }
  }

})();
