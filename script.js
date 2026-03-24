/**
 * FractionQuest — script.js
 * Comprehensive logic for Landing Page animations & Game UI
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
  { id: "first_correct", icon: "<span class='material-symbols-rounded' style='color:#ffd166;'>star</span>", name: "First Star!", condition: s => s.totalCorrect >= 1 },
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
   SECTION 3: LANDING PAGE ANIMATIONS
   ============================================================ */

/** Initialize Particle Background */
function initParticles() {
  const canvas = $("particle-canvas");
  if(!canvas) return;
  const cx = canvas.getContext("2d");
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const particles = [];

  for(let i=0; i<40; i++) {
    particles.push({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 3 + 1, alpha: Math.random() * 0.5 + 0.1
    });
  }

  function render() {
    cx.clearRect(0,0,w,h);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0 || p.x>w) p.vx *= -1;
      if(p.y<0 || p.y>h) p.vy *= -1;
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      cx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`; cx.fill();
    });
    requestAnimationFrame(render);
  }
  render();
  window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; });
}

/** Scroll Reveal Logic */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
        if(entry.target.classList.contains('reward-card')) animateCounters();
        if(entry.target.id === 'demo-section' || entry.target.closest('.demo-section')) {
          if(!window.demoStarted) { window.demoStarted = true; animateDemoCanvas(); }
        }
      }
    });
  }, { threshold: 0.1 });
  elements.forEach(el => observer.observe(el));
}

/** Counter Animation */
let countersAnimated = false;
function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;
  document.querySelectorAll('.reward-counter').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const updateCount = () => {
      const c = +counter.innerText;
      const inc = target / 40;
      if (c < target) {
        counter.innerText = Math.ceil(c + inc);
        setTimeout(updateCount, 40);
      } else {
        counter.innerText = target + (target > 500 ? "+" : "");
      }
    };
    updateCount();
  });
}

/** Animated Demo Canvas */
function animateDemoCanvas() {
  const canvas = $("demo-canvas");
  if(!canvas) return;
  const dcx = canvas.getContext("2d");
  let progress = 0;
  function draw() {
    dcx.clearRect(0, 0, 600, 320);
    dcx.beginPath(); dcx.arc(150, 160, 100, 0, Math.PI*2); dcx.fillStyle = "#2a214d"; dcx.fill();
    for(let i=0; i<3; i++) {
      const angle = -Math.PI/2 + (i*Math.PI/2);
      dcx.beginPath(); dcx.moveTo(150, 160); dcx.arc(150,160, 100, angle, angle + Math.PI/2);
      dcx.fillStyle = "rgba(108,99,255, 0.4)"; dcx.fill();
      dcx.strokeStyle = "rgba(255,255,255,0.4)"; dcx.lineWidth=2; dcx.stroke();
    }
    for(let i=0; i<3; i++) {
        const animState = Math.min(1, Math.max(0, (progress - i*0.3)/0.4));
        const easeIdx = 1 - Math.pow(1 - animState, 3);
        const angle = -Math.PI/2 + (i*Math.PI/2);
        const tx = 380 + (i*80); const ty = 160;
        const cxValue = 150 + (tx - 150) * easeIdx; const cyValue = 160 + (ty - 160) * easeIdx;
        dcx.beginPath(); dcx.moveTo(cxValue, cyValue); dcx.arc(cxValue, cyValue, 90, angle, angle + Math.PI/2);
        dcx.fillStyle = "rgba(255,107,53,0.9)"; dcx.fill();
        dcx.strokeStyle = "#fff"; dcx.lineWidth = 3; dcx.stroke();
        if (easeIdx > 0.8) {
            dcx.fillStyle = "#fff"; dcx.font = "bold 24px Fredoka One"; dcx.textAlign="center"; dcx.textBaseline="middle";
            const mx = cxValue + Math.cos(angle + Math.PI/4)*45; const my = cyValue + Math.sin(angle + Math.PI/4)*45;
            dcx.fillText(i+1, mx, my);
        }
    }
    progress += 0.005;
    if(progress > 2.5) progress = 0;
    requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollReveal();
});

/* ============================================================
   SECTION 4: GAME LOGIC
   ============================================================ */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  if(id==='splash-screen') window.scrollTo(0,0);
}

function fracStr(n, d) { return d === 1 ? `${n}` : `${n}/${d}`; }
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

const COLORS = {
  dividend: ["#6c63ff","#a78bfa","#818cf8","#7c3aed","#4f46e5","#8b5cf6","#9333ea","#c084fc","#7e22ce","#6d28d9"],
  divisor:  ["#ff6b35","#fb923c","#f97316","#ea580c","#dc2626","#ef4444","#f87171","#fca5a5","#b91c1c","#c2410c"],
  bg:       "#fafafe", grid: "#e2e0f0",
};

function drawCircleFraction(cx, cy, r, n, d, filled, isDiv = false) {
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = isDiv ? "#fffcf5" : "#f0edff"; ctx.fill();
  ctx.strokeStyle = COLORS.grid; ctx.lineWidth = 2; ctx.stroke();

  const colorArr = isDiv ? COLORS.divisor : COLORS.dividend;
  for (let i = 0; i < (filled ? n : 0); i++) {
    const start = -Math.PI / 2 + (i / d) * Math.PI * 2;
    const end   = -Math.PI / 2 + ((i + 1) / d) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, start, end); ctx.closePath();
    ctx.fillStyle = colorArr[i % colorArr.length] + "dd"; ctx.fill();
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
  }

  for (let i = 0; i < d; i++) {
    const angle = -Math.PI / 2 + (i / d) * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1.5; ctx.stroke();
  }

  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = isDiv ? "#ff6b35" : "#6c63ff"; ctx.lineWidth = 3; ctx.stroke();
}

function drawPizza(dividend, divisor, step, placed) {
  const W = DOM.canvas.width, H = DOM.canvas.height;
  ctx.clearRect(0, 0, W, H);

  const [dN, dD] = dividend; const [vN, vD] = divisor;
  const cxVal = W * 0.28, cyVal = H * 0.5, rVal = Math.min(H * 0.38, W * 0.22);
  drawCircleFraction(cxVal, cyVal, rVal, dN, dD, step >= 1);

  ctx.fillStyle = "#1a1a2e"; ctx.font = "bold 14px Nunito, sans-serif"; ctx.textAlign = "center";
  ctx.fillText(`Dividend: ${fracStr(dN, dD)}`, cxVal, cyVal + rVal + 22);

  if (step < 2) return;

  const cx2 = W * 0.72, cy2 = H * 0.5;
  drawCircleFraction(cx2, cy2, rVal * 0.7, vN, vD, true, true);
  ctx.fillStyle = "#1a1a2e"; ctx.font = "bold 13px Nunito, sans-serif"; ctx.textAlign = "center";
  ctx.fillText(`Divisor: ${fracStr(vN, vD)}`, cx2, cy2 + rVal * 0.7 + 20);

  if (step >= 2 && placed > 0) {
    for (let i = 0; i < placed; i++) {
      const startAngle = -Math.PI / 2 + (i * vN / vD) * 2 * Math.PI;
      const endAngle   = startAngle + (vN / vD) * 2 * Math.PI;
      ctx.beginPath(); ctx.moveTo(cxVal, cyVal); ctx.arc(cxVal, cyVal, rVal, startAngle, endAngle); ctx.closePath();
      ctx.fillStyle = COLORS.divisor[i % COLORS.divisor.length] + "aa"; ctx.fill();
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();

      const midAngle = (startAngle + endAngle) / 2;
      const lx = cxVal + Math.cos(midAngle) * rVal * 0.6; const ly = cyVal + Math.sin(midAngle) * rVal * 0.6;
      ctx.fillStyle = "#fff"; ctx.font = "bold 18px Fredoka One, cursive"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(i + 1, lx, ly);
    }
  }

  if (step >= 3) {
    ctx.fillStyle = "#6c63ff"; ctx.font = "bold 16px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.fillText(`Count: ${placed} group${placed !== 1 ? "s" : ""}`, cxVal, 24);
  }
}

function redraw() {
  if (!State.q || !ctx) return;
  if(State.visualMode==='pizza') drawPizza(State.q.dividend, State.q.divisor, State.step, State.placedUnits);
}

function buildDivisorTray() {
  const q = State.q; DOM.trayUnits.innerHTML = "";
  const ans = Math.ceil((q.dividend[0]*q.divisor[1])/(q.dividend[1]*q.divisor[0]));
  const count = Math.min(ans + 2, 12);

  for (let i = 0; i < count; i++) {
    const chip = document.createElement("div"); chip.className = "unit-chip pop-in"; chip.style.animationDelay = `${i * 0.04}s`; chip.dataset.index = i;
    chip.innerHTML = `<span>${fracStr(q.divisor[0], q.divisor[1])}</span><span class="chip-num">#${i + 1}</span>`;
    chip.setAttribute("draggable", true);
    chip.addEventListener("dragstart", e => { e.dataTransfer.effectAllowed = "move"; draggingChip = e.currentTarget; });
    chip.addEventListener("click", () => placeUnit(chip, i));
    DOM.trayUnits.appendChild(chip);
  }
}

