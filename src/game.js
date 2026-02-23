import { createInitialState, restartState, stepState } from './snakeLogic.js';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');

const menuOverlayEl = document.getElementById('menu-overlay');
const menuMainEl = document.getElementById('menu-main');
const menuInstructionsEl = document.getElementById('menu-instructions');
const menuPauseEl = document.getElementById('menu-pause');

const startBtn = document.getElementById('start-btn');
const instructionsBtn = document.getElementById('instructions-btn');
const instructionsBackBtn = document.getElementById('instructions-back-btn');
const continueBtn = document.getElementById('continue-btn');
const quitBtn = document.getElementById('quit-btn');

const TICK_MS = 130;
let state = createInitialState();
let queuedDirection = null;
let paused = false;
let gameStarted = false;
let menuMode = 'main';

function drawGrid() {
  const size = state.gridSize;
  const cell = canvas.width / size;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#ececec';
  ctx.lineWidth = 1;
  for (let i = 0; i <= size; i += 1) {
    const p = i * cell;
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(canvas.width, p);
    ctx.stroke();
  }
}

function setPaused(nextPaused) {
  paused = nextPaused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
}

function setMenuMode(nextMode) {
  menuMode = nextMode;
  const isVisible = menuMode !== null;
  menuOverlayEl.classList.toggle('hidden', !isVisible);

  menuMainEl.classList.toggle('hidden', menuMode !== 'main');
  menuInstructionsEl.classList.toggle('hidden', menuMode !== 'instructions');
  menuPauseEl.classList.toggle('hidden', menuMode !== 'pause');
}

function openMainMenu() {
  gameStarted = false;
  setPaused(false);
  setMenuMode('main');
}

function openPauseMenu() {
  if (!gameStarted || state.status !== 'playing') {
    return;
  }

  setPaused(true);
  setMenuMode('pause');
  draw();
}

function continueGame() {
  if (!gameStarted || state.status !== 'playing') {
    return;
  }

  setPaused(false);
  setMenuMode(null);
  draw();
}

function showInstructions() {
  setMenuMode('instructions');
  draw();
}

function backToMainMenu() {
  setMenuMode('main');
  draw();
}

function startGame() {
  gameStarted = true;
  setPaused(false);
  setMenuMode(null);
  draw();
}

function draw() {
  drawGrid();
  const cell = canvas.width / state.gridSize;

  if (state.food) {
    ctx.fillStyle = '#d42d2d';
    ctx.fillRect(state.food.x * cell, state.food.y * cell, cell, cell);
  }

  ctx.fillStyle = '#207520';
  for (const segment of state.snake) {
    ctx.fillRect(segment.x * cell, segment.y * cell, cell, cell);
  }

  scoreEl.textContent = String(state.score);

  if (menuMode === 'main' || menuMode === 'instructions') {
    statusEl.textContent = 'Main menu';
  } else if (menuMode === 'pause') {
    statusEl.textContent = 'Paused';
  } else if (state.status === 'game-over') {
    statusEl.textContent = 'Game over. Press Restart.';
  } else {
    statusEl.textContent = 'Playing';
  }
}

function tick() {
  if (!gameStarted || paused || state.status !== 'playing') {
    draw();
    return;
  }

  state = stepState(state, queuedDirection);
  queuedDirection = null;
  draw();
}

function mapKeyToDirection(key) {
  const lower = key.toLowerCase();
  if (lower === 'arrowup' || lower === 'w') return 'up';
  if (lower === 'arrowdown' || lower === 's') return 'down';
  if (lower === 'arrowleft' || lower === 'a') return 'left';
  if (lower === 'arrowright' || lower === 'd') return 'right';
  return null;
}

function restart() {
  state = restartState(state);
  queuedDirection = null;
  openMainMenu();
  draw();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (menuMode === 'pause') {
      continueGame();
    } else {
      openPauseMenu();
    }
    return;
  }

  if (event.key === ' ') {
    if (menuMode === 'pause') {
      continueGame();
    } else {
      openPauseMenu();
    }
    return;
  }

  const direction = mapKeyToDirection(event.key);
  if (!direction || !gameStarted || paused) return;

  event.preventDefault();
  queuedDirection = direction;
});

document.querySelectorAll('[data-action]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!gameStarted || paused) {
      return;
    }

    queuedDirection = btn.getAttribute('data-action');
  });
});

pauseBtn.addEventListener('click', () => {
  if (menuMode === 'pause') {
    continueGame();
    return;
  }

  openPauseMenu();
});

restartBtn.addEventListener('click', restart);
startBtn.addEventListener('click', startGame);
instructionsBtn.addEventListener('click', showInstructions);
instructionsBackBtn.addEventListener('click', backToMainMenu);
continueBtn.addEventListener('click', continueGame);
quitBtn.addEventListener('click', restart);

setInterval(tick, TICK_MS);
setMenuMode('main');
draw();

window.render_game_to_text = () =>
  JSON.stringify({
    coordinateSystem: 'origin top-left; +x right; +y down',
    status: state.status,
    paused,
    gameStarted,
    menuMode,
    direction: state.direction,
    snake: state.snake,
    food: state.food,
    score: state.score,
  });

window.advanceTime = (ms) => {
  const steps = Math.max(1, Math.round(ms / TICK_MS));
  for (let i = 0; i < steps; i += 1) {
    tick();
  }
};
