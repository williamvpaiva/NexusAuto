---
name: verification-before-completion
description: "Use when claiming work is complete, when ANY variation of success/completion claims, ANY expression of satisfaction, or ANY positive statement about work state. Blocks premature completion."
---

# Verification Before Completion - Quality Enforcement

## When to Use
- Before claiming work is "done"
- Before marking tasks complete
- When user asks "is it ready?"
- Before commit/PR
- Any completion claim

## Portuguese Triggers
- "está pronto"
- "está completo"
- "funcionando"
- "deveria estar pronto"
- "está bom assim"
- "pode fazer merge"
- "verificar"

## Verification Protocol

### NEVER Claim Without
1. Tests pass
2. Lint passes
3. Typecheck passes
4. No breaking changes
5. Verification steps completed

### Pre-Completion Checklist
```markdown
## Pre-Completion Verification

- [ ] Tests: [ ] pass / [ ] no tests
- [ ] Lint: [ ] pass / [ ] N/A
- [ ] Types: [ ] pass / [ ] N/A
- [ ] Manual test: [ ] done / [ ] N/A
- [ ] No console errors
- [ ] No breaking changes

If ANY item fails: DO NOT claim completion
```

## Claiming Completion Rules

### You CAN claim when:
- All verification items pass
- Tests prove functionality works
- No known issues remain
- Code follows standards

### You CANNOT claim when:
- Tests failing
- Lint errors present
- Typecheck fails
- Manual verification not done
- Known bugs exist
- Work is partially complete

## When Verification Blocked

### If blocked:
- Report what is NOT verified
- List specific failures
- Do NOT claim completion
- Continue working or ask for guidance

### Example Blocked Response:
```
[BLOCKED] Cannot claim completion:

Failing:
- Test suite: 3 tests failing
- Lint: 2 warnings

Remaining work:
- Fix failing tests
- Address lint warnings

Do NOT mark as complete until resolved.
```

## Quality Gates

### Gate 1: Test Coverage
- Unit tests pass
- Integration tests pass
- E2E tests pass (if applicable)

### Gate 2: Code Quality
- No lint errors
- Types correct
- No obvious bugs

### Gate 3: Functional
- Feature works as specified
- Edge cases handled
- No regressions

### Gate 4: Documentation
- Updated docs if needed
- Comments accurate
- README updated

## Related Skills
- systematic-debugging: Investigation before fixes
- requesting-code-review: Peer verification
- lint-and-validate: Run validation tools