function updateProgress() { DOM.progressFill.style.width = ((State.currentQ / State.questions.length) * 100) + "%"; DOM.progressLabel.textContent = `Q ${State.currentQ + 1} / ${State.questions.length}`; }
function updateStepIndicator(as) { DOM.steps.forEach(s => { const n = parseInt(s.dataset.step); s.classList.toggle("active", n === as); s.classList.toggle("done", n < as); }); }

function loadQuestion() {
  const q = State.q; if (!q) return endRound();
  State.step = 1; State.placedUnits = 0;
  DOM.qDividend.textContent = fracStr(q.dividend[0], q.dividend[1]); DOM.qDivisor.textContent = fracStr(q.divisor[0], q.divisor[1]);
  DOM.qAnswerSlot.textContent = "?"; DOM.qAnswerSlot.classList.remove("filled");
  DOM.eli5Divisor.textContent = fracStr(q.divisor[0], q.divisor[1]); DOM.eli5Dividend.textContent = fracStr(q.dividend[0], q.dividend[1]);
  DOM.trayUnitLabel.textContent = fracStr(q.divisor[0], q.divisor[1]);
  DOM.btnStepNext.style.display = "inline-flex"; DOM.btnStepNext.textContent = "Next Step →";
  DOM.btnCheck.style.display = "none"; DOM.answerSection.style.display = "none"; DOM.feedbackBanner.style.display = "none";
  DOM.answerInput.value = ""; DOM.ansNum.value = ""; DOM.ansDen.value = ""; DOM.fracAnsRow.style.display = "none";
  updateStepIndicator(1); buildDivisorTray(); updateProgress(); redraw();
}

