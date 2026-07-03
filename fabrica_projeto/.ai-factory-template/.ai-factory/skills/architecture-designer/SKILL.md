# architecture-designer

## Purpose

Design de arquitetura de software para AI Factory. Esta skill cria arquitetura de sistemas escaláveis, define padrões de design, seleciona tecnologias, documenta decisões arquiteturais (ADRs), e estabelece princípios de desenvolvimento. Especializada em arquitetura limpa, microsserviços, event-driven, e sistemas distribuídos.

## When to Use This Skill

This skill should be used when:
- User needs to design system architecture from requirements
- User wants to create Architecture Decision Records (ADRs)
- User needs to select appropriate technologies and frameworks
- User wants to define system boundaries and component interactions
- User needs to design for scalability, reliability, and maintainability
- User wants to establish architectural principles and patterns
- User needs to evaluate trade-offs between architecture options

## Core Capabilities

1. **System Design** - Create high-level and low-level architecture
2. **Technology Selection** - Evaluate and choose appropriate tech stack
3. **Pattern Application** - Apply proven architectural patterns
4. **Trade-off Analysis** - Evaluate options with clear criteria
5. **ADR Documentation** - Record architectural decisions with context
6. **Quality Attributes** - Design for performance, security, scalability
7. **Integration Design** - Define API contracts and service boundaries

## Architecture Design Process

### Phase 1: Understand Context
```
1. Business Context
   - What problem are we solving?
   - Who are the users?
   - What are the business goals?
   - What are the constraints (time, budget, compliance)?

2. Technical Context
   - Current systems and integrations
   - Existing technology stack
   - Technical debt and limitations
   - Team skills and capabilities

3. Requirements Analysis
   - Functional requirements (features)
   - Non-functional requirements (quality attributes)
   - Constraints and assumptions
   - Risks and mitigations
```

### Phase 2: Define Architecture Vision
```
1. Architecture Principles
   - Guiding principles for all decisions
   - Examples: "API-first", "Mobile-first", "Cloud-native"

2. Quality Attribute Scenarios
   - Performance: Response times, throughput
   - Scalability: User growth, data volume
   - Availability: Uptime SLA, fault tolerance
   - Security: Authentication, authorization, compliance
   - Maintainability: Code quality, documentation, testing

3. Architecture Styles
   - Monolithic vs Microservices
   - Event-driven vs Request-response
   - Serverless vs Container-based
   - SQL vs NoSQL
```

### Phase 3: Create Architecture Design
```
1. System Context Diagram
   - System boundaries
   - External systems and users
   - Data flows

2. Container Diagram
   - Applications, databases, services
   - Technology choices
   - Communication protocols

3. Component Diagram
   - Major components within each container
   - Responsibilities and interfaces
   - Dependencies

4. Data Architecture
   - Data model (entities and relationships)
   - Data flow (creation, storage, consumption)
   - Data governance (ownership, quality, retention)
```

### Phase 4: Document Decisions
```
1. Architecture Decision Records (ADRs)
   - Context and problem statement
   - Options considered
   - Decision and rationale
   - Consequences (positive and negative)

2. Architecture Documentation
   - Architecture overview
   - Design principles
   - Technology stack
   - Integration patterns
   - Deployment architecture
```

## Architecture Decision Record (ADR) Template

```markdown
# ADR-{number}: {Title}

## Status
{Proposed | Accepted | Deprecated | Superseded}

## Context
{Describe the context and problem statement. What forces are at play?}

## Decision
{Describe the decision. What did we decide to do?}

## Alternatives Considered

### Option 1: {Name}
**Description:** {Brief description}
**Pros:**
- {advantage 1}
- {advantage 2}
**Cons:**
- {disadvantage 1}
- {disadvantage 2}

### Option 2: {Name}
**Description:** {Brief description}
**Pros:**
- {advantage 1}
- {advantage 2}
**Cons:**
- {disadvantage 1}
- {disadvantage 2}

### Option 3: {Name}
**Description:** {Brief description}
**Pros:**
- {advantage 1}
- {advantage 2}
**Cons:**
- {disadvantage 1}
- {disadvantage 2}

## Decision Drivers
{What criteria were most important in making this decision?}
1. {driver 1}
2. {driver 2}
3. {driver 3}

## Consequences

### Positive
- {positive outcome 1}
- {positive outcome 2}

### Negative
- {negative outcome 1}
- {negative outcome 2}

### Risks
- {risk 1} - Mitigation: {mitigation strategy}
- {risk 2} - Mitigation: {mitigation strategy}

## Compliance
{How will we ensure this decision is followed?}
- Code reviews check for compliance
- Architecture review board approval required
- Automated linting rules

## References
{Links to documentation, RFCs, or other ADRs}

## Date
{YYYY-MM-DD}

## Authors
- {name 1}
- {name 2}
```

