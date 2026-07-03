# requirements-engineer

## Purpose

Engenharia de requisitos para AI Factory. Esta skill transforma demandas vagas em requisitos estruturados, histórias de usuário, critérios de aceitação e matrizes de rastreabilidade. Especializada em elicitar requisitos funcionais, não-funcionais, restrições técnicas e de negócio.

## When to Use This Skill

This skill should be used when:
- User needs to transform vague ideas into structured requirements
- User wants to create user stories with clear acceptance criteria
- User needs to prioritize features using MoSCoW or similar frameworks
- User wants to create requirement traceability matrices
- User needs to document business rules and constraints
- User wants to validate requirements completeness before architecture phase
- User needs to create MVP scope definitions

## Core Capabilities

1. **Requirements Elicitation** - Extract clear requirements from ambiguous inputs
2. **User Story Creation** - Write stories in "As a... I want... So that..." format
3. **Acceptance Criteria** - Define testable criteria using Given-When-Then
4. **Prioritization** - Apply MoSCoW, Kano, or Value vs Effort frameworks
5. **NFR Definition** - Specify performance, security, scalability requirements
6. **Traceability Matrix** - Link requirements to features and test cases
7. **MVP Scoping** - Define minimum viable product boundaries

## Requirements Elicitation Framework

### Input Sources
- Stakeholder interviews
- User feedback and complaints
- Competitive analysis
- Market research
- Technical constraints
- Business goals and OKRs
- Regulatory requirements (LGPD, GDPR)

### Elicitation Techniques

#### 1. 5 Whys
Ask "why" five times to reach root cause:
```
Problem: Users abandon signup flow
Why? Form is too long
Why? We ask for too much information upfront
Why? We think we need it for personalization
Why? We assume more data = better personalization
Why? We haven't tested minimal signup vs detailed signup

Root requirement: Implement progressive profiling
```

#### 2. User Journey Mapping
Map complete user experience to identify pain points:
```
Stage: Awareness → Consideration → Signup → Onboarding → Activation → Retention
Touchpoints: Ads → Landing page → Form → Welcome email → First use → Regular use
Pain points: Slow load → Confusing pricing → Long form → No guidance → Feature overwhelm → Forgotten password
Requirements: Optimize speed → Simplify pricing → Progressive form → Onboarding tour → Feature tooltips → Passwordless login
```

#### 3. Jobs to Be Done
Focus on user goals, not features:
```
"When I [situation], I want to [motivation], so I can [expected outcome]"

Example:
"When I'm managing multiple marketing campaigns, I want to see all metrics in one dashboard, so I can quickly identify which campaigns need attention."

Requirements:
- Unified dashboard
- Multi-campaign support
- Real-time metrics
- Anomaly detection
- Quick actions
```

## User Story Template

### Standard Format
```markdown
# US-{number}: {Title}

## Story
As a {user role}
I want to {action}
So that {benefit}

## Acceptance Criteria

### Scenario 1: {Happy path name}
Given {precondition}
When {action}
Then {expected result}

### Scenario 2: {Alternative path}
Given {precondition}
When {action}
Then {expected result}

### Scenario 3: {Error path}
Given {precondition}
When {action}
Then {error handling}

## Business Rules
- {rule 1}
- {rule 2}

## Non-Functional Requirements
- **Performance:** {metric}
- **Security:** {requirement}
- **Accessibility:** {WCAG level}

## Dependencies
- {related US or technical dependency}

## Estimates
- **Story Points:** {1, 2, 3, 5, 8, 13}
- **Priority:** {Must have | Should have | Could have | Won't have}
```

### Example User Story
```markdown
# US-042: Dashboard de Métricas em Tempo Real

## Story
As a marketing manager
I want to see campaign metrics updated in real-time
So that I can make quick decisions to optimize ad spend

## Acceptance Criteria

### Scenario 1: Dashboard loads with current data
Given I am on the dashboard page
When the page loads
Then I see metrics from the last 24 hours within 2 seconds

### Scenario 2: Metrics auto-refresh
Given I am viewing the dashboard
When 60 seconds pass
Then metrics refresh automatically without page reload

### Scenario 3: Manual refresh
Given I am viewing the dashboard
When I click the refresh button
Then metrics update immediately and show "Updated just now"

### Scenario 4: Connection lost
Given I am viewing the dashboard
When internet connection is lost
Then I see a warning banner and last cached data with timestamp

## Business Rules
- Metrics must be accurate to within 5 minutes
- Historical data retained for 90 days
- Role-based access to campaign data

## Non-Functional Requirements
- **Performance:** p95 load time < 2 seconds
- **Availability:** 99.9% uptime
- **Security:** JWT authentication required
- **Accessibility:** WCAG 2.1 AA compliant

## Dependencies
- US-038: Authentication system
- US-040: Campaign data API

## Estimates
- **Story Points:** 8
- **Priority:** Must have
```

