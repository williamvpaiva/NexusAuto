# NexusAuto Skill Browser & Invocation Guide

Complete catalog of all 13 skills available in NexusAuto, with invocation commands, use cases, and cross-references.

---

## Table of Contents

1. [Skill Overview](#1-skill-overview)
2. [NexusAuto Skills (10)](#2-nexusauto-skills)
3. [CowAgent Skills (3)](#3-cowagent-skills)
4. [Skill Invocation Commands](#4-skill-invocation-commands)
5. [Skill Selection Guide](#5-skill-selection-guide)
6. [Cross-Skill Workflows](#6-cross-skill-workflows)

---

## 1. Skill Overview

### Total: 13 Skills

| Location | Count | Skills |
|----------|-------|--------|
| `skills/` | 10 | lider, frontend-design, code-reviewer, debugger, testing-qa, tavily-web, web-artifacts-builder, theme-factory, doc-coauthoring, brand-guidelines |
| `cowagent/skills/` | 3 | skill-creator, knowledge-wiki, image-generation |

### Skill Format

All skills follow this structure:

```markdown
---
name: skill-name
description: "What this skill does"
---

# Skill Content
[Detailed guidance, patterns, examples]
```

---

## 2. NexusAuto Skills

### 2.1 lider

**Path:** `skills/lider/SKILL.md`

**Description:** Tech Lead / Orchestrator invocation command for NexusAuto AI Factory

**Trigger:** `/lider`

**Purpose:**
- Invoke the Tech Lead role
- Orchestrate sub-agents
- Manage workflow
- Consolidate memory

**Use When:**
- Starting a new feature
- Need task distribution
- Want to invoke AI Factory orchestration
- Need V&V (Verify & Validate) coordination

**Invocation:**
```
/lider
```
or
```
"Use the lider skill from skills/lider/SKILL.md"
```

**Details:**
- Reads `TECH-LEAD.md` for guidelines
- Uses Spec-Kit for new features
- Delegates to sub-agents via `cowagent-wrapper.js`
- Manages memory via `memory-manager.js`

---

### 2.2 frontend-design

**Path:** `skills/frontend-design/SKILL.md`

**Description:** Principles and guidelines for creating distinctive frontend interfaces with deliberate aesthetic choices

**Trigger:** Automatically when creating new UIs or redesigning existing ones

**Purpose:**
- Visual identity creation
- Typography pairing
- Layout decisions
- Motion/animation design
- Avoiding generic templates

**Use When:**
- Creating new UI components
- Redesigning existing interfaces
- Need distinctive visual identity
- Choosing color palette
- Typography decisions

**Invocation:**
```
"Use the frontend-design skill from skills/frontend-design/SKILL.md"
```

**Key Principles:**
1. Ground design in subject
2. Typography carries personality
3. Structure encodes information
4. Leverage motion deliberately
5. Match complexity to vision

**Related Skills:** `theme-factory`, `brand-guidelines`, `code-reviewer`

---

### 2.3 code-reviewer

**Path:** `skills/code-reviewer/SKILL.md`

**Description:** Elite code review with AI-powered analysis, security scanning, and quality assessment

**Trigger:** When reviewing code changes, PRs, or conducting audits

**Purpose:**
- Security vulnerability detection
- Code quality analysis
- Performance issue identification
- Best practices validation
- AI-powered review

**Use When:**
- Before merging PRs
- Code quality audits
- Security reviews
- Finding bugs before QA
- Technical debt assessment

**Invocation:**
```
"Use the code-reviewer skill from skills/code-reviewer/SKILL.md"
```

**Coverage:**
- OWASP security checks
- Performance anti-patterns
- Code complexity analysis
- Dependency scanning

---

### 2.4 debugger

**Path:** `skills/debugger/SKILL.md`

**Description:** Systematic debugging strategies for errors, test failures, and unexpected behavior

**Trigger:** When encountering bugs, errors, or unexpected behavior

**Purpose:**
- Root cause identification
- Systematic problem-solving
- Error pattern recognition
- Fix verification
- Prevention strategies

**Use When:**
- Application crashes
- Test failures
- Unexpected output
- Performance degradation
- Integration failures

**Invocation:**
```
"Use the debugger skill from skills/debugger/SKILL.md"
```

**Strategy:**
1. Reproduce the issue
2. Gather context
3. Form hypothesis
4. Test systematically
5. Implement fix
6. Verify and prevent

---

### 2.5 testing-qa

**Path:** `skills/testing-qa/SKILL.md`

**Description:** Testing guidance and QA workflows for comprehensive test coverage

**Trigger:** When planning tests, writing test suites, or running QA

**Purpose:**
- Test strategy development
- Test coverage optimization
- Automation patterns
- Quality gates
- Test data management

**Use When:**
- Creating test suites
- Planning QA strategy
- Writing unit tests
- Writing integration tests
- Setting up CI/CD tests

**Invocation:**
```
"Use the testing-qa skill from skills/testing-qa/SKILL.md"
```

**Related Skills:** `code-reviewer`, `debugger`

---

### 2.6 tavily-web

**Path:** `skills/tavily-web/SKILL.md`

**Description:** Web search and content extraction integration via Tavily API

**Trigger:** When needing current web information or website content extraction

**Purpose:**
- Web search
- Content extraction
- Research support
- Fact verification
- Market intelligence

**Use When:**
- Research tasks
- Fact-checking
- Market analysis
- Competitor research
- Technical documentation from web

**Invocation:**
```
"Use the tavily-web skill from skills/tavily-web/SKILL.md"
```

**Capabilities:**
- Real-time web search
- Content scraping
- PDF/content extraction
- Multi-source aggregation

---

### 2.7 web-artifacts-builder

**Path:** `skills/web-artifacts-builder/SKILL.md`

**Description:** Build frontend artifacts like prototypes, demos, and interactive UI components

**Trigger:** When building web prototypes, demos, or interactive UI

**Purpose:**
- Rapid prototyping
- Interactive demos
- UI component building
- Demo environments
- Proof of concepts

**Use When:**
- Building quick prototypes
- Creating demo environments
- Interactive component development
- Proof of concept implementation

**Invocation:**
```
"Use the web-artifacts-builder skill from skills/web-artifacts-builder/SKILL.md"
```

---

### 2.8 theme-factory

**Path:** `skills/theme-factory/SKILL.md`

**Description:** Theme creation system for consistent visual design across projects

**Trigger:** When creating or customizing themes, color systems, design tokens

**Purpose:**
- Theme generation
- Design token systems
- Color palette creation
- Typography themes
- Consistent styling

**Use When:**
- Creating new theme
- Customizing existing theme
- Setting up design system
- Generating color palettes
- Typography selection

**Invocation:**
```
"Use the theme-factory skill from skills/theme-factory/SKILL.md"
```

**Related Skills:** `frontend-design`, `brand-guidelines`

---

### 2.9 doc-coauthoring

**Path:** `skills/doc-coauthoring/SKILL.md`

**Description:** Documentation collaboration workflow for creating comprehensive docs

**Trigger:** When creating or improving documentation

**Purpose:**
- Documentation structure
- Collaborative writing
- Content organization
- Review process
- Version management

**Use When:**
- Creating documentation
- Improving existing docs
- Writing technical docs
- API documentation
- README files

**Invocation:**
```
"Use the doc-coauthoring skill from skills/doc-coauthoring/SKILL.md"
```

**Stages:**
1. Context Gathering
2. Refinement & Structure
3. Reader Testing

---

### 2.10 brand-guidelines

**Path:** `skills/brand-guidelines/SKILL.md`

**Description:** Brand design guidance for consistent visual identity

**Trigger:** When establishing or maintaining brand identity

**Purpose:**
- Brand consistency
- Visual identity
- Design standards
- Brand voice
- Marketing materials

**Use When:**
- Setting up brand identity
- Creating marketing materials
- Maintaining brand consistency
- Design reviews

**Invocation:**
```
"Use the brand-guidelines skill from skills/brand-guidelines/SKILL.md"
```

**Related Skills:** `frontend-design`, `theme-factory`

---

## 3. CowAgent Skills

### 3.1 skill-creator

**Path:** `cowagent/skills/skill-creator/SKILL.md`

**Description:** Create and install new skills via natural language

**Trigger:** When creating a new skill or extending existing functionality

**Purpose:**
- Skill creation
- Skill installation
- Skill validation
- Natural language skill authoring

**Use When:**
- Creating custom skills
- Extending agent capabilities
- Installing new skills
- Validating skill structure

**Invocation:**
```
"Use the skill-creator skill from cowagent/skills/skill-creator/SKILL.md"
```

---

### 3.2 knowledge-wiki

**Path:** `cowagent/skills/knowledge-wiki/SKILL.md`

**Description:** Knowledge base management for persistent documentation

**Trigger:** When managing project knowledge, documentation, or information

**Purpose:**
- Knowledge management
- Wiki creation
- Information retrieval
- Documentation organization
- Context preservation

**Use When:**
- Building knowledge base
- Organizing project documentation
- Information retrieval
- Creating wikis
- Managing context

**Invocation:**
```
"Use the knowledge-wiki skill from cowagent/skills/knowledge-wiki/SKILL.md"
```

---

### 3.3 image-generation

**Path:** `cowagent/skills/image-generation/SKILL.md`

**Description:** Image generation via API integration

**Trigger:** When generating images, graphics, or visual content

**Purpose:**
- AI image generation
- Graphic creation
- Visual content
- Marketing imagery
- UI assets

**Use When:**
- Creating marketing images
- Generating graphics
- UI asset creation
- Visual content for docs
- Prototype images

**Invocation:**
```
"Use the image-generation skill from cowagent/skills/image-generation/SKILL.md"
```

---

## 4. Skill Invocation Commands

### By Use Case

| Use Case | Skill | Command |
|----------|-------|---------|
| Start orchestration | lider | `/lider` |
| New UI design | frontend-design | `Use frontend-design skill` |
| Code review | code-reviewer | `Use code-reviewer skill` |
| Debugging | debugger | `Use debugger skill` |
| Testing | testing-qa | `Use testing-qa skill` |
| Web search | tavily-web | `Use tavily-web skill` |
| Build prototype | web-artifacts-builder | `Use web-artifacts-builder skill` |
| Create theme | theme-factory | `Use theme-factory skill` |
| Write docs | doc-coauthoring | `Use doc-coauthoring skill` |
| Brand design | brand-guidelines | `Use brand-guidelines skill` |
| Create skill | skill-creator | `Use skill-creator skill` |
| Manage knowledge | knowledge-wiki | `Use knowledge-wiki skill` |
| Generate images | image-generation | `Use image-generation skill` |

### Natural Language Invocation

```bash
# Generic format
"Use the [skill-name] skill from [path]"

# Examples
"Use the frontend-design skill from skills/frontend-design/SKILL.md"
"Use the debugger skill from skills/debugger/SKILL.md"
"Use the code-reviewer skill from skills/code-reviewer/SKILL.md"
```

### Direct File Reference

```bash
# Read skill file first
Leia skills/frontend-design/SKILL.md

# Then apply
"Aplicar os princípios de frontend-design para este componente"
```

---

## 5. Skill Selection Guide

### Decision Tree

```
What do you need?
    │
    ├─→ Orchestration / Task Management
    │       └─→ lider (/lider)
    │
    ├─→ Design / UI / Visual
    │       ├─→ New UI/Feature → frontend-design
    │       ├─→ Theme/Colors → theme-factory
    │       ├─→ Brand Identity → brand-guidelines
    │       └─→ Images → image-generation
    │
    ├─→ Code Quality
    │       ├─→ Review → code-reviewer
    │       ├─→ Debug → debugger
    │       └─→ Test → testing-qa
    │
    ├─→ Documentation
    │       ├─→ Write → doc-coauthoring
    │       └─→ Manage → knowledge-wiki
    │
    ├─→ Research / Information
    │       └─→ Web Search → tavily-web
    │
    └─→ Skills / Extensibility
            └─→ Create Skill → skill-creator
```

### Quick Selection by Task

| Task | Recommended Skill(s) |
|------|---------------------|
| Start new feature | `/lider` |
| Design new page | `frontend-design` + `theme-factory` |
| Fix bug | `debugger` |
| Review PR | `code-reviewer` |
| Write tests | `testing-qa` |
| Create docs | `doc-coauthoring` |
| Research competitors | `tavily-web` |
| Build prototype | `web-artifacts-builder` |
| Create new skill | `skill-creator` |
| Manage knowledge base | `knowledge-wiki` |
| Generate marketing images | `image-generation` |

---

## 6. Cross-Skill Workflows

### Feature Development Workflow

```bash
# 1. Start with Tech Lead
/lider

# 2. Design with frontend-design + theme-factory
"Use the frontend-design skill"
"Use the theme-factory skill"

# 3. Implement with code-reviewer on standby
"Use the code-reviewer skill for implementation review"

# 4. Test with testing-qa
"Use the testing-qa skill"

# 5. Debug if needed with debugger
"Use the debugger skill"
```

### Bug Fix Workflow

```bash
# 1. Debug with debugger
"Use the debugger skill from skills/debugger/SKILL.md"

# 2. Review fix with code-reviewer
"Use the code-reviewer skill from skills/code-reviewer/SKILL.md"

# 3. Add tests with testing-qa
"Use the testing-qa skill from skills/testing-qa/SKILL.md"
```

### Documentation Workflow

```bash
# 1. Co-author with doc-coauthoring
"Use the doc-coauthoring skill from skills/doc-coauthoring/SKILL.md"

# 2. Add to knowledge base
"Use the knowledge-wiki skill from cowagent/skills/knowledge-wiki/SKILL.md"
```

### Design System Workflow

```bash
# 1. Create brand guidelines
"Use the brand-guidelines skill from skills/brand-guidelines/SKILL.md"

# 2. Generate theme
"Use the theme-factory skill from skills/theme-factory/SKILL.md"

# 3. Apply to frontend
"Use the frontend-design skill from skills/frontend-design/SKILL.md"
```

---

## Skill Index

| Skill | File Path | Category | Priority |
|-------|-----------|----------|----------|
| lider | `skills/lider/SKILL.md` | Orchestration | HIGH |
| frontend-design | `skills/frontend-design/SKILL.md` | Design | HIGH |
| code-reviewer | `skills/code-reviewer/SKILL.md` | Quality | HIGH |
| debugger | `skills/debugger/SKILL.md` | Quality | HIGH |
| testing-qa | `skills/testing-qa/SKILL.md` | Quality | HIGH |
| tavily-web | `skills/tavily-web/SKILL.md` | Research | MEDIUM |
| web-artifacts-builder | `skills/web-artifacts-builder/SKILL.md` | Prototyping | MEDIUM |
| theme-factory | `skills/theme-factory/SKILL.md` | Design | MEDIUM |
| doc-coauthoring | `skills/doc-coauthoring/SKILL.md` | Documentation | MEDIUM |
| brand-guidelines | `skills/brand-guidelines/SKILL.md` | Design | MEDIUM |
| skill-creator | `cowagent/skills/skill-creator/SKILL.md` | Extensibility | LOW |
| knowledge-wiki | `cowagent/skills/knowledge-wiki/SKILL.md` | Knowledge | LOW |
| image-generation | `cowagent/skills/image-generation/SKILL.md` | Media | LOW |