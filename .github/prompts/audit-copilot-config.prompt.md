# Prompt: Audit Your Copilot Configuration

**Task**: Examine and assess existing Copilot agents, instructions, and skills  
**Purpose**: Identify gaps, redundancy, and improvement areas  
**Estimated Time**: 30-45 minutes  
**Prerequisites**: Access to `.github/agents/`, `.github/instructions/`, `.github/skills/` directories

---

## Overview

This audit ensures your Copilot configuration is:
- **Complete**: All critical domains have guidance
- **Cohesive**: No conflicting or overlapping instructions
- **Discoverable**: Clear relationships between pieces
- **Actionable**: Every guideline is testable and specific

---

## Audit Workflow

### Step 1: Inventory Existing Assets

Create a table listing all agents, instructions, and skills:

| Name | Type | Purpose | Target Files |
| --- | --- | --- | --- |
| {NAME} | agent/instruction/skill | {1-line purpose} | {glob pattern or N/A} |

**For each asset, note**:
- What problem does it solve?
- Who uses it (developers, AI, specific team)?
- Which files does it apply to?

---

### Step 2: Analyze for Overlap

Review the table for:

**Redundancy**: 
- Do any two instructions cover the same domain?  
  (e.g., two TypeScript guides)
- Do any two agents have overlapping missions?
- Can any be merged?

**Anti-Redundancy**:
- Are related concepts split across multiple files?  
  Can they be linked or consolidated?

**Action**: List any overlaps. Decide: merge, dedup, or clarify scope?

---

### Step 3: Check Coverage

For each major part of your codebase, ask:

- **Does an instruction exist** for this language/domain?  
  (e.g., if you have Python code, is there a Python instruction?)

- **Is it discoverable**?  
  (Does the frontmatter's `applyTo` glob actually match these files?)

- **Is it current**?  
  (Does it reference up-to-date versions, frameworks, patterns?)

**Coverage Checklist**:
- [ ] Languages used (TypeScript, Python, Go, etc.) → matching instructions exist
- [ ] Frameworks used (React, Django, etc.) → matching instructions exist
- [ ] Key dev concerns (testing, security, error handling) → covered
- [ ] Team processes (code review, PR standards, commit messages) → covered

**Action**: List gaps. Add new instruction files or agents to fill them.

---

### Step 4: Validate Frontmatter

Frontmatter is the interface between asset and Copilot. Check each file:

```yaml
---
description: '{MUST_BE_QUOTED}'
applyTo: '{GLOB_PATTERN_OR_NA}'
---
```

**Validation**:
- [ ] All quotes are single quotes (`'...'`), not double
- [ ] `applyTo` is a valid glob pattern or `'**'` or `'N/A'`
- [ ] `description` is 1-500 characters
- [ ] File name matches pattern: `{domain}.{type}.md`
  - Examples: `typescript.instructions.md`, `backend-lead.agent.md`, `lint-rules.skill.md`

**Action**: Fix any invalid frontmatter. Re-validate by running:
```bash
find .github -name "*.instructions.md" -o -name "*.agent.md" -o -name "*.skill.md"
```

---

### Step 5: Review Signal-to-Noise

Instruction files should be **scannable and action-oriented**. Skim each one:

**High Signal** 🟢:
- Starts with actionable rules, not philosophy
- Uses examples (Good/Bad patterns)
- Bullet points and bold, not long prose
- Each section is 3-5 items max

**Low Signal** 🔴:
- Theoretical explanations with no code examples
- Long paragraphs of hedging ("should", "might", "consider")
- Vague principles without concrete guidance
- No validation (no way to test compliance)

**Action**: For each 🔴 file, rewrite worst sections using the **create-instruction-file.prompt.md** template.

---

### Step 6: Trace Agent Dependencies

Each agent may reference or depend on instruction files. Map it:

```
Agent: {AGENT_NAME}
├─ Uses Instructions:
│  ├─ {INSTRUCTION_1}
│  ├─ {INSTRUCTION_2}
│  └─ {INSTRUCTION_3}
├─ Uses Skills:
│  └─ {SKILL_1}
└─ References:
   └─ {EXTERNAL_RESOURCE}
```

**Validation**:
- [ ] All referenced instruction files exist
- [ ] All referenced skills exist
- [ ] References are up-to-date (not pointing to old/deleted files)

**Action**: Update agent files to fix broken references.

---

## Output: Audit Report

Summarize findings:

```markdown
# Copilot Configuration Audit

## Summary
- Total Assets: {N} (agents: {M}, instructions: {K}, skills: {L})
- Coverage Gaps: {LIST_GAPS}
- Redundancies: {LIST_OVERLAPS}
- Signal Issues: {COUNT_LOW_SIGNAL_FILES}

## High Priority
{TOP_3_FIXES}

## Medium Priority
{NEXT_3_FIXES}

## Low Priority
{NICE_TO_HAVES}

## Recommendations
1. {REC_1}
2. {REC_2}
3. {REC_3}
```

---

## Action Items from Audit

For each gap or issue identified above, create a task:

- [ ] Merge redundant `{ASSET1}` and `{ASSET2}`
- [ ] Create new instruction file for `{DOMAIN}`
- [ ] Rewrite `{LOW_SIGNAL_FILE}` for clarity
- [ ] Fix frontmatter in `{FILE_WITH_INVALID_FRONTMATTER}`
- [ ] Update agent `{AGENT}` to reference correct instruction files
- [ ] Remove outdated file `{DEPRECATED_FILE}`

---

## Next Steps

1. Share audit report with team
2. Prioritize which gaps/issues to fix first
3. For each high-priority item:
   - If designing a new agent: use **design-custom-agent.prompt.md**
   - If authoring instruction: use **create-instruction-file.prompt.md**
   - If rewriting existing: refer to relevant instruction file for patterns
4. Re-audit after 2-3 sprints to stay current

---

## Validation: Did the Audit Work?

After implementing recommendations:

- [ ] No overlapping agent missions
- [ ] All code languages have matching instructions
- [ ] All instruction files are scannable (<1 min to extract key idea)
- [ ] Frontmatter in all files is valid
- [ ] Agent references point to existing files only
- [ ] Team can discover guidance for their domain
