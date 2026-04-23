# Summarize Markdown for Copilot

**Use this prompt when you have large markdown (>1 KB) you want to share with Copilot.**

Copy the prompt below, replace the placeholder, and send it:

---

## Prompt Template

```markdown
I have a markdown document (~{SIZE_KB} KB) that I'd like to use as context for Copilot. 
Before I paste the full document, help me work efficiently by creating a concise summary.

Here's the document:

{LONG_MARKDOWN}

---

Please provide a summary covering:

1. **Core Concept** (1-2 sentences): What problem does this document address? What is the main idea?
2. **Key Decisions** (3-5 bullet points): What are the most critical facts, rules, or constraints?
3. **Specific Ask** (1 sentence): What do I want Copilot to do with this information?

Format the output as:

\`\`\`markdown
**Core Concept**: [summary here]

**Key Decisions**:
- [bullet 1]
- [bullet 2]
- [bullet 3]

**Specific Ask**: [what you want Copilot to do]
\`\`\`

This summary should be under 500 tokens (typically 150-250 words).
```

---

## How to Use

1. **Copy the template above** (from "I have a markdown document..." through "...150-250 words")
2. **Replace `{SIZE_KB}`** with the approximate size (e.g., "2.5")
3. **Replace `{LONG_MARKDOWN}`** with your actual markdown document
4. **Send to Copilot** and use the returned summary for all future agent interactions

---

## Example

### Your Input

```
I have a markdown document (~1.8 KB) that I'd like to use as context for Copilot. 
Before I paste the full document, help me work efficiently by creating a concise summary.

Here's the document:

# User Authorization System

## Overview
The system handles role-based access control (RBAC) across the API...
[Full 1.8 KB document here]
...

Please provide a summary...
[rest of prompt]
```

### Copilot's Output

```markdown
**Core Concept**: Implementing role-based access control (RBAC) to restrict API endpoints based on user roles (admin, moderator, user).

**Key Decisions**:
- Three roles: admin (all permissions), moderator (edit content), user (read-only)
- Middleware checks JWT token role claim before allowing endpoint access
- Roles stored in User model; updated via admin panel only
- No permission inheritance; roles are flat

**Specific Ask**: Review the middleware implementation for security vulnerabilities and suggest improvements.
```

---

## What's Included in a Good Summary

✓ **Core Concept**: One or two sentences that explain the central idea  
✓ **Key Decisions**: Bullet points covering the most important constraints or rules  
✓ **Specific Ask**: A clear, bounded request (not "help me build this system")  
✓ **Concise**: Under 300 words (saves ~80% tokens vs. full document)  
✓ **Structured**: Uses markdown formatting for scannability

---

## Tips

- **Reuse the summary**: Once you have a good summary, use it in all related agent requests
- **Keep it truthful**: Ensure the summary accurately represents the document
- **Add full document if needed**: Include the full markdown after the summary if Copilot needs to reference specific details
- **Batch summarization**: If you have multiple large documents, ask Copilot to summarize all of them in one call

---

## See Also

- `.github/markdown-economy.md` — Full guide on when and why to summarize markdown
- `.github/agents/copilot-configuration-expert.agent.md` — Agent expertise in context optimization
