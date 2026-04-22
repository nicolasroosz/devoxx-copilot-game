# Devoxx Copilot Game

Devoxx Copilot Game is a Mario-like incremental game built with Phaser 4, React 19, TypeScript, and Vite. It starts from a side-scrolling movement prototype and is intended to grow into an incremental platformer where the player progresses by moving, collecting, and unlocking upgrades over time.

## Current Focus

- Side-scrolling Mario-like movement foundation
- Phaser scenes wired into a React shell
- Incremental game structure for future progression systems

## Tech Stack

- Phaser 4
- React 19
- TypeScript
- Vite

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The game runs at `http://localhost:8080` by default.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch the game in a development web server |
| `npm run build` | Create a production build in the `dist` folder |
| `npm run dev-nolog` | Launch the development server without sending anonymous build telemetry |
| `npm run build-nolog` | Create a production build without sending anonymous build telemetry |
| `npm run test` | Run the Vitest test suite |

## Project Structure

| Path | Description |
|------|-------------|
| `index.html` | Browser entry point for the game shell |
| `src/main.tsx` | React application entry point |
| `src/App.tsx` | React UI wrapper around the Phaser game |
| `src/PhaserGame.tsx` | Bridge between React and Phaser |
| `src/game/main.ts` | Phaser game bootstrap |
| `src/game/scenes/` | Phaser scenes for menus, gameplay, and flow control |
| `public/style.css` | Global page styling |
| `public/assets/` | Static game assets |

## Notes

The game is still in active development. The current codebase focuses on the playable movement foundation, and the incremental layer will build on top of that with progression, upgrades, and game loop systems.
