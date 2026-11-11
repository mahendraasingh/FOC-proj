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