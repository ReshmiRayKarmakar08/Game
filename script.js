/**
 * FractionQuest — script.js
 * Interactive fraction division educational game
 * Modular, well-commented code structure
 */

"use strict";

/* ============================================================
   SECTION 1: DATA & CONFIGURATION
   ============================================================ */

/** Question banks per difficulty mode */
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

/** Badge definitions */
const BADGES = [
  { id: "first_correct", icon: "⭐", name: "First Star!", condition: s => s.totalCorrect >= 1 },
  { id: "three_streak",  icon: "🔥", name: "On Fire!",   condition: s => s.bestStreak >= 3 },
  { id: "five_streak",   icon: "💥", name: "Unstoppable!", condition: s => s.bestStreak >= 5 },
  { id: "half_done",     icon: "🎯", name: "Halfway Hero", condition: s => s.totalCorrect >= 5 },
  { id: "perfect_round", icon: "👑", name: "Perfect Round!", condition: s => s.totalCorrect === 10 && s.totalWrong === 0 },
  { id: "no_hints",      icon: "🧠", name: "No Hints Needed!", condition: s => s.hintsUsed === 0 && s.totalCorrect >= 5 },
  { id: "speed_demon",   icon: "⚡", name: "Speed Demon!", condition: s => s.mode === "challenge" && s.totalCorrect >= 7 },
];

/** Emojis for player avatars based on score */
const AVATARS = ["🧒","🧑","👨‍🎓","🦸","🧙","🏆"];

/* ============================================================
   SECTION 2: GAME STATE
   ============================================================ */

const State = {
  playerName: "Player",
  mode: "intermediate",
  currentQ: 0,
  questions: [],
  score: 0,
  lives: 3,
  streak: 0,
  bestStreak: 0,
  totalCorrect: 0,
  totalWrong: 0,
  hintsUsed: 0,
  level: 1,
  step: 1,          // 1=dividend, 2=overlay, 3=count, 4=answer
  visualMode: "pizza", // "pizza" | "bar"
  timerInterval: null,
  timeLeft: 60,
  placedUnits: 0,
  badgesEarned: [],
  // current question shorthand
  get q() { return this.questions[this.currentQ]; },
};

/* ============================================================
   SECTION 3: DOM REFERENCES
   ============================================================ */

const $ = id => document.getElementById(id);
const DOM = {
  splash:        $("splash-screen"),
  game:          $("game-screen"),
  results:       $("results-screen"),
  playerName:    $("player-name"),
  btnStart:      $("btn-start"),
  btnHome:       $("btn-home"),
  btnHint:       $("btn-hint"),
  btnStepNext:   $("btn-step-next"),
  btnCheck:      $("btn-check"),
  btnSubmit:     $("btn-submit"),
  btnNextQ:      $("btn-next-q"),
  btnPlayAgain:  $("btn-play-again"),
  btnHomeRes:    $("btn-home-res"),
  btnViewLb:     $("btn-view-lb"),
  btnShowLb:     $("btn-show-leaderboard"),
  hdrName:       $("hdr-name"),
  hdrAvatar:     $("hdr-avatar"),
  hdrScore:      $("hdr-score"),
  hdrLevel:      $("hdr-level"),
  hdrLives:      $("hdr-lives"),
  hdrTimer:      $("hdr-timer"),
  timerWrap:     $("timer-wrap"),
  progressFill:  $("progress-fill"),
  progressLabel: $("progress-label"),
  qDividend:     $("q-dividend"),
  qDivisor:      $("q-divisor"),
  qAnswerSlot:   $("q-answer-slot"),
  eli5Divisor:   $("eli5-divisor"),
  eli5Dividend:  $("eli5-dividend"),
  canvas:        $("main-canvas"),
  trayUnits:     $("tray-units"),
  trayUnitLabel: $("tray-unit-label"),
  answerSection: $("answer-section"),
  answerInput:   $("answer-input"),
  ansHintText:   $("answer-hint-text"),
  fracAnsRow:    $("fraction-answer-row"),
  ansNum:        $("ans-num"),
  ansDen:        $("ans-den"),
  feedbackBanner:$("feedback-banner"),
  feedbackIcon:  $("feedback-icon"),
  feedbackText:  $("feedback-text"),
  feedbackExpl:  $("feedback-explanation"),
  resScore:      $("res-score"),
  resCorrect:    $("res-correct"),
  resStreak:     $("res-streak"),
  resultsTrophy: $("results-trophy"),
  resultsTitle:  $("results-title"),
  badgesEarned:  $("badges-earned"),
  lbModal:       $("leaderboard-modal"),
  lbList:        $("lb-list"),
  hintModal:     $("hint-modal"),
  hintBody:      $("hint-body"),
  hintCanvas:    $("hint-canvas"),
  badgeToast:    $("badge-toast"),
  toastIcon:     $("toast-icon"),
  toastMsg:      $("toast-msg"),
  confettiCanvas:$("confetti-canvas"),
  steps:         document.querySelectorAll(".step"),
  modeModeCards: document.querySelectorAll(".mode-card"),
  vtabs:         document.querySelectorAll(".vtab"),
  lbTabs:        document.querySelectorAll(".lb-tab"),
};

