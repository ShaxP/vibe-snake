import { createInitialState, restartState, stepState } from './snakeLogic.js';

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart-btn');
const pauseBtn = document.getElementById('pause-btn');

const TICK_MS = 130;
let state = createInitialState();
let queuedDirection = null;
let paused = false;

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

  if (state.status === 'game-over') {
    statusEl.textContent = 'Game over. Press Restart.';
  } else if (paused) {
    statusEl.textContent = 'Paused';
  } else {
    statusEl.textContent = 'Playing';
  }
}

function tick() {
  if (paused || state.status !== 'playing') {
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
  paused = false;
  pauseBtn.textContent = 'Pause';
  draw();
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Resume' : 'Pause';
    draw();
    return;
  }

  const direction = mapKeyToDirection(event.key);
  if (!direction) return;

  event.preventDefault();
  queuedDirection = direction;
});

document.querySelectorAll('[data-action]').forEach((btn) => {
  btn.addEventListener('click', () => {
    queuedDirection = btn.getAttribute('data-action');
  });
});

pauseBtn.addEventListener('click', () => {
  paused = !paused;
  pauseBtn.textContent = paused ? 'Resume' : 'Pause';
  draw();
});

restartBtn.addEventListener('click', restart);

setInterval(tick, TICK_MS);
draw();

window.render_game_to_text = () =>
  JSON.stringify({
    coordinateSystem: 'origin top-left; +x right; +y down',
    status: state.status,
    paused,
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
