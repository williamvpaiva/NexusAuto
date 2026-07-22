# NexusAuto + Orca Integration Guide

Complete guide for using Orca IDE with the NexusAuto AI Factory ecosystem.

---

## Quick Start

```bash
# In any Orca worktree, load NexusAuto context:
Leia NEXUS-ORCA.md           # This file - master integration guide
Leia ORCHESTRATOR.md  # How AI Factory works
Leia PROJECT_CONTEXT.md # Current project state
```

---

## Architecture Overview

```
Orca IDE
├── Worktrees (parallel isolated environments)
├── API Providers (OpenRouter, NVIDIA, DeepSeek, Claude, etc.)
└── NexusAuto AI Factory
    ├── 21 Specialized Agents
    ├── 15+ Skills (NexusAuto + CowAgent)
    ├── 3-Tier Memory System
    └── Tech Lead Orchestrator
```

---

## Available Agents (21)

Located in `.ai-factory/agents/`

### Core Development Agents

| Agent | File | Responsibilities |
|-------|------|-----------------|
| **Tech Lead** | `tech-lead.md` | Orchestration, task distribution, V&V validation, matrix routing |
| **Architect** | `architect.md` | System architecture, ADR decisions, clean architecture |
| **Frontend Dev** | `frontend-dev.md` | React, UI components, responsive design, accessibility |
| **Backend Dev** | `backend-dev.md` | APIs, services, database, business logic |
| **Security** | `security.md` | OWASP audits, vulnerability assessment, compliance |
| **QA Tester** | `qa-tester.md` | Testing strategy, test coverage, go/no-go decisions |
| **DevOps** | `devops.md` | CI/CD, deployment, infrastructure, monitoring |
| **Performance** | `performance.md` | Optimization, caching, scalability |

### Specialist Agents

| Agent | File | Responsibilities |
|-------|------|-----------------|
| **Product Owner** | `product-owner.md` | Requirements, prioritization, stakeholder alignment |
| **Analyst** | `analyst.md` | Requirements gathering, user stories, acceptance criteria |
| **UI/UX Pro Max** | `ui-ux-pro-max-agent.md` | Visual design system, layout patterns, color/typography |
| **Data Analyst** | `data-analyst.md` | Data modeling, analytics, metrics |
| **Financial Analyst** | `financial-analyst.md` | Cost analysis, ROI, budget planning |
| **Legal Counsel** | `legal-counsel.md` | Compliance, contracts, IP |
| **Recruiter** | `recruiter.md` | Talent acquisition, team building |
| **Chief of Staff** | `chief-of-staff.md` | Executive support, coordination |
| **Customer Support Lead** | `customer-support-lead.md` | Support workflows, escalation |
| **Product Marketer** | `product-marketer.md` | Go-to-market, positioning |
| **WhatsApp Agent** | `whatsapp-agent.md` | WhatsApp integration, messaging |
| **Venture Capitalist** | `venture-capitalist.md` | Investment analysis, pitch review |
| **Executor Agent** | `executor-agent.md` | Task execution, automation |

### How to Use Agents in Orca

```bash
# Create a worktree for a specific agent
orca worktree create --agent opencode -- nexus-frontend-dev

# Inside the worktree, invoke the agent:
"Você é o Frontend Dev. Leia .ai-factory/agents/frontend-dev.md"
```

---

## Available Skills (15+)

### NexusAuto Skills (`skills/`)