// Canvas 2D context
const ctx = DOM.canvas.getContext("2d");

/* ============================================================
   SECTION 4: SCREEN MANAGEMENT
   ============================================================ */

/** Show a screen by ID, hide all others */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
}

/* ============================================================
   SECTION 5: QUESTION LOGIC
   ============================================================ */

/** Build a shuffled question list for the round */
function buildQuestions() {
  const pool = [...QUESTION_BANKS[State.mode]];
  // Shuffle via Fisher-Yates
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 10);
}

/** Format a fraction [n,d] as a string */
function fracStr(n, d) {
  return d === 1 ? `${n}` : `${n}/${d}`;
}

/** Compute greatest common divisor (for simplification) */
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }

/** Convert fraction to decimal */
function fracToDecimal(n, d) { return n / d; }

/* ============================================================
   SECTION 6: VISUAL RENDERING (Canvas)
   ============================================================ */

const COLORS = {
  dividend: ["#6c63ff","#a78bfa","#818cf8","#7c3aed","#4f46e5","#8b5cf6","#9333ea","#c084fc","#7e22ce","#6d28d9"],
  divisor:  ["#ff6b35","#fb923c","#f97316","#ea580c","#dc2626","#ef4444","#f87171","#fca5a5","#b91c1c","#c2410c"],
  bg:       "#fafafe",
  grid:     "#e2e0f0",
};

/**
 * Draw the pizza (circle) visual
 * @param {number[]} dividend - [numerator, denominator]
 * @param {number[]} divisor  - [numerator, denominator]
 * @param {number}   step     - current step (1-4)
 * @param {number}   placed   - how many divisor units placed
 */
