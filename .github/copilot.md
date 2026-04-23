# Copilot Configuration Guide

This document is a central hub for understanding and using Copilot configuration in the Devoxx Copilot Game project.

## Quick Start: Which Agent to Use

- **Frontend development (React, TypeScript, UI)**: Use the **Expert React Frontend Engineer** agent (`.github/agents/expert-react-frontend-engineer.agent.md`)
- **Game specification review and planning**: Use the **Product Owner Expert** agent (`.github/agents/product-owner-expert.agent.md`)
- **Copilot configuration, agents, instructions, skills**: Use the **Copilot Configuration Expert** agent (`.github/agents/copilot-configuration-expert.agent.md`)
- **General tasks**: Default Copilot with project instructions applied automatically

## Agents Overview

### Expert React Frontend Engineer
- **File**: `.github/agents/expert-react-frontend-engineer.agent.md`
- **Specialization**: React 19.2 with modern hooks, TypeScript, Server Components, Actions, and performance optimization
- **Best for**: Building React components, refactoring hooks-based code, TypeScript type design, performance tuning
- **Applies to**: `src/**/*.{ts,tsx}`

### Product Owner Expert
- **File**: `.github/agents/product-owner-expert.agent.md`
- **Specialization**: Game specification validation, requirements clarification, and feature planning without code implementation
- **Best for**: Planning feature changes, validating requirements, identifying scope and dependencies before implementation
- **Applies to**: Game feature requests, specification changes, and planning discussions

### Copilot Configuration Expert
- **File**: `.github/agents/copilot-configuration-expert.agent.md`
- **Specialization**: Designing custom agents, instruction files, and skills; Copilot configuration best practices
- **Best for**: Extending Copilot agents, authoring instruction files, designing domain-specific skills
- **Applies to**: `.github/**/*.md`

## Instructions Overview

All instruction files are located in `.github/instructions/` and apply automatically based on glob patterns.

| File | Purpose | Applies to |
|------|---------|-----------|
| `workflow.instructions.md` | Mandatory 7-step development workflow for all code changes | All files |
| `typescript.instructions.md` | TypeScript and React component guidelines | `**/*.{ts,tsx}` |
| `testing.instructions.md` | Testing requirements, coverage standards, test patterns | `**/*.{ts,tsx}` |
| `readme-structure.instructions.md` | README structure and content requirements | `README.md` |
| `copilot-agent-authoring.instructions.md` | How to design and author custom Copilot agents | `.github/agents/**` |
| `copilot-instructions-best-practices.instructions.md` | How to write effective instruction files | `.github/instructions/**` |
| `copilot-skills-authoring.instructions.md` | How to design domain-specific skills | `.github/skills/**` |
| `instruction.instructions.md` | Metadata and structure for all instruction files | `**/*.instructions.md` |

## When to Use Each Instruction

- **workflow.instructions.md**: Always follow this for any code change, feature, or bug fix
- **typescript.instructions.md**: When writing React components, hooks, TypeScript types, or game logic
- **testing.instructions.md**: When adding or updating tests for any change
- **readme-structure.instructions.md**: When modifying README.md (enforces 6-section structure)
- **copilot-*-authoring.instructions.md**: When extending Copilot configuration (agents, instructions, skills)

## Prompts and Templates

Reusable prompt templates for common workflows are located in `.github/prompts/`. These provide:
- Consistent language for common task patterns
- Pre-structured prompts for complex requests
- Guardrails for ensuring quality Copilot interactions

Browse the prompts directory to discover available templates for your workflow.

## Markdown Economy

See `.github/markdown-economy.md` for guidelines on maximizing context efficiency in documentation:
- Concise prose patterns that communicate clearly without verbosity
- When to use tables, code blocks, and structured lists
- How to structure complex information for quick scanning
- Token optimization for AI assistants and documentation systems

## Contributing: How to Extend Copilot Configuration

### Adding a New Custom Agent

1. Create a new `.agent.md` file in `.github/agents/` with a descriptive name (e.g., `backend-expert.agent.md`)
2. Follow the patterns in existing agents and `copilot-agent-authoring.instructions.md`
3. Include frontmatter specifying `applyTo` glob patterns
4. Document the agent's specialization and best use cases
5. Update this guide with the new agent

### Adding a New Instruction File

1. Create a new `.instructions.md` file in `.github/instructions/` (use kebab-case names)
2. Follow `copilot-instructions-best-practices.instructions.md` and `instruction.instructions.md`
3. Include YAML frontmatter with `description` and `applyTo` fields
4. Reference this guide once added
5. Update the README "Copilot Configuration" section if it represents a core development concern

### Adding a New Skill

1. Create skill files in `.github/skills/` following `copilot-skills-authoring.instructions.md`
2. Ensure the skill has clear documentation and examples
3. Reference it in `.github/prompts/` or relevant instruction files
4. Document the skill's purpose and triggers in this guide

## Project Links

- **Main README**: See [README.md](../README.md) for game overview, architecture, and development workflow
- **Architecture Details**: See "Architecture of the Game" section in README for file structure and scene organization
- **Tech Stack**: Phaser 4, React 19, TypeScript, Vite, Vitest

## Questions or Issues

If Copilot instructions don't match your use case or are unclear, file an issue or update the relevant instruction file following `instruction.instructions.md`.
