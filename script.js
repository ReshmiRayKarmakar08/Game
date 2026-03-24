/**
 * FractionQuest — script.js
 * Comprehensive logic for Professional UI, Theme Toggling, and Realistic Pizza Rendering
 */

"use strict";

/* ============================================================
   SECTION 1: DATA & CONFIGURATION
   ============================================================ */

const QUESTION_BANKS = {
  beginner: [
    { dividend: [3,4], divisor: [1,4], answer: 3, explanation: "There are 3 pieces of size 1/4 in 3/4." },
    { dividend: [2,3], divisor: [1,3], answer: 2, explanation: "Two 1/3 slices fill a 2/3 shape." },
    { dividend: [4,6], divisor: [2,6], answer: 2, explanation: "4/6 ÷ 2/6 = 2. Two groups of 2/6 make 4/6." },
    { dividend: [1,2], divisor: [1,4], answer: 2, explanation: "1/2 holds exactly two 1/4 pieces." },
    { dividend: [3,3], divisor: [1,3], answer: 3, explanation: "A whole divided into thirds gives 3 groups." },
    { dividend: [2,4], divisor: [1,4], answer: 2, explanation: "2/4 = 1/2. Two quarter-pieces fit inside." },
    { dividend: [6,8], divisor: [2,8], answer: 3, explanation: "Three groups of 2/8 make 6/8." },
    { dividend: [4,5], divisor: [2,5], answer: 2, explanation: "4/5 ÷ 2/5 = 2 groups." },
    { dividend: [1,2], divisor: [1,6], answer: 3, explanation: "Three 1/6 pieces fit into 1/2 = 3/6." },
    { dividend: [3,6], divisor: [1,6], answer: 3, explanation: "3/6 = 1/2. Three sixth-pieces fit inside." },
  ],
  intermediate: [
    { dividend: [5,4], divisor: [1,4], answer: 5, explanation: "5/4 is an improper fraction. Five 1/4 pieces fit!" },
    { dividend: [7,3], divisor: [1,3], answer: 7, explanation: "7/3 holds seven thirds." },
    { dividend: [9,4], divisor: [3,4], answer: 3, explanation: "Three groups of 3/4 make 9/4." },
    { dividend: [8,3], divisor: [2,3], answer: 4, explanation: "8/3 ÷ 2/3 = 4 groups of 2/3." },
    { dividend: [5,2], divisor: [1,4], answer: 10, explanation: "5/2 = 10/4. Ten quarter-pieces fit!" },
    { dividend: [7,4], divisor: [1,2], answer: 3.5, explanation: "7/4 ÷ 1/2 = 7/4 × 2 = 7/2 = 3.5 groups." },
    { dividend: [9,6], divisor: [3,6], answer: 3, explanation: "9/6 holds three groups of 3/6." },
    { dividend: [11,4], divisor: [1,4], answer: 11, explanation: "Count 11 quarter pieces in 11/4." },
    { dividend: [10,3], divisor: [2,3], answer: 5, explanation: "Five groups of 2/3 = 10/3." },
    { dividend: [6,4], divisor: [1,2], answer: 3, explanation: "6/4 = 3/2. Three halves fit? No—3 groups of 1/2 fit in 3/2." },
  ],
  challenge: [
    { dividend: [7,4], divisor: [3,8], answer: "14/3", answerNum: 14, answerDen: 3, explanation: "7/4 ÷ 3/8 = 7/4 × 8/3 = 56/12 = 14/3" },
    { dividend: [5,3], divisor: [5,6], answer: 2, explanation: "5/3 ÷ 5/6 = 5/3 × 6/5 = 2 groups." },
    { dividend: [9,4], divisor: [3,8], answer: 6, explanation: "9/4 ÷ 3/8 = 9/4 × 8/3 = 6." },
    { dividend: [4,5], divisor: [2,15], answer: 6, explanation: "4/5 ÷ 2/15 = 4/5 × 15/2 = 6." },
    { dividend: [7,8], divisor: [7,16], answer: 2, explanation: "7/8 ÷ 7/16 = 7/8 × 16/7 = 2." },
    { dividend: [5,6], divisor: [5,12], answer: 2, explanation: "5/6 ÷ 5/12 = 5/6 × 12/5 = 2." },
    { dividend: [3,4], divisor: [3,16], answer: 4, explanation: "3/4 ÷ 3/16 = 3/4 × 16/3 = 4." },
    { dividend: [11,6], divisor: [1,3], answer: "11/2", answerNum: 11, answerDen: 2, explanation: "11/6 ÷ 1/3 = 11/6 × 3 = 33/6 = 11/2." },
    { dividend: [9,10], divisor: [3,5], answer: "3/2", answerNum: 3, answerDen: 2, explanation: "9/10 ÷ 3/5 = 9/10 × 5/3 = 3/2." },
    { dividend: [8,9], divisor: [4,3], answer: "2/3", answerNum: 2, answerDen: 3, explanation: "8/9 ÷ 4/3 = 8/9 × 3/4 = 2/3." },
  ],
};