### Example ADR

```markdown
# ADR-001: Escolha de Banco de Dados

## Status
Aceito

## Contexto
Precisamos escolher um banco de dados para o Polymarketing que:
- Armazene dados estruturados de campanhas de marketing
- Suporte consultas analíticas complexas
- Escale para milhões de registros
- Tenha consistência forte para dados financeiros
- Equipe já tenha experiência

## Decisão
Usar PostgreSQL como banco de dados principal

## Alternativas Consideradas

### Option 1: PostgreSQL
**Description:** Banco de dados relacional open-source
**Pros:**
- ACID compliance para consistência
- Suporte a JSON para flexibilidade
- Excelente para consultas analíticas
- Grande comunidade e ecosystem
- Equipe já tem experiência
**Cons:**
- Escalabilidade horizontal mais complexa
- Performance em writes massivos

### Option 2: MongoDB
**Description:** Banco de dados NoSQL document-based
**Pros:**
- Escalabilidade horizontal fácil
- Schema flexível
- Alta performance em writes
**Cons:**
- Consistência eventual (por padrão)
- Consultas analíticas limitadas
- Menor maturidade em transações

### Option 3: MySQL
**Description:** Banco de dados relacional tradicional
**Pros:**
- Amplamente adotado
- Bom para cargas de trabalho simples
- Fácil de operar
**Cons:**
- Recursos analíticos limitados
- Menos recursos avançados que PostgreSQL
- Comunidade menor para data-intensive apps

## Decision Drivers
1. Consistência de dados é crítica para relatórios financeiros
2. Necessidade de consultas analíticas complexas
3. Experiência existente da equipe
4. Maturidade e estabilidade da tecnologia

## Consequences

### Positive
- Dados consistentes e confiáveis
- Consultas analíticas poderosas
- Curva de aprendizado mínima
- Excelente suporte a transações

### Negative
- Escalabilidade horizontal requer planejamento
- Write throughput limitado por nó
- Operações de schema changes podem ser lentas

### Risks
- Crescimento além de um único nó - Mitigation: Planejar sharding desde o design
- Locking em tabelas quentes - Mitigation: Usar row-level locking e otimizar queries

## Compliance
- Todos os novos modelos de dados devem ser revisados
- Queries complexas devem passar por code review
- Monitoramento de performance configurado

## References
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- ADR-002: Estratégia de Cache com Redis

## Date
2026-07-02

## Authors
- Architect
```

## Architectural Patterns

### Layered Architecture (N-Tier)
```
┌─────────────────┐
│  Presentation   │  ← UI, API Gateway
├─────────────────┤
│    Business     │  ← Services, Domain Logic
├─────────────────┤
│     Data        │  ← Repositories, Data Access
└─────────────────┘

Use when:
✓ Traditional enterprise applications
✓ Clear separation of concerns needed
✓ Team organized by layers

Avoid when:
✗ High scalability requirements
✗ Complex domain logic
✗ Need for independent deployment
```

### Clean Architecture (Hexagonal)
```
        ┌──────────────────┐
        │  Interfaces      │
        │  (Controllers,   │
        │   Presenters)    │
        └────────┬─────────┘
                 │
        ┌────────▼─────────┐
        │  Use Cases       │
        │  (Application    │
        │   Logic)         │
        └────────┬─────────┘
                 │
        ┌────────▼─────────┐
        │  Domain          │
        │  (Entities,      │
        │   Business Rules)│
        └──────────────────┘
        Dependencies point inward

Use when:
✓ Complex business logic
✓ Long-term maintainability priority
✓ Testability is critical

Avoid when:
✗ Simple CRUD applications
✗ Time-constrained projects
✗ Team unfamiliar with pattern
```

### Microservices Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Service A  │     │  Service B  │     │  Service C  │
│  (Users)    │     │ (Campaigns) │     │ (Analytics) │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                  ┌────────▼────────┐
                  │   API Gateway   │
                  └────────┬────────┘
                           │
                  ┌────────▼────────┐
                  │    Clients      │
                  └─────────────────┘

