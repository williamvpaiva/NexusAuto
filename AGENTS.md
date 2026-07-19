# AGENTS.md — Claude Code / OpenCode Agent Instructions

> Configuração para ferramentas de agente de código (Claude Code, OpenCode, Codex).

## Contexto do Projeto
NexusAuto é uma fábrica autônoma de software com 10+ agentes de IA especializados.

## Pontos de Partida

### Para entender o projeto
1. `CONTEXT_SUMMARY.md` — contexto base (Layer 1, ~200 tokens)
2. `PROJECT_CONTEXT.md` — visão macro do projeto
3. `.ai-factory/wiki/overview.md` — visão executiva no wiki persistente

### Para continuar uma sessão
1. `.ai-factory/wiki/session/hot.md` — cache de continuidade (~500 tokens, ler sempre primeiro)
2. `.ai-factory/wiki/index.md` — catálogo master do wiki
3. `.ai-factory/wiki/session/log.md` — últimas operações registradas

### Para documentar algo novo
- Use `.ai-factory/wiki/entities/` para pessoas, orgs, produtos
- Use `.ai-factory/wiki/concepts/` para ideias, padrões, frameworks
- Registre em `.ai-factory/wiki/session/log.md` (append-only)
- Ao finalizar, atualize `.ai-factory/wiki/session/hot.md`

### Convenções
- Código > 100 linhas → entregar apenas diff/patch
- Handoffs usam template resumido (máx 200 tokens)
- Validação por cache: hash inalterado = pular validação
- OpenWiki atualiza docs automaticamente (diário 03:00 UTC)
- GNHF roda overnight com V&V (diário 02:00 UTC)

## Hooks Ativos
Ver `hooks/hooks.json` para lifecycle hooks configurados.

## Referências
| Documento | Caminho |
|-----------|---------|
| WIKI Schema | `WIKI.md` |
| Wiki Index | `.ai-factory/wiki/index.md` |
| Hot Cache | `.ai-factory/wiki/session/hot.md` |

## Skills Catalog (34 skills)

### Documentação & Docs
| Skill | Use |
|-------|-----|
| `context7-cli` | Buscar docs atualizadas de bibliotecas |
| `context7-mcp` | MCP server para documentação |
| `find-docs` | CLI wrapper para busca de docs |
| `pdf` | Criar/editar PDFs |
| `docx` | Documentos Word (.docx) |
| `pptx` | Apresentações PowerPoint |
| `xlsx` | Planilhas Excel |

### Design & UI/UX
| Skill | Use |
|-------|-----|
| `ui-ux-pro-max` | 84 estilos, 192 paletas, 161 regras de design |
| `design-system` | Master + overrides pattern |
| `ui-styling` | CSS + Tailwind implementation |
| `transitions-dev` | 18 transições CSS prontas |
| `transitions-polish` | Combinar/polir animações |
| `taste-skill` | 3-dials (taste/speed/quality) |

### Development Workflows
| Skill | Use |
|-------|-----|
| `systematic-debugging` | Método científico para debug |
| `subagent-driven-development` | Multi-agent orchestration |
| `dispatching-parallel-agents` | Distribuir tarefas paralelas |
| `verification-before-completion` | Quality enforcement antes de completar |
| `skill-creator` | Criar novos skills |

### Marketing & Analytics
| Skill | Use |
|-------|-----|
| `seo-audit` | Auditoria SEO completa |
| `analytics` | GA4 + event tracking |
| `social-media-marketing` | Conteúdo para redes sociais |

### Skills Originais (14)
Ver `.ai-factory/wiki/index.md` para lista completa.

**Para detalhes sobre triggers e dependências, ver:**
`.ai-factory/wiki/audit/external-skills/CROSS-REFERENCE-MATRIX.md` |
