# Prompt: Create a Custom Instruction File

**Task**: Guide through authoring a new instruction file for Copilot  
**Purpose**: Create domain-specific guidance that shapes AI output quality  
**Estimated Time**: 20-30 minutes  
**Prerequisites**: Understand the project structure and target audience

---

## Before You Start

Instruction files work best when they're **focused on ONE domain** (TypeScript, testing, React patterns, security, etc). If you're covering multiple unrelated topics, split into separate files.

**Question**: What single domain or practice area will this instruction file govern?  
Example: "TypeScript type safety conventions", "API error handling patterns", "React component composition"

---

## Step 1: Define Frontmatter

Every instruction file starts with YAML metadata:

```yaml
---
description: '{BRIEF_PURPOSE}'
applyTo: '{GLOB_PATTERN}'
---
```

**`description`** (required):  
- 1-500 characters  
- Single-quoted string  
- Answer: "What is the core purpose of this instruction?"  
- Example: `'Guidelines for writing type-safe TypeScript with minimal any casts'`

**`applyTo`** (required):  
- Glob pattern(s) for which files use these instructions  
- Examples:
  - Single: `'**/*.ts'`
  - Multiple: `'**/*.{ts,tsx}'`
  - Specific folder: `'src/api/**/*.ts'`
  - All files: `'**'`

---

## Step 2: Structure Your Content

Use this proven structure (skip sections that don't apply):

```
# {DOMAIN} Guidelines

{1-paragraph overview}

## General Instructions
- High-level principle 1
- High-level principle 2
- High-level principle 3

## Best Practices
- Specific practice 1
- Specific practice 2

## Code Standards

### Naming Conventions
- Rule 1
- Rule 2

### File Organization
- Structure 1
- Structure 2

### Common Patterns

#### Pattern Name
{Description}

\`\`\`{language}
// Good example
\`\`\`

\`\`\`{language}
// Bad example — avoid this
\`\`\`

## Validation

- Build: `{BUILD_COMMAND}`
- Lint: `{LINT_COMMAND}`
- Test: `{TEST_COMMAND}`
```

**Key principle**: Show contrasts via "Good/Bad" examples, not just rules. Examples encode behavior better than prose.

---

## Step 3: Fill in Specific Rules

For each section, answer:

**General Instructions**:
- What are the 3 biggest principles I should follow?
- What mistakes do I most want to prevent?

**Best Practices**:
- What patterns should I use repeatedly?
- What tools or libraries make this easier?

**Code Standards**:
- Naming: How should I name variables, functions, files?  
  Example: `camelCase` for functions, `PascalCase` for components
- Organization: How should code files be structured?  
  Example: Exports at end, imports at top, private helpers below public ones
- Patterns: What repeated code structures should I recognize and reuse?

**Validation**:
- What commands prove compliance?

---

## Step 4: Encode Markdown Economy

Instruction files should be **scannable** — people should extract the core message in under 30 seconds:

- Use **bullet points** instead of prose paragraphs
- Use **bold** for key terms
- Use **tables** for comparing options
- Use **code blocks** generously (examples > explanations)
- Avoid: long sentences, hedging language ("should", "might"), excessive detail

**Anti-pattern**: "You should consider using the builder pattern in situations where you have many optional parameters because it can improve readability."

**Better**: "Use builder pattern for 5+ optional parameters. Improves readability and prevents argument order errors."

---

## Step 5: Validation Checklist

Before finalizing, confirm:

- [ ] YAML frontmatter is valid (description quoted, applyTo is a glob pattern)
- [ ] File is named `{domain}.instructions.md` in `.github/instructions/`
- [ ] Every principle has at least one concrete example
- [ ] File is scannable (reader gets the point in <1 min)
- [ ] No contradictions between sections
- [ ] All code examples are syntactically correct
- [ ] Commands in Validation section actually exist and run

---

## Quick Format Reference

| Element | Example |
| --- | --- |
| Section heading | `## Best Practices` |
| Subsection | `### Naming Conventions` |
| Good example label | `### Good Example` |
| Code block | ` ```typescript ... ``` ` |
| Inline code | `` `variableName` `` |
| Bold emphasis | `**important term**` |

---

## Next Steps

1. Fill in the template above for your domain
2. Write 3-5 "Good/Bad" example pairs
3. Add validation commands
4. Run validation to confirm examples are correct
5. Save to `.github/instructions/{DOMAIN}.instructions.md`
6. Test with Copilot: ask it to generate code in a file matching `applyTo`

For multi-faceted guidance that spans people/process (not just code), use **design-custom-agent.prompt.md** instead.

For auditing existing configs, see **audit-copilot-config.prompt.md**.
