# Copilot Prompts

Reusable workflow prompts for designing and auditing Copilot configuration assets (agents, instructions, skills).

## Overview

This directory contains **copy-paste-ready prompts** that guide you through common Copilot tasks. Each prompt:
- Is focused on a single workflow
- Includes step-by-step instructions with examples
- Uses `{PLACEHOLDERS}` for customization
- References instruction and agent files for deeper guidance
- Is reusable across different projects

## Available Prompts

### 1. `design-custom-agent.prompt.md`

**When to use**: Before authoring a new custom Copilot agent

**What it does**:
- Guides you through defining agent mission, persona, guidelines, and scenarios
- Includes validation checklist to confirm the agent is well-scoped
- Takes ~15-20 minutes

**Example use case**: Designing a "React Testing Specialist" agent for your team

**Output**: A complete agent design ready to be authored into `.github/agents/`

---

### 2. `create-instruction-file.prompt.md`

**When to use**: After designing an agent (or independently) to author domain-specific guidance

**What it does**:
- Provides a template and structure for instruction files
- Emphasizes markdown economy (scannable, actionable, example-driven)
- Includes validation checklist for YAML frontmatter and content
- Takes ~20-30 minutes

**Example use case**: Writing TypeScript type safety guidelines for your codebase

**Output**: A complete instruction file ready to be saved to `.github/instructions/`

---

### 3. `audit-copilot-config.prompt.md`

**When to use**: Periodically (monthly/quarterly) to review your Copilot configuration health

**What it does**:
- Audits all agents, instructions, and skills for coverage, overlap, and quality
- Identifies gaps in domain guidance
- Flags low-signal assets (vague, unhelpful content)
- Produces an audit report with prioritized recommendations
- Takes ~30-45 minutes

**Example use case**: Quarterly review to ensure all languages and team processes are covered

**Output**: An audit report highlighting what to fix/add/improve

---

### 4. `summarize-markdown.prompt.md` (Utility)

**When to use**: When you have large markdown files (>1 KB) to share with Copilot

**What it does**:
- Provides a template for summarizing large markdown documents
- Extracts core concept, key decisions, and specific asks
- Saves ~80% token usage vs. pasting full documents
- Takes ~5-10 minutes

**Example use case**: Summarizing a 2 KB architecture doc before asking Copilot for design feedback

**Output**: A concise summary suitable for use in all follow-up agent interactions

---

## How to Use These Prompts

### Quick Start

1. **Choose your prompt** based on what you're doing:
   - Creating a new agent? → Start with `design-custom-agent.prompt.md`
   - Writing guidance? → Use `create-instruction-file.prompt.md`
   - Reviewing configuration? → Run `audit-copilot-config.prompt.md`

2. **Copy the prompt** into your editor or paste into GitHub Copilot CLI

3. **Fill in placeholders** marked with `{BRACES}`

4. **Follow the workflow** step-by-step

5. **Use the validation checklist** before considering the work done

### Example Workflow: Add a New Agent

```
1. Copy design-custom-agent.prompt.md
2. Fill in mission, persona, guidelines, scenarios
3. Review with team
4. Save design as `.github/agents/{ROLE_NAME}.design.md` (reference)
5. Reference `.github/agents/copilot-configuration-expert.agent.md` format
6. Author agent file as `.github/agents/{ROLE_NAME}.agent.md`
7. If the agent needs domain guidance, use create-instruction-file.prompt.md
8. Update MCP configuration to include the agent
```

---

## Prompt Chaining

These prompts are designed to chain together:

```
design-custom-agent.prompt.md
    ↓
    → (Team review & approval)
    ↓
create-instruction-file.prompt.md  [if agent needs domain guidance]
    ↓
    → (Author instruction files for agent's domain)
    ↓
audit-copilot-config.prompt.md  [quarterly]
    ↓
    → (Identify gaps, fix low-signal assets)
    ↓
design-custom-agent.prompt.md  [for new gaps discovered]
```

---

## Reference Materials

These prompts reference the following files for deeper context:

| Asset | Location | Purpose |
| --- | --- | --- |
| Agent Authoring Guidelines | `.github/instructions/copilot-agent-authoring.instructions.md` | How to write agent files |
| Instruction File Guidelines | `.github/instructions/instruction.instructions.md` | How to write instruction files |
| Skill Authoring Guidelines | `.github/instructions/copilot-skills-authoring.instructions.md` | How to write skill files |
| Example Agent | `.github/agents/copilot-configuration-expert.agent.md` | Template for agent structure |
| Example Instructions | `.github/instructions/typescript.instructions.md` | Example instruction file |

---

## Customization

All prompts use `{PLACEHOLDERS}` for project-specific values. Common placeholders:

| Placeholder | Example | How to Fill |
| --- | --- | --- |
| `{BRIEF_PURPOSE}` | "Guidelines for writing type-safe TypeScript with minimal any casts" | Describe what the file teaches in 1 sentence |
| `{GLOB_PATTERN}` | `'**/*.ts'` or `'src/api/**/*.py'` | Which files does this apply to? |
| `{BUILD_COMMAND}` | `npm run build` or `cargo build` | What's the build command for this repo? |
| `{EXISTING_AGENT_FILE}` | `copilot-configuration-expert.agent.md` | Pick an existing agent file as template |
| `{DOMAIN}` | `typescript`, `react-patterns`, `error-handling` | What's the subject area? |

---

## Extending These Prompts

To create your own prompts for specific workflows:

1. Follow the same structure: frontmatter info + step-by-step workflow + validation checklist
2. Keep prompts to 0.8–1.5 KB (scannable, not encyclopedic)
3. Use `{PLACEHOLDERS}` for customization points
4. End with "Next Steps" that reference related prompts or reference materials
5. Store in `.github/prompts/` with a descriptive name like `{workflow}.prompt.md`

---

## FAQ

**Q: Can I use these prompts for other projects?**  
A: Yes! These are designed to be reusable. Just customize the `{PLACEHOLDERS}` for your project structure.

**Q: How often should I audit my Copilot configuration?**  
A: Recommend quarterly review using `audit-copilot-config.prompt.md`. Add it to your calendar.

**Q: What if I'm new to Copilot customization?**  
A: Start with `design-custom-agent.prompt.md` to learn the workflow, then read `.github/instructions/copilot-agent-authoring.instructions.md` for the deep dive.

**Q: Can I modify these prompts?**  
A: Absolutely! These are templates. Adapt them to your team's workflow and values.

---

## Contributing

If you improve these prompts or create new ones:
1. Keep them focused (one workflow, not a grab-bag)
2. Test with actual team members using the prompt
3. Update this README with the new prompt
4. Follow the same structure and placeholder conventions
