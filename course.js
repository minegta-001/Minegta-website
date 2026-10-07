/* ==========================================================================
   MINE GTA — COURSE PORTAL SCRIPT
   Direct Dispatch to: amangta599990@gmail.com
   ========================================================================== */

// 1. Audio Engine (Web Audio API Synthesizer)
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
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
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'tab') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'pay') {
      // Celebratory chord
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + i * 0.06);
        g.gain.setValueAtTime(0.09, now + i * 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + i * 0.06);
        o.stop(now + i * 0.06 + 0.35);
      });
    } else if (type === 'warn') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.start(now);
      osc.stop(now + 0.16);
    }
  } catch (e) {}
}

// Toast System
function showToast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px) scale(0.95)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// 2. Select Course Month (from Pricing Cards)
window.selectCourseMonth = function(monthString) {
  const selectEl = document.getElementById('applyCourse');
  if (selectEl) {
    selectEl.value = monthString;
  }
  const formSection = document.getElementById('apply');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth' });
  }
  playSound('click');
  showToast(`Selected: ${monthString}`, 'info');

  const nameInput = document.getElementById('applyName');
  if (nameInput) {
    setTimeout(() => nameInput.focus(), 600);
  }
};

// 3. Month Tabs in Curriculum Section
function initCurriculumTabs() {
  const tabBtns = document.querySelectorAll('.gta-tab-btn');
  const panels = document.querySelectorAll('.gta-month-panel');
  const container = document.querySelector('.gta-roadmap-container');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const month = btn.dataset.month;
      if (!month) return;

      tabBtns.forEach(b => b.classList.toggle('active', b === btn));
      playSound('tab');

      if (month === 'all') {
        if (container) container.classList.add('show-all');
        panels.forEach(p => p.classList.add('active'));
      } else {
        if (container) container.classList.remove('show-all');
        panels.forEach(p => {
          p.classList.toggle('active', p.dataset.panel === month);
        });
      }
    });
  });
}

// 4. Form Submission & Direct Student Gmail Link
const GTA_APPLICATIONS_KEY = 'mine_gta_applications_v1';

function saveApplicationLocally(rec) {
  try {
    const list = JSON.parse(localStorage.getItem(GTA_APPLICATIONS_KEY)) || [];
    list.unshift(rec);
    localStorage.setItem(GTA_APPLICATIONS_KEY, JSON.stringify(list));
  } catch (e) {}
}

