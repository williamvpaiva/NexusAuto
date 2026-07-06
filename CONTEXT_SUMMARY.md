# NexusAuto - Contexto Base (Layer 1)

## Propósito
Fábrica autônoma de software com 10+ agentes de IA especializados.

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

## Camadas de Contexto
- **Layer 1**: Este arquivo (sempre carregado, ~200 tokens)
- **Layer 2**: `./PROJECT_CONTEXT.md` (visão macro, sob demanda)
- **Layer 3**: `.ai-factory/scripts/retrieve-context.js` (código específico, sob demanda)

## Agentes Disponíveis
| Agente | Responsabilidade | Localização |
|--------|-----------------|-------------|
| TECH-LEAD | Orquestração | `.ai-factory/agents/tech-lead.md` |
| PRODUCT-OWNER | Produto | `.ai-factory/agents/product-owner.md` |
| ANALYST | Requisitos | `.ai-factory/agents/analyst.md` |
| ARCHITECT | Arquitetura | `.ai-factory/agents/architect.md` |
| FRONTEND-DEV | UI/Componentes | `.ai-factory/agents/frontend-dev.md` |
| BACKEND-DEV | API/Database | `.ai-factory/agents/backend-dev.md` |
| SECURITY | Segurança | `.ai-factory/agents/security.md` |
| PERFORMANCE | Performance | `.ai-factory/agents/performance.md` |
| QA-TESTER | Validação/Testes | `.ai-factory/agents/qa-tester.md` |
| DEVOPS | Infra/Deploy | `.ai-factory/agents/devops.md` |
| UI/UX-PRO-MAX | Design | `.ai-factory/agents/ui-ux-pro-max-agent.md` |
| EXECUTOR | Automação | `.ai-factory/agents/executor-agent.md` |
| WHATSAPP | Comunicação | `.ai-factory/agents/whatsapp-agent.md` |

## Links Críticos
- [Protocolo V&V](.ai-factory/standards/VV_PROTOCOL_ADAPTATIVE.md)
- [Template de Handoff](.ai-factory/handoffs/HANDOFF_TEMPLATE.md)
- [Índice de Melhorias](.ai-factory/MELHORIAS/INDEX.md)
- [Progresso](PROGRESS.md)
- [Contexto do Projeto](PROJECT_CONTEXT.md)

---
*Última atualização: 2026-07-06 | Tokens: ~200*
