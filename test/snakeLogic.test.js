import test from 'node:test';
import assert from 'node:assert/strict';

import { createInitialState, createSeededRng, stepState } from '../src/snakeLogic.js';

test('snake moves one cell in current direction', () => {
  const state = createInitialState({ gridSize: 10, rng: createSeededRng(1) });
  const next = stepState(state);

  assert.deepEqual(next.snake[0], { x: state.snake[0].x + 1, y: state.snake[0].y });
  assert.equal(next.score, 0);
  assert.equal(next.status, 'playing');
});

test('snake grows and increments score when food is eaten', () => {
  const base = createInitialState({ gridSize: 10, rng: createSeededRng(2) });
  const head = base.snake[0];
  const state = { ...base, food: { x: head.x + 1, y: head.y } };
  const next = stepState(state);

  assert.equal(next.snake.length, state.snake.length + 1);
  assert.equal(next.score, 1);
});

test('snake hits wall and game ends', () => {
  const state = {
    ...createInitialState({ gridSize: 5, rng: createSeededRng(3) }),
    snake: [
      { x: 4, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 1 },
    ],
    direction: 'right',
  };

  const next = stepState(state);
  assert.equal(next.status, 'game-over');
});

test('snake hits itself and game ends', () => {
  const state = {
    ...createInitialState({ gridSize: 8, rng: createSeededRng(4) }),
    snake: [
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 3 },
    ],
    direction: 'left',
  };

  const next = stepState(state, 'down');
  assert.equal(next.status, 'game-over');
});

test('food placement avoids occupied snake cells', () => {
  const state = {
    gridSize: 3,
    rng: () => 0,
    snake: [
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
    ],
    direction: 'right',
    food: { x: 2, y: 1 },
    score: 0,
    status: 'playing',
  };

  const next = stepState(state);
  assert.equal(next.score, 1);
  assert.deepEqual(next.food, { x: 1, y: 0 });
});