const BADGES = [
  { id: "first_correct", icon: "<span class='material-symbols-rounded' style='color:#ffd166;'>grade</span>", name: "First Star!", condition: s => s.totalCorrect >= 1 },
  { id: "three_streak",  icon: "<span class='material-symbols-rounded' style='color:#ff6b35;'>local_fire_department</span>", name: "On Fire!",   condition: s => s.bestStreak >= 3 },
  { id: "five_streak",   icon: "<span class='material-symbols-rounded' style='color:#ef4444;'>bolt</span>", name: "Unstoppable!", condition: s => s.bestStreak >= 5 },
  { id: "half_done",     icon: "<span class='material-symbols-rounded' style='color:#2ec4b6;'>track_changes</span>", name: "Halfway Hero", condition: s => s.totalCorrect >= 5 },
  { id: "perfect_round", icon: "<span class='material-symbols-rounded' style='color:#fcd34d;'>workspace_premium</span>", name: "Perfect Round!", condition: s => s.totalCorrect === 10 && s.totalWrong === 0 },
  { id: "speed_demon",   icon: "<span class='material-symbols-rounded' style='color:#fbbf24;'>bolt</span>", name: "Speed Demon!", condition: s => s.mode === "challenge" && s.totalCorrect >= 7 },
];

const AVATARS = [
  "<span class='material-symbols-rounded'>face_2</span>",
  "<span class='material-symbols-rounded'>face_3</span>",
  "<span class='material-symbols-rounded'>school</span>",
  "<span class='material-symbols-rounded'>emoji_people</span>",
  "<span class='material-symbols-rounded'>auto_fix_high</span>",
  "<span class='material-symbols-rounded' style='color:#fbbf24;'>emoji_events</span>"
];

/* ============================================================
   SECTION 2: STATE & DOM REFS
   ============================================================ */
const State = {
  playerName: "Player", mode: "intermediate", currentQ: 0, questions: [], score: 0, lives: 3,
  streak: 0, bestStreak: 0, totalCorrect: 0, totalWrong: 0, hintsUsed: 0, level: 1, step: 1,
  visualMode: "pizza", timerInterval: null, timeLeft: 60, placedUnits: 0, badgesEarned: [],
  get q() { return this.questions[this.currentQ]; },
};