## Prioritization Frameworks

### MoSCoW Method
- **Must have** (40-60% of scope) - Critical for MVP
- **Should have** (20-40%) - Important but not vital
- **Could have** (10-20%) - Nice to have
- **Won't have** (0-10%) - Explicitly deferred

### Value vs Effort Matrix
```
High Value, Low Effort: Do first (Quick Wins)
High Value, High Effort: Plan carefully (Major Projects)
Low Value, Low Effort: Fill-ins (Thankless Tasks)
Low Value, High Effort: Avoid (Money Pit)
```

### Kano Model
- **Basic Needs** (Must-be) - Expected features
- **Performance Needs** (One-dimensional) - More is better
- **Excitement Needs** (Delighters) - Unexpected value

## Non-Functional Requirements Checklist

### Performance
- [ ] Response time targets (p50, p95, p99)
- [ ] Throughput requirements (requests/second)
- [ ] Concurrent users support
- [ ] Page load time (Core Web Vitals)
- [ ] Database query performance
- [ ] Cache hit rates

### Security
- [ ] Authentication mechanism
- [ ] Authorization model (RBAC, ABAC)
- [ ] Data encryption (at rest, in transit)
- [ ] Input validation and sanitization
- [ ] Rate limiting and throttling
- [ ] Audit logging requirements
- [ ] Compliance (LGPD, GDPR, PCI-DSS)

### Scalability
- [ ] Horizontal scaling strategy
- [ ] Database sharding/partitioning
- [ ] Load balancing requirements
- [ ] Auto-scaling triggers
- [ ] Maximum data volume
- [ ] User growth projections

### Reliability
- [ ] Availability SLA (e.g., 99.9%)
- [ ] Recovery Time Objective (RTO)
- [ ] Recovery Point Objective (RPO)
- [ ] Backup frequency and retention
- [ ] Disaster recovery plan
- [ ] Monitoring and alerting

### Maintainability
- [ ] Code coverage requirements (>80%)
- [ ] Documentation standards
- [ ] CI/CD pipeline requirements
- [ ] Deployment frequency target
- [ ] Rollback capabilities
- [ ] Technical debt limits

## Traceability Matrix

| ID | Requirement | User Story | Feature | Test Case | Status |
|----|-------------|------------|---------|-----------|--------|
| REQ-001 | Real-time metrics | US-042 | Dashboard | TC-042-01 | Implemented |
| REQ-002 | Auto-refresh | US-042 | Dashboard | TC-042-02 | In Progress |
| REQ-003 | Role-based access | US-038 | Auth | TC-038-01 | Implemented |

## MVP Scoping Framework

### MVP Definition
```
MVP = Smallest product that delivers customer value + validates business hypothesis

Not MVP:
❌ Half-baked product with poor quality
❌ Product with random features
❌ Prototype without value delivery

MVP:
✅ Complete solution to one core problem
✅ High quality on essential features
✅ Validates key business assumptions
✅ Provides actionable learnings
```

### MVP Scoping Process
1. **Identify Core Problem** - What pain point are we solving?
2. **Define Success Metrics** - How will we measure validation?
3. **List All Features** - Brainstorm complete solution
4. **Prioritize by Value** - Which features directly validate hypothesis?
5. **Estimate Effort** - Time and complexity for each feature
6. **Select MVP Set** - Minimum features for validation
7. **Define Post-MVP** - Features for subsequent releases

### Example MVP Scope
```
Product: Marketing Analytics Dashboard

Core Hypothesis: Marketing managers need unified metrics to optimize campaigns faster

MVP Features (6 weeks):
✅ Single dashboard with 5 key metrics
✅ Data from Google Ads and Facebook Ads
✅ Daily data refresh
✅ Export to CSV
✅ Basic authentication

Post-MVP Phase 2 (4 weeks):
⏳ Real-time data refresh
⏳ Additional ad platforms (LinkedIn, TikTok)
⏳ Custom date ranges
⏳ Email reports

Post-MVP Phase 3 (4 weeks):
⏳ Anomaly detection
⏳ Campaign recommendations
⏳ Team collaboration
⏳ Mobile app
```

## Workflow

### Requirements Gathering Workflow
1. **Discovery** (2-4 hours)
   - Review project brief
   - Identify stakeholders
   - Schedule interviews
   - Research competitors

2. **Elicitation** (4-8 hours)
   - Conduct stakeholder interviews
   - Map user journeys
   - Identify pain points
   - Document business rules