function nextStep() {
  State.step++; updateStepIndicator(State.step);
  if (State.step === 2) { DOM.btnStepNext.textContent = "I've counted! →"; redraw(); pulseCanvas(); }
  else if (State.step === 3) { DOM.btnStepNext.textContent = "Done counting →"; redraw(); pulseCanvas(); }
  else if (State.step === 4) {
    DOM.btnStepNext.style.display = "none"; DOM.answerSection.style.display = "flex"; DOM.answerSection.classList.add("fade-in");
    if (State.mode === "challenge" && typeof State.q.answer === "string") DOM.fracAnsRow.style.display = "flex";
    redraw();
  }
}

let draggingChip = null;
if(DOM.canvas) {
    DOM.canvas.addEventListener("dragover", e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; });
    DOM.canvas.addEventListener("drop", e => {
    e.preventDefault();
    if (draggingChip && !draggingChip.classList.contains("placed")) placeUnit(draggingChip, parseInt(draggingChip.dataset.index));
    });
}

function placeUnit(chip, index) {
  if (chip.classList.contains("placed") || State.step < 2) { if (State.step < 2) pulseCanvas(); return; }
  const ans = (State.q.dividend[0] * State.q.divisor[1]) / (State.q.dividend[1] * State.q.divisor[0]);
  if (State.placedUnits >= Math.floor(ans) + 0.5) return;
  State.placedUnits++; chip.classList.add("placed");
  if (State.step < 3) { State.step = 3; updateStepIndicator(3); }
  redraw();
  if (State.placedUnits >= Math.floor(ans)) DOM.btnCheck.style.display = "inline-flex";
}

