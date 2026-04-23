---
description: 'Best practices for writing high-signal Copilot instructions: clarity, specificity, examples, and context efficiency.'
applyTo: '**/.github/instructions/*.instructions.md'
---

# Copilot Instructions Best Practices

Supplement to `instruction.instructions.md` focusing on Copilot-specific guidance and practical context efficiency.

## Signal-to-Noise Ratio: What to Include

### High-Signal Content ✓

- Concrete rules with specific examples (not abstract principles)
- Warnings about common mistakes (from actual failures, not hypotheticals)
- Naming conventions and file organization patterns used in this project
- Links to relevant code examples in the repository (e.g., "See `src/auth/` for the pattern")
- Syntax examples showing correct and incorrect approaches side-by-side

### Low-Signal Content ✗

- General philosophy or mission statements unrelated to the code
- Hypothetical edge cases that have not occurred in practice
- Verbose explanations of standard language features
- Redundant lists that restate the language documentation
- Guidelines without consequences for breaking them

**Principle**: Every sentence must either (a) prevent a common mistake, (b) clarify ambiguity, or (c) show a specific pattern.

## Markdown Summarization Pattern

When instructions risk becoming too large, use this pattern to keep them scannable:

```markdown
## [Topic]: [One-sentence rule]

- Specific guideline 1
- Specific guideline 2
- [Rare edge case: handle by doing X]

### Example
[Code block showing the recommended pattern]
```

This forces conciseness and improves scanability. Copilot processes concise, structured instructions faster and more reliably than prose.

## Instruction Altitude: Finding the Goldilocks Zone

| Problem | Symptom | Fix |
| --- | --- | --- |
| Over-specified (too many rules) | Instructions feel like a style guide | Remove "nice to have" rules; keep only "must do" |
| Under-specified (too vague) | Copilot generates inconsistent outputs | Add a concrete example showing the 1-2 correct patterns |
| Right altitude | Clear, generalizable outputs | 1 core principle + 2-3 specific examples |

**Audit checklist**:
- [ ] Each rule includes at least one concrete example
- [ ] Rules are specific (no "should", "may", "consider", or "generally")
- [ ] No hypothetical warnings ("What if someone does X...")
- [ ] Common patterns take up more space than rare edge cases

## Context Efficiency Strategies

### File Size Targets

| File Type | Target Size | Strategy |
| --- | --- | --- |
| Single-tool instructions | 1-2 KB | Example: testing.instructions.md (583 bytes) |
| Multi-topic instructions | 3-5 KB | Example: typescript.instructions.md (900 bytes) |
| Reference/guide instructions | 8-10 KB max | Example: instruction.instructions.md (8 KB) |

Keep instructions concise; Copilot processes them faster and applies them more reliably.

### Removing Redundancy

- Do not repeat rules from language documentation (e.g., don't rephrase TypeScript handbook)
- Do not restate earlier instruction files (e.g., don't copy testing.instructions.md into a new file)
- Do link to existing instructions when extending them
- Do add project-specific context not available elsewhere

**Example**: In `typescript.instructions.md`, reference `testing.instructions.md` for test patterns instead of duplicating test rules.

## High-Signal vs Low-Signal Instructions

### Good Example: High-Signal TypeScript Rule

```markdown
## Exported API Types: Always Explicit

For exported functions and component props, use explicit types unless inference is obvious.

✓ Good
\`\`\`typescript
export function fetchUser(id: string): Promise<User> { ... }
export interface UserCardProps { name: string; email: string; }
\`\`\`

✗ Bad
\`\`\`typescript
export function fetchUser(id: any) { ... }  // Type lost
export function getUser(id: string) { ... }  // Return type unclear
\`\`\`
```

**Why high-signal**: Specific rule + clear example + shows the cost of breaking it.

### Poor Example: Low-Signal Rule

```markdown
## Use TypeScript

Always write your code in TypeScript to get better tooling and type safety.
TypeScript is a superset of JavaScript that adds static typing. 
Consider using TypeScript for your projects...
```

**Why low-signal**: Vague ("better tooling"), general purpose, no project context, no specific rule or example.

## Domain-Specific Instruction Templates

### Framework/Library Instructions (React, Phaser, etc.)

```markdown
---
description: 'Single-sentence purpose for this technology in this project'
applyTo: '**/*.{ts,tsx}'
---

# [Technology] in [Project]

One paragraph: what role this tech plays, not general description.

## Core Principle
One sentence rule that guides 90% of decisions.

## Specific Patterns

### Pattern 1: [Name]
- When to use it
- How to use it
\`\`\`language
// Example
\`\`\`

### Pattern 2: [Name]
...

## Common Mistakes
- Mistake 1 (with example)
- Mistake 2 (with example)

## Links
- [Example in codebase](path/to/file)
- [Reference](url)
```

### Tool/Build Instructions (npm, webpack, etc.)

```markdown
---
description: '[Tool]: how to configure, use, and troubleshoot in this project'
applyTo: '**'
---

# Using [Tool] in [Project]

## Configuration
- Config file: [location]
- Typical command: `command here`
- [One paragraph on project-specific config]

## Common Tasks
| Task | Command |
| --- | --- |
| [Task 1] | `npm run task1` |

## Troubleshooting
| Symptom | Cause | Fix |
| --- | --- | --- |
| [Error X] | [Reason] | [Solution] |
```

## Auditing Existing Instructions

When reviewing instruction files, check:

1. **Clarity**: Can a new team member understand the rule in 30 seconds?
2. **Specificity**: Does each rule have an example? Is the example runnable?
3. **Necessity**: Would code break or diverge without this rule? If not, consider removing it.
4. **Consistency**: Does this contradict other instruction files?
5. **Maintenance**: Are examples still accurate and current?

**Audit command**: Search for vague language patterns and replace with specific rules or remove them.

## Markdown Economy

Keep instruction files scannable and token-efficient by following these principles:

- **File size targets**: Aim for 1-2 KB for single-topic files, 3-5 KB for multi-topic, 8-10 KB max for comprehensive guides
- **Summarize large concepts**: Replace long narratives with structured sections (bullet points, tables, code examples)
- **Link for details**: When a topic needs more depth, link to reference docs instead of inlining full text
- **Example-driven**: Use concrete code examples instead of verbose explanations; examples are more scannable

See `.github/markdown-economy.md` for guidance on context efficiency and `.github/prompts/summarize-markdown.prompt.md` to help summarize user inputs.

## Maintenance Checklist

- [ ] Examples reflect current code style in the repository
- [ ] No contradictions with other instruction files
- [ ] No hypothetical rules (only constraints from real failures)
- [ ] Signal-to-noise ratio is high (most content is actionable)
- [ ] Markdown is scannable (short sections, code examples, tables)
- [ ] File size is under target (1-10 KB depending on scope)
- [ ] Links to repository examples are still valid
