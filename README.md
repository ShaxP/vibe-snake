# Vibe Snake

A minimal classic Snake game built with plain HTML, CSS, and JavaScript.

## Features

- Grid-based snake movement
- Food spawning and snake growth
- Score tracking
- Game-over on wall/self collision
- Pause/resume and restart
- Keyboard controls (Arrow keys / WASD)
- On-screen controls for smaller screens

## Requirements

- Node.js 18+

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Run Tests

```bash
npm test
```

## Controls

- Move: Arrow keys or `W`, `A`, `S`, `D`
- Pause/Resume: `Space` or the **Pause** button
- Restart: **Restart** button

## Project Structure

- `index.html` - app shell
- `styles.css` - minimal styling
- `src/snakeLogic.js` - deterministic game logic (pure functions)
- `src/game.js` - rendering, input handling, game loop
- `test/snakeLogic.test.js` - core logic tests
- `server.js` - tiny static dev server
