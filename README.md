# 🍕 FractionQuest — Fraction Division Educational Game

An interactive, visually engaging web game that teaches fraction division
through **pizza circles** and **rectangular bar** visual models.

---

## 📁 Files

```
fraction-game/
├── index.html    — Main game UI
├── styles.css    — All styles + animations
├── script.js     — Game logic, canvas rendering, state machine
├── backend.php   — PHP API for scores (optional)
└── scores.json   — Auto-created by backend when first score is saved
```

---

## 🚀 Running Locally

### Option A — No Backend (open directly)
Just double-click **index.html**. Everything works; scores are saved
to `localStorage` as a fallback.

### Option B — With PHP Backend (XAMPP)

1. Install [XAMPP](https://www.apachefriends.org/) (or WAMP / MAMP).
2. Copy the `fraction-game/` folder into `htdocs/`:
   ```
   C:\xampp\htdocs\fraction-game\
   ```
3. Start **Apache** in XAMPP Control Panel.
4. Open: `http://localhost/fraction-game/index.html`
5. The backend auto-creates `scores.json` on first save.

> **PHP 8.0+** is recommended. The backend uses no external libraries.

---

## 🎮 Game Modes

| Mode         | Description                         | Timer |
|--------------|-------------------------------------|-------|
| 🌱 Beginner  | Simple fractions (e.g. 3/4 ÷ 1/4)  | No    |
| 🔥 Intermediate | Improper fractions               | No    |
| ⚡ Challenge  | Mixed, complex fractions            | 60 s  |

---

## 🧠 Pedagogical Approach

1. **See** — The dividend fraction is drawn visually (pizza or bar).
2. **Overlay** — The divisor unit is shown alongside.
3. **Count** — Students drag divisor units onto the dividend to count groups.
4. **Answer** — Students type their answer and receive instant feedback.

Every incorrect answer shows a full explanation.
Hints show the **Keep-Change-Flip** method with a mini visual.

---

## ✨ Features

- 🍕 Pizza (circle) and 📊 Bar visual models
- Step-by-step guided walkthrough
- Drag-and-drop OR click-to-place divisor units
- 🏆 Leaderboard (PHP backend) with localStorage fallback
- 🏅 6 earnable badges
- ⭐ Score, streaks, levels, lives system
- 🎉 Confetti on correct answers
- 💡 Hint modal with mini visualization
- 🌙 Dark / light mode toggle
- 📱 Responsive design

---
## Photo : 

<img width="1915" height="1036" alt="image" src="https://github.com/user-attachments/assets/6a1b0b8b-7374-45fa-9587-26e5e1478a3b" />


## 🔧 API Reference

All calls go to `backend.php`.

### Save a score
```
POST backend.php
Body: { "action":"save_score", "name":"Alice", "score":850,
        "mode":"intermediate", "correct":8, "streak":5 }
```

### Get top scores
```
GET backend.php?action=get_scores&mode=intermediate&limit=10
```

### Get aggregate stats
```
GET backend.php?action=get_stats
```

---

## 🔐 Production Notes

- Remove or protect the `?action=clear` endpoint before deploying.
- For multi-user production use, replace `scores.json` with a proper
  MySQL database (PDO queries shown in comments in `backend.php`).
- Add session/auth if you need per-user progress tracking.
