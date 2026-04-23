# Markdown Economy: Context Efficiency for Copilot

**Core Principle**: Context is finite. Large markdown inputs consume tokens without adding proportional value. Always summarize large documents before using them with Copilot agents.

## Why Summarize Markdown?

- **Token limits**: Every word in your prompt competes for Copilot's context window
- **Signal-to-noise**: Copilot processes concise, structured context faster and more reliably
- **Faster responses**: Smaller inputs = faster agent processing
- **Better focus**: Summarized context keeps agents focused on the specific ask

## When to Summarize

| Situation | Action |
| --- | --- |
| Markdown >1 KB | Always summarize before sharing |
| Complex multi-section docs | Summarize + provide linked reference |
| Specification with lots of edge cases | Extract core concept + key decisions |
| README for external library | Summarize relevant sections only |
| GitHub issue with long discussion thread | Extract key facts + current status |
| Old documentation (possibly outdated) | Verify currency and summarize core parts |

**Guideline**: If reading it takes >2 minutes, summarize it first.

## How to Summarize (Template)

Use this three-part structure to summarize any markdown:

```markdown
**Core Concept** (1-2 sentences)
What problem does this document address? What is the central idea?

**Key Decisions** (3-5 bullet points)
What are the critical facts/rules/constraints I need to know?

**Specific Ask** (1 sentence)
What exactly do you want me to do with this information?
```

**Example**: Original spec is 8 KB; summarized = 150 words.

### Before (Full Spec)

```markdown
# User Authentication System Specification

## Overview
This document specifies the user authentication system for the customer portal. 
The system must support...
[2 KB of narrative architecture details]

## JWT Implementation
We chose JWT because...
[1.5 KB of justification]

## Password Security
Passwords should be hashed using bcrypt with a minimum of...
[1 KB of requirements]
...
```

**Summarized**:

```markdown
**Core Concept**: 
We're building a JWT-based auth system for the customer portal supporting login, token refresh, and logout.

**Key Decisions**:
- JWT tokens, no server sessions
- Bcrypt password hashing (min 12-char passwords with mixed case + numbers)
- Refresh tokens stored in httpOnly cookies
- Email verification required for signup

**Specific Ask**: 
Implement the authentication module in `src/auth/` following these constraints.
```

**Reduction**: 4.5 KB → 200 words. **~3.2x token savings.**

## Tools and Integration

### Use This Prompt

When you have large markdown to summarize, copy this prompt to Copilot:

```markdown
**Help me work efficiently with this large input:**

I have a document (~{SIZE} KB) I'd like to share for context. 
Before I paste the full text, here's the summary:

{CORE_CONCEPT}

{KEY_DECISIONS}

{SPECIFIC_ASK}

[OPTIONAL: I can share the full document for reference if needed]
```

Replace placeholders with your three-part summary.

### Markdown Economy in Agent Design

Agents (in `.github/agents/`) should be designed to:

1. Request summarized input for large documents (>1 KB)
2. Work efficiently with structured context (YAML, tables, lists)
3. Ask for specific, bounded asks rather than open-ended questions
4. Reference full documents rather than inlining them

See `.github/agents/copilot-configuration-expert.agent.md` for the **Markdown Summarization Pattern** code example.

## Before/After Examples

### Example 1: Architecture Decision Document

**Before** (1.2 KB):
```markdown
# Architecture Decision Record: Event Bus Pattern

We considered three approaches to inter-component communication:
1. Direct prop passing (considered but rejected because...)
2. React Context (considered but rejected because...)
3. Event bus pattern (selected because...)

The event bus pattern uses a centralized pub-sub system...
[Detailed explanation of implementation]

Error handling considerations...
[Multiple paragraphs]

Rollback strategy if this fails...
[Contingency planning]
```

**After** (150 words):
```markdown
**Core Concept**: 
Using a centralized event bus (pub-sub) for scene-to-React communication instead of prop drilling or Context.

**Key Decisions**:
- Phaser scenes emit events; React listens via useEffect
- Events are typed (no untyped event names)
- Teardown on component unmount to prevent memory leaks

**Specific Ask**: 
Review the event bus implementation in `src/utils/eventBus.ts` for correctness.
```

**Savings**: ~87% token reduction.

### Example 2: Complex Feature Specification

**Before** (2.5 KB): Full user story with acceptance criteria, edge cases, API spec, database schema, migration instructions...

**After** (180 words):
```markdown
**Core Concept**: 
Add a "favorite items" feature allowing users to star/unstar items and filter the list view to show only favorites.

**Key Decisions**:
- Store favorites in a `user_favorites` database table (user_id, item_id, created_at)
- POST `/api/favorites/:itemId` to add; DELETE to remove
- Frontend state synced via Redux (added `favoritesSlice`)
- No pagination limit; assume <1000 favorites per user

**Specific Ask**: 
Implement the backend API endpoint for adding/removing favorites with proper auth and error handling.
```

**Savings**: ~93% token reduction.

## Checklist

Before sharing markdown with Copilot:

- [ ] Is this markdown >1 KB? If yes, summarize first.
- [ ] Have I identified the core concept in 1-2 sentences?
- [ ] Have I listed 3-5 key decisions/facts?
- [ ] Is my specific ask clear and bounded (not "implement the whole system")?
- [ ] Did I reduce verbose narrative to structured lists?
- [ ] Have I verified my summary is accurate and complete?

## FAQ

**Q: Won't I lose important details by summarizing?**  
A: Yes, intentionally. Include details in your specific ask. Share the full document if Copilot needs to reference it. Summaries are for efficiency, not replacement.

**Q: How do I know if my summary is good?**  
A: You can read it in 20-30 seconds. Someone unfamiliar with the document can understand the core idea. Your specific ask is crystal clear.

**Q: What if the document is complex and needs multiple summaries?**  
A: Break it into logical sections. Summarize each section separately. Use the summaries to guide Copilot on what matters most.

**Q: Can I send both the summary and the full document?**  
A: Yes. Lead with the summary, then say "Here's the full document for reference:" if Copilot needs details.

---

**Remember**: Copilot works best with concise, structured input. Summarizing large markdown is not skipping important information—it's respecting Copilot's context budget and maximizing signal-to-noise ratio.
