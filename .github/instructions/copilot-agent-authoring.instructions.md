---
description: 'Guide for creating and refining custom Copilot agents with clear mission, capabilities, and communication style.'
applyTo: '**/.github/agents/*.agent.md'
---

# Copilot Agent Authoring

Guide for designing custom Copilot agents that work effectively with GitHub Copilot CLI and task orchestration.

## Agent YAML Frontmatter

Every agent file must include frontmatter with these required fields:

```yaml
---
name: 'Agent Display Name'
description: 'Single-sentence purpose of this agent'
capabilities: ['capability1', 'capability2']
tools: ['tool1', 'tool2']
---
```

- **name**: Short, memorable identifier (max 50 chars)
- **description**: Single sentence describing the agent's primary role
- **capabilities**: List of key capabilities or strengths (3-5 items)
- **tools**: Array of tools this agent can access (e.g., grep, powershell, view)

## Core Sections Structure

A well-designed agent should include these sections:

### 1. Mission and Goals

- Single paragraph stating the primary goal
- 2-3 bullet points for supporting objectives
- **Example**: "Explore and analyze large codebases efficiently, identifying patterns and answering research questions about code organization and dependencies."

### 2. Persona and Expertise

Describe the agent's professional identity:

- **Expertise areas**: 2-3 sentences on domain knowledge
- **Working style**: How it approaches tasks (e.g., methodical, parallel investigation, iterative refinement)
- **Strengths**: Specific capabilities (e.g., fast pattern matching, parallel searches, cross-file analysis)

**Example**:
```
## Persona

The Explore Agent is a fast, methodical code researcher that:
- Performs parallel file searching and pattern analysis using grep and glob
- Identifies architectural patterns and dependencies across modules
- Answers complex questions about codebase structure
- Works efficiently with large repositories by batching independent searches
```

### 3. Guidelines: Do's and Don'ts

Provide behavioral constraints and best practices:

| Do | Don't |
| --- | --- |
| Use parallel tool calls for independent searches | Make sequential calls when they can be parallel |
| Batch related questions into one call | Assume shared context across turns |
| Ask for clarification on ambiguous requests | Guess or make unsupported assumptions |
| Provide concise summaries in response | Return raw tool output without synthesis |

### 4. Communication Style

Define how the agent responds to users:

- **Tone**: Professional, direct, clear (e.g., technical, conversational, concise)
- **Response format**: Bullet points, tables, code blocks, or prose
- **Output length**: Target response conciseness (e.g., "under 100 words for routine tasks, detailed for complex findings")
- **Error handling**: How to communicate when blocked or uncertain

**Example**:
```
## Communication Style

- Respond in clear, scannable prose with bullet points for lists
- Keep routine responses under 100 words; elaborate only on complex findings
- Format code examples with syntax highlighting
- If a search yields no results, explain what was searched and why it may be empty
- If blocked by permissions or tool limitations, state the constraint clearly
```

### 5. Common Scenarios and Use Cases

Provide 2-3 concrete scenarios showing the agent's expected behavior:

- **Scenario 1**: Research question about codebase structure
  - Input: "Find all references to the UserService class across the codebase"
  - Approach: Use grep for class name, glob for TypeScript files, parallel execution
  - Output: List of files with context snippets

- **Scenario 2**: Cross-file dependency analysis
  - Input: "Which modules import from auth/ and how?"
  - Approach: Multiple grep patterns (imports, requires), parallel searches by path
  - Output: Dependency map with counts and examples

### 6. Response Style and Examples

Show examples of high-quality responses:

**Good Response** (concise, actionable, formatted):
```
Found 12 references to UserService:
- src/auth/service.ts (definition)
- src/api/routes.ts (3 imports)
- src/pages/profile.tsx (2 calls)
- [8 more files]

Most common usage: dependency injection in controller setup.
```

**Poor Response** (overwhelming, unformatted):
```
grep output: UserService found in /path/to/file1 line 42, /path/to/file2 line 15, ...
(raw output dump without synthesis)
```

## Context Efficiency

- Focus responses on the question; avoid tangential exploration
- Batch independent work: combine multiple parallel searches in one agent call
- Maximize signal-to-noise: provide context snippets (3-5 lines) around matches, not entire files
- Stop when answered: avoid redundant verification or exhaustive searching once the question is answered

## Integration with Task Orchestration

- Agents are stateless across turns—provide complete context in each message
- When delegated a scope by the main agent, own it fully until completion
- Return clear findings or explicitly state blockers
- Format results so the main agent can easily synthesize them into a response

## Markdown Economy

Agents should respect context efficiency by requesting summarized input and working with structured data:

- **Request summaries**: For large documents (>1 KB), ask users to provide a 150-250 word summary before using them as context
- **Link vs. inline**: When possible, link to large documents rather than inlining their full text in agent messages
- **Structured context**: Work with YAML, JSON, or tables instead of prose for high-density information
- **Bounded asks**: Guide users toward specific, measurable requests rather than open-ended exploration

See `.github/markdown-economy.md` for the full markdown economy guide and `.github/prompts/summarize-markdown.prompt.md` for a copy-paste summary template.

## Maintenance and Evolution

- Review agent design when tool capabilities change
- Update scenarios and examples when new use patterns emerge
- Keep descriptions accurate and concise
- Document any special tool requirements or limitations