const $ = id => document.getElementById(id);
const DOM = {
  splash: $("splash-screen"), game: $("game-screen"), results: $("results-screen"),
  playerName: $("player-name"), btnStart: $("btn-start"), btnPlayNow: $("btn-play-now"),
  btnHome: $("btn-home"), btnHint: $("btn-hint"), btnStepNext: $("btn-step-next"),
  btnCheck: $("btn-check"), btnSubmit: $("btn-submit"), btnNextQ: $("btn-next-q"),
  btnPlayAgain: $("btn-play-again"), btnHomeRes: $("btn-home-res"),
  btnViewLb: $("btn-view-lb"), btnShowLb: $("btn-show-leaderboard"),
  hdrName: $("hdr-name"), hdrAvatar: $("hdr-avatar"), hdrScore: $("hdr-score"),
  hdrLevel: $("hdr-level"), hdrLives: $("hdr-lives"), hdrTimer: $("hdr-timer"),
  timerWrap: $("timer-wrap"), progressFill: $("progress-fill"), progressLabel: $("progress-label"),
  qDividend: $("q-dividend"), qDivisor: $("q-divisor"), qAnswerSlot: $("q-answer-slot"),
  eli5Divisor: $("eli5-divisor"), eli5Dividend: $("eli5-dividend"), canvas: $("main-canvas"),
  trayUnits: $("tray-units"), trayUnitLabel: $("tray-unit-label"), answerSection: $("answer-section"),
  answerInput: $("answer-input"), ansHintText: $("answer-hint-text"), fracAnsRow: $("fraction-answer-row"),
  ansNum: $("ans-num"), ansDen: $("ans-den"), feedbackBanner: $("feedback-banner"),
  feedbackIcon: $("feedback-icon"), feedbackText: $("feedback-text"), feedbackExpl: $("feedback-explanation"),
  resScore: $("res-score"), resCorrect: $("res-correct"), resStreak: $("res-streak"),
  resultsTrophy: $("results-trophy"), resultsTitle: $("results-title"), badgesEarned: $("badges-earned"),
  lbModal: $("leaderboard-modal"), lbList: $("lb-list"), hintModal: $("hint-modal"),
  hintBody: $("hint-body"), hintCanvas: $("hint-canvas"), badgeToast: $("badge-toast"),
  toastIcon: $("toast-icon"), toastMsg: $("toast-msg"), confettiCanvas: $("confetti-canvas"),
  steps: document.querySelectorAll(".step"), modeModeCards: document.querySelectorAll(".mode-card"),
  vtabs: document.querySelectorAll(".vtab"), lbTabs: document.querySelectorAll(".lb-tab"),
};
const ctx = DOM.canvas ? DOM.canvas.getContext("2d") : null;

/* ============================================================
   SECTION 3: THEME & UI LOGIC
   ============================================================ */

function initTheme() {
  const saved = localStorage.getItem('fq_theme') || 'light';
  if (saved === 'dark') document.body.classList.add('dark-theme');
  
  [$('theme-toggle-landing'), $('theme-toggle-game')].forEach(btn => {
    if(!btn) return;
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const current = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
      localStorage.setItem('fq_theme', current);
    });
  });
}

function initModals() {
  const setupModal = (id, closeId, openId) => {
    const m = $(id), c = $(closeId), o = $(openId);
    if(m && c) c.addEventListener('click', () => m.style.display = 'none');
    if(m && o) o.addEventListener('click', (e) => { e.preventDefault(); m.style.display = 'flex'; });
  };
  setupModal('about-modal', 'about-close', 'footer-about');
  setupModal('settings-modal', 'settings-close', 'footer-settings');
  setupModal('leaderboard-modal', 'lb-close', 'footer-leaderboard');
}

/* ============================================================
   SECTION 4: IMAGE SEQUENCE SCROLL ANIMATION
   ============================================================ */

const SEQ_TOTAL_FRAMES = 200;
const seqImages = [];
let seqLoaded = 0;
let seqCurrentFrame = 0;

