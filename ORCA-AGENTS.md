# NexusAuto Agent Routing Matrix & Handoff Rules

Complete routing guide for all 21 NexusAuto agents with handoff protocols, escalation paths, and parallel execution rules.

---

## Table of Contents

1. [Agent Overview](#1-agent-overview)
2. [Routing Matrix](#2-routing-matrix)
3. [Handoff Protocols](#3-handoff-protocols)
4. [Parallel Execution Rules](#4-parallel-execution-rules)
5. [Escalation Paths](#5-escalation-passes)
6. [Tech Lead Routing](#6-tech-lead-routing)

---

## 1. Agent Overview

### Development Agents (8)

| ID | Agent | Primary Responsibility | Entry Point |
|----|-------|----------------------|-------------|
| `dev.tl` | Tech Lead | Orchestration, task distribution, V&V | `/lider` or `tech-lead.md` |
| `dev.arc` | Architect | System architecture, ADRs, tech stack | `architect.md` |
| `dev.be` | Backend Dev | APIs, services, database, business logic | `backend-dev.md` |
| `dev.fe` | Frontend Dev | UI components, React, responsive design | `frontend-dev.md` |
| `dev.sec` | Security | OWASP audits, vulnerability assessment | `security.md` |
| `dev.perf` | Performance | Optimization, caching, scalability | `performance.md` |
| `dev.qa` | QA Tester | Testing strategy, test coverage, go/no-go | `qa-tester.md` |
| `dev.ops` | DevOps | CI/CD, deployment, infrastructure | `devops.md` |

### Specialist Agents (13)

| ID | Agent | Primary Responsibility | Entry Point |
|----|-------|----------------------|-------------|
| `spec.analyst` | Analyst | Requirements gathering, user stories | `analyst.md` |
| `spec.po` | Product Owner | Requirements, prioritization, stakeholder | `product-owner.md` |
| `spec.ux` | UI/UX Pro Max | Visual design, layout, typography | `ui-ux-pro-max-agent.md` |
| `spec.data` | Data Analyst | Data modeling, analytics | `data-analyst.md` |
| `spec.fin` | Financial Analyst | Cost analysis, ROI, budget | `financial-analyst.md` |
| `spec.legal` | Legal Counsel | Compliance, contracts, IP | `legal-counsel.md` |
| `spec.recruiter` | Recruiter | Talent acquisition, team building | `recruiter.md` |
| `spec.cos` | Chief of Staff | Executive support, coordination | `chief-of-staff.md` |
| `spec.csl` | Customer Support Lead | Support workflows, escalation | `customer-support-lead.md` |
| `spec.pm` | Product Marketer | Go-to-market, positioning | `product-marketer.md` |
| `spec.vc` | Venture Capitalist | Investment analysis, pitch | `venture-capitalist.md` |
| `spec.wa` | WhatsApp Agent | WhatsApp integration, messaging | `whatsapp-agent.md` |
| `spec.exec` | Executor Agent | Task execution, automation | `executor-agent.md` |

---

## 2. Routing Matrix

### Feature Development Flow

```
User Request
    │
    ▼
┌─────────────────┐
│   Tech Lead     │ ← Entry point for all feature work
│   /lider        │   Validates → Analyzes → Routes
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Analyst      │ → Requirements → User Stories → Acceptance Criteria
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Architect     │ → Architecture → Tech Stack → ADRs → API Design
└────────┬────────┘
         │
    ┌────┴────────────────────┐
    │                         │
    ▼                         ▼
┌───────────┐          ┌───────────┐
│ Frontend  │          │  Backend  │
│   Dev     │◄────────►│   Dev     │
└─────┬─────┘  API    └─────┬─────┘
      │        Contract    │
      │                     │
      ▼                     ▼
┌───────────┐          ┌───────────┐
│ Security  │          │Security   │
│ (Review)  │          │ (Review)  │
└─────┬─────┘          └─────┬─────┘
      │                     │
      ▼                     ▼
┌───────────┐          ┌───────────┐
│ QA Tester │          │QA Tester  │
│ (Verify)  │          │ (Verify)  │
└─────┬─────┘          └─────┬─────┘
      │                     │
      └──────────┬──────────┘
                 │
                 ▼
         ┌─────────────┐
         │  DevOps     │ → CI/CD → Deploy → Monitor
         └─────────────┘
```

### Task Type Routing

| Task Type | Primary Agent | Secondary Agent | Notes |
|-----------|--------------|-----------------|-------|
| New feature | Tech Lead → Analyst → Architect | → Frontend/Backend | Full flow |
| Bug fix | Tech Lead → Developer | → QA | Quick validation |
| Security audit | Tech Lead → Security | → Backend | Immediate escalation |
| Performance tuning | Tech Lead → Performance | → Backend/DevOps | Analyze first |
| UI/UX redesign | Tech Lead → UI/UX | → Frontend | Design first |
| Database change | Tech Lead → Architect | → Backend | Schema review |
| API design | Tech Lead → Architect | → Backend | REST/GraphQL |
| Testing strategy | Tech Lead → QA | → Developer | TDD approach |
| Deployment | Tech Lead → DevOps | → All | Staged rollout |
| Requirements | Tech Lead → Analyst | → Product Owner | Clarification |

### Special Routing Rules

| Situation | Route To | Priority |
|-----------|----------|----------|
| Unclear requirements | Analyst | HIGH |
| Technical debt concern | Tech Lead | MEDIUM |
| Security vulnerability | Security | CRITICAL |
| Performance degradation | Performance | HIGH |
| User complaint | Customer Support | HIGH |
| Legal question | Legal Counsel | HIGH |
| Budget question | Financial Analyst | MEDIUM |
| Hiring need | Recruiter | MEDIUM |
| Marketing push | Product Marketer | MEDIUM |
| Investor meeting | Venture Capitalist | HIGH |
| WhatsApp integration | WhatsApp Agent | MEDIUM |
| General automation | Executor Agent | LOW |

---

## 3. Handoff Protocols

### Standard Handoff Checklist

**From Architect → Frontend/Backend:**

```markdown
## Handoff Prerequisites ✓
- [ ] architecture-design.md complete
- [ ] tech-stack.md justified
- [ ] ≥3 ADRs documented
- [ ] C4 Context + Container diagrams ready
- [ ] project-structure.md defined
- [ ] api-design.md specified

## For Frontend:
- [ ] architecture-design.md (frontend view)
- [ ] api-design.md (contracts)
- [ ] project-structure.md (frontend)
- [ ] Framework chosen + rationale
- [ ] Approved libraries list
- [ ] Component patterns
- [ ] State management strategy

## For Backend:
- [ ] architecture-design.md (backend view)
- [ ] data-model.md
- [ ] api-design.md
- [ ] project-structure.md (backend)
- [ ] Layer patterns (Controller/Service/Repository)
- [ ] Validation + error handling strategy
```

### Handoff Commands

```bash
# Handoff from Architect to Frontend
/handoff architect → frontend-dev --files "docs/architecture/frontend-spec.md,docs/architecture/api-design.md"

# Handoff from Architect to Backend
/handoff architect → backend-dev --files "docs/architecture/backend-spec.md,docs/architecture/data-model.md"

# Handoff from QA to DevOps
/handoff qa-tester → devops --files "test-results/latest/,docs/deployment-checklist.md"

# Request review from Security
/review-request security --scope "backend-auth,api-endpoints"
```

---

## 4. Parallel Execution Rules

### When to Run Parallel

| Scenario | Agents | Conditions |
|---------|--------|------------|
| Independent features | Frontend + Backend | Clear API contracts defined |
| Multiple endpoints | Backend Dev (x2+) | Separate domains |
| Multiple components | Frontend Dev (x2+) | Shared design system |
| Security + Dev work | Security + Dev | Isolated scopes |
| Tests + Implementation | QA + Developer | TDD protocol |

### Parallel Handoff Example

```bash
# Split backend work by domain
/handoff architect → backend-dev --scope "user-auth,payments" --name "backend-auth"
/handoff architect → backend-dev --scope "notifications,reports" --name "backend-notify"

/split-work backend-auth backend-notify

# Split frontend work by feature
/handoff architect → frontend-dev --scope "dashboard,widgets" --name "frontend-dash"
/handoff architect → frontend-dev --scope "settings,profile" --name "frontend-user"

/split-work frontend-dash frontend-user
```

### Parallel Coordination

```bash
# Create sync point
/sync-point "api-contract-ready"

# Wait for multiple agents
/wait-for architect backend-dev frontend-dev --sync "api-contract-ready"

# Merge results
/merge-results backend-dev frontend-dev --output "docs/integration/merged-spec.md"
```

---

## 5. Escalation Paths

### Escalation Tiers

```
TIER 1: Agent Level
    ↓ (unclear requirements, blocking issues)
TIER 2: Tech Lead Level
    ↓ (strategic decisions, cross-agent conflicts)
TIER 3: Human/Product Owner Level
    ↓ (budget, timeline, priorities)
TIER 4: Stakeholder Level
```

### Escalation Triggers

| Trigger | From | To | Priority |
|---------|------|----|----------|
| Requirements unclear | Any Dev | Analyst | HIGH |
| Technical debt > 20% | Any Dev | Tech Lead | MEDIUM |
| Architecture decision needed | Dev | Architect | HIGH |
| Security vulnerability found | Dev | Security | CRITICAL |
| Performance below threshold | Dev | Performance | HIGH |
| Scope creep suspected | Dev | Tech Lead | MEDIUM |
| Timeline at risk | Dev | Tech Lead | HIGH |
| Budget concerns | Dev | Financial Analyst | HIGH |
| Legal/compliance issue | Dev | Legal Counsel | CRITICAL |
| Stakeholder conflict | Tech Lead | Product Owner | HIGH |
| Resource constraint | Tech Lead | Human | CRITICAL |

### Escalation Commands

```bash
# Escalate to Tech Lead
/escalate --reason "architecture-decision-required" --priority HIGH

# Request human intervention
/escalate --to human --reason "budget-approval-needed" --priority CRITICAL

# Request security review immediately
/escalate security --reason "critical-vulnerability-found" --priority CRITICAL
```

---

## 6. Tech Lead Routing

### Tech Lead Decision Matrix

```
┌─────────────────────────────────────────────────────────────┐
│                    TECH LEAD ROUTING                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  INPUT: User Request / Task                                 │
│      │                                                     │
│      ▼                                                     │
│  ┌─────────────────────────────────────────┐               │
│  │ 1. VALIDATE                              │               │
│  │    - Requirements clear?                 │               │
│  │    - Success criteria defined?          │               │
│  │    - Dependencies identified?            │               │
│  └─────────────────┬───────────────────────┘               │
│                    │                                       │
│          ┌────────┴────────┐                              │
│          │                  │                              │
│         YES                NO                              │
│          │                  │                              │
│          ▼                  ▼                              │
│  ┌───────────────┐  ┌──────────────────┐                 │
│  │ 2. ANALYZE    │  │ → Analyst        │                 │
│  │    - Scope    │  │   (requirements) │                 │
│  │    - Effort   │  │                  │                 │
│  │    - Priority │  └──────────────────┘                 │
│  │    - Risks    │                                       │
│  └───────┬───────┘                                       │
│          │                                                 │
│          ▼                                                 │
│  ┌─────────────────────────────────────────┐              │
│  │ 3. ROUTE                                 │              │
│  │                                          │              │
│  │  Task Type        →  Agent               │              │
│  │  ─────────────────────────────────       │              │
│  │  Feature (new)    →  Architect           │              │
│  │  Feature (UI)     →  Frontend Dev        │              │
│  │  Feature (API)    →  Backend Dev         │              │
│  │  Bug (simple)     →  Developer (direct)  │              │
│  │  Bug (complex)    →  Security/QA first   │              │
│  │  Security         →  Security           │              │
│  │  Performance      →  Performance         │              │
│  │  Testing          →  QA Tester          │              │
│  │  Deployment       →  DevOps             │              │
│  │  Requirements     →  Analyst             │              │
│  │  Design           →  UI/UX Pro Max        │              │
│  │  Marketing        →  Product Marketer    │              │
│  │  Legal            →  Legal Counsel       │              │
│  │  Financial        →  Financial Analyst   │              │
│  │  WhatsApp         →  WhatsApp Agent       │              │
│  └─────────────────────────────────────────┘              │
│                                                             │
│  V&V: Verify all outputs before marking complete           │
└─────────────────────────────────────────────────────────────┘
```

### Slash Commands Reference

| Command | Description | Example |
|---------|-------------|---------|
| `/lider` | Invoke Tech Lead | `/lider` |
| `/nl-specify "desc"` | Generate spec | `/nl-specify "user authentication"` |
| `/nl-plan "tech"` | Generate plan | `/nl-plan "implement REST API"` |
| `/nl-tasks` | Generate task list | `/nl-tasks` |
| `/nl-implement` | Trigger implementation | `/nl-implement` |
| `/handoff` | Transfer to agent | `/handoff architect → frontend-dev` |
| `/escalate` | Escalate issue | `/escalate --reason "blocked"` |
| `/sync-point` | Create sync | `/sync-point "api-ready"` |
| `/wait-for` | Wait for agents | `/wait-for architect backend-dev` |
| `/split-work` | Parallel split | `/split-work agent1 agent2` |
| `/merge-results` | Merge outputs | `/merge-results agent1 agent2` |

---

## Agent-Specific Handoff Rules

### Architect Handoffs

| To | Prerequisites | Files Transferred |
|----|--------------|-------------------|
| Frontend Dev | architecture-design.md, api-design.md, project-structure.md | frontend-spec.md, api-design.md, component-patterns.md |
| Backend Dev | architecture-design.md, data-model.md, api-design.md | backend-spec.md, data-model.md, layer-patterns.md |
| DevOps | deployment-architecture.md, infrastructure-as-code | deployment-guide.md, docker-compose.yml, k8s/ |
| Security | security-design.md, threat-model.md | security-spec.md, auth-flows.md |
| Performance | performance-strategy.md, scalability-plan.md | performance-spec.md, sla-requirements.md |

### Frontend Dev Handoffs

| To | Prerequisites | Files Transferred |
|----|--------------|-------------------|
| Security | component-security-review.md | component清单, auth-flows |
| QA Tester | testable-components.md, component-contracts.md | component清单, interaction-specs |
| Architect | implementation-feedback.md | tech-debt, architectural-concerns |

### Backend Dev Handoffs

| To | Prerequisites | Files Transferred |
|----|--------------|-------------------|
| Security | api-security-review.md | endpoint清单, auth-implementation.md |
| QA Tester | testable-endpoints.md, test-data-specs.md | endpoint清单, test-scripts |
| Architect | implementation-feedback.md | tech-debt, performance-issues |

### QA Tester Handoffs

| To | Prerequisites | Files Transferred |
|----|--------------|-------------------|
| Developer | bug-report.md, failing-tests.md | test-results, coverage-report |
| DevOps | deployment-readiness.md, test-sign-off.md | test-results, smoke-test-suite |
| Tech Lead | quality-assessment.md, risk-report.md | quality-report, go/no-go-decision |

---

## Quick Reference Card

```
╔════════════════════════════════════════════════════════════╗
║              AGENT ROUTING QUICK REFERENCE                 ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  START → Tech Lead (/lider)                                ║
║    │                                                       ║
║    ├─ New Feature    → Analyst → Architect → Devs         ║
║    ├─ Bug Fix        → Dev (direct) → QA → Done          ║
║    ├─ Security       → Security → Fix → Review           ║
║    ├─ Performance     → Performance → Optimize → Verify    ║
║    ├─ Testing        → QA Tester → Develop → Verify      ║
║    ├─ Deployment      → DevOps → Staged Rollout → Done    ║
║    └─ Research       → Specialist → Synthesize → Done    ║
║                                                            ║
║  ESCALATE: /escalate --reason "X" --priority HIGH         ║
║  HANDOFF: /handoff agent1 → agent2 --files "x.md,y.md"       ║
║  SYNC:    /sync-point "name"                               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Index of Agent Files

| Agent | File Path | Key Responsibilities |
|-------|-----------|-------------------|
| Tech Lead | `.ai-factory/agents/tech-lead.md` | Orchestration, V&V, routing |
| Analyst | `.ai-factory/agents/analyst.md` | Requirements, user stories |
| Architect | `.ai-factory/agents/architect.md` | Architecture, ADRs, tech stack |
| Frontend Dev | `.ai-factory/agents/frontend-dev.md` | UI, components, responsive |
| Backend Dev | `.ai-factory/agents/backend-dev.md` | APIs, services, DB |
| Security | `.ai-factory/agents/security.md` | Audits, vulnerabilities |
| Performance | `.ai-factory/agents/performance.md` | Optimization, caching |
| QA Tester | `.ai-factory/agents/qa-tester.md` | Testing, quality gates |
| DevOps | `.ai-factory/agents/devops.md` | CI/CD, deployment |
| Product Owner | `.ai-factory/agents/product-owner.md` | Prioritization, stakeholders |
| UI/UX Pro Max | `.ai-factory/agents/ui-ux-pro-max-agent.md` | Visual design, layout |
| Data Analyst | `.ai-factory/agents/data-analyst.md` | Data modeling, analytics |
| Financial Analyst | `.ai-factory/agents/financial-analyst.md` | Costs, ROI |
| Legal Counsel | `.ai-factory/agents/legal-counsel.md` | Compliance, contracts |
| Recruiter | `.ai-factory/agents/recruiter.md` | Talent acquisition |
| Chief of Staff | `.ai-factory/agents/chief-of-staff.md` | Executive coordination |
| Customer Support | `.ai-factory/agents/customer-support-lead.md` | Support workflows |
| Product Marketer | `.ai-factory/agents/product-marketer.md` | Go-to-market |
| Venture Capitalist | `.ai-factory/agents/venture-capitalist.md` | Investment analysis |
| WhatsApp Agent | `.ai-factory/agents/whatsapp-agent.md` | WhatsApp integration |
| Executor Agent | `.ai-factory/agents/executor-agent.md` | Task automation |