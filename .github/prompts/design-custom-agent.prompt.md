# Prompt: Design a Custom Copilot Agent

**Task**: Guide through designing a new custom Copilot agent  
**Purpose**: Create a reusable agent persona, mission, and guidelines  
**Estimated Time**: 15-20 minutes  
**Prerequisites**: Read `.github/agents/copilot-configuration-expert.agent.md` for format reference  

---

## Workflow: Define Your Agent

Use this workflow to design a focused, effective custom agent before authoring the agent file.

### Step 1: Clarify the Mission

Answer these questions to define your agent's core purpose:

- **What specific task** should this agent excel at?  
  Example: "Generate TypeScript tests following Jest conventions"
  
- **Who is the audience**? (other developers, AI systems, specific team roles)  
  Example: "Backend engineers who need to add coverage quickly"

- **What should it explicitly NOT do?** (scope boundaries)  
  Example: "Not a code reviewer; not a code formatter"

**Output**: 1-2 sentence mission statement in plain language.

---

### Step 2: Define the Persona

Build a character that embodies the agent's expertise:

- **Role Title**: What is this agent? (e.g., "React Testing Specialist", "DevOps Automation Expert")

- **Key Strengths**: 2-3 core capabilities that define its identity  
  Example: "Expert in Vitest patterns, React Testing Library idioms, snapshot strategies"

- **Communication Style**: How does it sound? (concise/verbose, formal/casual)  
  Example: "Direct and efficient; no fluff; biased toward practical solutions"

- **Values**: 1-2 priorities that guide its behavior  
  Example: "Prioritizes readability over cleverness; tests should serve as documentation"

**Output**: A brief persona card (3-4 sentences, in character).

---

### Step 3: Identify Guidelines

List the core rules and heuristics this agent should follow:

**Technical Guidelines**:
- Which languages, frameworks, tools does it specialize in?
- Which versions or configurations should it assume?
- Any toolchain or environment constraints?

**Behavioral Guidelines**:
- How should it handle ambiguous requests?
- When should it ask for clarification vs. make assumptions?
- What's its preferred depth of explanation?

**Quality Guidelines**:
- What constitutes "good" output for this agent?
- Any anti-patterns to avoid?
- How should it signal uncertainty or limitations?

**Output**: A numbered or bulleted list of 5-10 key guidelines.

---

### Step 4: Sketch Scenarios

Picture realistic use cases:

1. **Primary Scenario**: The most common request you expect  
   Example: "Generate a new test file for a React component with event handlers"

2. **Edge Case**: A tricky situation the agent should handle well  
   Example: "Asked to test a component that uses async hooks and mocks"

3. **Out-of-Scope**: A request the agent should politely decline  
   Example: "Asked to review code for security vulnerabilities"

**Output**: 3 brief scenarios (2-3 sentences each).

---

## Validation Checklist

Before authoring the agent file, confirm:

- [ ] Mission is laser-focused (one primary task, not a grab-bag)
- [ ] Persona is distinct and memorable (not generic)
- [ ] Guidelines are actionable (not vague principles)
- [ ] Scenarios cover normal, edge, and out-of-scope cases
- [ ] The agent doesn't duplicate an existing agent's role

---

## Next Steps

1. Share your answers above with your team for feedback
2. Refine based on feedback
3. Use `.github/agents/{EXISTING_AGENT_FILE}` as a template
4. Author the agent file following the format in that template
5. Add the agent to your MCP configuration

After completing this design, use the **create-instruction-file.prompt.md** if your agent needs detailed domain guidance.
