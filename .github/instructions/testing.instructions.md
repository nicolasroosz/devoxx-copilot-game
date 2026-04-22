---
description: "Require tests for every TypeScript or TSX code change in this Phaser 4 + React 19 project."
applyTo: "**/*.{ts,tsx}"
---

# Testing Requirements

- Cover every code change with a matching test update or a new test for the changed behavior.
- Prioritize behavior coverage over 100% line coverage; every meaningful feature or bug fix must have an associated test.
- Keep the full relevant test suite passing before considering a change complete.
- If a change cannot be tested directly, add the closest practical test coverage and explain the gap clearly.
