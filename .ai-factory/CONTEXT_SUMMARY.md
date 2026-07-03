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
- **Layer 2**: [./PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) (visão macro, sob demanda)
- **Layer 3**: `scripts/retrieve-context.js` (código específico, sob demanda)

## Agentes Disponíveis
| Agente | Responsabilidade | Diretório |
|--------|-----------------|-----------|
| TECH-LEAD | Orquestração | `.ai-factory/orchestrator/` |
| BACKEND-DEV | API/Database | `backend/src/` |
| FRONTEND-DEV | UI/Componentes | `frontend/src/` |
| QA-TESTER | Validação/Testes | `tests/` |
| DEVOPS | Infra/Deploy | `infra/` |

## Links Críticos
- [Protocolo V&V](./standards/VV_PROTOCOL.md)
- [Template de Handoff](./handoffs/HANDOFF_TEMPLATE.md)
- [Índice de Melhorias](./MELHORIAS/INDEX.md)

---
*Última atualização: 2026-07-03 | Tokens: ~180*