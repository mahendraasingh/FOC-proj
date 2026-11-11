/**
 * ROTBRAIN - Modern Landing Page Interactivity
 * Features: Live Phone Simulator, 4-Stage Brain Decay Scrubber,
 * Bento Interactive Previews, Dopamine Calculator, Sound Effects, Download Manager
 */

// ==========================================
// 1. SOUND SYNTHESIZER (WEB AUDIO API)
// ==========================================
class SoundFX {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  playWhoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playWarningAlert() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.setValueAtTime(520, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  playCriticalSiren() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.linearRampToValueAtTime(400, now + 0.2);
      osc.frequency.linearRampToValueAtTime(800, now + 0.4);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

const sound = new SoundFX();

// ==========================================
// 2. HERO PHONE SIMULATOR DATA & LOGIC
// ==========================================
const mockReels = [
  {
    author: "@dopamine_trap",
    title: "POV: You opened Instagram for 30 seconds to reply to a DM and now it's 2:47 AM 💀",
    track: "Viral Synthwave • 1.2M Reels",
    likes: "428K",
    comments: "3,892",
    bg: "radial-gradient(circle at 30% 30%, #3B82F6 0%, #1E1B4B 70%)"
  },
  {
    author: "@infinite_scroll",
    title: "Why short-form videos destroy your prefrontal cortex attention span in 7 days ⚡",
    track: "Deep House Focus Beats",
    likes: "892K",
    comments: "7,120",
    bg: "radial-gradient(circle at 70% 40%, #8B5CF6 0%, #0F172A 70%)"
  },
  {
    author: "@brainrot_chronicles",
    title: "Wait till the end... only 1% of people noticed this subtle optical illusion! 😱👀",
    track: "Suspense Sound FX #99",
    likes: "1.4M",
    comments: "14.2K",
    bg: "radial-gradient(circle at 50% 60%, #F59E0B 0%, #31135E 80%)"
  },
  {
    author: "@screen_time_audit",
    title: "You haven't read a book this year. This is your sign to close the feed and breathe.",
    track: "Peaceful Ambient Rain",
    likes: "312K",
    comments: "1,940",
    bg: "radial-gradient(circle at 40% 70%, #EF4444 0%, #18181B 80%)"
  }
];

let heroVideoCount = 0;
let heroReelIndex = 0;
let autoBingeTimer = null;

function getBrainState(count) {
  if (count < 30) {
    return {
      stage: 1,
      name: "Fresh",
      color: "#3546F5",
      glow: "rgba(53, 70, 245, 0.4)",
      img: "images/freshBrain.png",
      status: "FRESH // FOCUS 100%"
    };
  } else if (count < 60) {
    return {
      stage: 2,
      name: "Tired",
      color: "#F59E0B",
      glow: "rgba(245, 158, 11, 0.4)",
      img: "assets/brain-tired.svg",
      status: "TIRED // ATTENTION DRIFT"
    };
  } else if (count < 90) {
    return {
      stage: 3,
      name: "Very Tired",
      color: "#F97316",
      glow: "rgba(249, 115, 22, 0.4)",
      img: "assets/brain-very-tired.svg",
      status: "OVERLOAD // FATIGUE"
    };
  } else {
    return {
      stage: 4,
      name: "Rotting",
      color: "#EF4444",
      glow: "rgba(239, 68, 68, 0.5)",
      img: "assets/brain-rotting.svg",
      status: "CRITICAL // BRAIN ROT"
    };
  }
}

function updateHeroPhoneUI(triggeredAlert = true) {
  const state = getBrainState(heroVideoCount);

  // Update floating mascot overlay
  const overlay = document.getElementById("hero-floating-overlay");
  const avatarImg = document.getElementById("hero-overlay-avatar-img");
  const countEl = document.getElementById("hero-overlay-count");
  const statusEl = document.getElementById("hero-overlay-status");

  if (overlay && avatarImg && countEl && statusEl) {
    overlay.style.borderColor = state.color;
    overlay.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px ${state.glow}`;
    avatarImg.src = state.img;
    countEl.innerText = `🔥 ${heroVideoCount} Reels`;
    statusEl.innerText = state.name;
    statusEl.style.color = state.color;
  }

  // Update reel content
  const reel = mockReels[heroReelIndex % mockReels.length];
  const bgEl = document.getElementById("reel-bg");
  const authorEl = document.getElementById("reel-author-name");
  const titleEl = document.getElementById("reel-title-text");
  const trackEl = document.getElementById("reel-track-name");
  const likesEl = document.getElementById("reel-likes-count");
  const commentsEl = document.getElementById("reel-comments-count");

  if (bgEl) bgEl.style.background = reel.bg;
  if (authorEl) authorEl.innerText = reel.author;
  if (titleEl) titleEl.innerText = reel.title;
  if (trackEl) trackEl.innerText = reel.track;
  if (likesEl) likesEl.innerText = reel.likes;
  if (commentsEl) commentsEl.innerText = reel.comments;

  // Sound and Alert effects
  if (triggeredAlert) {
    if (heroVideoCount === 30) sound.playWarningAlert();
    else if (heroVideoCount === 60) sound.playWarningAlert();
    else if (heroVideoCount >= 90) sound.playCriticalSiren();
  }

  // Trigger Interception Guard if 90+ reels
  const guardModal = document.getElementById("hero-guard-modal");
  if (guardModal) {
    if (heroVideoCount >= 90 && !guardModal.classList.contains("dismissed")) {
      guardModal.classList.add("active");
    } else {
      guardModal.classList.remove("active");
    }
  }
}

function scrollNextReel(increment = 1) {
  sound.playWhoosh();
  heroVideoCount += increment;
  heroReelIndex++;

  // Subtle reel transition animation
  const container = document.getElementById("reel-video-container");
  if (container) {
    container.style.transform = "translateY(-6px)";
    setTimeout(() => {
      container.style.transform = "translateY(0)";
    }, 120);
  }

  updateHeroPhoneUI(true);
}

function resetBrainSimulator() {
  sound.playPop();
  heroVideoCount = 0;
  heroReelIndex = 0;
  if (autoBingeTimer) {
    clearInterval(autoBingeTimer);
    autoBingeTimer = null;
    const bingeBtn = document.getElementById("auto-binge-btn");
    if (bingeBtn) bingeBtn.innerHTML = "<span>⏩</span> Auto-Binge";
  }
  const guardModal = document.getElementById("hero-guard-modal");
  if (guardModal) {
    guardModal.classList.remove("active");
    guardModal.classList.remove("dismissed");
  }
  updateHeroPhoneUI(false);
}

function toggleAutoBinge() {
  const bingeBtn = document.getElementById("auto-binge-btn");
  if (autoBingeTimer) {
    clearInterval(autoBingeTimer);
    autoBingeTimer = null;
    sound.playPop();
    if (bingeBtn) bingeBtn.innerHTML = "<span>⏩</span> Auto-Binge";
  } else {
    sound.playPop();
    if (bingeBtn) bingeBtn.innerHTML = "<span>⏸️</span> Pause Binge";
    autoBingeTimer = setInterval(() => {
      scrollNextReel(5);
      if (heroVideoCount >= 105) {
        clearInterval(autoBingeTimer);
        autoBingeTimer = null;
        if (bingeBtn) bingeBtn.innerHTML = "<span>⏩</span> Auto-Binge";
      }
    }, 1200);
  }
}

// Make floating brain draggable within the phone screen
function initDraggableOverlay() {
  const overlay = document.getElementById("hero-floating-overlay");
  const screen = document.getElementById("phone-mockup-screen");
  if (!overlay || !screen) return;

  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  overlay.addEventListener("pointerdown", (e) => {
    isDragging = true;
    overlay.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;

    const rect = overlay.getBoundingClientRect();
    const screenRect = screen.getBoundingClientRect();

    initialLeft = rect.left - screenRect.left;
    initialTop = rect.top - screenRect.top;
    sound.playPop();
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const screenRect = screen.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();

    let newLeft = initialLeft + dx;
    let newTop = initialTop + dy;

    // Boundaries
    const maxLeft = screenRect.width - overlayRect.width - 8;
    const maxTop = screenRect.height - overlayRect.height - 8;

    newLeft = Math.max(8, Math.min(newLeft, maxLeft));
    newTop = Math.max(38, Math.min(newTop, maxTop));

    overlay.style.left = `${newLeft}px`;
    overlay.style.top = `${newTop}px`;
    overlay.style.right = "auto";
  });

  window.addEventListener("pointerup", () => {
    if (isDragging) {
      isDragging = false;
    }
  });
}

// ==========================================
// 3. INTERACTIVE 4-STAGE BRAIN DECAY SHOWCASE
// ==========================================
const stageData = [
  {
    stageNum: 1,
    name: "Fresh Brain",
    range: "0–29 Videos",
    color: "#3546F5",
    img: "images/freshBrain.png",
    badge: "STAGE 01 // FRESH",
    cognitiveState: "High Executive Control & Balanced Dopamine",
    symptoms: "Sharp working memory, clear focus, zero neural fatigue. Natural impulse resistance.",
    overlayBehavior: "Calm electric blue bubble. Non-intrusive breathing pulse. Video counter increments normally.",
    memoryCapacity: 98,
    focusRetention: 95,
    executiveControl: 94
  },
  {
    stageNum: 2,
    name: "Tired Brain",
    range: "30–59 Videos",
    color: "#F59E0B",
    img: "assets/brain-tired.svg",
    badge: "STAGE 02 // TIRED",
    cognitiveState: "Attention Drift & Micro-Fatigue",
    symptoms: "Unconscious auto-scroll reflex activates. Working memory drops by 32%. Mild mental fog.",
    overlayBehavior: "Turns warm amber. Mascot eyelids droop. Subtle vibration upon every 5th swipe.",
    memoryCapacity: 68,
    focusRetention: 64,
    executiveControl: 60
  },
  {
    stageNum: 3,
    name: "Very Tired Brain",
    range: "60–89 Videos",
    color: "#F97316",
    img: "assets/brain-very-tired.svg",
    badge: "STAGE 03 // OVERLOAD",
    cognitiveState: "Neural Overdrive & Dopamine Desensitization",
    symptoms: "Severe attention fragmentation. Time blindness (you think 15 mins passed, but it was 1.5 hours).",
    overlayBehavior: "Sunset orange alert pulse. Mascot shows stress cracks. Periodic warning nudge badge.",
    memoryCapacity: 38,
    focusRetention: 32,
    executiveControl: 28
  },
  {
    stageNum: 4,
    name: "Exhausted / Rotting Brain",
    range: "90+ Videos",
    color: "#EF4444",
    img: "assets/brain-rotting.svg",
    badge: "STAGE 04 // CRITICAL ROT",
    cognitiveState: "Acute Dopamine Depletion (Brain Rot)",
    symptoms: "Executive dysfunction. Irritability upon closing the app. Inability to read long paragraphs.",
    overlayBehavior: "Crimson biohazard alert. Melting pixel animation. Activates fullscreen Reality-Check Intercept.",
    memoryCapacity: 12,
    focusRetention: 10,
    executiveControl: 8
  }
];

function selectBrainStage(index) {
  sound.playPop();
  const data = stageData[index];

  // Update tabs
  const tabBtns = document.querySelectorAll(".stage-tab-btn");
  tabBtns.forEach((btn, i) => {
    btn.classList.remove("active", "active-stage-1", "active-stage-2", "active-stage-3", "active-stage-4");
    if (i === index) {
      btn.classList.add("active", `active-stage-${index + 1}`);
    }
  });

  // Update display card content
  const card = document.getElementById("stage-display-card");
  const nameEl = document.getElementById("stage-display-name");
  const badgeEl = document.getElementById("stage-display-badge");
  const mascotImg = document.getElementById("stage-mascot-img");
  const cognitiveEl = document.getElementById("stage-cognitive-val");
  const symptomsEl = document.getElementById("stage-symptoms-val");
  const overlayEl = document.getElementById("stage-overlay-val");

  // Metric bars
  const memBar = document.getElementById("metric-memory-bar");
  const memVal = document.getElementById("metric-memory-val");
  const focBar = document.getElementById("metric-focus-bar");
  const focVal = document.getElementById("metric-focus-val");
  const exeBar = document.getElementById("metric-exec-bar");
  const exeVal = document.getElementById("metric-exec-val");

  if (card) {
    card.style.setProperty("--stage-accent", data.color);
    card.style.borderColor = data.color;
  }
  if (nameEl) {
    nameEl.innerText = data.name;
    nameEl.style.color = data.color;
  }
  if (badgeEl) {
    badgeEl.innerText = data.badge;
    badgeEl.style.borderColor = data.color;
    badgeEl.style.color = data.color;
  }
  if (mascotImg) {
    mascotImg.src = data.img;
    mascotImg.style.transform = "scale(0.92)";
    setTimeout(() => {
      mascotImg.style.transform = "scale(1)";
    }, 150);
  }
  if (cognitiveEl) cognitiveEl.innerText = data.cognitiveState;
  if (symptomsEl) symptomsEl.innerText = data.symptoms;
  if (overlayEl) overlayEl.innerText = data.overlayBehavior;

  if (memBar && memVal) {
    memBar.style.width = `${data.memoryCapacity}%`;
    memBar.style.background = data.color;
    memVal.innerText = `${data.memoryCapacity}%`;
  }
  if (focBar && focVal) {
    focBar.style.width = `${data.focusRetention}%`;
    focBar.style.background = data.color;
    focVal.innerText = `${data.focusRetention}%`;
  }
  if (exeBar && exeVal) {
    exeBar.style.width = `${data.executiveControl}%`;
    exeBar.style.background = data.color;
    exeVal.innerText = `${data.executiveControl}%`;
  }

  // Update scrubber slider position
  const slider = document.getElementById("stages-scrubber");
  const valChip = document.getElementById("stages-scrubber-val");
  if (slider && valChip) {
    let targetVal = 15;
    if (index === 1) targetVal = 45;
    if (index === 2) targetVal = 75;
    if (index === 3) targetVal = 110;
    slider.value = targetVal;
    valChip.innerText = `${targetVal} REELS`;
    valChip.style.borderColor = data.color;
    valChip.style.color = data.color;
  }
}

function onScrubberChange(val) {
  const count = parseInt(val, 10);
  const valChip = document.getElementById("stages-scrubber-val");
  if (valChip) {
    valChip.innerText = `${count} REELS`;
  }

  let stageIndex = 0;
  if (count < 30) stageIndex = 0;
  else if (count < 60) stageIndex = 1;
  else if (count < 90) stageIndex = 2;
  else stageIndex = 3;

  selectBrainStage(stageIndex);
}

// ==========================================
// 4. DOPAMINE LIFETIME CALCULATOR
// ==========================================
function updateDopamineCalc() {
  const dailyReelsInput = document.getElementById("calc-daily-reels");
  const daysActiveInput = document.getElementById("calc-days-week");

  const dailyReelsVal = document.getElementById("calc-daily-val");
  const daysActiveVal = document.getElementById("calc-days-val");

  if (!dailyReelsInput || !daysActiveInput) return;

  const reels = parseInt(dailyReelsInput.value, 10);
  const days = parseInt(daysActiveInput.value, 10);

  if (dailyReelsVal) dailyReelsVal.innerText = `${reels} Reels / day`;
  if (daysActiveVal) daysActiveVal.innerText = `${days} Days / week`;

  // Assume avg 45 seconds per reel
  const minutesPerDay = (reels * 45) / 60;
  const hoursPerWeek = (minutesPerDay * days) / 60;
  const hoursPerYear = Math.round(hoursPerWeek * 52);

  // Conscious waking days lost (16 waking hours/day)
  const wakingDaysLost = Math.round((hoursPerYear / 16) * 10) / 10;

  // Average 6 hours to finish reading an impactful book
  const booksEquivalent = Math.round(hoursPerYear / 6.5);

  // Hours saved with RotBrain (reducing daily binge by ~65%)
  const hoursSaved = Math.round(hoursPerYear * 0.65);

  const hoursLostEl = document.getElementById("calc-hours-lost");
  const daysLostEl = document.getElementById("calc-days-lost");
  const booksEl = document.getElementById("calc-books-val");
  const savedEl = document.getElementById("calc-hours-saved");

  if (hoursLostEl) hoursLostEl.innerText = `${hoursPerYear.toLocaleString()} hrs`;
  if (daysLostEl) daysLostEl.innerText = `${wakingDaysLost} conscious days`;
  if (booksEl) booksEl.innerText = `${booksEquivalent} Books`;
  if (savedEl) savedEl.innerText = `+${hoursSaved} hrs/year`;
}

// ==========================================
// 5. 24-HOUR INTERACTIVE HEATMAP
// ==========================================
function initHeatmap() {
  const container = document.getElementById("heatmap-cells-container");
  if (!container) return;

  container.innerHTML = "";
  // 7 days x 24 hours
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  days.forEach((day, dIdx) => {
    for (let h = 0; h < 24; h++) {
      const cell = document.createElement("div");
      cell.className = "heatmap-cell";

      // Pattern: heavier at 11pm-2am (hours 22, 23, 0, 1) and lunch (12, 13)
      let level = 0;
      let reelsCount = 0;

      if ((h >= 22 || h <= 1) && (dIdx >= 3)) {
        level = 4; // Critical late night weekend
        reelsCount = Math.floor(Math.random() * 30) + 75;
      } else if (h >= 21 || h === 2) {
        level = 3; // High
        reelsCount = Math.floor(Math.random() * 25) + 40;
      } else if (h >= 12 && h <= 13) {
        level = 2; // Lunch scroll
        reelsCount = Math.floor(Math.random() * 15) + 20;
      } else if (h >= 8 && h <= 20) {
        level = Math.random() > 0.6 ? 1 : 0;
        reelsCount = level === 1 ? Math.floor(Math.random() * 8) + 2 : 0;
      }

      cell.classList.add(`heat-level-${level}`);
      cell.title = `${day} at ${h}:00 - ${reelsCount} reels scrolled`;

      cell.addEventListener("mouseenter", () => {
        sound.playPop();
        const tooltip = document.getElementById("heatmap-tooltip");
        if (tooltip) {
          tooltip.innerText = `[${day} ${h}:00] -> ${reelsCount} Reels (${reelsCount > 60 ? 'CRITICAL BINGE' : reelsCount > 30 ? 'FATIGUE ZONE' : 'SAFE'})`;
        }
      });

      container.appendChild(cell);
    }
  });
}

// ==========================================
// 6. SIDELOADING 3-STEP GUIDE SWITCHER
// ==========================================
const sideloadSteps = [
  {
    step: 1,
    title: "Download the RotBrain APK",
    desc: "Click the download button on this page to get the official RotBrain-v1.0.1.apk file (~129 MB) directly to your Android device.",
    mockup: `[NOTIF] Chrome: Download complete\n📁 RotBrain-v1.0.1.apk (129 MB)\nTap to start package installer`
  },
  {
    step: 2,
    title: "Allow Unknown Sources",
    desc: "When prompted by your browser or files app, toggle 'Allow from this source'. Because RotBrain is distributed directly without Google Play gatekeeping, Android shows this standard safety check.",
    mockup: `[SECURITY DIALOG]\n"For your security, your phone is not allowed to install unknown apps from this source."\n-> Settings -> [TOGGLE ON] Allow from this source`
  },
  {
    step: 3,
    title: "Grant Accessibility & Overlay",
    desc: "Open RotBrain and enable: 1) Accessibility Service (to count video scrolls with zero logging) and 2) Display Over Other Apps (for the floating brain mascot).",
    mockup: `[PERMISSIONS SETUP]\n✅ Accessibility Service: ENABLED\n✅ Display Over Other Apps: ENABLED\n[READY] Mascot will appear when Instagram or Shorts opens!`
  }
];

function selectSideloadStep(index) {
  sound.playPop();
  const tabs = document.querySelectorAll(".sideload-step-btn");
  tabs.forEach((tab, i) => {
    if (i === index) tab.classList.add("active");
    else tab.classList.remove("active");
  });

  const step = sideloadSteps[index];
  const titleEl = document.getElementById("sideload-step-title");
  const descEl = document.getElementById("sideload-step-desc");
  const mockEl = document.getElementById("sideload-step-mock");

  if (titleEl) titleEl.innerText = step.title;
  if (descEl) descEl.innerText = step.desc;
  if (mockEl) mockEl.innerText = step.mockup;
}

// ==========================================
// 7. DOWNLOAD MANAGER & ASSISTANT MODAL
// ==========================================
const GOOGLE_DRIVE_DIRECT_URL = "https://drive.google.com/file/d/1OYehgzvSZ9usMkNN5CMjFnNZg7exC0sm/view?usp=sharing";
const GOOGLE_DRIVE_EXPORT_DOWNLOAD = "https://drive.google.com/uc?export=download&id=1OYehgzvSZ9usMkNN5CMjFnNZg7exC0sm";

function startApkDownload(e) {
  if (e && e.preventDefault) e.preventDefault();
  sound.playPop();

  // 1. Trigger direct download from the Google Drive export link
  const driveLink = document.createElement("a");
  driveLink.href = GOOGLE_DRIVE_EXPORT_DOWNLOAD;
  driveLink.target = "_blank";
  driveLink.download = "RotBrain-v1.0.1.apk";
  document.body.appendChild(driveLink);
  driveLink.click();
  document.body.removeChild(driveLink);

  // 2. Also trigger local APK download fallback
  try {
    const localLink = document.createElement("a");
    localLink.href = "RotBrain.apk";
    localLink.download = "RotBrain-v1.0.1.apk";
    document.body.appendChild(localLink);
    localLink.click();
    document.body.removeChild(localLink);
  } catch (err) {}

  // 3. Open the Download Assistant Modal
  openDownloadModal();
}

function openDownloadModal() {
  const modal = document.getElementById("download-assistant-modal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeDownloadModal() {
  const modal = document.getElementById("download-assistant-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// ==========================================
// 8. SCROLL TRIGGER & REVEAL ANIMATIONS
// ==========================================
function initScrollObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal-on-scroll").forEach(el => {
    observer.observe(el);
  });

  // Floating Corner CTA scroll reveal
  const floatingCta = document.getElementById("floating-corner-download");
  if (floatingCta) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 350) {
        floatingCta.classList.add("is-visible");
      } else {
        floatingCta.classList.remove("is-visible");
      }
    }, { passive: true });
  }
}

// ==========================================
// 9. INITIALIZATION ON DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Phone Simulator
  updateHeroPhoneUI(false);
  initDraggableOverlay();

  // Button Listeners for Phone Simulator
  const nextReelBtn = document.getElementById("scroll-reel-btn");
  if (nextReelBtn) nextReelBtn.addEventListener("click", () => scrollNextReel(1));

  const fastBingeBtn = document.getElementById("fast-binge-btn");
  if (fastBingeBtn) fastBingeBtn.addEventListener("click", () => scrollNextReel(25));

  const resetBtn = document.getElementById("reset-simulator-btn");
  if (resetBtn) resetBtn.addEventListener("click", resetBrainSimulator);

  const autoBingeBtn = document.getElementById("auto-binge-btn");
  if (autoBingeBtn) autoBingeBtn.addEventListener("click", toggleAutoBinge);

  const dismissGuardBtn = document.getElementById("dismiss-guard-btn");
  if (dismissGuardBtn) {
    dismissGuardBtn.addEventListener("click", () => {
      sound.playPop();
      const modal = document.getElementById("hero-guard-modal");
      if (modal) {
        modal.classList.remove("active");
        modal.classList.add("dismissed");
      }
    });
  }

  const closeGuardBtn = document.getElementById("close-app-guard-btn");
  if (closeGuardBtn) {
    closeGuardBtn.addEventListener("click", () => {
      sound.playPop();
      resetBrainSimulator();
    });
  }

  // Stages tabs listeners
  const tabBtns = document.querySelectorAll(".stage-tab-btn");
  tabBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => selectBrainStage(idx));
  });

  const scrubber = document.getElementById("stages-scrubber");
  if (scrubber) {
    scrubber.addEventListener("input", (e) => onScrubberChange(e.target.value));
  }

  // Calculator listeners
  const dailyReelsInput = document.getElementById("calc-daily-reels");
  const daysActiveInput = document.getElementById("calc-days-week");
  if (dailyReelsInput) dailyReelsInput.addEventListener("input", updateDopamineCalc);
  if (daysActiveInput) daysActiveInput.addEventListener("input", updateDopamineCalc);
  updateDopamineCalc();

  // Heatmap initialization
  initHeatmap();

  // Sideload steps
  const sideloadBtns = document.querySelectorAll(".sideload-step-btn");
  sideloadBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => selectSideloadStep(idx));
  });

  // Sound toggle button in navbar
  const soundBtn = document.getElementById("sound-toggle-btn");
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      const isNowOn = sound.toggle();
      soundBtn.innerText = isNowOn ? "🔊" : "🔇";
      soundBtn.title = isNowOn ? "Sound Effects: ON" : "Sound Effects: MUTED";
      if (isNowOn) sound.playPop();
    });
  }

  // Download Trigger buttons everywhere
  const downloadTriggers = document.querySelectorAll(".trigger-download");
  downloadTriggers.forEach(btn => {
    btn.addEventListener("click", startApkDownload);
  });

  // Modal close buttons
  const closeModalBtn = document.getElementById("close-modal-btn");
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeDownloadModal);

  const modalOverlay = document.getElementById("download-assistant-modal");
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) closeDownloadModal();
    });
  }

  // Escape key to close modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDownloadModal();
  });

  // Scroll triggers
  initScrollObserver();
});