function drawPizza(dividend, divisor, step, placed) {
  const W = DOM.canvas.width, H = DOM.canvas.height;
  ctx.clearRect(0, 0, W, H);

  const [dN, dD] = dividend;
  const [vN, vD] = divisor;
  const totalSlices = dD; // denominator determines slice count for base pizza

  // ---- Draw dividend pizza ----
  const cx = W * 0.28, cy = H * 0.5, r = Math.min(H * 0.38, W * 0.22);
  drawCircleFraction(cx, cy, r, dN, dD, step >= 1);

  // Label
  ctx.fillStyle = "#1a1a2e";
  ctx.font = `bold 14px Nunito, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(`Dividend: ${fracStr(dN, dD)}`, cx, cy + r + 22);

  if (step < 2) return;

  // ---- Draw divisor unit (overlay or separate) ----
  const cx2 = W * 0.72, cy2 = H * 0.5;
  // How many divisor-sized slices per circle?
  const divisorSlices = vD; // divisor denominator

  drawCircleFraction(cx2, cy2, r * 0.7, vN, vD, true, true);
  ctx.fillStyle = "#1a1a2e";
  ctx.font = `bold 13px Nunito, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText(`Divisor: ${fracStr(vN, vD)}`, cx2, cy2 + r * 0.7 + 20);

  // ---- Show divisor overlays on dividend pizza ----
  if (step >= 2 && placed > 0) {
    const answer = dN / vN * (vD / dD); // rough integer answer for visual
    for (let i = 0; i < placed; i++) {
      const startAngle = -Math.PI / 2 + (i * vN / vD) * 2 * Math.PI;
      const endAngle   = startAngle + (vN / vD) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = COLORS.divisor[i % COLORS.divisor.length] + "aa";
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Numbered label inside slice
      const midAngle = (startAngle + endAngle) / 2;
      const lx = cx + Math.cos(midAngle) * r * 0.6;
      const ly = cy + Math.sin(midAngle) * r * 0.6;
      ctx.fillStyle = "#fff";
      ctx.font = `bold 16px Fredoka One, cursive`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(i + 1, lx, ly);
    }
  }

  // ---- Step 3: Show count arrow ----
  if (step >= 3) {
    ctx.fillStyle = "#6c63ff";
    ctx.font = `bold 14px Nunito, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    const ans = (dN * vD) / (dD * vN);
    ctx.fillText(`Count: ${placed} group${placed !== 1 ? "s" : ""}`, cx, 24);
  }
}

/**
 * Helper: draw a fraction circle
 */
function drawCircleFraction(cx, cy, r, n, d, filled, isDiv = false) {
  // Background circle
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#f0edff";
  ctx.fill();
  ctx.strokeStyle = COLORS.grid;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Filled slices
  const colorArr = isDiv ? COLORS.divisor : COLORS.dividend;
  for (let i = 0; i < (filled ? n : 0); i++) {
    const start = -Math.PI / 2 + (i / d) * Math.PI * 2;
    const end   = -Math.PI / 2 + ((i + 1) / d) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, start, end);
    ctx.closePath();
    ctx.fillStyle = colorArr[i % colorArr.length] + "dd";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Slice grid lines for all d slices
  for (let i = 0; i < d; i++) {
    const angle = -Math.PI / 2 + (i / d) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Outer ring
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = isDiv ? "#ff6b35" : "#6c63ff";
  ctx.lineWidth = 3;
  ctx.stroke();
}

/**
 * Draw the bar visual
 * @param {number[]} dividend - [n, d]
 * @param {number[]} divisor  - [n, d]
 * @param {number}   step
 * @param {number}   placed
 */
function drawBar(dividend, divisor, step, placed) {
  const W = DOM.canvas.width, H = DOM.canvas.height;
  ctx.clearRect(0, 0, W, H);

  const [dN, dD] = dividend;
  const [vN, vD] = divisor;

  const BAR_H = 48, TOP = 50;
  const BAR_W = Math.min(W - 80, 500);
  const BAR_X = (W - BAR_W) / 2;

  // ---- DIVIDEND BAR ----
  // Background
  ctx.fillStyle = "#e8e4ff";
  ctx.beginPath();
  roundRect(ctx, BAR_X, TOP, BAR_W, BAR_H, 10);
  ctx.fill();
  ctx.strokeStyle = "#6c63ff";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Filled portion
  const fillW = BAR_W * (dN / dD);
  for (let i = 0; i < dN; i++) {
    const segW = BAR_W / dD;
    ctx.fillStyle = COLORS.dividend[i % COLORS.dividend.length] + "cc";
    ctx.beginPath();
    roundRect(ctx, BAR_X + i * segW + 1, TOP + 1, segW - 2, BAR_H - 2, 6);
    ctx.fill();
  }

  // Tick marks
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.lineWidth = 1.5;
  for (let i = 1; i < dD; i++) {
    const x = BAR_X + (i / dD) * BAR_W;
    ctx.beginPath();
    ctx.moveTo(x, TOP);
    ctx.lineTo(x, TOP + BAR_H);
    ctx.stroke();
  }

  // Label
  ctx.fillStyle = "#1a1a2e"; ctx.font = "bold 13px Nunito, sans-serif";
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.fillText(`Dividend: ${fracStr(dN, dD)}`, BAR_X, TOP - 12);

  if (step < 2) return;

  // ---- DIVISOR BAR ----
  const TOP2 = TOP + BAR_H + 40;
  const divW = BAR_W * (vN / vD);

  ctx.fillStyle = "#fff0eb";
  ctx.beginPath();
  roundRect(ctx, BAR_X, TOP2, BAR_W, BAR_H, 10);
  ctx.fill();
  ctx.strokeStyle = "#ff6b35";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Filled divisor portion
  ctx.fillStyle = COLORS.divisor[0] + "cc";
  ctx.beginPath();
  roundRect(ctx, BAR_X + 1, TOP2 + 1, divW - 2, BAR_H - 2, 8);
  ctx.fill();

  ctx.fillStyle = "#1a1a2e"; ctx.font = "bold 13px Nunito, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`Divisor: ${fracStr(vN, vD)}`, BAR_X, TOP2 - 12);

  if (step < 3 || placed === 0) return;

  // ---- Show placed divisor groups on dividend bar ----
  for (let i = 0; i < placed; i++) {
    const gx = BAR_X + i * divW;
    ctx.fillStyle = COLORS.divisor[i % COLORS.divisor.length] + "88";
    ctx.beginPath();
    roundRect(ctx, gx + 1, TOP + 1, divW - 2, BAR_H - 2, 6);
    ctx.fill();
    ctx.strokeStyle = COLORS.divisor[i % COLORS.divisor.length];
    ctx.lineWidth = 2;
    ctx.strokeRect(gx + 1, TOP + 1, divW - 2, BAR_H - 2);

    // Number label
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Fredoka One, cursive";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(i + 1, gx + divW / 2, TOP + BAR_H / 2);
  }

  // Count label
  ctx.fillStyle = "#6c63ff";
  ctx.font = "bold 14px Nunito, sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  ctx.fillText(`${placed} group${placed !== 1 ? "s" : ""} so far`, W / 2, TOP + BAR_H + 22);
}

/** Helper: canvas rounded rect path */
function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.closePath();
}

/** Redraw canvas for current state */
function redraw() {
  const q = State.q;
  if (!q) return;
  if (State.visualMode === "pizza") {
    drawPizza(q.dividend, q.divisor, State.step, State.placedUnits);
  } else {
    drawBar(q.dividend, q.divisor, State.step, State.placedUnits);
  }
}

/* ============================================================
   SECTION 7: QUESTION DISPLAY
   ============================================================ */

/** Load and display the current question */
function loadQuestion() {
  const q = State.q;
  if (!q) { endRound(); return; }

  State.step = 1;
  State.placedUnits = 0;

  // Update question display
  DOM.qDividend.textContent = fracStr(q.dividend[0], q.dividend[1]);
  DOM.qDivisor.textContent  = fracStr(q.divisor[0], q.divisor[1]);
  DOM.qAnswerSlot.textContent = "?";
  DOM.qAnswerSlot.classList.remove("filled");

  // ELI5 text
  DOM.eli5Divisor.textContent  = fracStr(q.divisor[0], q.divisor[1]);
  DOM.eli5Dividend.textContent = fracStr(q.dividend[0], q.dividend[1]);

  // Tray label
  DOM.trayUnitLabel.textContent = fracStr(q.divisor[0], q.divisor[1]);

  // Reset controls
  DOM.btnStepNext.style.display = "inline-flex";
  DOM.btnStepNext.textContent = "Next Step →";
  DOM.btnCheck.style.display = "none";
  DOM.answerSection.style.display = "none";
  DOM.feedbackBanner.style.display = "none";
  DOM.answerInput.value = "";
  DOM.ansNum.value = "";
  DOM.ansDen.value = "";
  DOM.fracAnsRow.style.display = "none";

  updateStepIndicator(1);
  buildDivisorTray();
  updateProgress();
  redraw();

  // Canvas resize for responsiveness
  resizeCanvas();
}

/** Build the draggable divisor unit chips */
function buildDivisorTray() {
  const q = State.q;
  DOM.trayUnits.innerHTML = "";

  // Compute how many whole units to show (max 12 for layout)
  const ans = Math.ceil((q.dividend[0] * q.divisor[1]) / (q.dividend[1] * q.divisor[0]));
  const count = Math.min(ans + 2, 12);

  for (let i = 0; i < count; i++) {
    const chip = document.createElement("div");
    chip.className = "unit-chip pop-in";
    chip.style.animationDelay = `${i * 0.04}s`;
    chip.dataset.index = i;
    chip.innerHTML = `<span>${fracStr(q.divisor[0], q.divisor[1])}</span><span class="chip-num">#${i + 1}</span>`;

    // Drag events (desktop)
    chip.setAttribute("draggable", true);
    chip.addEventListener("dragstart", onDragStart);

    // Click to place (mobile-friendly)
    chip.addEventListener("click", () => placeUnit(chip, i));

    DOM.trayUnits.appendChild(chip);
  }
}