Use when:
✓ Independent scaling needed
✓ Different teams per service
✓ Different technology needs
✓ High availability required

Avoid when:
✗ Small team (<10 developers)
✗ Simple domain
✗ Limited DevOps maturity
✗ Tight coupling unavoidable
```

### Event-Driven Architecture
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Service  │────▶│  Event   │◀────│ Service  │
│   A      │     │  Bus     │     │   B      │
└──────────┘     └────┬─────┘     └──────────┘
                      │
              ┌───────┴───────┐
              │               │
        ┌─────▼─────┐   ┌─────▼─────┐
        │ Service C │   │ Service D │
        └───────────┘   └───────────┘

Use when:
✓ Real-time processing needed
✓ Loose coupling desired
✓ Asynchronous workflows
✓ High scalability required

Avoid when:
✗ Strong consistency required
✗ Simple request-response sufficient
✗ Team unfamiliar with event sourcing
✗ Debugging complexity concern
```

## Technology Selection Framework

### Evaluation Criteria

| Criteria | Weight | Description |
|----------|--------|-------------|
| **Functionality** | 30% | Does it meet requirements? |
| **Performance** | 20% | Speed, throughput, latency |
| **Scalability** | 15% | Can it grow with demand? |
| **Reliability** | 15% | Uptime, fault tolerance |
| **Security** | 10% | Built-in security features |
| **Cost** | 5% | Licensing, operational costs |
| **Community** | 5% | Support, documentation, talent |

### Technology Radar

```
Adopt (use by default):
✓ React, TypeScript, Node.js, PostgreSQL, Redis

Trial (use with caution):
⚠ Deno, SvelteKit, PlanetScale

Assess (evaluate for future):
🔍 Bun, HTMX, Cloudflare Workers

Hold (avoid):
❌ jQuery, PHP, MongoDB (for this project)
```

## Quality Attribute Scenarios

### Performance Scenario Template
```
Source: User
Stimulus: Request to load dashboard
Environment: Normal operation (95% of requests)
Artifact: Dashboard page
Response: Page rendered and interactive
Response Measure: < 2 seconds (p95)
```

### Availability Scenario Template
```
Source: Infrastructure failure
Stimulus: Database server crashes
Environment: Production, peak hours
Artifact: API service
Response: Automatic failover to replica
Response Measure: < 30 seconds downtime, zero data loss
```

### Security Scenario Template
```
Source: External attacker
Stimulus: SQL injection attempt
Environment: Public API endpoint
Artifact: User authentication endpoint
Response: Request rejected, logged, and alerted
Response Measure: Zero successful injections, alert within 1 minute
```

## Workflow

### Architecture Design Workflow
1. **Requirements Review** (2-4 hours)
   - Review functional requirements
   - Analyze non-functional requirements
   - Identify constraints and assumptions

2. **Context Definition** (2-3 hours)
   - Define system boundaries
   - Identify external systems
   - Map user roles and interactions

3. **Pattern Selection** (2-4 hours)
   - Evaluate architectural patterns
   - Select primary pattern
   - Define supporting patterns

4. **Technology Evaluation** (4-8 hours)
   - Identify technology options
   - Apply evaluation criteria
   - Document decision rationale

5. **Design Creation** (8-16 hours)
   - Create system context diagram
   - Design container architecture
   - Define component structure
   - Design data architecture

6. **ADR Documentation** (4-6 hours)
   - Document key decisions
   - Record alternatives considered
   - Define consequences

7. **Review and Validation** (2-4 hours)
   - Technical team review
   - Stakeholder alignment
   - Risk assessment

## Quality Standards

**Architecture Documentation:**
- Clear diagrams (C4 model or similar)
- All major decisions documented in ADRs
- Technology choices justified
- Quality attributes defined with metrics
- Integration points specified
- Deployment architecture documented

**Design Quality:**
- Follows established principles
- Addresses all requirements
- Considers trade-offs explicitly
- Allows for evolution
- Testable and verifiable
- Aligned with team capabilities

**ADR Quality:**
- Context clearly explained
- Multiple alternatives considered
- Decision rationale documented
- Consequences (positive and negative) listed
- Compliance mechanism defined

## Error Handling

### Insufficient Requirements
If requirements are incomplete:
```
⚠️  Cannot proceed with architecture design

Missing critical information:
□ Performance requirements (response time, throughput)
□ Scalability requirements (user growth, data volume)
□ Security requirements (compliance, authentication)
□ Availability requirements (uptime SLA)

Architecture decisions require clear quality attributes.

Would you like to:
1. Create placeholder assumptions (documented as risks)
2. Schedule requirements workshop
3. Proceed with minimal architecture and iterate
```