function updateLives() { DOM.hdrLives.innerHTML = "<span class='material-symbols-rounded' style='color:#ef4444; font-variation-settings: \"FILL\" 1;'>favorite</span>".repeat(State.lives) + "<span class='material-symbols-rounded' style='color:#ccc; font-variation-settings: \"FILL\" 0;'>favorite</span>".repeat(3 - State.lives); }
function updateLevel() { State.level = Math.floor(State.score / 500) + 1; DOM.hdrLevel.textContent = State.level; DOM.hdrAvatar.innerHTML = AVATARS[Math.min(State.level-1, 5)]; }

function showFeedback(ok, msg, expl) {
  DOM.feedbackBanner.style.display = "flex"; DOM.feedbackBanner.className = `feedback-banner ${ok?"correct":"wrong"}`;
  DOM.feedbackIcon.innerHTML = ok ? "<span class='material-symbols-rounded' style='color:#10b981;'>celebration</span>" : "<span class='material-symbols-rounded' style='color:#3b82f6;'>fitness_center</span>"; DOM.feedbackText.textContent = msg; DOM.feedbackExpl.innerHTML = `<span class='material-symbols-rounded' style='font-size:16px;'>chat</span> ${expl}`;
  DOM.answerSection.style.display = "none"; DOM.btnStepNext.style.display = "none";
}

function checkBadges() {
  BADGES.forEach(b => {
    if (!State.badgesEarned.includes(b.id) && b.condition(State)) {
      State.badgesEarned.push(b.id);
      DOM.toastIcon.innerHTML = b.icon; DOM.toastMsg.textContent = b.name; DOM.badgeToast.style.display = "flex";
      setTimeout(() => DOM.badgeToast.style.display = "none", 3200);
    }
  });
}

function checkAnswer() {
  const q = State.q; let ok = false, usr;
  if (State.mode === "challenge" && typeof q.answer === "string") {
    const un = parseInt(DOM.ansNum.value) || 0, ud = parseInt(DOM.ansDen.value) || 1; usr = `${un}/${ud}`;
    const qg = gcd(q.answerNum, q.answerDen), ug = gcd(un, ud);
    ok = (q.answerNum / qg === un / ug) && (q.answerDen / qg === ud / ug);
  } else {
    usr = parseFloat(DOM.answerInput.value);
    const corr = typeof q.answer === "string" ? q.answerNum / q.answerDen : q.answer;
    ok = Math.abs(usr - corr) < 0.01;
  }
  if (ok) {
    const earn = (State.mode === "challenge" ? 150 : State.mode === "intermediate" ? 100 : 75) + (State.streak >= 2 ? State.streak*20 : 0);
    State.score += earn; State.streak++; State.bestStreak = Math.max(State.bestStreak, State.streak); State.totalCorrect++;
    DOM.hdrScore.textContent = State.score; DOM.qAnswerSlot.textContent = q.answer; DOM.qAnswerSlot.classList.add("filled");
    showFeedback(true, `+${earn} pts${State.streak>=2 ? ` (<span class='material-symbols-rounded' style='color:#ff6b35;'>local_fire_department</span> ×${State.streak})` : ""}`, q.explanation); checkBadges();
    State.step = 4; State.placedUnits = Math.round((q.dividend[0]*q.divisor[1])/(q.dividend[1]*q.divisor[0])); redraw(); fireConfetti(); updateLives(); updateLevel();
  } else {
    State.streak = 0; State.totalWrong++; State.lives = Math.max(0, State.lives - 1);
    showFeedback(false, `Not quite! You said ${usr}`, q.explanation); updateLives();
    DOM.answerInput.classList.add("shake"); setTimeout(() => DOM.answerInput.classList.remove("shake"), 500);
    if (State.lives === 0) setTimeout(endRound, 2000);
  }
}

function nextQuestion() {
  State.currentQ++;
  if (State.currentQ >= State.questions.length) endRound();
  else loadQuestion();
}