function initImageSequence() {
  const canvas = $('seq-canvas');
  if (!canvas) return;
  const cx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderFrame(seqCurrentFrame);
  }
  window.addEventListener('resize', resize);
  resize();

  // Preload all frames
  for (let i = 1; i <= SEQ_TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = `imagesequence/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
    img.onload = () => {
      seqLoaded++;
      // Draw first frame as soon as it's ready
      if (i === 1) renderFrame(0);
    };
    seqImages.push(img);
  }

  function renderFrame(index) {
    const img = seqImages[index];
    if (!img || !img.complete) return;
    cx.clearRect(0, 0, canvas.width, canvas.height);

    // Cover fit (like background-size: cover)
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale, sh = ih * scale;
    cx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);

    // Dark overlay for text readability
    cx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    cx.fillRect(0, 0, cw, ch);
  }

  // Scroll-driven playback
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = Math.min(scrollTop / Math.max(maxScroll, 1), 1);
    const frameIndex = Math.min(Math.floor(scrollFraction * SEQ_TOTAL_FRAMES), SEQ_TOTAL_FRAMES - 1);
    if (frameIndex !== seqCurrentFrame) {
      seqCurrentFrame = frameIndex;
      requestAnimationFrame(() => renderFrame(seqCurrentFrame));
    }
  });

  // Auto-play animation on the splash screen (since it's a single viewport, no scroll)
  let autoFrame = 0;
  let autoDir = 1;
  function autoAnimate() {
    // Only auto-animate if user hasn't scrolled (splash screen visible)
    const splash = $('splash-screen');
    if (!splash || !splash.classList.contains('active')) return;

    autoFrame += autoDir;
    if (autoFrame >= SEQ_TOTAL_FRAMES - 1) autoDir = -1;
    if (autoFrame <= 0) autoDir = 1;

    renderFrame(autoFrame);
    seqCurrentFrame = autoFrame;
    setTimeout(() => requestAnimationFrame(autoAnimate), 50);
  }
  // Start auto-animation after images load
  const checkReady = setInterval(() => {
    if (seqLoaded >= 10) { // Start after first 10 frames load
      clearInterval(checkReady);
      autoAnimate();
    }
  }, 200);
}

/* ============================================================
   SECTION 5: GAME LOGIC & REALISTIC PIZZA
   ============================================================ */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  if(id==='splash-screen') window.scrollTo(0,0);
}

const COLORS = {
  dividend: ["#6c63ff","#a78bfa","#818cf8","#7c3aed","#4f46e5","#8b5cf6","#9333ea","#c084fc","#7e22ce","#6d28d9"],
  divisor:  ["#ff6b35","#fb923c","#f97316","#ea580c","#dc2626","#ef4444","#f87171","#fca5a5","#b91c1c","#c2410c"],
  bg:       "#fafafe", grid: "rgba(0,0,0,0.05)",
};

/** Draw a professional pizza with toppings and crust */
function drawRealPizza(cx, cy, r, n, d, filled, isDiv = false) {
  // 1. Crust
  const crustGrad = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r);
  crustGrad.addColorStop(0, "#f3d29c");
  crustGrad.addColorStop(1, "#c68642");
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = crustGrad; ctx.fill();
  ctx.strokeStyle = "#8d5524"; ctx.lineWidth = 2; ctx.stroke();

  // 2. Base Cheese
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
  ctx.fillStyle = "#ffda6c"; ctx.fill();

  // 3. Toppings Area (Slices)
  const colorArr = isDiv ? COLORS.divisor : COLORS.dividend;
  for (let i = 0; i < (filled ? n : 0); i++) {
    const start = -Math.PI / 2 + (i / d) * Math.PI * 2;
    const end   = -Math.PI / 2 + ((i + 1) / d) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r * 0.88, start, end); ctx.closePath();
    ctx.fillStyle = colorArr[i % colorArr.length] + "44"; // Translucent overlay
    ctx.fill();
    
    // Pepperoni circles randomly in slice
    ctx.save();
    ctx.clip();
    for(let j=0; j<3; j++) {
      const dist = (0.3 + Math.random()*0.5) * r;
      const angle = start + Math.random()*(end-start);
      const px = cx + Math.cos(angle)*dist;
      const py = cy + Math.sin(angle)*dist;
      ctx.beginPath(); ctx.arc(px, py, r*0.08, 0, Math.PI*2);
      ctx.fillStyle = "#d53d0d"; ctx.fill();
      ctx.strokeStyle = "#a52a2a"; ctx.lineWidth = 1; ctx.stroke();
    }
    ctx.restore();
  }

  // 4. Grid Lines
  for (let i = 0; i < d; i++) {
    const angle = -Math.PI / 2 + (i / d) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.strokeStyle = "rgba(141, 85, 36, 0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
  }
}

/** Draw a professional bar visual model */
function drawBar(cx, cy, w, h, n, d, filled, isDiv = false) {
  const colorArr = isDiv ? COLORS.divisor : COLORS.dividend;
  const unitW = w / d;
  
  // Background
  ctx.fillStyle = "var(--c-surface-soft)";
  ctx.fillRect(cx, cy, w, h);
  ctx.strokeStyle = "var(--c-border)";
  ctx.lineWidth = 2;
  ctx.strokeRect(cx, cy, w, h);

  // Filled parts
  for (let i = 0; i < (filled ? n : 0); i++) {
    ctx.fillStyle = colorArr[i % colorArr.length] + "ee";
    ctx.fillRect(cx + i * unitW, cy, unitW, h);
    ctx.strokeStyle = "#fff";
    ctx.strokeRect(cx + i * unitW, cy, unitW, h);
  }

  // Grid lines
  ctx.beginPath();
  for (let i = 1; i < d; i++) {
    ctx.moveTo(cx + i * unitW, cy);
    ctx.lineTo(cx + i * unitW, cy + h);
  }
  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawPizza(dividend, divisor, step, placed) {
  const W = DOM.canvas.width, H = DOM.canvas.height;
  ctx.clearRect(0, 0, W, H);
  const [dN, dD] = dividend; const [vN, vD] = divisor;
  const cxVal = W * 0.28, cyVal = H * 0.5, rVal = Math.min(H * 0.38, W * 0.22);
  drawRealPizza(cxVal, cyVal, rVal, dN, dD, step >= 1);
  ctx.fillStyle = "var(--c-text-main)"; ctx.font = "bold 14px Nunito"; ctx.textAlign = "center";
  ctx.fillText(`Dividend: ${dN}/${dD}`, cxVal, cyVal + rVal + 26);

  if (step < 2) return;
  const cx2 = W * 0.72, cy2 = H * 0.5;
  drawRealPizza(cx2, cy2, rVal * 0.7, vN, vD, true, true);
  ctx.fillStyle = "var(--c-text-main)"; ctx.fillText(`Divisor: ${vN}/${vD}`, cx2, cy2 + rVal * 0.7 + 24);

  if (step >= 2 && placed > 0) {
    for (let i = 0; i < placed; i++) {
        const startAngle = -Math.PI / 2 + (i * vN / vD) * 2 * Math.PI;
        const endAngle   = startAngle + (vN / vD) * 2 * Math.PI;
        ctx.beginPath(); ctx.moveTo(cxVal, cyVal); ctx.arc(cxVal, cyVal, rVal * 0.9, startAngle, endAngle); ctx.closePath();
        ctx.fillStyle = "rgba(46, 196, 182, 0.4)"; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.stroke();
        const mid = (startAngle+endAngle)/2;
        ctx.fillStyle = "#fff"; ctx.font = "bold 20px Fredoka One";
        ctx.fillText(i+1, cxVal + Math.cos(mid)*rVal*0.6, cyVal + Math.sin(mid)*rVal*0.6);
    }
  }
}

function redraw() {
  if (!State.q || !ctx) return;
  const q = State.q;
  if (State.visualMode === 'pizza') {
    drawPizza(q.dividend, q.divisor, State.step, State.placedUnits);
  } else {
    const W = DOM.canvas.width, H = DOM.canvas.height;
    ctx.clearRect(0, 0, W, H);
    drawBar(W*0.1, H*0.2, W*0.8, 60, q.dividend[0], q.dividend[1], State.step >= 1);
    ctx.fillStyle = "var(--c-text-main)"; ctx.font = "bold 14px Nunito"; ctx.textAlign = "center";
    ctx.fillText(`Dividend: ${q.dividend[0]}/${q.dividend[1]}`, W*0.5, H*0.2 + 85);

    if (State.step >= 2) {
      drawBar(W*0.1, H*0.55, W*0.4, 40, q.divisor[0], q.divisor[1], true, true);
      ctx.fillStyle = "var(--c-text-main)"; ctx.fillText(`Divisor: ${q.divisor[0]}/${q.divisor[1]}`, W*0.3, H*0.55 + 65);
      
      if (State.placedUnits > 0) {
        const unitW = (W*0.8) / q.dividend[1];
        const divisorW = (W*0.8) * (q.divisor[0]/q.divisor[1]) / (q.dividend[0]/q.dividend[1]); // Wait, simple scale
        const scale = (W*0.8) / (q.dividend[0]/q.dividend[1]);
        const dw = scale * (q.divisor[0]/q.divisor[1]);

        for(let i=0; i<State.placedUnits; i++) {
          ctx.fillStyle = "rgba(46, 196, 182, 0.4)";
          ctx.fillRect(W*0.1 + i*dw, H*0.2, dw, 60);
          ctx.strokeStyle = "#fff"; ctx.strokeRect(W*0.1 + i*dw, H*0.2, dw, 60);
          ctx.fillStyle = "#fff"; ctx.font = "bold 18px Fredoka One";
          ctx.fillText(i+1, W*0.1 + i*dw + dw/2, H*0.2 + 35);
        }
      }
    }
  }
}

function updateProgress() { DOM.progressFill.style.width = ((State.currentQ / State.questions.length) * 100) + "%"; DOM.progressLabel.textContent = `Q ${State.currentQ + 1} / ${State.questions.length}`; }
function updateStepIndicator(as) { DOM.steps.forEach(s => { const n = parseInt(s.dataset.step); s.classList.toggle("active", n === as); s.classList.toggle("done", n < as); }); }

function loadQuestion() {
  const q = State.q; if (!q) return endRound();
  State.step = 1; State.placedUnits = 0;
  DOM.qDividend.textContent = `${q.dividend[0]}/${q.dividend[1]}`; DOM.qDivisor.textContent = `${q.divisor[0]}/${q.divisor[1]}`;
  DOM.qAnswerSlot.textContent = "?"; DOM.qAnswerSlot.classList.remove("filled");
  DOM.eli5Divisor.textContent = `${q.divisor[0]}/${q.divisor[1]}`; DOM.eli5Dividend.textContent = `${q.dividend[0]}/${q.dividend[1]}`;
  DOM.trayUnitLabel.textContent = `${q.divisor[0]}/${q.divisor[1]}`;
  DOM.btnStepNext.style.display = "inline-flex"; DOM.btnCheck.style.display = "none"; DOM.answerSection.style.display = "none"; DOM.feedbackBanner.style.display = "none";
  DOM.answerInput.value = ""; DOM.ansNum.value = ""; DOM.ansDen.value = ""; DOM.fracAnsRow.style.display = "none";
  updateStepIndicator(1); buildDivisorTray(); updateProgress(); redraw();
}

function buildDivisorTray() {
  DOM.trayUnits.innerHTML = "";
  const ans = Math.ceil((State.q.dividend[0]*State.q.divisor[1])/(State.q.dividend[1]*State.q.divisor[0]));
  for (let i = 0; i < Math.min(ans + 2, 12); i++) {
    const chip = document.createElement("div"); chip.className = "unit-chip pop-in"; chip.style.animationDelay = `${i * 0.04}s`;
    chip.innerHTML = `<span>${State.q.divisor[0]}/${State.q.divisor[1]}</span>`;
    chip.addEventListener("click", () => {
        if (State.step < 2) return;
        chip.classList.add("placed"); State.placedUnits++;
        if (State.step < 3) { State.step = 3; updateStepIndicator(3); }
        if (State.placedUnits >= Math.floor(ans)) DOM.btnCheck.style.display = "inline-flex";
        redraw();
    });
    DOM.trayUnits.appendChild(chip);
  }
}

function checkAnswer() {
  const q = State.q; let ok = false, usr;
  if (State.mode === "challenge" && typeof q.answer === "string") {
    const un = parseInt(DOM.ansNum.value), ud = parseInt(DOM.ansDen.value);
    ok = (un/ud === q.answerNum/q.answerDen); usr = `${un}/${ud}`;
  } else {
    usr = parseFloat(DOM.answerInput.value);
    ok = Math.abs(usr - (typeof q.answer==='string'?q.answerNum/q.answerDen:q.answer)) < 0.01;
  }
  if (ok) {
    State.score += 100; State.streak++; State.totalCorrect++; updateLevel(); showFeedback(true, "+100 pts!", q.explanation); fireConfetti();
  } else {
    State.lives--; State.streak = 0; showFeedback(false, "Try again!", q.explanation); updateLives();
    if(State.lives <= 0) setTimeout(endRound, 2000);
  }
}

function showFeedback(ok, msg, expl) {
  DOM.feedbackBanner.style.display = "flex"; DOM.feedbackBanner.className = `feedback-banner ${ok?"correct":"wrong"}`;
  DOM.feedbackIcon.innerHTML = ok ? "<span class='material-symbols-rounded' style='color:#10b981;'>celebration</span>" : "<span class='material-symbols-rounded' style='color:#ef4444;'>error</span>";
  DOM.feedbackText.textContent = msg; DOM.feedbackExpl.textContent = expl;
  DOM.answerSection.style.display = "none"; redraw();
}

function updateLives() { DOM.hdrLives.innerHTML = "<span class='material-symbols-rounded' style='color:#ef4444; font-variation-settings: \"FILL\" 1;'>favorite</span>".repeat(State.lives) + "<span class='material-symbols-rounded' style='color:#ccc;'>favorite</span>".repeat(3 - State.lives); }
function updateLevel() { State.level = Math.floor(State.score / 500) + 1; DOM.hdrLevel.textContent = State.level; DOM.hdrAvatar.innerHTML = AVATARS[Math.min(State.level-1, 5)]; DOM.hdrScore.textContent = State.score; }

/* ============================================================
   SECTION 6: BACKEND & SCORES
   ============================================================ */

async function saveScoreLocal() {
  const data = { action: 'save_score', name: State.playerName, score: State.score, mode: State.mode, correct: State.totalCorrect, streak: State.bestStreak };
  console.log("Saving score:", data);
  // Optional PHP backend call
  try {
    await fetch('backend.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  } catch(e) { console.warn("Backend save failed, using local fallback."); }
  
  const key = `fq_scores_${State.mode}`;
  const ex = JSON.parse(localStorage.getItem(key) || "[]");
  ex.push(data);
  localStorage.setItem(key, JSON.stringify(ex.sort((a,b)=>b.score-a.score).slice(0, 15)));
}

async function renderLeaderboard(mode) {
  let scores = [];
  try {
    const res = await fetch(`backend.php?action=get_scores&mode=${mode}`);
    scores = await res.json();
  } catch(e) {
    scores = JSON.parse(localStorage.getItem(`fq_scores_${mode}`) || "[]");
  }
  
  DOM.lbList.innerHTML = scores.length ? scores.map((x,i)=>`
    <div class="lb-entry">
      <span class="lb-rank ${i<3?['gold','silver','bronze'][i]:''}">${i+1}</span>
      <span class="lb-name">${x.name}</span>
      <span class="lb-score">${x.score}</span>
    </div>`).join("") : `<div class="lb-loading">No scores yet!</div>`;
}

/* Confetti Particles */
const confettiParticles = []; let confettiAnimating = false;
function fireConfetti() {
  for (let i=0; i<60; i++) confettiParticles.push({ x:window.innerWidth/2, y:window.innerHeight/2, vx:(Math.random()-0.5)*10, vy:(Math.random()-0.5)*10, color:["#ff6b35","#6c63ff","#2ec4b6","#ffd166"][i%4], size:Math.random()*8+4, life:1 });
  if (!confettiAnimating) animateConfetti();
}
function animateConfetti() {
  confettiAnimating = true; const cEle = DOM.confettiCanvas, cxx = cEle.getContext("2d");
  cEle.width = window.innerWidth; cEle.height = window.innerHeight;
  function act() {
    cxx.clearRect(0, 0, cEle.width, cEle.height);
    for (let i = confettiParticles.length-1; i>=0; i--) {
      const p = confettiParticles[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=0.2; p.life-=0.02;
      if (p.life<=0) { confettiParticles.splice(i,1); continue; }
      cxx.fillStyle=p.color; cxx.globalAlpha=p.life; cxx.fillRect(p.x, p.y, p.size, p.size);
    }
    if(confettiParticles.length) requestAnimationFrame(act); else confettiAnimating = false;
  }
  requestAnimationFrame(act);
}

/* Initialization */
document.addEventListener('DOMContentLoaded', () => {
  initTheme(); initModals(); initImageSequence();
  DOM.btnStart.addEventListener('click', () => {
    State.playerName = DOM.playerName.value.trim() || "Explorer";
    State.score = 0; State.lives = 3; State.currentQ = 0;
    State.questions = [...QUESTION_BANKS[State.mode]].sort(()=>Math.random()-0.5).slice(0,10);
    updateLives(); updateLevel(); showScreen('game-screen'); loadQuestion();
  });
  DOM.btnHome.addEventListener('click', () => showScreen('splash-screen'));
  DOM.btnStepNext.addEventListener('click', () => { State.step++; if(State.step===4) { DOM.btnStepNext.style.display='none'; DOM.answerSection.style.display='flex'; } updateStepIndicator(State.step); redraw(); });
  DOM.btnSubmit.addEventListener('click', checkAnswer);
  DOM.btnNextQ.addEventListener('click', () => { State.currentQ++; loadQuestion(); });
  DOM.btnPlayAgain.addEventListener('click', () => DOM.btnStart.click());
  DOM.btnHomeRes.addEventListener('click', () => showScreen('splash-screen'));
  DOM.vtabs.forEach(t => t.addEventListener('click', () => {
    DOM.vtabs.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    State.visualMode = t.dataset.visual;
    redraw();
  }));
});

function endRound() { showScreen('results-screen'); DOM.resScore.textContent = State.score; DOM.resCorrect.textContent = `${State.totalCorrect}/10`; saveScoreLocal(); }
