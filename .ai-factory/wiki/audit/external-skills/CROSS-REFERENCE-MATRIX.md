# Skills Cross-Reference Matrix

> Created: 2026-07-19
> Purpose: Map skill dependencies, trigger phrases, and integration points

## Skill → Trigger Phrases (Portuguese)

| Skill | Primary Triggers (PT-BR) |
|-------|-------------------------|
| `context7-cli` | "docs do React", "documentação do Next", "API do Stripe", "como usar [library]" |
| `context7-mcp` | "MCP docs", "server documentation", "protocol docs" |
| `find-docs` | "buscar documentação", "resolver dúvida de lib", "procurar docs" |
| `pdf` | "gerar PDF", "criar PDF", "converter para PDF", "extrair texto PDF" |
| `docx` | "documento Word", "criar .docx", "editar Word", "relatório docx" |
| `pptx` | "apresentação", "slides PowerPoint", "criar PPTX", "deck de slides" |
| `xlsx` | "planilha Excel", "criar XLSX", "tabela Excel", "fórmulas" |
| `ui-ux-pro-max` | "design system para X", "cores para landing page", "tipografia para fintech" |
| `design-system` | "gerar design system", "criar token de design", "master + overrides" |
| `ui-styling` | "CSS para React", "estilização Vue", "Tailwind para X", "CSS variables" |
| `transitions-dev` | "transição do modal", "animação dropdown", "hover effect", "card expand" |
| `transitions-polish` | "polir timing", "tunar animação", "combinar transições" |
| `taste-skill` | "não genérico", "anti-padrão", "design distintivo", "3 dial", "beleza vs velocidade" |
| `systematic-debugging` | "root cause", "por que está falhando", "debugar", "4 fases" |
| `subagent-driven-development` | "executar plano", "dispatch agents", "tarefas paralelas", "subagentes" |
| `dispatching-parallel-agents` | "múltiplos agentes", "execução paralela", "distribuir trabalho" |
| `verification-before-completion` | "está pronto", "verificar completion", "pode fazer merge" |
| `skill-creator` | "criar skill", "desenvolver skill", "skill para [tema]" |
| `seo-audit` | "auditar SEO", "otimizar busca", "Core Web Vitals", "meta tags" |
| `analytics` | "setup GA4", "tracking events", "Google Analytics", "eventos" |
| `social-media-marketing` | "post LinkedIn", "conteúdo Instagram", "engajamento", "campanha" |

## Skill → Dependency Chain

### Execution Flow
```
brainstorming → writing-plans → subagent-driven-development → requesting-code-review → verification-before-completion → finishing-a-development-branch

context7-cli/mcp → any skill needing library documentation

ui-ux-pro-max → frontend-design → transitions-dev

seo-audit → analytics → ab-testing

skill-creator → any NEW skill being created

social-media-marketing → voice-builder → post-writer/content-matrix
```

### Integration Patterns

| Pattern | Skills | Use Case |
|---------|--------|----------|
| **Docs Lookup** | context7-cli → any | "How do I use [library]?" |
| **Design System** | ui-ux-pro-max → design-system → ui-styling → transitions-dev | "Build beautiful UI" |
| **Debugging** | systematic-debugging → verification-before-completion | "Fix this bug properly" |
| **Multi-Agent** | subagent-driven-development → dispatching-parallel-agents | "Execute complex plan" |
| **Document Creation** | pdf/docx/pptx/xlsx → doc-coauthoring | "Generate report" |
| **Marketing** | seo-audit → analytics → social-media-marketing | "Launch and track" |

## Skill → Related Skills

| Skill | Related Skills | Relationship |
|-------|----------------|--------------|
| `context7-cli` | context7-mcp, find-docs | Same source, different interfaces |
| `ui-ux-pro-max` | design-system, ui-styling, taste-skill | Design workflow chain |
| `design-system` | ui-ux-pro-max, ui-styling | Token architecture |
| `ui-styling` | design-system, transitions-dev | CSS implementation |
| `transitions-dev` | transitions-polish, taste-skill | Motion/animation |
| `systematic-debugging` | debugger, verification-before-completion | Quality enforcement |
| `subagent-driven-development` | dispatching-parallel-agents, multi-agent-patterns | Agent orchestration |
| `skill-creator` | skill-writer, skill-check | Skill development lifecycle |
| `seo-audit` | analytics, social-media-marketing | Marketing workflow |
| `analytics` | seo-audit, ab-testing | Data-driven decisions |

## Skill Activation Priority

When multiple skills could apply, use this priority:

```
1. verification-before-completion (always check first)
2. systematic-debugging (if bug/error)
3. context7-cli (if docs needed)
4. ui-ux-pro-max (if design question)
5. transitions-dev (if animation needed)
6. [other skills based on specific triggers]
```

## Cross-Skill Workflows

### Workflow: New Feature with Tests
```
1. writing-plans → create feature plan
2. subagent-driven-development → dispatch implementation tasks
3. systematic-debugging → investigate any issues
4. verification-before-completion → quality gate
5. requesting-code-review → peer review
```

### Workflow: Design System for SaaS
```
1. ui-ux-pro-max → query style/palette for SaaS
2. design-system → create token structure
3. ui-styling → implement CSS
4. transitions-dev → add motion
5. taste-skill → quality check
```

### Workflow: Marketing Campaign
```
1. seo-audit → audit site SEO
2. analytics → setup tracking
3. social-media-marketing → create content
4. pdf/pptx → generate reports
```

### Workflow: Debug Production Issue
```
1. systematic-debugging → investigate root cause
2. verification-before-completion → ensure fix is correct
3. documentation → update docs if needed
```

## Skills NOT to Import (Rejected)

| Skill | Reason |
|-------|--------|
| claude-mem full | Requires memory infrastructure |
| marketingskills cold-email | Lower priority, can add later |
| superpowers brainstorming | Already have lider + product-launch |
| social-media-skills full | English-first, requires API keys |
| anthropic brand-guidelines | Already have NexusAuto-specific brand |

---

**Document Version:** 1.0
**Last Updated:** 2026-07-19
**Maintainer:** External Skills Integration Phase 4