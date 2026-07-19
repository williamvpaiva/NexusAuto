# NexusAuto Wiki — Catálogo Mestre

> Catálogo central de todo conhecimento persistente do projeto.

## Seções do Wiki

| Seção | Descrição | Link |
|-------|-----------|------|
| **Session** | Cache de continuidade + log de operações | [session/](session/) |
| **Overview** | Visão executiva do projeto | [overview.md](overview.md) |
| **Entities** | Pessoas, organizações, produtos, sistemas | [entities/](entities/_index.md) |
| **Concepts** | Ideias, padrões, frameworks, decisões | [concepts/](concepts/_index.md) |
| **Sources** | Documentos fonte ingeridos | [sources/](sources/_index.md) |
| **Decisions** | ADRs e decisões arquiteturais | [decisions/](decisions/) |
| **Architecture** | Arquitetura do sistema (auto-gerado) | [architecture/](architecture/INDEX.md) |
| **Memory** | Sistema de memória (auto-gerado) | [memory/](memory/INDEX.md) |
| **API** | Referência de API (auto-gerado) | [api/](api/INDEX.md) |
| **Economy** | Token economy reports | [economy/](economy/LATEST-REPORT.md) |

## Geração Automática

As seções **Architecture**, **Memory**, **API** e subdiretórios vazios (`agents/`, `skills/`, `workflows/`, `handoffs/`) são auto-gerados pelo OpenWiki.

**Não editar manualmente** os arquivos dentro de diretórios auto-gerados.

## Skills Catalog (34 skills)

### Documentação & Docs
| Skill | Descrição | Triggers |
|-------|-----------|----------|
| `context7-cli` | Busca docs atualizadas de bibliotecas | "docs do React", "API do Stripe" |
| `context7-mcp` | MCP server para documentação | "como usar [lib]" |
| `find-docs` | Wrapper CLI para busca de docs | "buscar documentação" |
| `pdf` | Criar/editar PDFs | "gerar PDF", "extrair texto PDF" |
| `docx` | Documentos Word | "documento Word", "criar .docx" |
| `pptx` | Apresentações PowerPoint | "slides PowerPoint", "criar PPTX" |
| `xlsx` | Planilhas Excel | "planilha Excel", "criar XLSX" |

### Design & UI/UX
| Skill | Descrição | Triggers |
|-------|-----------|----------|
| `ui-ux-pro-max` | 84 estilos, 192 paletas, 161 regras | "design system para SaaS" |
| `design-system` | Master + overrides pattern | "gerar design system" |
| `ui-styling` | CSS + Tailwind | "estilizar componente" |
| `transitions-dev` | 18 transições CSS | "transição modal", "hover effect" |
| `transitions-polish` | Combinar/polir animações | "polir timing", "tunar animação" |
| `taste-skill` | 3-dials (taste/speed/quality) | "design frontend", "qualidade" |

### Development Workflows
| Skill | Descrição | Triggers |
|-------|-----------|----------|
| `systematic-debugging` | Método científico para debug | "debugar", "erro inesperado" |
| `subagent-driven-development` | Multi-agent orchestration | "subagentes", "execução paralela" |
| `dispatching-parallel-agents` | Distribuir tarefas | "tarefas paralelas", "dispatch" |
| `verification-before-completion` | Quality enforcement | "está pronto", "verificar" |
| `skill-creator` | Criar novos skills | "criar skill", "desenvolver skill" |

### Marketing & Analytics
| Skill | Descrição | Triggers |
|-------|-----------|----------|
| `seo-audit` | Auditoria SEO | "auditar SEO", "Core Web Vitals" |
| `analytics` | GA4 + event tracking | "Google Analytics", "tracking" |
| `social-media-marketing` | Conteúdo redes sociais | "post LinkedIn", "engajamento" |

### [Skills Originais]...

## Links Externos (Projeto)

| Documento | Localização |
|-----------|-------------|
| Contexto Base | [CONTEXT_SUMMARY.md](../../CONTEXT_SUMMARY.md) |
| Progresso | [PROGRESS.md](../../PROGRESS.md) |
| Instructions | [AGENTS.md](../../AGENTS.md) |
| OpenWiki | `tools/openwiki/` |
| GNHF | `tools/gnhf/` |
| V&V Protocol | `standards/VV_PROTOCOL_ADAPTATIVE.md` |
| Brain/Decisions | `brain/Key Decisions.md` |

## Regras do Wiki

1. **session/hot.md**: Sempre ≤500 tokens. Atualizado no hook `Stop`.
2. **session/log.md**: Append-only. Nunca editar entradas existentes.
3. **entities/**: Um arquivo por entidade. Nome no padrão `kebab-case.md`.
4. **concepts/**: Um arquivo por conceito. Nome no padrão `kebab-case.md`.
5. **sources/**: Fontes ingeridas, com metadados de origem e data.
6. **Seções auto-geradas**: Não editar manualmente.
