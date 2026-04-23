---
description: 'Mandatory end-to-end workflow for planning and implementing all code changes in the Devoxx Copilot Game project.'
applyTo: '**'
---

# Implementation Workflow

Every code change, feature addition, or bug fix must follow this mandatory end-to-end workflow. This ensures consistency, quality, and comprehensive documentation throughout the project.

## Workflow Steps

### 1. Read and Understand Existing Documentation and Code

Before proposing any change, review the current state:

- Read the relevant sections of `README.md` to understand current specifications, tech stack, and project structure.
- Review the current implementation in the affected code files to understand existing patterns and architecture.
- Check `.github/instructions/` files for domain-specific rules (TypeScript, testing, etc.).
- Examine any related test files to understand current test coverage and patterns.

**Why**: You cannot accurately compare a proposed change against what exists if you don't know the baseline.

### 2. Compare Against the Request

Once you understand the current state:

- Clearly state what the user is asking for.
- Identify gaps between the current code and the desired state.
- Call out any ambiguities or edge cases in the request that need clarification.
- Ask clarifying questions using `ask_user` tool if the request is incomplete.

**Why**: Prevents misalignment between implementation and expectations.

### 3. Plan the Implementation

Before writing code:

- Design the specific codebase changes needed to meet the request.
- Consider which files will be created or modified.
- Document any new types, interfaces, or data structures.
- Identify dependencies between changes.
- Use the `exit_plan_mode` tool to present your plan to the user for approval before proceeding.

**Why**: Catching design issues early is cheaper than fixing them after implementation.

### 4. Add or Update Tests

After design approval, tests come first:

- Write or update tests that cover the new or changed behavior.
- Ensure tests reflect the requirements from step 2.
- Follow the Testing Requirements in `.github/instructions/testing.instructions.md`.
- Run `npm run test` to verify all tests pass before moving to code changes.

**Why**: Tests define behavior and prevent regressions. Writing tests first keeps changes focused and verifiable.

### 5. Modify the Code

Implement the planned changes:

- Follow TypeScript Guidelines in `.github/instructions/typescript.instructions.md`.
- Keep changes focused and surgical—only modify what is needed.
- Update existing code comments or add clarifying comments where necessary.
- Preserve the existing naming, formatting, and module structure.

**Why**: Discipline in code changes prevents unnecessary refactoring and keeps diffs focused.

### 6. Update README and Specification

After code changes:

- Update `README.md` if the project scope, tech stack, commands, or structure have changed.
- Reflect any new features or modified behavior in the documentation.
- Add examples or usage notes where helpful for future developers.

**Why**: Documentation and code must stay in sync, or the repository becomes a source of confusion.

### 7. Validate the Product

Finally, run validation commands:

- Run `npm run test` to ensure all tests pass.
- Run `npm run build` to confirm the production build succeeds.
- Perform a manual browser check: run `npm run dev` and verify the feature works as expected in the browser.
- Test relevant user flows and edge cases if applicable.

**Why**: Automated builds catch syntax and logical errors; manual checks validate real-world behavior and user experience.

## When Clarification Is Needed

If at any step (1–7) you discover ambiguity or missing information:

- Use the `ask_user` tool to request clarification.
- Wait for the user's response before proceeding.
- Do not guess or make assumptions about requirements.

**Why**: Confirming intent early prevents wasted work and rework.

## Exceptions

- **Documentation-only changes**: Steps 4 (tests) and 5 (code) may be skipped for README or markdown updates, but steps 1, 2, 3, and 6 still apply.
- **Existing tests**: If modifying code that already has passing tests, still run step 4 (update tests) to keep them aligned with the new behavior.

## Summary

The workflow ensures:
1. Changes are grounded in current reality (steps 1–2).
2. Changes are planned and approved (step 3).
3. Changes are testable and tested (step 4).
4. Changes are implemented cleanly (step 5).
5. Documentation reflects the new state (step 6).
6. Everything works together (step 7).

Follow this workflow for every task to maintain project quality and consistency.
