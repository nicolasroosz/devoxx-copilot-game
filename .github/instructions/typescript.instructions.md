---
description: "Use when editing TypeScript, TSX, React components, Phaser scenes, or game bootstrap code in this Phaser 4 + React 19 project. Covers typing, component structure, and scene interactions."
applyTo: "**/*.{ts,tsx}"
---

# TypeScript Guidelines

- Prefer explicit types for exported APIs, component props, refs, callbacks, scene state, and function returns when the inference is not obvious.
- Keep React code in functional components with hooks; do not introduce class components or move Phaser logic into React state.
- Keep Phaser-specific behavior inside scene files and use the existing event bus and scene lifecycle for React-to-Phaser communication.
- Avoid unsafe casts unless a nearby guard or type definition justifies them; prefer narrowing and type-safe checks first.
- Preserve the existing naming, formatting, and module structure in each file instead of reshaping it.