/* ============================================================
   SECTION 8: STEP-BY-STEP FLOW
   ============================================================ */

/** Advance to the next step */
function nextStep() {
  State.step++;
  updateStepIndicator(State.step);

  if (State.step === 2) {
    // Show divisor overlay hint
    DOM.btnStepNext.textContent = "I've counted! →";
    redraw();
    pulseCanvas();
  } else if (State.step === 3) {
    // Activate drag-and-drop
    DOM.btnStepNext.textContent = "Done counting →";
    redraw();
    pulseCanvas();
  } else if (State.step === 4) {
    // Show answer section
    DOM.btnStepNext.style.display = "none";
    DOM.answerSection.style.display = "flex";
    DOM.answerSection.classList.add("fade-in");
    // Show fraction input for challenge mode
    if (State.mode === "challenge") {
      const q = State.q;
      if (typeof q.answer === "string") {
        DOM.fracAnsRow.style.display = "flex";
        DOM.ansHintText.textContent = "Enter as a fraction!";
      }
    }
    redraw();
  }
}

/** Update the step indicator highlight */
function updateStepIndicator(activeStep) {
  DOM.steps.forEach(s => {
    const n = parseInt(s.dataset.step);
    s.classList.toggle("active", n === activeStep);
    s.classList.toggle("done",   n < activeStep);
  });
}

/** Update progress bar */
function updateProgress() {
  const pct = (State.currentQ / State.questions.length) * 100;
  DOM.progressFill.style.width = pct + "%";
  DOM.progressLabel.textContent = `Q ${State.currentQ + 1} / ${State.questions.length}`;
}

/* ============================================================
   SECTION 9: DRAG & DROP / CLICK TO PLACE UNITS
   ============================================================ */

let draggingChip = null;

function onDragStart(e) {
  draggingChip = e.currentTarget;
  e.dataTransfer.effectAllowed = "move";
}

DOM.canvas.addEventListener("dragover", e => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; });

DOM.canvas.addEventListener("drop", e => {
  e.preventDefault();
  if (draggingChip && !draggingChip.classList.contains("placed")) {
    placeUnit(draggingChip, parseInt(draggingChip.dataset.index));
  }
});

/** Place a divisor unit onto the canvas */
function placeUnit(chip, index) {
  if (chip.classList.contains("placed")) return;
  if (State.step < 2) { pulseCanvas(); return; }

  const q = State.q;
  const maxFit = (q.dividend[0] * q.divisor[1]) / (q.dividend[1] * q.divisor[0]);
  const maxInt = Math.floor(maxFit);

  if (State.placedUnits >= maxFit + 0.5) return; // don't over-place

  State.placedUnits++;
  chip.classList.add("placed");

  // Advance step if needed
  if (State.step < 3) {
    State.step = 3;
    updateStepIndicator(3);
  }

  redraw();

  // Show "check" button when enough placed
  if (State.placedUnits >= Math.floor(maxFit)) {
    DOM.btnCheck.style.display = "inline-flex";
  }
}

