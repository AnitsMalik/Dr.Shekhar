/**
 * Prof. (Col.) Dr. Shekhar Kashyap - Medical Portal
 * Motion Graphics, Interactive Telemetry, CardioCheck™ Risk Analyzer & Booking Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeaderScroll();
  initECGAnimation();
  initCounterObserver();
  initCardTilt();
  initSpecialtyFilter();
  initCardioCheckCalculator();
  initBookingWizard();
  initFaqAccordion();
});

/* ===================================================================
   1. THEME TOGGLE (DARK LUXE & CLINICAL LIGHT)
   =================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('dr_shekhar_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(toggleBtn, savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dr_shekhar_theme', newTheme);
    updateThemeIcon(toggleBtn, newTheme);
  });
}

function updateThemeIcon(btn, theme) {
  btn.innerHTML = theme === 'light' 
    ? '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path></svg>'
    : '<svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
}

/* ===================================================================
   2. HEADER SCROLL & NAVIGATION
   =================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
}

/* ===================================================================
   3. REAL-TIME CANAVS ECG VECTORCARDIOGRAM WITH SOUND & RHYTHMS
   =================================================================== */
let ecgBpm = 72;
let ecgRhythm = 'normal';

function initECGAnimation() {
  const canvas = document.getElementById('ecgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 70;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  let x = 0;
  let points = [];
  const maxPoints = Math.floor(canvas.width / 2);
  const baseline = canvas.height * 0.55;

  // Listen to rhythm selector buttons
  const rhythmBtns = document.querySelectorAll('.rhythm-btn:not(#ecgAudioToggle)');
  rhythmBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      rhythmBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ecgRhythm = btn.dataset.rhythm;
      
      const bpmDisplay = document.getElementById('ecgBpmDisplay');
      if (ecgRhythm === 'normal') ecgBpm = 72;
      if (ecgRhythm === 'brady') ecgBpm = 52;
      if (ecgRhythm === 'tachy') ecgBpm = 118;
      if (bpmDisplay) bpmDisplay.textContent = `${ecgBpm} BPM`;
    });
  });

  // Web Audio API Cardiac Telemetry Pulse (Muted by default)
  let audioContext = null;
  let audioEnabled = false;
  let lastBeepTime = 0;

  const audioToggleBtn = document.getElementById('ecgAudioToggle');
  const soundIcon = document.getElementById('ecgSoundIcon');

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      if (audioEnabled) {
        if (!audioContext) {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }
        audioToggleBtn.classList.add('active');
        if (soundIcon) soundIcon.textContent = '🔊 Beep On';
      } else {
        audioToggleBtn.classList.remove('active');
        if (soundIcon) soundIcon.textContent = '🔇 Sound Off';
      }
    });
  }

  function triggerTelemetryBeep() {
    if (!audioEnabled || !audioContext) return;
    try {
      const now = performance.now();
      const intervalMs = (60 / ecgBpm) * 1000;
      if (now - lastBeepTime < intervalMs * 0.75) return;
      lastBeepTime = now;

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(820, audioContext.currentTime);
      gain.gain.setValueAtTime(0.04, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + 0.05);
    } catch(err) {}
  }

  let cycleT = 0;

  function getEcgY(t) {
    // Normal Sinus Waveform Model: P wave, Q dip, R peak, S dip, T wave
    const cycle = (t % 100);

    if (ecgRhythm === 'tachy') {
      if (cycle >= 22 && cycle <= 26) triggerTelemetryBeep();
      if (cycle >= 10 && cycle <= 16) return -5 * Math.sin(((cycle - 10) / 6) * Math.PI); // P
      if (cycle >= 20 && cycle <= 22) return 6; // Q
      if (cycle >= 22 && cycle <= 26) return -34; // R
      if (cycle >= 26 && cycle <= 29) return 14; // S
      if (cycle >= 35 && cycle <= 47) return -9 * Math.sin(((cycle - 35) / 12) * Math.PI); // T
      return 0;
    }

    if (ecgRhythm === 'brady') {
      if (cycle >= 30 && cycle <= 34) triggerTelemetryBeep();
      if (cycle >= 15 && cycle <= 22) return -6 * Math.sin(((cycle - 15) / 7) * Math.PI); // P
      if (cycle >= 28 && cycle <= 30) return 6; // Q
      if (cycle >= 30 && cycle <= 34) return -36; // R
      if (cycle >= 34 && cycle <= 37) return 14; // S
      if (cycle >= 45 && cycle <= 60) return -10 * Math.sin(((cycle - 45) / 15) * Math.PI); // T
      return 0;
    }

    // Normal Sinus (72 BPM)
    if (cycle >= 26 && cycle <= 30) triggerTelemetryBeep();
    if (cycle >= 12 && cycle <= 20) return -7 * Math.sin(((cycle - 12) / 8) * Math.PI); // P wave
    if (cycle >= 24 && cycle <= 26) return 8; // Q dip
    if (cycle >= 26 && cycle <= 30) return -38; // R wave (sharp peak)
    if (cycle >= 30 && cycle <= 33) return 16; // S dip
    if (cycle >= 38 && cycle <= 54) return -12 * Math.sin(((cycle - 38) / 16) * Math.PI); // T wave
    return 0;
  }

  function renderEcg() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle background grid
    ctx.strokeStyle = 'rgba(0, 180, 216, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    const gridStep = 18;
    for (let gx = 0; gx < canvas.width; gx += gridStep) {
      ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height);
    }
    for (let gy = 0; gy < canvas.height; gy += gridStep) {
      ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy);
    }
    ctx.stroke();

    // Advance cycle
    const speed = (ecgBpm / 72) * 1.35;
    cycleT += speed;

    const currentY = baseline + getEcgY(cycleT);
    points.push({ x: canvas.width - 20, y: currentY });

    // Shift previous points left
    for (let i = 0; i < points.length; i++) {
      points[i].x -= 2.2;
    }
    points = points.filter(p => p.x >= 0);

    // Draw main glowing ECG line
    if (points.length > 2) {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.strokeStyle = isDark ? '#00F0FF' : '#0A66C2';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = isDark ? '#00F0FF' : 'rgba(10, 102, 194, 0.5)';
      ctx.shadowBlur = isDark ? 8 : 4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Lead pulse indicator dot
      const lastPoint = points[points.length - 1];
      ctx.fillStyle = '#FFF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(lastPoint.x, lastPoint.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(renderEcg);
  }

  renderEcg();
}

