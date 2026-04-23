# Devoxx Copilot Game

## Brief Summary of the Game

Devoxx Copilot Game is a Mario-like incremental game built with Phaser 4, React 19, TypeScript, and Vite. The current playable version focuses on side-scrolling movement, step-based progression, and menu-driven interactions that will evolve into a broader incremental platformer loop.

## Stack of the Project

- Phaser 4
- React 19
- TypeScript
- Vite
- Vitest

## How to Play and Main Actions of the Game

### Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

### Start the Game

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The game runs at `http://localhost:8080` by default.

### Main In-Game Actions

- Use Left and Right arrow keys to move the player.
- Gain step progress while moving across the world.
- Press `S` to open the shop.
- Press `I` to open the inventory.
- Press `Esc` to open the pause menu.

### Useful Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Launch the game in a development web server |
| `npm run build` | Create a production build in the `dist` folder |
| `npm run dev-nolog` | Launch the development server without sending anonymous build telemetry |
| `npm run build-nolog` | Create a production build without sending anonymous build telemetry |
| `npm run test` | Run the Vitest test suite |

## Architecture of the Game

The project uses React as the web application shell and Phaser as the real-time game runtime. React mounts the game container, while Phaser scenes handle gameplay state, rendering, input, and menu flows.

### Key Structure

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

### Development Workflow

All code changes, features, and bug fixes follow a mandatory end-to-end workflow to ensure consistency, quality, and comprehensive documentation:

1. **Read existing documentation and code** - Review README, affected code, instructions, and tests to understand the current state.
2. **Compare against the request** - Identify gaps between the current state and what is requested. Ask clarifying questions if needed.
3. **Plan the implementation** - Design the specific changes and present the plan for user approval.
4. **Add or update tests** - Write tests that cover the new or changed behavior. Run `npm run test` to verify they pass.
5. **Modify the code** - Implement changes following TypeScript and project conventions.
6. **Update README and specification** - Ensure documentation reflects changes to scope, tech stack, commands, or behavior.
7. **Validate the product** - Run `npm run test` and `npm run build` to ensure quality. Perform manual browser checks to verify real-world behavior.

For details, see `.github/instructions/workflow.instructions.md`.

### Copilot Configuration

This project includes custom Copilot agents, instruction files, and skill documentation to guide AI-assisted development:

- **Copilot Agents**: Custom agents for specialized development tasks
  - `.github/agents/expert-react-frontend-engineer.agent.md` — React 19.2 expertise and modern hooks
  - `.github/agents/copilot-configuration-expert.agent.md` — Copilot configuration design and best practices

- **Instruction Files**: Domain-specific development guidelines
  - `.github/instructions/workflow.instructions.md` — Mandatory 7-step development workflow
  - `.github/instructions/typescript.instructions.md` — TypeScript and React component guidelines
  - `.github/instructions/testing.instructions.md` — Testing requirements and coverage standards
  - `.github/instructions/copilot-agent-authoring.instructions.md` — Custom agent authoring patterns
  - `.github/instructions/copilot-instructions-best-practices.instructions.md` — Instruction file best practices
  - `.github/instructions/copilot-skills-authoring.instructions.md` — Domain skill development

- **Prompts and Templates**: `.github/prompts/` — Reusable prompt templates for common workflows
- **Markdown Economy**: `.github/markdown-economy.md` — Context efficiency guidelines for documentation

For comprehensive guidance on using Copilot in this project, see `.github/copilot.md`.

## Brief Explanation of PhaserJS

PhaserJS is the core game engine in this project. It manages scenes, rendering, input handling, camera behavior, and frame updates, allowing the game loop to run independently from the React UI shell.

## Specification of the Game

- Current scope: side-scrolling movement foundation with world bounds.
- Current scope: step accumulation loop tied to player movement.
- Current scope: menu-based interactions for pause, shop, and inventory.
- Current scope: save-state-oriented progression model for run continuity.
- Planned direction: expand the incremental progression layer with more upgrades, item effects, and longer-term progression.
- Planned direction: strengthen the game loop with richer economy systems and additional gameplay milestones.