/* ============================================================
   SECTION 10: ANSWER SUBMISSION & CHECKING
   ============================================================ */

/** Check the user's answer */
function checkAnswer() {
  const q = State.q;
  let correct = false;
  let userAnswer;

  if (State.mode === "challenge" && typeof q.answer === "string") {
    // Fraction answer
    const un = parseInt(DOM.ansNum.value) || 0;
    const ud = parseInt(DOM.ansDen.value) || 1;
    userAnswer = `${un}/${ud}`;
    // Normalize and compare
    const qG = gcd(q.answerNum, q.answerDen);
    const uG = gcd(un, ud);
    correct = (q.answerNum / qG === un / uG) && (q.answerDen / qG === ud / uG);
  } else {
    userAnswer = parseFloat(DOM.answerInput.value);
    const correctVal = typeof q.answer === "string"
      ? q.answerNum / q.answerDen
      : parseFloat(q.answer);
    correct = Math.abs(userAnswer - correctVal) < 0.01;
  }

  if (correct) {
    handleCorrect();
  } else {
    handleWrong(userAnswer);
  }
}

/** Handle correct answer */
function handleCorrect() {
  const q = State.q;
  const pts = State.mode === "challenge" ? 150 : State.mode === "intermediate" ? 100 : 75;
  const streakBonus = State.streak >= 2 ? State.streak * 20 : 0;
  const earned = pts + streakBonus;

  State.score += earned;
  State.streak++;
  State.bestStreak = Math.max(State.bestStreak, State.streak);
  State.totalCorrect++;

  // Animate score
  DOM.hdrScore.textContent = State.score;

  // Fill answer slot
  DOM.qAnswerSlot.textContent = q.answer;
  DOM.qAnswerSlot.classList.add("filled");

  // Show feedback
  showFeedback(true, `+${earned} pts${streakBonus ? ` (🔥 ×${State.streak} streak!)` : ""}`, q.explanation);

  // Check badges
  checkBadges();

  // Draw final state
  State.step = 4;
  State.placedUnits = Math.round((q.dividend[0] * q.divisor[1]) / (q.dividend[1] * q.divisor[0]));
  redraw();
  fireConfetti();
  updateLives();
  updateLevel();
}

/** Handle wrong answer */
function handleWrong(userAnswer) {
  State.streak = 0;
  State.totalWrong++;
  State.lives = Math.max(0, State.lives - 1);

  showFeedback(false, `Not quite! You said ${userAnswer}`, State.q.explanation);
  updateLives();

  // Shake input
  DOM.answerInput.classList.add("shake");
  setTimeout(() => DOM.answerInput.classList.remove("shake"), 500);

  if (State.lives === 0) {
    setTimeout(endRound, 2000);
  }
}

/** Show the feedback banner */
function showFeedback(isCorrect, message, explanation) {
  DOM.feedbackBanner.style.display = "flex";
  DOM.feedbackBanner.className = `feedback-banner ${isCorrect ? "correct" : "wrong"}`;
  DOM.feedbackIcon.textContent = isCorrect ? "🎉" : "💪";
  DOM.feedbackText.textContent = isCorrect ? message : message;
  DOM.feedbackExpl.textContent = `💬 ${explanation}`;
  DOM.answerSection.style.display = "none";
  DOM.btnStepNext.style.display = "none";
}

/** Move to next question */
function nextQuestion() {
  State.currentQ++;
  if (State.currentQ >= State.questions.length) {
    endRound();
  } else {
    loadQuestion();
  }
}

/* ============================================================
   SECTION 11: LIVES & LEVEL
   ============================================================ */

function updateLives() {
  const hearts = ["❤️", "❤️", "❤️"];
  const empties = ["🖤", "🖤", "🖤"];
  DOM.hdrLives.textContent = hearts.slice(0, State.lives).join("") +
                              empties.slice(State.lives).join("");
}

function updateLevel() {
  State.level = Math.floor(State.score / 500) + 1;
  DOM.hdrLevel.textContent = State.level;
  // Update avatar based on level
  DOM.hdrAvatar.textContent = AVATARS[Math.min(State.level - 1, AVATARS.length - 1)];
}

/* ============================================================
   SECTION 12: TIMER (Challenge Mode)
   ============================================================ */

function startTimer() {
  State.timeLeft = 60;
  DOM.timerWrap.style.display = "flex";
  DOM.hdrTimer.textContent = State.timeLeft;

  State.timerInterval = setInterval(() => {
    State.timeLeft--;
    DOM.hdrTimer.textContent = State.timeLeft;

    if (State.timeLeft <= 10) {
      DOM.timerWrap.classList.add("warn");
    }
    if (State.timeLeft <= 0) {
      clearInterval(State.timerInterval);
      endRound();
    }
  }, 1000);
}

