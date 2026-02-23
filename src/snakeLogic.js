export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export function createSeededRng(seed = 1) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function isOppositeDirection(current, requested) {
  if (!current || !requested) return false;
  const a = DIRECTIONS[current];
  const b = DIRECTIONS[requested];
  return a.x + b.x === 0 && a.y + b.y === 0;
}

function isInsideGrid(cell, gridSize) {
  return cell.x >= 0 && cell.y >= 0 && cell.x < gridSize && cell.y < gridSize;
}

function pointsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

function spawnFood(gridSize, snake, rng) {
  const available = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const occupied = snake.some((segment) => segment.x === x && segment.y === y);
      if (!occupied) available.push({ x, y });
    }
  }

  if (available.length === 0) {
    return null;
  }

  const index = Math.floor(rng() * available.length);
  return available[index];
}

export function createInitialState({ gridSize = 20, rng = Math.random } = {}) {
  const mid = Math.floor(gridSize / 2);
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
  return {
    gridSize,
    rng,
    snake,
    direction: 'right',
    food: spawnFood(gridSize, snake, rng),
    score: 0,
    status: 'playing',
  };
}

export function stepState(state, requestedDirection) {
  if (state.status !== 'playing') {
    return state;
  }

  const nextDirection =
    requestedDirection && !isOppositeDirection(state.direction, requestedDirection)
      ? requestedDirection
      : state.direction;

  const vector = DIRECTIONS[nextDirection];
  const head = state.snake[0];
  const nextHead = { x: head.x + vector.x, y: head.y + vector.y };

  if (!isInsideGrid(nextHead, state.gridSize)) {
    return { ...state, direction: nextDirection, status: 'game-over' };
  }

  const willGrow = state.food && pointsEqual(nextHead, state.food);
  const bodyToCheck = willGrow ? state.snake : state.snake.slice(0, -1);
  const hitSelf = bodyToCheck.some((segment) => pointsEqual(segment, nextHead));

  if (hitSelf) {
    return { ...state, direction: nextDirection, status: 'game-over' };
  }

  const snake = [nextHead, ...state.snake];
  if (!willGrow) {
    snake.pop();
  }

  const food = willGrow ? spawnFood(state.gridSize, snake, state.rng) : state.food;
  const status = food ? 'playing' : 'game-over';

  return {
    ...state,
    direction: nextDirection,
    snake,
    food,
    score: willGrow ? state.score + 1 : state.score,
    status,
  };
}

export function restartState(state) {
  return createInitialState({ gridSize: state.gridSize, rng: state.rng });
}
