---
name: subagent-driven-development
description: "Use when executing implementation plans with independent tasks that can run in parallel or when coordinating multiple sub-agents for complex features. NOT for research-only tasks."
---

# Subagent-Driven Development

## When to Use
- Implementation plan with multiple independent tasks
- Tasks can be parallelized (no shared state)
- Need different domain expertise for different parts
- Large refactor with isolated components

## Portuguese Triggers
- "executar plano"
- "subagentes"
- "execução paralela"
- "múltiplos agentes"
- "distribuir tarefas"
- "workflow de implementação"

## Subagent Orchestration

### When to Split Work
```
✓ Independent tasks (no shared state/dependencies)
✓ Different domain expertise needed
✓ Parallel execution saves time
✗ Tasks share mutable state
✗ Sequential by nature
✗ Research-only (use general agent instead)
```

### Task Definition Template
```markdown
## Task: [Name]
### Input
[What this subagent receives]
### Output
[What this subagent produces]
### Verification
[How to verify the output]
```

## Subagent Types Available

| Type | Best For |
|------|----------|
| explore | Read-only codebase exploration |
| general | Multi-step tasks with execution |
| gsd-executor | GSD plan execution with atomic commits |
| research | Read-only research tasks |

## Execution Patterns

### Pattern 1: Parallel Execution
```
Main Agent
├── Task A (subagent-1)
├── Task B (subagent-2)
└── Task C (subagent-3)

All run in parallel, merge results
```

### Pattern 2: Sequential Handoff
```
Main Agent
└── Phase 1 (subagent)
    └── Phase 2 (subagent, uses Phase 1 output)
        └── Phase 3 (subagent, uses Phase 2 output)
```

### Pattern 3: Hierarchical
```
Main Orchestrator
├── Research Agent (explore phase)
│   └── Output: structured findings
├── Planning Agent (uses research)
│   └── Output: implementation plan
└── Executor Agents (use plan)
    └── Output: implemented code
```

## Multi-Agent Workflow Template

### Step 1: Task Decomposition
```markdown
Identify independent units:
1. [ ] Task A - [what it does]
2. [ ] Task B - [what it does]
3. [ ] Task C - [what it does]

Dependencies:
- Task B requires Task A output
- Task C is independent
```

### Step 2: Agent Instructions
```markdown
For EACH subagent, provide:
1. Context summary (what main agent knows)
2. Specific task (what to do)
3. Output format (how to return results)
4. Verification (how to check work)
```

### Step 3: Merge Results
```markdown
Main agent collects outputs:
- [ ] Subagent A results received
- [ ] Subagent B results received
- [ ] Subagent C results received

Merge strategy:
[How to combine into final result]
```

## Verification Protocol

### Each Subagent Must
- Report completion status
- List files changed
- Report any blockers
- Follow coding standards

### Main Agent Must
- Verify each output
- Run tests per component
- Run integration tests
- Report final status

## Common Pitfalls

### DO NOT
- Create subagents for trivial tasks
- Share mutable state between agents
- Skip verification step
- Let agents diverge from plan

### DO
- Define clear boundaries
- Provide complete context
- Verify outputs individually
- Maintain unified coding standards

## Subagent-Driven vs Single Agent

| Factor | Single Agent | Subagent-Driven |
|--------|--------------|-----------------|
| Complexity | Low | High |
| Speed | Sequential | Parallel when possible |
| Quality | Consistent | Requires coordination |
| Context | Full | Must be shared |
| Best For | Simple tasks | Complex, multi-domain |

## CLI Reference

### Spawn Subagent
```javascript
// In OpenCode Claude config
{
  "subagent_type": "general",
  "prompt": "Detailed task description",
  "skill": "optional-skill-name"
}
```

### Task Tool
```javascript
{
  "command": "description",
  "prompt": "Full context + specific task",
  "subagent_type": "explore",
  "task_id": "optional-continuation"
}
```

## Related Skills
- parallel-agents: Multi-agent patterns
- multi-agent-brainstorming: Multi-agent review
- dispatcher: Task routing to agents
- skill-router: Skill selection