| Skill | File | Purpose |
|-------|------|---------|
| **lider** | `skills/lider/SKILL.md` | Tech Lead invocation command `/lider` |
| **frontend-design** | `skills/frontend-design/SKILL.md` | UI design principles, typography, anti-patterns |
| **code-reviewer** | `skills/code-reviewer/SKILL.md` | Elite code review with AI-powered analysis |
| **debugger** | `skills/debugger/SKILL.md` | Systematic debugging strategies |
| **testing-qa** | `skills/testing-qa/SKILL.md` | Testing guidance and QA workflows |
| **tavily-web** | `skills/tavily-web/SKILL.md` | Web search integration |
| **web-artifacts-builder** | `skills/web-artifacts-builder/SKILL.md` | Web artifact generation |
| **theme-factory** | `skills/theme-factory/SKILL.md` | Theme creation system |
| **doc-coauthoring** | `skills/doc-coauthoring/SKILL.md` | Documentation collaboration |
| **brand-guidelines** | `skills/brand-guidelines/SKILL.md` | Brand design guidance |
| **hyperframes** | `skills/hyperframes/SKILL.md` | Video creation via HTML (HeyGen Hyperframes) |

### CowAgent Skills (`cowagent/skills/`)

| Skill | File | Purpose |
|-------|------|---------|
| **skill-creator** | `cowagent/skills/skill-creator/SKILL.md` | Create/install skills via natural language |
| **knowledge-wiki** | `cowagent/skills/knowledge-wiki/SKILL.md` | Knowledge base management |
| **image-generation** | `cowagent/skills/image-generation/SKILL.md` | Image generation via API |

---

## AI API Providers

### Supported Providers

| Provider | Config Key | Models |
|----------|------------|--------|
| **OpenRouter** | `openrouter_api_key` | Claude, GPT, Gemini, Llama, Mistral, etc. |
| **NVIDIA** | `nvidia_api_key` | NVIDIA NIM models |
| **DeepSeek** | `deepseek_api_key` | DeepSeek Coder, DeepSeek Chat |
| **Claude (Anthropic)** | `claude_api_key` | Claude 3.5, Claude 3 Opus |
| **OpenAI** | `open_ai_api_key` | GPT-4, GPT-4o |
| **Gemini (Google)** | `gemini_api_key` | Gemini 1.5, Gemini Pro |
| **Moonshot (Kimi)** | `moonshot_api_key` | Moonshot V1 |
| **Qwen (Alibaba)** | `dashscope_api_key` | Qwen 2, Qwen-Max |
| **MiniMax** | `minimax_api_key` | MiniMax models |
| **Zhipu AI** | `zhipu_ai_api_key` | GLM-4, GLM-4V |
| **ARK (ByteDance)** | `ark_api_key` | ARK models |

### Configuration in Orca

Orca settings (`~/.orca/settings.json`):

```json
{
  "providers": {
    "openrouter": "${OPENROUTER_API_KEY}",
    "nvidia": "${NVIDIA_API_KEY}",
    "deepseek": "${DEEPSEEK_API_KEY}",
    "claude": "${ANTHROPIC_API_KEY}"
  },
  "defaultProvider": "openrouter",
  "models": {
    "openrouter": {
      "preferred": "anthropic/claude-3.5-sonnet"
    }
  }
}
```

---

## Memory System

### 3-Tier Architecture

| Tier | Purpose | Access |
|------|---------|--------|
| **Conversation** | Current session context | Always loaded |
| **Daily** | Daily memory distillation | Loaded on session start |
| **Core** | Long-term knowledge, decisions | Search when needed |

### Memory Commands

```bash
# Search memory
node .ai-factory/scripts/memory-manager.js search "query" --topK 5

# Save to memory
node .ai-factory/scripts/memory-manager.js save "content" --agent tech-lead --type decision --tags tag1,tag2

# Memory types
# --type decision | code | lesson | adr | context | general
```

---

## Workflow Examples

### Parallel Development with Multiple Agents

```bash
# Create worktrees for parallel development
orca worktree create --agent opencode -- project-frontend
orca worktree create --agent opencode -- project-backend
orca worktree create --agent opencode -- project-security

# In each worktree:
# project-frontend: "Leia .ai-factory/agents/frontend-dev.md"
# project-backend: "Leia .ai-factory/agents/backend-dev.md"
# project-security: "Leia .ai-factory/agents/security.md"
```

