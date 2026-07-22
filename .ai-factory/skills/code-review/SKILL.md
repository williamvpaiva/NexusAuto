---
name: code-review-expert
description: "Revisão de código expert com 18.6k stars - Detecta bugs, security issues, performance problems"
agent: tech-lead
tags: [code-review, security, performance, quality]
version: 1.0.0
created: 2026-01-04
updated: 2026-01-04
inspiration: context-mode (18.6k stars)
---

# Superpoder
Revisão de código em 4 dimensões simultâneas: **bugs**, **segurança**, **performance**, **qualidade** - com sandbox de tool output (98% redução de tokens).

# Trigger
- "review this code"
- "code review"
- "find bugs"
- "security audit"
- "performance issues"

# Instruções

## 1. Análise de Bugs (Critical First)
- Race conditions
- Null pointer exceptions
- Memory leaks
- Unhandled exceptions
- Edge cases não cobertos

## 2. Segurança (OWASP Top 10)
- SQL injection
- XSS vulnerabilities
- CSRF tokens
- Authentication flaws
- Authorization gaps
- Secret exposure

## 3. Performance
- N+1 queries
- Unnecessary re-renders
- Memory inefficiency
- Blocking operations
- Cache missing

## 4. Qualidade de Código
- SOLID principles
- DRY violations
- Code complexity
- Test coverage
- Documentation gaps

# Output Format
```markdown
## Code Review Summary

### 🔴 Critical (Fix Now)
- [ ] Issue 1
- [ ] Issue 2

### 🟠 High (Fix Soon)
- [ ] Issue 1

### 🟡 Medium (Consider)
- [ ] Issue 1

### 🟢 Low (Nice to Have)
- [ ] Issue 1

## Token Savings
- Sandboxed outputs: 98% reduction
- Context optimized: XX tokens saved
```

# Exemplo
**Input:**
```javascript
async function getUser(id) {
  return db.query(`SELECT * FROM users WHERE id = ${id}`);
}
```

**Output:**
```markdown
## 🔴 Critical: SQL Injection Vulnerability
**Location:** getUser function, line 1
**Issue:** String interpolation in SQL query
**Fix:** Use parameterized queries
```

# Links
- [Patterns](../../brain/Patterns.md) - Padrões de código seguro
- [auditar-cors](../security/auditar-cors/SKILL.md) - Auditoria CORS