function stopTimer() {
  if (State.timerInterval) {
    clearInterval(State.timerInterval);
    State.timerInterval = null;
  }
  DOM.timerWrap.style.display = "none";
  DOM.timerWrap.classList.remove("warn");
}

/* ============================================================
   SECTION 13: HINTS
   ============================================================ */

function showHint() {
  const q = State.q;
  State.hintsUsed++;

  const [dN, dD] = q.dividend;
  const [vN, vD] = q.divisor;
  const ans = (dN * vD) / (dD * vN);

  DOM.hintBody.innerHTML = `
    <strong>🍕 Think of it like pizza!</strong><br><br>
    You have <strong>${fracStr(dN, dD)}</strong> of a pizza.<br>
    Each serving is <strong>${fracStr(vN, vD)}</strong> of a pizza.<br><br>
    <strong>The trick:</strong> Flip the divisor and multiply!<br>
    <span style="color:#ff6b35">${fracStr(dN, dD)} ÷ ${fracStr(vN, vD)}</span>
    = ${fracStr(dN, dD)} × ${fracStr(vD, vN)}
    = ${fracStr(dN * vD, dD * vN)}<br><br>
    That simplifies to: <strong style="color:#6c63ff">${simplifyFrac(dN * vD, dD * vN)}</strong>
  `;

  // Draw mini hint visualization
  const hCtx = DOM.hintCanvas.getContext("2d");
  hCtx.clearRect(0, 0, 300, 150);
  drawCircleFractionCtx(hCtx, 70, 75, 55, dN, dD, true, false);
  drawCircleFractionCtx(hCtx, 220, 75, 40, vN, vD, true, true);
  hCtx.fillStyle = "#1a1a2e"; hCtx.font = "bold 20px Fredoka One, cursive";
  hCtx.textAlign = "center"; hCtx.textBaseline = "middle";
  hCtx.fillText("÷", 150, 75);

  DOM.hintModal.style.display = "flex";
}

/** Draw fraction circle on any context */
function drawCircleFractionCtx(c, cx, cy, r, n, d, filled, isDiv) {
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.fillStyle = isDiv ? "#fff0eb" : "#f0edff";
  c.fill();
  for (let i = 0; i < (filled ? n : 0); i++) {
    const start = -Math.PI / 2 + (i / d) * Math.PI * 2;
    const end   = -Math.PI / 2 + ((i + 1) / d) * Math.PI * 2;
    c.beginPath(); c.moveTo(cx, cy);
    c.arc(cx, cy, r, start, end); c.closePath();
    c.fillStyle = (isDiv ? COLORS.divisor : COLORS.dividend)[i % 10] + "cc";
    c.fill();
  }
  c.beginPath();
  c.arc(cx, cy, r, 0, Math.PI * 2);
  c.strokeStyle = isDiv ? "#ff6b35" : "#6c63ff";
  c.lineWidth = 2.5; c.stroke();
  c.fillStyle = "#1a1a2e"; c.font = "bold 13px Nunito, sans-serif";
  c.textAlign = "center"; c.textBaseline = "alphabetic";
  c.fillText(`${n}/${d}`, cx, cy + r + 16);
}

/** Simplify a fraction string */
function simplifyFrac(n, d) {
  const g = gcd(Math.abs(n), Math.abs(d));
  const sn = n / g, sd = d / g;
  return sd === 1 ? `${sn}` : `${sn}/${sd}`;
}

/* ============================================================
   SECTION 14: BADGES
   ============================================================ */

function checkBadges() {
  BADGES.forEach(b => {
    if (!State.badgesEarned.includes(b.id) && b.condition(State)) {
      State.badgesEarned.push(b.id);
      showBadgeToast(b);
    }
  });
}

function showBadgeToast(badge) {
  DOM.toastIcon.textContent = badge.icon;
  DOM.toastMsg.textContent  = badge.name;
  DOM.badgeToast.style.display = "flex";
  setTimeout(() => { DOM.badgeToast.style.display = "none"; }, 3200);
}

/* ============================================================
   SECTION 15: END ROUND & RESULTS
   ============================================================ */