### Feature Development Flow

```bash
# 1. Tech Lead analyzes and routes
/lider
# → Scan MELHORIAS/*/TAREFAS.md for tasks

# 2. Create spec first
# → Spec-Kit generates spec.md, plan.md, tasks.md

# 3. Generate design system (if frontend)
/design save "feature description" "feature-name"

# 4. Route to specialist agents
# → architect.md for API design
# → frontend-dev.md for UI implementation
# → backend-dev.md for backend implementation
```

### Security Audit Flow

```bash
# 1. Security agent takes task
"Leia .ai-factory/agents/security.md"

# 2. Run OWASP analysis
# → OWASP Top 10 review
# → Vulnerability assessment
# → Security report generation
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `NEXUS-ORCA.md` | This file - master integration guide |
| `ORCHESTRATOR.md` | AI Factory workflow and agent routing |
| `PROJECT_CONTEXT.md` | Current project state |
| `TECH-LEAD.md` | Tech Lead responsibilities |
| `.ai-factory/MELHORIAS/INDEX.md` | Areas of improvement |
| `skills/*/SKILL.md` | NexusAuto skills |
| `cowagent/skills/*/SKILL.md` | CowAgent skills |
| `cowagent/agent/protocol/agent.py` | CowAgent core |
| `.ai-factory/brain/Memories/` | Persistent memory |

---

## Slash Commands (Tech Lead)

| Command | Action |
|---------|--------|
| `/lider` | Invoke Tech Lead |
| `/nl-specify "desc"` | Generate spec with Spec-Kit |
| `/nl-plan "tech"` | Generate technical plan |
| `/nl-tasks` | Generate task list |
| `/nl-implement` | Trigger agent orchestration |
| `/memory search "query"` | Search persistent memory |
| `/memory save "content"` | Save to memory |
| `/design save "desc" "name"` | Generate design system |
| `/task add "desc" [priority]` | Add task to queue |
| `/task next` | Get next task |
| `/status board` | Show status aggregator |

---

## Skill Loading in Orca

Skills follow the SKILL.md format with YAML frontmatter:

```markdown
---
name: skill-name
description: "What this skill does"
---

# Skill Content
```

To use a skill, reference it directly:
```
"Use the frontend-design skill from skills/frontend-design/SKILL.md"
```

---

## Environment Variables

```bash
# API Keys
export OPENROUTER_API_KEY="sk-..."
export NVIDIA_API_KEY="nv-..."
export DEEPSEEK_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-..."
export GEMINI_API_KEY="..."

# Project
export NEXUS_PROJECT_ROOT="D:/NexusAuto"
```

---

## Orca CLI Reference

```bash
# Worktree management
orca worktree create --agent <agent-name> -- <name>
orca worktree list
orca worktree remove <name>
orca snapshot create <message>

# Agent control
orca run --agent <agent> --prompt <prompt>
orca parallel --agents <agent1,agent2> --prompt <prompt>

# File operations
orca click <selector>  # Click UI element
orca fill <selector> <text>  # Fill form field
orca drag <from> <to>  # Drag element

# Computer use (let agents control desktop)
orca computer on
orca computer off
```

---

## Tips for NexusAuto + Orca

1. **Use parallel worktrees** for independent tasks
2. **Reference agent files** at start of each session
3. **Use memory search** before starting complex tasks
4. **Tech Lead** routes to specialist agents automatically
5. **Design first** for frontend tasks (`/design save`)
6. **V&V protocol** always validates before marking complete
7. **Slash commands** speed up common operations

---

## Troubleshooting

### Agent not responding as expected?
→ Ensure you read the agent's `.md` file first

### Memory not found?
→ Run `node .ai-factory/scripts/memory-manager.js rebuild-index`

### Skills not loading?
→ Check SKILL.md has valid YAML frontmatter

### API errors?
→ Verify API keys are set in environment or Orca settings