/* ===================================================================
   4. INTERSECTION OBSERVER FOR STAT COUNTERS
   =================================================================== */
function initCounterObserver() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetVal = parseFloat(el.dataset.target);
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = easeProgress * targetVal;

          if (isDecimal) {
            el.innerHTML = currentVal.toFixed(1) + '<span class="plus">%</span>';
          } else {
            el.innerHTML = Math.floor(currentVal).toLocaleString() + '<span class="plus">+</span>';
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            if (isDecimal) {
              el.innerHTML = targetVal.toFixed(1) + '<span class="plus">%</span>';
            } else {
              el.innerHTML = targetVal.toLocaleString() + '<span class="plus">+</span>';
            }
          }
        }

        requestAnimationFrame(updateCounter);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* ===================================================================
   5. 3D MAGNETIC TILT EFFECT FOR CARDS
   =================================================================== */
function initCardTilt() {
  const tiltCard = document.querySelector('.doctor-card-frame');
  if (!tiltCard) return;

  tiltCard.addEventListener('mousemove', (e) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* ===================================================================
   6. CLINICAL SPECIALTIES FILTER
   =================================================================== */
function initSpecialtyFilter() {
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const cards = document.querySelectorAll('.specialty-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => { card.style.opacity = '1'; }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   7. INTERACTIVE CARDIOCHECK™ RISK CALCULATOR
   =================================================================== */
function initCardioCheckCalculator() {
  const ageSlider = document.getElementById('calcAge');
  const bpSlider = document.getElementById('calcBp');
  const cholSlider = document.getElementById('calcChol');

  const ageVal = document.getElementById('calcAgeVal');
  const bpVal = document.getElementById('calcBpVal');
  const cholVal = document.getElementById('calcCholVal');

  const needle = document.getElementById('gaugeNeedle');
  const badge = document.getElementById('riskBadge');
  const summary = document.getElementById('riskSummary');
  const scorePercent = document.getElementById('riskScorePercent');

  if (!ageSlider || !bpSlider || !cholSlider) return;

  function recalculateRisk() {
    const age = parseInt(ageSlider.value, 10);
    const bp = parseInt(bpSlider.value, 10);
    const chol = parseInt(cholSlider.value, 10);

    ageVal.textContent = `${age} Yrs`;
    bpVal.textContent = `${bp} mmHg`;
    cholVal.textContent = `${chol} mg/dL`;

    const smoker = document.querySelector('input[name="smoker"]:checked')?.value === 'yes';
    const diabetic = document.querySelector('input[name="diabetic"]:checked')?.value === 'yes';
    const family = document.querySelector('input[name="family"]:checked')?.value === 'yes';
    const chestPain = document.querySelector('input[name="chestPain"]:checked')?.value === 'yes';

    // Clinical Multi-Factor Risk Algorithm (Framingham / Indian Atherosclerosis adaptation)
    let score = 0;
    if (age > 45) score += (age - 45) * 0.45;
    if (bp > 120) score += (bp - 120) * 0.25;
    if (chol > 180) score += (chol - 180) * 0.15;
    if (smoker) score += 8;
    if (diabetic) score += 10;
    if (family) score += 6;
    if (chestPain) score += 15;

    const calculatedRisk = Math.min(Math.max(Math.round(score), 4), 65);
    if (scorePercent) scorePercent.textContent = `${calculatedRisk}%`;

    // Needle Angle: Map 0% -> -90 deg, 50% -> 0 deg, 100% -> +90 deg
    const clampedAngle = -90 + (calculatedRisk / 50) * 90;
    needle.style.transform = `rotate(${clampedAngle}deg)`;

    badge.className = 'risk-level-badge';
    if (calculatedRisk < 12 && !chestPain) {
      badge.classList.add('low');
      badge.textContent = 'Low Cardiovascular Risk';
      summary.textContent = 'Excellent cardiac baseline. Continue heart-healthy diet, regular aerobic exercise, and annual screening.';
    } else if (calculatedRisk < 26 && !chestPain) {
      badge.classList.add('moderate');
      badge.textContent = 'Moderate Cardiovascular Risk';
      summary.textContent = 'Early vascular risk markers detected. Recommend lipid profile optimization, stress echo screening, and preventive consultation.';
    } else {
      badge.classList.add('high');
      badge.textContent = chestPain ? 'Urgent Cardiac Attention Advised' : 'High Cardiovascular Risk';
      summary.textContent = chestPain 
        ? 'Active chest symptoms with risk markers require immediate evaluation. Schedule priority consultation or visit our emergency OPD.'
        : 'Elevated cardiac risk factors present. Comprehensive CT Coronary Angiography or expert cardiology evaluation strongly recommended.';
    }
  }

  [ageSlider, bpSlider, cholSlider].forEach(input => {
    input.addEventListener('input', recalculateRisk);
  });

  const radioInputs = document.querySelectorAll('.calc-radio-pill input');
  radioInputs.forEach(radio => {
    radio.addEventListener('change', recalculateRisk);
  });

  recalculateRisk();

  const bookWithScoreBtn = document.getElementById('btnBookWithScore');
  if (bookWithScoreBtn) {
    bookWithScoreBtn.addEventListener('click', () => {
      const notesField = document.getElementById('patientNotes');
      if (notesField) {
        notesField.value = `CardioCheck™ Assessment: ${scorePercent.textContent} Risk | Age: ${ageSlider.value}y, BP: ${bpSlider.value} mmHg, Chol: ${cholSlider.value} mg/dL.`;
      }
    });
  }

  const shareWhatsAppBtn = document.getElementById('btnShareRiskWhatsApp');
  if (shareWhatsAppBtn) {
    shareWhatsAppBtn.addEventListener('click', () => {
      const text = `Hello Dr. Shekhar Kashyap's Clinic, I evaluated my heart risk on your portal. My Score: ${scorePercent.textContent} (Age: ${ageSlider.value}, BP: ${bpSlider.value} mmHg, Chol: ${cholSlider.value} mg/dL). I would like to request an appointment.`;
      window.open(`https://wa.me/919811099888?text=${encodeURIComponent(text)}`, '_blank');
    });
  }
}

/* ===================================================================
   8. MULTI-STEP APPOINTMENT BOOKING ENGINE
   =================================================================== */
function initBookingWizard() {
  const steps = [
    document.getElementById('bookingStep1'),
    document.getElementById('bookingStep2'),
    document.getElementById('bookingStep3')
  ];
  const indicators = document.querySelectorAll('.booking-step-indicator');
  const successBox = document.getElementById('bookingSuccessBox');
  const bookingForm = document.getElementById('appointmentForm');

  let currentStep = 0;
  let selectedSlot = '10:30 AM';

  // Slot buttons selection
  const slotBtns = document.querySelectorAll('.time-slot-btn');
  slotBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      slotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSlot = btn.textContent.trim();
    });
  });

  // Next / Back buttons
  const nextBtn1 = document.getElementById('btnStep1Next');
  const prevBtn2 = document.getElementById('btnStep2Prev');
  const nextBtn2 = document.getElementById('btnStep2Next');
  const prevBtn3 = document.getElementById('btnStep3Prev');

  function showStep(index) {
    steps.forEach((step, idx) => {
      if (step) step.style.display = idx === index ? 'block' : 'none';
    });
    indicators.forEach((ind, idx) => {
      ind.classList.remove('active', 'completed');
      if (idx === index) ind.classList.add('active');
      if (idx < index) ind.classList.add('completed');
    });
    currentStep = index;
  }

  if (nextBtn1) nextBtn1.addEventListener('click', () => showStep(1));
  if (prevBtn2) prevBtn2.addEventListener('click', () => showStep(0));
  if (nextBtn2) nextBtn2.addEventListener('click', () => showStep(2));
  if (prevBtn3) prevBtn3.addEventListener('click', () => showStep(1));

  // Form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const patientName = document.getElementById('patientName')?.value || 'Valued Patient';
      const patientPhone = document.getElementById('patientPhone')?.value || '+91 98XXX XXXXX';
      const consultationType = document.getElementById('consultType')?.value || 'In-Person OPD Consultation';
      const bookingDate = document.getElementById('bookDate')?.value || 'Tomorrow';

      // Hide all steps, show confirmation
      steps.forEach(s => { if (s) s.style.display = 'none'; });
      const actionsFooter = document.getElementById('bookingFormActions');
      if (actionsFooter) actionsFooter.style.display = 'none';

      if (successBox) {
        successBox.style.display = 'block';
        const randomBookingId = 'SKC-' + Math.floor(100000 + Math.random() * 900000);
        
        document.getElementById('confirmPatientName').textContent = patientName;
        document.getElementById('confirmBookingId').textContent = randomBookingId;
        document.getElementById('confirmDateTime').textContent = `${bookingDate} at ${selectedSlot}`;
        document.getElementById('confirmLocation').textContent = consultationType;
      }
    });
  }

  // Save to Calendar (.ics) download handler
  const downloadIcsBtn = document.getElementById('btnDownloadAppointment');
  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', () => {
      const bId = document.getElementById('confirmBookingId')?.textContent || 'SKC-CONFIRMED';
      const pName = document.getElementById('confirmPatientName')?.textContent || 'Patient';
      const loc = document.getElementById('confirmLocation')?.textContent || 'Cardiology Clinic';
      const dt = document.getElementById('confirmDateTime')?.textContent || 'Scheduled Slot';

      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Prof Dr Shekhar Kashyap//Cardiology OPD//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'SUMMARY:Cardiology Consultation - Prof. (Col.) Dr. Shekhar Kashyap',
        `DESCRIPTION:Patient: ${pName}\\nBooking Ref: ${bId}\\nFacility: ${loc}\\nTime: ${dt}`,
        `LOCATION:${loc}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT2H',
        'DESCRIPTION:Cardiology Appointment with Dr. Shekhar Kashyap in 2 hours',
        'ACTION:DISPLAY',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\\r\\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `Dr_Shekhar_Kashyap_Appointment_${bId}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Pre-fill booking date with tomorrow
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }
}

/* ===================================================================
   9. FAQ ACCORDION
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}