function endRound() {
  const pct = State.totalCorrect / State.questions.length;
  showScreen("results-screen");
  DOM.resultsTrophy.innerHTML = pct === 1 ? "<span class='material-symbols-rounded' style='color:#fbbf24;'>emoji_events</span>" : pct >= 0.7 ? "<span class='material-symbols-rounded' style='color:#fcd34d;'>workspace_premium</span>" : pct >= 0.5 ? "<span class='material-symbols-rounded' style='color:#94a3b8;'>workspace_premium</span>" : "<span class='material-symbols-rounded' style='color:#6c63ff;'>sports_esports</span>";
  DOM.resultsTitle.textContent = pct === 1 ? "Perfect Score!" : pct >= 0.7 ? "Great Job!" : pct >= 0.5 ? "Good Effort!" : "Keep Practicing!";
  DOM.resScore.textContent = State.score; DOM.resCorrect.textContent = `${State.totalCorrect}/${State.questions.length}`; DOM.resStreak.textContent = State.bestStreak;
  DOM.badgesEarned.innerHTML = "";
  State.badgesEarned.forEach((id, idx) => {
    const b = BADGES.find(x => x.id === id); if(!b) return;
    const el = document.createElement("div"); el.className = "badge-item"; el.style.animationDelay = `${idx*0.1}s`;
    el.innerHTML = `<span>${b.icon}</span><span>${b.name}</span>`; DOM.badgesEarned.appendChild(el);
  });
  saveScoreLocal(); fireConfetti(true);
}

function saveScoreLocal() {
  const key = `fq_scores_${State.mode}`; const ex = JSON.parse(localStorage.getItem(key) || "[]");
  ex.push({ name: State.playerName, score: State.score, correct: State.totalCorrect, streak: State.bestStreak });
  localStorage.setItem(key, JSON.stringify(ex.sort((a,b)=>b.score-a.score).slice(0, 15)));
}
function renderLeaderboard(mode) {
  const s = JSON.parse(localStorage.getItem(`fq_scores_${mode}`) || "[]");
  if(!s.length) { DOM.lbList.innerHTML = `<div class="lb-loading">No scores yet!</div>`; return; }
  DOM.lbList.innerHTML = s.map((x,i)=>`
    <div class="lb-entry">
      <span class="lb-rank ${['gold','silver','bronze'][i]||''} ">${['<span class="material-symbols-rounded" style="color:#fcd34d;">workspace_premium</span>','<span class="material-symbols-rounded" style="color:#94a3b8;">workspace_premium</span>','<span class="material-symbols-rounded" style="color:#b45309;">workspace_premium</span>'][i]||'#'+(i+1)}</span>
      <span class="lb-name">${x.name}</span><span class="lb-score"><span class='material-symbols-rounded' style='color:#ffd166;'>star</span> ${x.score}</span>
    </div>`).join("");
}

function startGame() {
  const n = (DOM.playerName?.value || "").trim(); State.playerName = n || "Explorer";
  State.score = 0; State.lives = 3; State.streak = 0; State.bestStreak = 0; State.totalCorrect = 0; State.totalWrong = 0; State.level = 1; State.currentQ = 0; State.badgesEarned = [];
  let pool = [...QUESTION_BANKS[State.mode]]; for (let i=pool.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }
  State.questions = pool.slice(0, 10);
  DOM.hdrName.textContent = State.playerName; DOM.hdrAvatar.innerHTML = AVATARS[0]; DOM.hdrScore.textContent = "0"; DOM.hdrLevel.textContent = "1"; updateLives();
  showScreen("game-screen"); loadQuestion();
}

function pulseCanvas() { DOM.canvas.parentElement.classList.add("pulse"); setTimeout(() => DOM.canvas.parentElement.classList.remove("pulse"), 2100); }