### Technology Constraints
If technology choices are restricted:
```
⚠️  Technology constraints detected

Mandated technologies:
- Frontend: React (corporate standard)
- Database: SQL Server (existing license)

Impact on architecture:
✓ Simplifies hiring and training
✗ Limits some architectural options
✗ May increase infrastructure costs

Architecture will be designed within these constraints.

Recommended mitigations:
- Use abstraction layers to reduce vendor lock-in
- Document constraint impact in ADRs
- Plan for future technology migration if needed
```

### Architecture Conflicts
If requirements conflict:
```
⚠️  Conflicting quality requirements detected:

REQ-PERF: "Response time < 100ms"
REQ-SEC: "All requests must be encrypted with 4096-bit keys"
REQ-COST: "Infrastructure cost < $500/month"

Conflict: High security + low latency + low cost is not achievable

Trade-off options:
1. Relax performance to <500ms (acceptable?)
2. Reduce encryption to 2048-bit (security impact?)
3. Increase budget to $2000/month (approved?)

Stakeholder decision required before proceeding.
```

## References

- **C4 Model**: https://c4model.com/
- **Architecture Decision Records**: https://adr.github.io/
- **Clean Architecture**: Robert C. Martin
- **Building Microservices**: Sam Newman
- **Designing Data-Intensive Applications**: Martin Kleppmann

## Examples

### System Context Diagram (Mermaid)
```mermaid
C4Context
  title System Context Diagram for Polymarketing

  Person_(marketing_manager, "Marketing Manager", "Creates and manages campaigns")
  Person_(analyst, "Data Analyst", "Analyzes campaign performance")

  System_Boundary(polymarketing, "Polymarketing Platform") {
    System(web_app, "Web Application", "React SPA for campaign management")
    System(api, "API Service", "Express backend for business logic")
    SystemDb(db, "PostgreSQL", "Campaign and user data")
    SystemDb(cache, "Redis", "Session and cache storage")
  }

  System_Ext(google_ads, "Google Ads API", "Campaign data and management")
  System_Ext(facebook_ads, "Facebook Ads API", "Campaign data and management")
  System_Ext(email_service, "Email Service", "SendGrid for notifications")

  Rel(marketing_manager, web_app, "Uses", "HTTPS")
  Rel(analyst, web_app, "Analyzes data", "HTTPS")
  Rel(web_app, api, "Calls", "REST API")
  Rel(api, db, "Reads/Writes", "SQL")
  Rel(api, cache, "Reads/Writes", "Redis Protocol")
  Rel(api, google_ads, "Syncs data", "HTTPS")
  Rel(api, facebook_ads, "Syncs data", "HTTPS")
  Rel(api, email_service, "Sends emails", "HTTPS")
```

### Technology Stack Decision
```markdown
# Technology Stack - Polymarketing

## Frontend
- **Framework:** React 18+ (component-based, large ecosystem)
- **Language:** TypeScript (type safety, better DX)
- **Build Tool:** Vite (fast builds, HMR)
- **State Management:** Zustand (simple, lightweight)
- **Routing:** React Router (standard, well-maintained)
- **Styling:** Tailwind CSS (utility-first, fast development)

## Backend
- **Runtime:** Node.js 18+ (JavaScript everywhere, async I/O)
- **Framework:** Express (mature, flexible, large ecosystem)
- **Language:** TypeScript (type safety, shared types with frontend)
- **Validation:** Zod (runtime type validation, TypeScript inference)
- **Testing:** Vitest (fast, Jest-compatible)

## Database
- **Primary:** PostgreSQL 15 (relational, ACID, JSON support)
- **Cache:** Redis 7 (sessions, caching, pub/sub)
- **ORM:** Prisma (type-safe, auto-completion, migrations)

## Infrastructure
- **Containerization:** Docker (consistent environments)
- **Orchestration:** Docker Compose (local development)
- **CI/CD:** GitHub Actions (integrated with repository)
- **Monitoring:** Prometheus + Grafana (metrics, alerting)

## Rationale
- Full-stack TypeScript for shared types and better DX
- PostgreSQL for data consistency and analytics
- Redis for performance and session management
- Docker for reproducible environments
- GitHub Actions for seamless CI/CD