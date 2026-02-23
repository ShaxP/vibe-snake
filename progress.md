Original prompt: Build a classic Snake game in this repo.

- Repo inspected: workspace was empty (no existing files/tooling detected).
- Plan: implement a minimal no-dependency web app with deterministic snake logic in src/snakeLogic.js, UI in src/game.js, and node:test coverage.

- Implemented initial game files (index, styles, logic, UI wrapper, tests, server).
- Next: run/fix tests and do a quick functional check.
- Fixed food-placement test fixture to validate deterministic respawn after growth.
- Test suite passing (5/5).
- Runtime smoke-check blocked in sandbox: opening localhost listener returned EPERM.
- TODO for next agent: run `npm run dev` outside sandbox and perform manual input/visual verification.