function initCourseApplicationForm() {
  const form = document.getElementById('courseApplyForm');
  const submitBtn = document.getElementById('btnCourseSubmit');
  const spinner = document.getElementById('courseSpinner');
  const statusBox = document.getElementById('courseFormStatus');
  const waLink = document.getElementById('courseWaLink');
  const gmailDirectBtn = document.getElementById('btnSendFromMyGmail');

  if (!form) return;

  // Real-time update of direct Gmail / WhatsApp link as student types
  function updateDirectLinks() {
    const name = (document.getElementById('applyName')?.value || '').trim();
    const city = (document.getElementById('applyAddress')?.value || '').trim();
    const email = (document.getElementById('applyEmail')?.value || '').trim();
    const phone = (document.getElementById('applyPhone')?.value || '').trim();
    const course = document.getElementById('applyCourse')?.value || 'Complete 4-Month Masterclass';
    const notes = (document.getElementById('applyNotes')?.value || '').trim();

    const subject = `MINE GTA Course Application - ${name || 'New Student'}`;
    const body = 
`Hello Aman Sir,

I want to enroll in the MINE GTA After Effects Professional Course.

• Student Name: ${name || '[Your Name]'}
• Address / City: ${city || '[Your City]'}
• Student Gmail: ${email || '[Your Gmail]'}
• Phone / WhatsApp: ${phone || '[Your Phone]'}
• Selected Course: ${course}
• Goal / Message: ${notes || 'Ready to learn!'}

Please review my application and share the enrollment & payment details.

Thank you,
${name || 'Student'}`;

    // 1. Standard mailto
    const mailtoUrl = `mailto:amangta599990@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // 2. Direct Web Gmail Compose URL (Opens student's logged in Gmail compose tab)
    const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=amangta599990@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (gmailDirectBtn) {
      gmailDirectBtn.href = gmailWebUrl;
      gmailDirectBtn.title = `Send directly from your logged-in Gmail to amangta599990@gmail.com`;
    }

    // 3. WhatsApp link
    if (waLink) {
      const waMsg = 
`Hello Aman Sir, I want to apply for the MINE GTA Course!
• Name: ${name || 'Student'}
• City: ${city || 'India'}
• My Gmail: ${email}
• Course: ${course}
Please confirm my seat!`;
      waLink.href = `https://wa.me/917999900000?text=${encodeURIComponent(waMsg)}`;
    }
  }

  ['applyName', 'applyAddress', 'applyEmail', 'applyPhone', 'applyCourse', 'applyNotes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updateDirectLinks);
      el.addEventListener('change', updateDirectLinks);
    }
  });

  // Initialize links immediately on load
  updateDirectLinks();

  // Handle Form Submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = (document.getElementById('applyName')?.value || '').trim();
    const address = (document.getElementById('applyAddress')?.value || '').trim();
    const email = (document.getElementById('applyEmail')?.value || '').trim();
    const phone = (document.getElementById('applyPhone')?.value || '').trim();
    const course = document.getElementById('applyCourse')?.value || 'Complete 4-Month Masterclass';
    const level = document.getElementById('applyLevel')?.value || 'Intermediate';
    const notes = (document.getElementById('applyNotes')?.value || '').trim();

    if (!name || name.length < 2) {
      setStatus('Please enter your full student name.', 'error');
      document.getElementById('applyName')?.focus();
      playSound('warn');
      return;
    }
    if (!address || address.length < 3) {
      setStatus('Please enter your address or city.', 'error');
      document.getElementById('applyAddress')?.focus();
      playSound('warn');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus('Please enter a valid Gmail address (e.g. yourname@gmail.com).', 'error');
      document.getElementById('applyEmail')?.focus();
      playSound('warn');
      return;
    }
    const phoneClean = phone.replace(/[^0-9+]/g, '');
    if (!phoneClean || phoneClean.length < 8) {
      setStatus('Please enter a valid WhatsApp / Phone number with country code.', 'error');
      document.getElementById('applyPhone')?.focus();
      playSound('warn');
      return;
    }

    // Set UI Loading state
    if (submitBtn) submitBtn.disabled = true;
    if (spinner) spinner.style.display = 'inline-block';
    const btnText = submitBtn?.querySelector('.btn-text');
    if (btnText) btnText.textContent = 'Sending to amangta599990@gmail.com...';

    const appId = 'GTA-' + Math.floor(100000 + Math.random() * 900000);
    const appRecord = {
      id: appId,
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

    // FormSubmit payload (Sends directly to amangta599990@gmail.com with _replyto: student's Gmail)
    const payload = {
      _subject: `🔥 [MINE GTA COURSE ENROLLMENT] ${name} - ${course} (${appId})`,
      _template: 'table',
      _captcha: 'false',
      _replyto: email,
      "Application ID": appId,
      "Student Name": name,
      "Full Address": address,
      "Student Personal Gmail": email,
      "WhatsApp / Phone": phone,
      "Selected Course Program": course,
      "Experience Level": level,
      "Student Goals": notes || 'Not provided',
      "Submitted At": appRecord.formattedDate
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

      saveApplicationLocally(appRecord);
      playSound('pay');
      showToast('✓ Application Dispatched to amangta599990@gmail.com! 🚀', 'success');

      setStatus(
        `<strong>✓ Application Dispatched to amangta599990@gmail.com!</strong><br>` +
        `Thank you, <strong>${name}</strong> (Enrollment ID: <code>${appId}</code>). ` +
        `Your selected course: <strong>${course}</strong>.<br>` +
        `Aman Sir will contact you directly at your Gmail (<strong>${email}</strong>) and WhatsApp (<strong>${phone}</strong>) within 24 hours.<br><br>` +
        `<a href="https://mail.google.com/mail/?view=cm&fs=1&to=amangta599990@gmail.com&su=${encodeURIComponent(`MINE GTA Application Confirmation (${appId}) - ${name}`)}&body=${encodeURIComponent(`Hello Aman Sir, I just submitted my application for ${course}.\nMy Phone: ${phone}\nMy Gmail: ${email}`)}" target="_blank" style="color:#ffffff; text-decoration:underline; font-weight:700;">Open Gmail to see/send direct copy &rarr;</a>`,
        'success'
      );

      form.reset();
    } catch (err) {
      saveApplicationLocally(appRecord);
      playSound('pay');

      setStatus(
        `<strong>✓ Application Captured (ID: ${appId})!</strong><br>` +
        `A copy has been recorded. Click the button below to send directly from your Gmail app to <strong>amangta599990@gmail.com</strong>.`,
        'success'
      );
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (spinner) spinner.style.display = 'none';
      if (btnText) btnText.textContent = 'Submit Application To Aman Sir ↗';
    }
  });

  function setStatus(html, type) {
    if (!statusBox) return;
    statusBox.className = `gta-form-status ${type}`;
    statusBox.innerHTML = html;
    statusBox.style.display = 'block';
  }
}

// 5. Scroll Reveals
function initScrollReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initCurriculumTabs();
  initCourseApplicationForm();
  initScrollReveals();
});