3. **Documentation** (4-6 hours)
   - Write user stories
   - Define acceptance criteria
   - Specify NFRs
   - Create traceability matrix

4. **Prioritization** (2-3 hours)
   - Apply MoSCoW framework
   - Create Value vs Effort matrix
   - Define MVP scope
   - Get stakeholder sign-off

5. **Validation** (1-2 hours)
   - Review with technical team
   - Check feasibility
   - Identify dependencies
   - Final adjustments

## Quality Standards

**User Story Requirements:**
- Clear user role defined
- Specific action described
- Measurable benefit stated
- Acceptance criteria are testable
- Follows Given-When-Then format
- No technical implementation details
- Independent and negotiable
- Valuable to user or business
- Estimable by development team
- Small enough for one sprint
- Testable with clear criteria

**NFR Requirements:**
- Quantifiable metrics (not "fast" but "<200ms")
- Realistic and achievable
- Aligned with business goals
- Testable with defined methods
- Documented in standard format

**Prioritization Requirements:**
- All stakeholders aligned
- Clear rationale for priority
- Dependencies identified
- MVP scope is achievable in timeline
- Post-MVP roadmap defined

## Error Handling

### Ambiguous Requirements
If requirements are unclear:
```
⚠️  Ambiguous requirement detected: "Make it user-friendly"

Issues:
- Not measurable
- No clear acceptance criteria
- Subjective interpretation

Requested action:
Please provide specific examples or metrics:
- What does "user-friendly" mean for this feature?
- What user tasks should be completed in under X seconds?
- What is the target error rate for users?
```

### Conflicting Requirements
If requirements conflict:
```
⚠️  Conflicting requirements identified:

REQ-001: "All data must be stored locally for compliance"
REQ-015: "Data must be accessible from anywhere globally"

Conflict: Local storage vs global access

Resolution options:
1. Hybrid approach: Local primary storage with secure global sync
2. Clarify compliance requirements (may allow encrypted cloud)
3. Prioritize one requirement over the other

Stakeholder consultation required before proceeding.
```

### Incomplete Requirements
If critical information is missing:
```
⚠️  Incomplete requirements for US-{number}

Missing:
□ User role definition
□ Acceptance criteria
□ Performance metrics
□ Security requirements
□ Business rules

Cannot proceed to architecture phase until complete.

Would you like to:
1. Schedule requirements workshop
2. Interview stakeholders
3. Create placeholder and flag for review
```

## References

- **INVEST in Good Stories**: https://agilealliance.org/glossary/invest/
- **User Story Mapping**: Jeff Patton's book
- **Jobs to Be Done**: Clayton Christensen framework
- **MoSCoW Method**: Dynamic Systems Development Method
- **Kano Model**: Noriaki Kano's theory

## Examples

### Complete Requirements Package
```markdown
# Requirements Package: Campaign Management Module

## Epic: Campaign Management
**Goal:** Enable marketers to create, manage, and optimize ad campaigns across multiple platforms

## User Stories

### US-001: Create New Campaign
**Priority:** Must have
**Story Points:** 5

As a marketing manager
I want to create a new ad campaign
So that I can start promoting my products

**Acceptance Criteria:**
- Campaign name, budget, start/end date required
- Platform selection (Google Ads, Facebook Ads)
- Campaign objective selection
- Draft saving capability

### US-002: Edit Campaign
**Priority:** Must have
**Story Points:** 3

As a marketing manager
I want to edit campaign details
So that I can adjust strategy based on performance

**Acceptance Criteria:**
- All fields editable except campaign ID
- Changes logged with timestamp and user
- Active campaigns show change confirmation

### US-003: Pause/Resume Campaign
**Priority:** Must have
**Story Points:** 2

As a marketing manager
I want to pause and resume campaigns
So that I can control ad spend in real-time

**Acceptance Criteria:**
- One-click pause/resume
- Status updates within 5 minutes
- Notification sent to team members

## Non-Functional Requirements

### Performance
- Campaign list loads in <2 seconds
- Campaign actions complete in <3 seconds
- Supports 1000+ campaigns per account

### Security
- Role-based access (Admin, Manager, Viewer)
- All changes audited
- API rate limiting: 100 requests/minute

### Availability
- 99.9% uptime during business hours
- Automatic retry for failed API calls
- Graceful degradation if platform API down

## MVP Scope
**Phase 1 (4 weeks):** US-001, US-002, US-003 + Google Ads only
**Phase 2 (2 weeks):** Facebook Ads integration
**Phase 3 (2 weeks):** Advanced features (A/B testing, automation)
```