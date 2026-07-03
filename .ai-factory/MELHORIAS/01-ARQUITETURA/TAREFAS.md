# 01-ARQUITETURA — Tarefas de Melhoria

## Status Geral da Área

**Status:** 🟡 Em Progresso
**Progresso:** 0% concluído (0 de 3 tarefas)

---

## 📋 Tarefas

### TAREFA ARQ-001: Registrar memory router no routes/index.ts

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente                                  |
| 🗓️ Iniciado em     | -                                            |
| ✅ Concluído em    | -                                            |
| 👤 Responsável     | backend-dev                                  |
| ⚡ Prioridade      | 🔴 Crítica                                   |

#### 🔍 O que existe hoje:
`memory.controller.ts` cria um `Router` com endpoints REST completos (`/conversations`, `/conversations/:id`, `/conversations/:conversationId/messages`, `/errors`, `/errors/:id`, `/stats`, `/optimize`), mas `routes/index.ts` apenas importa e registra `healthRouter` e `usersRouter`. A linha `apiRouter.use('/memory', memoryRouter)` não existe.

#### 🎯 O que deve ser feito:
Adicionar import e registro do `memoryRouter` em `backend/src/routes/index.ts` para expor os endpoints `/api/v1/memory/*`.

#### ❓ Por que corrigir:
Os endpoints de memória são o core do negócio — sem eles, o frontend `MemoryDashboard` não funciona e agentes não conseguem persistir/recuperar contexto.

#### 📦 Entregáveis:
- [ ] `routes/index.ts` atualizado com `import { memoryRouter }` + `apiRouter.use('/memory', memoryRouter)`
- [ ] Teste de integração confirmando rota `/api/v1/memory/conversations` retorna 200

---

### TAREFA ARQ-002: Unificar error handling no memory.controller.ts

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente                                  |
| 🗓️ Iniciado em     | -                                            |
| ✅ Concluído em    | -                                            |
| 👤 Responsável     | backend-dev                                  |
| ⚡ Prioridade      | 🟠 Alta                                      |

#### 🔍 O que existe hoje:
O controller usa `throw new AppError(...)` em alguns trechos, mas em validações (ex: `res.status(400).json(...)`) usa resposta direta sem delegar ao middleware de erro.

#### 🎯 O que deve ser feito:
Substituir todos os `res.status(4xx).json(...)` por `throw new AppError(..., statusCode)` para que o `error-handler.ts` unifique o formato de resposta.

#### ❓ Por que corrigir:
Consistência de API — clientes esperam mesmo formato de erro em toda a aplicação.

#### 📦 Entregáveis:
- [ ] `memory.controller.ts` sem `res.status(...).json(...)` de erro — todos viram `throw new AppError`
- [ ] Todos os endpoints retornam `{ success: false, error: { code, message } }` consistentemente

---

### TAREFA ARQ-003: Persistir users no SQLite (remover mock em memória)

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente                                  |
| 🗓️ Iniciado em     | -                                            |
| ✅ Concluído em    | -                                            |
| 👤 Responsável     | backend-dev                                  |
| ⚡ Prioridade      | 🟠 Alta                                      |

#### 🔍 O que existe hoje:
`users.service.ts` mantém array em memória. Usuários criados via POST são perdidos ao reiniciar o servidor. Diferente do módulo `memory` que já usa SQLite com repository pattern e DTOs.

#### 🎯 O que deve ser feito:
Migrar `users.service.ts` para usar SQLite (mesmo padrão de `memory.service.ts`): criar tabela `users`, repository, DTOs tipados, e remover array volátil.

#### ❓ Por que corrigir:
Users são entidade fundamental para futura autenticação JWT; persistência evita perda de dados entre restart.

#### 📦 Entregáveis:
- [ ] Tabela `users` criada em `database.ts` (schema init)
- [ ] `UsersRepository` com CRUD SQLite
- [ ] DTOs tipados em `types/` (CreateUserDTO, UserResponse)
- [ ] Testes de integração para UsersRepository

---

## 📊 Instruções de Uso

1. Execute cada tarefa em ordem de prioridade
2. Execute V&V após cada implementação
3. Registre no LOG-VALIDACOES.md
4. Atualize INDEX.md com o progresso

---

## 🔗 Referências

- [Protocolo V&V](../../.ai-factory/standards/vv-protocol.md)
- [Log de Validações](../LOG-VALIDACOES.md)
- [Painel Geral](../INDEX.md)