function endRound() {
  stopTimer();
  showScreen("results-screen");

  // Trophies based on score
  const pct = State.totalCorrect / State.questions.length;
  DOM.resultsTrophy.textContent = pct === 1 ? "🏆" : pct >= 0.7 ? "🥇" : pct >= 0.5 ? "🥈" : "🎮";
  DOM.resultsTitle.textContent  = pct === 1 ? "Perfect Score!" : pct >= 0.7 ? "Great Job!" : pct >= 0.5 ? "Good Effort!" : "Keep Practicing!";

  DOM.resScore.textContent   = State.score;
  DOM.resCorrect.textContent = `${State.totalCorrect}/${State.questions.length}`;
  DOM.resStreak.textContent  = State.bestStreak;

  // Render earned badges
  DOM.badgesEarned.innerHTML = "";
  State.badgesEarned.forEach((id, idx) => {
    const badge = BADGES.find(b => b.id === id);
    if (!badge) return;
    const el = document.createElement("div");
    el.className = "badge-item";
    el.style.animationDelay = `${idx * 0.1}s`;
    el.innerHTML = `<span>${badge.icon}</span><span>${badge.name}</span>`;
    DOM.badgesEarned.appendChild(el);
  });

  // Save to backend
  saveScore();

  // Big confetti
  fireConfetti(true);
}

/* ============================================================
   SECTION 16: CONFETTI ANIMATION
   ============================================================ */

const confettiParticles = [];

function fireConfetti(big = false) {
  const count = big ? 120 : 40;
  const W = window.innerWidth, H = window.innerHeight;
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: Math.random() * W,
      y: -10,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 4 + 2,
      color: ["#ff6b35","#6c63ff","#2ec4b6","#ffd166","#ff9500","#a78bfa"][Math.floor(Math.random() * 6)],
      size: Math.random() * 10 + 5,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
      life: 1,
    });
  }
  if (!confettiAnimating) animateConfetti();
}

let confettiAnimating = false;

function animateConfetti() {
  confettiAnimating = true;
  const c = DOM.confettiCanvas;
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  const cx = c.getContext("2d");

  function frame() {
    cx.clearRect(0, 0, c.width, c.height);
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
      p.vy += 0.08; p.life -= 0.015;
      if (p.life <= 0 || p.y > c.height) { confettiParticles.splice(i, 1); continue; }
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.rot * Math.PI / 180);
      cx.globalAlpha = p.life;
      cx.fillStyle = p.color;
      cx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      cx.restore();
    }
    if (confettiParticles.length > 0) requestAnimationFrame(frame);
    else confettiAnimating = false;
  }
  requestAnimationFrame(frame);
}

/* ============================================================
   SECTION 17: CANVAS UTILITY
   ============================================================ */

function pulseCanvas() {
  document.querySelector(".canvas-wrap").classList.add("pulse");
  setTimeout(() => document.querySelector(".canvas-wrap").classList.remove("pulse"), 2100);
}

function resizeCanvas() {
  const wrap = DOM.canvas.parentElement;
  const w = Math.min(wrap.clientWidth - 24, 620);
  DOM.canvas.style.width = w + "px";
  // Keep intrinsic size for quality
}

/* ============================================================
   SECTION 18: BACKEND API (PHP)
   ============================================================ */

/** Save score to PHP backend */
async function saveScore() {
  try {
    const payload = {
      name:    State.playerName,
      score:   State.score,
      mode:    State.mode,
      correct: State.totalCorrect,
      streak:  State.bestStreak,
    };
    await fetch("backend.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "save_score", ...payload }),
    });
  } catch (e) {
    // Backend unavailable (running without XAMPP) — silent fail
    console.info("Backend not available. Scores stored locally only.");
    saveScoreLocal();
  }
}

/** Fallback: save to localStorage */
function saveScoreLocal() {
  const key = `fq_scores_${State.mode}`;
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.push({
    name: State.playerName, score: State.score,
    correct: State.totalCorrect, streak: State.bestStreak,
    date: new Date().toISOString(),
  });
  existing.sort((a, b) => b.score - a.score);
  localStorage.setItem(key, JSON.stringify(existing.slice(0, 20)));
}

