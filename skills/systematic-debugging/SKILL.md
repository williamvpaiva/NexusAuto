---
name: systematic-debugging
description: "Use when encountering any bug, test failure, or unexpected behavior. Applies the scientific method to debugging: hypothesize, isolate, test, iterate. NOT for quick fixes."
---

# Systematic Debugging - Scientific Method Applied

## When to Use
- Bug report received
- Test failure that needs investigation
- Production incident
- Unexpected behavior
- First instinct is to "just try random fixes"

## Portuguese Triggers
- "debugar"
- "erro inesperado"
- "teste falhou"
- "bug estranho"
- "não funciona"
- "comportamento inesperado"

## Phase-Gated Debugging Protocol

### 1. OBSERVE (Mandatory First Step)
```
Before writing ANY code:
- [ ] Read error message completely
- [ ] Identify exact failure point (file:line)
- [ ] Capture reproduction steps
- [ ] Note affected user workflows
```

### 2. HYPOTHESIZE
```
Form testable hypothesis:
- "The bug is caused by X because Y"
- "The error occurs when A and B are true"
- "The variable Z has unexpected value"

Ask: "What MUST be true for this bug to occur?"
```

### 3. ISOLATE
```
Reduce to minimal reproduction:
- [ ] Create isolated test case
- [ ] Eliminate external dependencies
- [ ] Use debugger, not print statements
- [ ] Check: does bug reproduce in isolation?
```

### 4. TEST
```
Systematic verification:
- [ ] Write test that FAILS before fix
- [ ] Verify test fails with exact symptom
- [ ] Apply minimal fix
- [ ] Verify test passes
- [ ] Run full test suite
```

### 5. ITERATE
```
If hypothesis wrong:
- [ ] Form new hypothesis
- [ ] Return to step 2
- [ ] Document what was ruled out
```

## Debugging Anti-Patterns

### DO NOT
- Change code and hope it fixes
- Add print statements without plan
- Blame "heisenbugs" without investigation
- Skip root cause analysis
- Fix symptom, not cause

### DO
- Use debugger breakpoints
- Check recent git changes
- Verify assumptions
- Test one variable at a time
- Document findings

## Phase-Gated Rules

### Rule 1: Code Changes Blocked Until
- Root cause identified
- Hypothesis formulated
- Test written that fails

### Rule 2: No "Quick Fixes"
- Every fix requires understanding
- Random changes = tech debt
- 5 minutes understanding > 1 hour fixing

### Rule 3: Isolation First
- Cannot debug in complex system
- Build minimal reproduction
- Then test in full system

## Systematic-Debugging vs Quick-Debug

| Aspect | Quick Debug | Systematic Debug |
|--------|-------------|-----------------|
| Time | 5-15 min | 30-120 min |
| Approach | Trial & error | Hypothesis-driven |
| Root Cause | Often missed | Found |
| Recurrence | High | Low |
| Learning | Minimal | Deep |

## CLI Commands for Investigation

### Find recent changes
```bash
git log --oneline -10
git diff HEAD~3 HEAD
```

### Search for error patterns
```bash
grep -rn "ERROR\|error\|exception" --include="*.py" .
```

### Check test output
```bash
pytest -v --tb=long
python -m pytest tests/ -k "test_name" -s
```

### Debug mode
```python
import pdb; pdb.set_trace()
# or
breakpoint()  # Python 3.7+
```

## Session Template

```markdown
# Debug Session: [Brief Description]

## Observation
Error/failure seen: [exact text]

## Hypothesis
[What I think is wrong and why]

## Evidence
- [List of clues supporting hypothesis]
- [List of clues that contradict]

## Test Plan
How to verify: [specific test]

## Execution
[ ] Test isolation
[ ] Verify hypothesis
[ ] Apply fix
[ ] Verify fix
[ ] Run regression

## Result
- [ ] Root cause identified
- [ ] Fix applied
- [ ] Tests pass
```

## Related Skills
- phase-gated-debugging: Similar but with strict enforcement
- systematic-debugging: This skill - general methodology
- error-debugging-error-analysis: Production incident analysis
- debugger: Deep debugger usage