/* Confetti */
const confettiParticles = []; let confettiAnimating = false;
function fireConfetti(big = false) {
  const cCount = big ? 120 : 40, W = window.innerWidth;
  for (let i=0; i<cCount; i++) confettiParticles.push({ x:Math.random()*W, y:-10, vx:(Math.random()-0.5)*8, vy:Math.random()*5+2, color:["#ff6b35","#6c63ff","#2ec4b6","#ffd166","#ff9500"][i%5], size:Math.random()*10+5, rot:Math.random()*360, rotV:(Math.random()-0.5)*10, life:1 });
  if (!confettiAnimating) animateConfetti();
}
function animateConfetti() {
  confettiAnimating = true; const cEle = DOM.confettiCanvas, cxx = cEle.getContext("2d");
  cEle.width = window.innerWidth; cEle.height = window.innerHeight;
  function act() {
    cxx.clearRect(0, 0, cEle.width, cEle.height);
    for (let i = confettiParticles.length-1; i>=0; i--) {
      const p = confettiParticles[i]; p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotV; p.vy+=0.1; p.life-=0.015;
      if (p.life<=0||p.y>cEle.height) { confettiParticles.splice(i,1); continue; }
      cxx.save(); cxx.translate(p.x, p.y); cxx.rotate(p.rot*Math.PI/180); cxx.globalAlpha=p.life; cxx.fillStyle=p.color; cxx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2); cxx.restore();
    }
    if(confettiParticles.length) requestAnimationFrame(act); else confettiAnimating = false;
  }
  requestAnimationFrame(act);
}

/* Event Listners */
if(DOM.btnStart) DOM.btnStart.addEventListener("click", startGame);
if(DOM.btnPlayNow) DOM.btnPlayNow.addEventListener("click", () => { window.scrollTo(0, 0); DOM.playerName.focus(); });
if(DOM.playerName) DOM.playerName.addEventListener("keydown", e => { if(e.key==="Enter") startGame(); });
DOM.modeModeCards.forEach(c => c.addEventListener("click", () => { DOM.modeModeCards.forEach(x => x.classList.remove("selected")); c.classList.add("selected"); State.mode = c.dataset.mode; }));
if(DOM.btnHome) DOM.btnHome.addEventListener("click", () => showScreen("splash-screen"));
if(DOM.btnStepNext) DOM.btnStepNext.addEventListener("click", nextStep);
if(DOM.btnCheck) DOM.btnCheck.addEventListener("click", () => { State.step=4; updateStepIndicator(4); DOM.btnCheck.style.display="none"; DOM.btnStepNext.style.display="none"; DOM.answerSection.style.display="flex"; DOM.answerSection.classList.add("fade-in"); if(State.mode==="challenge"&&typeof State.q.answer==="string") DOM.fracAnsRow.style.display="flex"; });
if(DOM.btnSubmit) DOM.btnSubmit.addEventListener("click", checkAnswer);
if(DOM.answerInput) DOM.answerInput.addEventListener("keydown", e => { if(e.key==="Enter") checkAnswer(); });
if(DOM.btnNextQ) DOM.btnNextQ.addEventListener("click", nextQuestion);
if(DOM.btnPlayAgain) DOM.btnPlayAgain.addEventListener("click", startGame);
if(DOM.btnHomeRes) DOM.btnHomeRes.addEventListener("click", () => showScreen("splash-screen"));

const lbb = () => { DOM.lbModal.style.display="flex"; renderLeaderboard(State.mode); DOM.lbTabs.forEach(t=>t.classList.toggle("active",t.dataset.mode===State.mode)); };
if(DOM.btnShowLb) DOM.btnShowLb.addEventListener("click", lbb);
if(DOM.btnViewLb) DOM.btnViewLb.addEventListener("click", lbb);
document.getElementById('footer-leaderboard')?.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo(0,0); lbb(); });
document.getElementById("lb-close")?.addEventListener("click", () => DOM.lbModal.style.display="none");
DOM.lbTabs.forEach(t=>t.addEventListener("click",()=>{ DOM.lbTabs.forEach(x=>x.classList.remove("active")); t.classList.add("active"); renderLeaderboard(t.dataset.mode); }));

// Header Language Dropdown
const langSelector = document.getElementById("lang-selector");
if (langSelector) {
  langSelector.addEventListener("click", (e) => {
    e.stopPropagation();
    langSelector.classList.toggle("open");
  });
  document.addEventListener("click", () => {
    langSelector.classList.remove("open");
  });
}

// Set initial selection
if(DOM.modeModeCards.length) DOM.modeModeCards[1].classList.add('selected');
