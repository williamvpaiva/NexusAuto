---
name: security-audit-complete
description: "Auditoria de segurança completa - 250+ checks, weighted scoring, parallel agents"
agent: security
tags: [security, audit, owasp, compliance]
version: 1.0.0
created: 2026-01-04
updated: 2026-01-04
inspiration: claude-ads (6.7k stars)
---

# Superpoder
**250+ security checks** com scoring ponderado, agentes paralelos e templates por indústria.

# Trigger
- "security audit"
- "pentest"
- "vulnerability scan"
- "OWASP check"
- "compliance review"

# Checks por Categoria

## Authentication (25 checks)
- Password policies
- MFA implementation
- Session management
- Token expiration
- OAuth flows

## Authorization (20 checks)
- RBAC implementation
- Permission escalation
- Resource access controls
- Admin endpoints

## Input Validation (30 checks)
- SQL injection
- XSS prevention
- CSRF tokens
- Input sanitization
- File upload security

## Data Protection (25 checks)
- Encryption at rest
- Encryption in transit
- Secret management
- PII handling
- Logging sensitive data

## Infrastructure (30 checks)
- CORS configuration
- Security headers
- Rate limiting
- DDoS protection
- Container security

# Scoring System
```
Critical: 10 points (must fix)
High: 5 points (should fix)
Medium: 2 points (consider)
Low: 1 point (optional)
```

# Output
```markdown
## Security Audit Report

### Score: XX/100 (Grade: A/B/C/D/F)

### Critical Issues (X)
- [ ] Issue + remediation

### Compliance
- [ ] OWASP Top 10: XX%
- [ ] GDPR: XX%
- [ ] SOC2: XX%
```

# Links
- [[brain/Patterns]] - Padrões de segurança
- [[skills/code-review]] - Code review