/** Load leaderboard (PHP or localStorage fallback) */
async function loadLeaderboard(mode) {
  try {
    const res = await fetch(`backend.php?action=get_scores&mode=${mode}`);
    const data = await res.json();
    return data.scores || [];
  } catch (e) {
    const key = `fq_scores_${mode}`;
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
}

/** Render leaderboard list */
async function renderLeaderboard(mode) {
  DOM.lbList.innerHTML = `<div class="lb-loading">Loading…</div>`;
  const scores = await loadLeaderboard(mode);

  if (scores.length === 0) {
    DOM.lbList.innerHTML = `<div class="lb-loading">No scores yet! Be the first! 🚀</div>`;
    return;
  }

  const rankSymbols = ["🥇","🥈","🥉"];
  const rankClasses = ["gold","silver","bronze"];

  DOM.lbList.innerHTML = scores.slice(0, 10).map((s, i) => `
    <div class="lb-entry">
      <span class="lb-rank ${rankClasses[i] || ""}">${rankSymbols[i] || `#${i + 1}`}</span>
      <span class="lb-name">${escapeHtml(s.name)}</span>
      <span class="lb-score">⭐ ${s.score}</span>
      <span style="font-size:0.75rem;color:var(--c-text-soft)">${s.correct}/10</span>
    </div>
  `).join("");
}

/** Basic HTML escape */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

/* ============================================================
   SECTION 19: GAME INITIALIZATION
   ============================================================ */

function startGame() {
  const name = DOM.playerName.value.trim() || "Explorer";
  State.playerName = name;
  State.score = 0;
  State.lives = 3;
  State.streak = 0;
  State.bestStreak = 0;
  State.totalCorrect = 0;
  State.totalWrong = 0;
  State.hintsUsed = 0;
  State.level = 1;
  State.currentQ = 0;
  State.badgesEarned = [];
  State.questions = buildQuestions();

  DOM.hdrName.textContent   = name;
  DOM.hdrAvatar.textContent = AVATARS[0];
  DOM.hdrScore.textContent  = "0";
  DOM.hdrLevel.textContent  = "1";
  updateLives();

  showScreen("game-screen");

  if (State.mode === "challenge") startTimer();
  else stopTimer();

  loadQuestion();
}

/* ============================================================
   SECTION 20: EVENT LISTENERS
   ============================================================ */

// --- Splash ---
DOM.btnStart.addEventListener("click", startGame);
DOM.playerName.addEventListener("keydown", e => { if (e.key === "Enter") startGame(); });

DOM.modeModeCards.forEach(card => {
  card.addEventListener("click", () => {
    DOM.modeModeCards.forEach(c => c.classList.remove("selected"));
    card.classList.add("selected");
    State.mode = card.dataset.mode;
  });
});

DOM.btnShowLb.addEventListener("click", () => {
  DOM.lbModal.style.display = "flex";
  renderLeaderboard(State.mode);
  // Highlight active tab
  DOM.lbTabs.forEach(t => t.classList.toggle("active", t.dataset.mode === State.mode));
});

// --- Game Header ---
DOM.btnHome.addEventListener("click", () => {
  stopTimer();
  showScreen("splash-screen");
});

// --- Step Flow ---
DOM.btnStepNext.addEventListener("click", nextStep);
DOM.btnCheck.addEventListener("click", () => {
  State.step = 4;
  updateStepIndicator(4);
  DOM.btnCheck.style.display = "none";
  DOM.btnStepNext.style.display = "none";
  DOM.answerSection.style.display = "flex";
  DOM.answerSection.classList.add("fade-in");
  if (State.mode === "challenge" && typeof State.q.answer === "string") {
    DOM.fracAnsRow.style.display = "flex";
  }
});

DOM.btnSubmit.addEventListener("click", checkAnswer);
DOM.answerInput.addEventListener("keydown", e => { if (e.key === "Enter") checkAnswer(); });

DOM.btnNextQ.addEventListener("click", nextQuestion);

// --- Hints ---
DOM.btnHint.addEventListener("click", showHint);
$("hint-close").addEventListener("click", () => { DOM.hintModal.style.display = "none"; });
DOM.hintModal.addEventListener("click", e => { if (e.target === DOM.hintModal) DOM.hintModal.style.display = "none"; });

// --- Visual Tabs ---
DOM.vtabs.forEach(tab => {
  tab.addEventListener("click", () => {
    DOM.vtabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    State.visualMode = tab.dataset.visual;
    redraw();
  });
});

// --- Leaderboard Modal ---
$("lb-close").addEventListener("click", () => { DOM.lbModal.style.display = "none"; });
DOM.lbModal.addEventListener("click", e => { if (e.target === DOM.lbModal) DOM.lbModal.style.display = "none"; });

DOM.lbTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    DOM.lbTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderLeaderboard(tab.dataset.mode);
  });
});

// --- Results ---
DOM.btnPlayAgain.addEventListener("click", startGame);
DOM.btnHomeRes.addEventListener("click", () => showScreen("splash-screen"));
DOM.btnViewLb.addEventListener("click", () => {
  DOM.lbModal.style.display = "flex";
  renderLeaderboard(State.mode);
  DOM.lbTabs.forEach(t => t.classList.toggle("active", t.dataset.mode === State.mode));
});

// --- Dark mode toggle ---
const darkToggle = document.createElement("button");
darkToggle.className = "dark-toggle";
darkToggle.title = "Toggle dark mode";
darkToggle.textContent = "🌙";
document.body.appendChild(darkToggle);
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// --- Responsive canvas resize ---
window.addEventListener("resize", resizeCanvas);

// Canvas click to auto-place unit (step >= 2)
DOM.canvas.addEventListener("click", () => {
  if (State.step >= 2) {
    // Find first unplaced chip
    const chip = DOM.trayUnits.querySelector(".unit-chip:not(.placed)");
    if (chip) placeUnit(chip, parseInt(chip.dataset.index));
  }
});

/* ============================================================
   SECTION 21: INIT
   ============================================================ */

// Pre-select intermediate mode card
document.querySelector('.mode-card[data-mode="intermediate"]').classList.add("selected");
State.mode = "intermediate";

// Initial canvas size
resizeCanvas();

console.log("🍕 FractionQuest loaded! Ready to learn!");
