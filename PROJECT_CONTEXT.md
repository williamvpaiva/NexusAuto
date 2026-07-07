# PROJECT_CONTEXT — NexusAuto AI Factory

## Nome do Projeto
POLYMARKETING

## Problema
Agentes de IA perdem contexto entre execuções — não há memória persistente de conversas, erros ou otimizações de tokens. Cada nova execução começa do zero, ignorando lições aprendidas, decisões anteriores e padrões de erro. Projetos multiagentes sofrem com fragmentação de conhecimento e retrabalho.

## Objetivo
Construir um **sistema de memória persistente para agentes de IA** com backend Express + SQLite que armazene conversas, mensagens, logs de erro, otimização de tokens e cache de queries, exposto via API REST e frontend React para visualização. Serve como camada de memória para fábrica SaaS orquestrada por 10 agentes de IA.

## Usuários / Personas
- **Agente de IA**: Consome API REST para persistir/recuperar contexto de execuções anteriores
- **Desenvolvedor**: Visualiza histórico de conversas, erros e métricas de otimização no frontend
- **Tech Lead**: Monitora saúde do sistema via endpoints de health check e dashboard de memória
- **DevOps**: Configura ambiente, variáveis e deploys via scripts npm e CLI

## Restrições
- **Prazo:** Contínuo — projeto em desenvolvimento ativo
- **Orçamento:** Zero — stack 100% open-source (Express, SQLite, React, Vite)
- **Compliance:** JWT middleware implementado (`middleware/auth.ts` com `jsonwebtoken`) ativo em rotas protegidas; LGPD aplicável a dados de usuário
- **Integrações obrigatórias:** SQLite via `sqlite3` (atual), PostgreSQL como melhoria futura

## Requisitos Não-Funcionais (NFR)
- **Performance:** SQLite com índices em agent_id, conversation_id, error_code; token_count calculado em cada mensagem
- **Segurança:** Helmet + CORS configurados; JWT_SECRET no env (middleware não implementado); AppError com classes NotFoundError, UnauthorizedError, ForbiddenError, ConflictError
- **Disponibilidade:** SQLite file-based (./data/memory.db) — sem replicação; viável para desenvolvimento
- **Observabilidade:** Endpoint GET /api/v1/health com status do serviço; logs de erro persistidos em tabela error_logs

## Estado Atual
- **Fase:** development
- **Workflow:** new-feature
- **Agente Atual:** backend-dev (🔄)
- **Próximo Agente:** security (auth middleware), qa-tester (testes E2E)

## Stack Tecnológico
- **Frontend:** React 18 + Vite 5 + TypeScript 5 + react-router-dom 6
- **Backend:** Express + TypeScript + Zod + Helmet + CORS + dotenv
- **Database:** SQLite (via `sqlite3` npm, arquivo `./data/memory.db`)
- **Testes:** Vitest + Supertest (backend)
- **Cache:** Não implementado (Redis listado como futuro)
- **Infra:** Docker Compose (pendente), npm workspaces (monorepo)

## Estrutura do Backend
```
backend/src/
├── config/
│   ├── database.ts      # SQLite singleton (./data/memory.db)
│   └── env.ts           # Validação de env vars com zod
├── controllers/
│   ├── health.controller.ts
│   ├── users.controller.ts     # Zod validation + AppError (padrão)
│   └── memory.controller.ts    # Endpoints definidos mas NÃO registrados no router
├── middleware/
│   └── error-handler.ts        # AppError + ZodError + erros genéricos
├── routes/
│   └── index.ts         # Só registra healthRouter e usersRouter (falta memoryRouter)
├── services/
│   ├── users.service.ts # Mock em memória (array)
│   └── memory.service.ts# CRUD completo: conversations, messages, errors, tokens
├── types/
│   └── memory.ts        # DTOs e interfaces
├── utils/
│   └── app-error.ts     # AppError, NotFoundError, ConflictError, UnauthorizedError, ForbiddenError
├── app.ts               # Express app export (usado por server.ts e testes)
└── server.ts            # Listen na porta do env
```

## Estrutura do Frontend
```
frontend/src/
├── components/
│   ├── Layout.tsx
│   └── MemoryList.tsx
├── lib/
│   └── api.ts           # Cliente HTTP para API
├── pages/
│   ├── HomePage.tsx
│   ├── HealthPage.tsx
│   └── MemoryDashboard.tsx  # UI real para visualizar memória
├── App.tsx
└── main.tsx
```

## Links Úteis
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health: http://localhost:3000/api/v1/health
- Memory API: http://localhost:3000/api/v1/memory (⚠️ não registrada no router — precisa ativar)

## Gaps Conhecidos (Prioritários)
1. ~~**Memory routes não conectadas**~~ ✅ RESOLVIDO — `routes/index.ts` importa `memoryRouter` do controller e registra em `/memory`
2. ~~**Error handling inconsistente**~~ ✅ RESOLVIDO — `memory.controller.ts` usa `asyncHandler` + `AppError` via services
3. ~~**Auth não implementada**~~ ✅ RESOLVIDO — `middleware/auth.ts` com `jsonwebtoken` ativo em rotas protegidas (`/users`, `/memory`)
4. ~~**Users sem persistência**~~ ✅ RESOLVIDO — `users.repository.ts` usa SQLite via `db`; tabela `users` criada com seed admin
5. ~~**Path hardcoded do SQLite**~~ ✅ RESOLVIDO — `database.ts` cria diretório `data/` automaticamente se não existir
6. ~~**Frontend sem testes**~~ ✅ RESOLVIDO — `vitest` + `@testing-library` instalados; 3 testes existentes (`App.test.tsx`, `Layout.test.tsx`, `HealthPage.test.tsx`)
7. ~~**Arquivo morto memory-routes.ts**~~ ✅ RESOLVIDO — removido (nunca era importado, `memoryApi: null`)

## Histórico de Decisões
Ver `.ai-factory/brain/Key Decisions.md` para Architecture Decision Records.

---
*Última atualização: 02/07/2026*
