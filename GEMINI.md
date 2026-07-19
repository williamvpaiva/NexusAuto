# GEMINI.md — Google Gemini CLI Agent Instructions

> Configuração para o Gemini CLI da Google.

## Identidade
Este é o repositório **NexusAuto** — fábrica autônoma de software com 10+ agentes de IA.

## Como Começar

### Primeira Sessão
1. Leia `CONTEXT_SUMMARY.md` para contexto base
2. Leia `wiki/overview.md` para visão executiva
3. Navegue por `wiki/index.md` para estrutura completa

### Sessão de Continuação
1. **Sempre** leia `wiki/hot.md` primeiro — contém o cache de continuidade
2. Consulte `wiki/index.md` para navegar
3. Verifique `wiki/log.md` para operações recentes

### Ao Finalizar
- Atualize `wiki/hot.md` com resumo da sessão
- Adicione entrada em `wiki/log.md` (append-only)

## Stack Técnica
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: Node.js 20 + TypeScript + Express + Zod
- Database: SQLite (dev) / PostgreSQL (prod) + Prisma ORM
- Infra: Docker + Docker Compose

## Arquitetura de Agentes
21 agentes especializados em `.ai-factory/agents/`. Orquestração via TECH-LEAD + CHIEF-OF-STAFF.

## Regras
- Código > 100 linhas → diff/patch apenas
- Handoffs ≤ 200 tokens
- V&V gate de 7 passos antes de commit
- OpenWiki (03:00 UTC) e GNHF (02:00 UTC) rodam automáticos
