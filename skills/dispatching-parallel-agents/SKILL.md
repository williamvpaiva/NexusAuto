---
name: dispatching-parallel-agents
description: "Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies. NOT for dependent tasks or research-only tasks."
---

# Dispatching Parallel Agents - Multi-Task Distribution

## When to Use
- Multiple independent tasks available
- Different domain expertise needed for each
- Tasks can run simultaneously
- Need speed through parallelism

## Portuguese Triggers
- "tarefas paralelas"
- "executar em paralelo"
- "múltiplos agentes"
- "dispatch"
- "distribuir trabalho"

## When to Split vs Sequential

### SPLIT (Parallel) When
- Tasks are completely independent
- No shared state or files
- Different expertise domains
- Can run simultaneously
- Results don't need each other

### SEQUENTIAL When
- Tasks depend on each other's output
- Need to share context
- Sequential by nature
- One task sets up next

## Dispatching Protocol

### Step 1: Identify Tasks
```markdown
Task A: [Independent work] - Can run immediately
Task B: [Independent work] - Can run immediately
Task C: [Dependent on Task A] - Must wait
```

### Step 2: Group Independent Tasks
```markdown
PARALLEL GROUP 1:
- Task A
- Task B

SEQUENTIAL GROUP 2:
- Task C (waits for Task A)
```

### Step 3: Create Subagent Prompts
```markdown
For Task A:
> Context: [What main agent knows]
> Task: [Specific work]
> Output: [What to return]
> Verification: [How to check]

For Task B:
> Context: [What main agent knows]
> Task: [Specific work]
> Output: [What to return]
```

### Step 4: Execute and Merge
```markdown
Collect results:
- [ ] Task A result
- [ ] Task B result

Merge into final output
```

## Subagent Types for Dispatching

| Type | Best For | Speed |
|------|----------|-------|
| explore | Read-only analysis | Fast |
| general | Implementation | Medium |
| gsd-executor | GSD workflow | Medium |

## Anti-Patterns

### DO NOT Dispatch When
- Tasks share same file
- Tasks modify shared state
- Results must be combined before next step
- Tasks require same context

### DO Not Dispatch
- Single task (overhead > benefit)
- Research-only (use general agent)
- Trivial tasks (2-3 minute work)

## Quality Control

### Each Subagent Should
- Report completion status
- List files changed
- Identify any blockers
- Follow coding standards

### Main Agent Must
- Verify each output
- Run tests if applicable
- Report combined status
- Handle any failures

## Example: Multi-File Feature

```
Main Agent receives: "Add dark mode to all pages"

Dispatch 3 agents:
├── Agent A: Add dark mode CSS variables → design-tokens.css
├── Agent B: Create dark mode toggle component → ThemeToggle.tsx
└── Agent C: Add dark mode to navigation → Navbar.tsx

Wait for all complete → Main agent combines and tests
```

## Related Skills
- subagent-driven-development: Full multi-agent workflow
- parallel-agents: Similar pattern
- multi-agent-patterns: Advanced patterns