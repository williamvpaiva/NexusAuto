# NexusAuto - Contexto Base (Layer 1)

## Propósito
Fábrica autônoma de software com 21 agentes de IA especializados.

## Stack Principal
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js 20 + TypeScript + Express + Zod
- **Database**: SQLite (dev) / PostgreSQL (prod) + Prisma ORM
- **Infra**: Docker + Docker Compose

## Regras Áureas
1. Toda saída deve ter validação V&V de 7 passos
2. Handoffs usam apenas template resumido (máx 200 tokens)
3. Código > 100 linhas → entregar apenas diff/patch
4. Validação por cache: hash inalterado = pular validação
5. OpenWiki atualiza docs automaticamente (diário 03:00 UTC)
6. GNHF roda overnight com validação V&V (diário 02:00 UTC)

## Camadas de Contexto
- **Layer 1**: Este arquivo (sempre carregado, ~200 tokens)
- **Layer 2**: `./PROJECT_CONTEXT.md` (visão macro, sob demanda)
- **Layer 3**: `.ai-factory/wiki/session/hot.md` (cache de continuidade, ler sempre primeiro numa sessão)
- **Layer 4**: `.ai-factory/scripts/retrieve-context.js` (código específico, sob demanda)

## Agentes Disponíveis (21 agentes)

| Agente | Divisão | Localização |
|--------|---------|-------------|
| TECH-LEAD | Orquestração | `.ai-factory/agents/tech-lead.md` |
| CHIEF-OF-STAFF | Operações | `.ai-factory/agents/chief-of-staff.md` |
| PRODUCT-OWNER | Produto | `.ai-factory/agents/product-owner.md` |
| ANALYST | Requisitos | `.ai-factory/agents/analyst.md` |
| ARCHITECT | Arquitetura | `.ai-factory/agents/architect.md` |
| FRONTEND-DEV | Frontend | `.ai-factory/agents/frontend-dev.md` |
| BACKEND-DEV | Backend | `.ai-factory/agents/backend-dev.md` |
| UI/UX-PRO-MAX | Design | `.ai-factory/agents/ui-ux-pro-max-agent.md` |
| SECURITY | Segurança | `.ai-factory/agents/security.md` |
| PERFORMANCE | Performance | `.ai-factory/agents/performance.md` |
| QA-TESTER | Testes | `.ai-factory/agents/qa-tester.md` |
| DEVOPS | Infra/Deploy | `.ai-factory/agents/devops.md` |
| DATA-ANALYST | Dados | `.ai-factory/agents/data-analyst.md` |
| FINANCIAL-ANALYST | Finanças | `.ai-factory/agents/financial-analyst.md` |
| CUSTOMER-SUPPORT | Suporte | `.ai-factory/agents/customer-support-lead.md` |
| PRODUCT-MARKETER | Marketing | `.ai-factory/agents/product-marketer.md` |
| LEGAL-COUNSEL | Jurídico | `.ai-factory/agents/legal-counsel.md` |
| RECRUITER | RH/Talentos | `.ai-factory/agents/recruiter.md` |
| VENTURE-CAPITALIST | Investimentos | `.ai-factory/agents/venture-capitalist.md` |
| EXECUTOR | Automação | `.ai-factory/agents/executor-agent.md` |
| WHATSAPP | Comunicação | `.ai-factory/agents/whatsapp-agent.md` |

## Links Críticos
- [Protocolo V&V](.ai-factory/standards/VV_PROTOCOL_ADAPTATIVE.md)
- [Template de Handoff](.ai-factory/handoffs/HANDOFF_TEMPLATE.md)
- [Índice de Melhorias](.ai-factory/MELHORIAS/INDEX.md)
- [Progresso](PROGRESS.md)
- [Contexto do Projeto](PROJECT_CONTEXT.md)
- [OpenWiki + GNHF Integration](.ai-factory/tools/INTEGRACAO.md)
- [Wiki Persistente](.ai-factory/wiki/index.md) — memória entre sessões
- [WIKI Schema](WIKI.md) — wiki reference para agentes
- [AGENTS.md](AGENTS.md) — instruções para Claude Code / OpenCode
- [GEMINI.md](GEMINI.md) — instruções para Gemini CLI

## Status Testes
- **84/84 testes passando**, 0 falhas, ~10.9s (backend)
- Coverage rate limiter: Redis mockado em test, sem timeouts
- OpenWiki: ✅ 3/3 testes passando
- GNHF: ✅ 2/3 testes passando (run, handoff)
- V&V: ✅ Gate integrado no GNHF

---

## Novas Ferramentas (2026-07-07)

### OpenWiki
- **Local:** `.ai-factory/tools/openwiki/`
- **Função:** Gera docs automáticas em `.ai-factory/wiki/`
- **Comando:** `/wiki init`, `/wiki update`

### GNHF
- **Local:** `.ai-factory/tools/gnhf/`
- **Função:** Agentes autônomos overnight com V&V
- **Comando:** `/gnhf run "objetivo"`

### V&V Validation
- **Local:** `.ai-factory/scripts/run-vv.js`
- **Função:** Gate de 7 passos pré-commit
- **Comando:** `/vv run`

### Memory Integration
- **Local:** `.ai-factory/scripts/memory-integration.js`
- **Função:** Sync memória ↔ Wiki
- **Comando:** `/memory sync`

### Integration Script
- **Local:** `.ai-factory/scripts/integrate.js`
- **Função:** Orquestra tudo
- **Comando:** `/integrate full`

---

*Última atualização: 2026-07-18 | Tokens: ~450*

---

## Wiki Persistente (Novo)

Implementação do pattern claude-obsidian para memória persistente entre sessões.

### Componentes

| Componente | Arquivo | Função |
|------------|---------|--------|
| Wiki Pattern | `.ai-factory/wiki/` | Estrutura de diretórios para conhecimento persistente |
| Hot Cache | `.ai-factory/wiki/session/hot.md` | ~500 tokens, cache de continuidade entre sessões |
| Hooks | `hooks/hooks.json` | Lifecycle hooks: SessionStart, PostToolUse, Stop |
| Plugin | `.claude-plugin/` | Registro no ecossistema Claude Code |
| Discovery | `AGENTS.md`, `GEMINI.md` | Descoberta cross-platform |

### Comandos Rápidos

- `/wiki index` — abre o catálogo master
- Leia `AGENTS.md` para instruções completas
