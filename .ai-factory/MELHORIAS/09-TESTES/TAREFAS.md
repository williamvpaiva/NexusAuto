# 09-TESTES — Tarefas de Melhoria

## Status Geral da Área

**Status:** 🟡 Em Progresso
**Progresso:** 50% concluído (2 de 4 tarefas)

---

## 📋 Tarefas

### TAREFA TST-001: Verificar e documentar testes de backend existentes ✅

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🟢 Concluído                                 |
| 🗓️ Iniciado em     | 02/07/2026                                   |
| ✅ Concluído em    | 02/07/2026                                   |
| 👤 Responsável     | qa-tester                                    |
| ⚡ Prioridade      | 🔴 Crítica                                   |

#### 🔍 O que existe hoje:
Backend possui 2 arquivos de teste em `backend/tests/`:
- **users.test.ts** (62 linhas): 4 testes — health endpoint, list users, create user (sucesso), create user (email inválido), create user (nome curto). Usa `supertest` + `vitest`, faz chamadas HTTP reais ao Express `app`.
- **memory.test.ts** (313 linhas): 14 testes — CRUD conversations, messages, error logs, token optimization (summary + truncate), stats, context management (com truncation). Testa direto o service (não HTTP), acessa SQLite real via `db.initialize()`.

#### 🎯 O que deve ser feito:
Documentado — testes existem e são de boa qualidade. Cobrem edge cases (id inexistente, email inválido, nome curto) e cenários de integração (paginacão, resolução de erros, otimização de tokens).

#### ❓ Por que corrigir:
N/A — tarefa de verificação concluída.

#### 📦 Entregáveis:
- [x] Relatório de cobertura documentado nesta tarefa

---

### TAREFA TST-002: Adicionar testes para rotas HTTP de memória (E2E)

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente                                  |
| 🗓️ Iniciado em     | -                                            |
| ✅ Concluído em    | -                                            |
| 👤 Responsável     | qa-tester / backend-dev                      |
| ⚡ Prioridade      | 🔴 Crítica                                   |

#### 🔍 O que existe hoje:
Testes de `MemoryService` são unitários (chamam service direto). Não há testes HTTP com `supertest` para os endpoints `/api/v1/memory/*`. Além disso, o router de memória não está registrado (TAREFA ARQ-001), então testes HTTP falhariam.

#### 🎯 O que deve ser feito:
Após registrar o memory router, criar `backend/tests/memory-routes.test.ts` com `supertest` testando: GET /conversations, POST /conversations, GET /conversations/:id, POST /messages, GET /errors, POST /errors, GET /stats, GET /conversations/:id/context.

#### ❓ Por que corrigir:
Verificar que os endpoints HTTP funcionam corretamente com autenticação e validação.

#### 📦 Entregáveis:
- [ ] `memory-routes.test.ts` com 8+ testes de integração HTTP
- [ ] Setup/teardown com banco SQLite temporário

---

### TAREFA TST-003: Configurar ambiente de testes para frontend

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente                                  |
| 🗓️ Iniciado em     | -                                            |
| ✅ Concluído em    | -                                            |
| 👤 Responsável     | qa-tester / frontend-dev                     |
| ⚡ Prioridade      | 🟡 Média                                     |

#### 🔍 O que existe hoje:
`frontend/package.json` referencia `vitest` em scripts de teste mas não tem `vitest` nem `@testing-library/react` em `devDependencies`. Nenhum teste de frontend existe.

#### 🎯 O que deve ser feito:
Adicionar `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` como devDependencies. Configurar `vitest.config.ts`. Criar teste inicial para `HealthPage` e `MemoryDashboard`.

#### ❓ Por que corrigir:
Sem testes de frontend, regressões em UI passam despercebidas; quebra de componentes críticos pode ocorrer.

#### 📦 Entregáveis:
- [ ] `vitest`, `@testing-library/react`, `@testing-library/jest-dom` em devDependencies
- [ ] `vitest.config.ts` no frontend
- [ ] Teste de snapshot para `HealthPage.tsx`
- [ ] Teste de renderização para `Layout.tsx`

---

### TAREFA TST-004: Adicionar teste de inicialização do banco SQLite

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente                                  |
| 🗓️ Iniciado em     | -                                            |
| ✅ Concluído em    | -                                            |
| 👤 Responsável     | qa-tester                                    |
| ⚡ Prioridade      | 🟠 Alta                                      |

#### 🔍 O que existe hoje:
`database.ts` inicializa tabelas SQLite na primeira execução. `memory.test.ts` chama `db.initialize()` no `beforeAll`, mas se o banco falhar ao criar, o teste inteiro pode quebrar sem mensagem clara.

#### 🎯 O que deve ser feito:
Criar `backend/tests/database.test.ts` que testa a inicialização do banco (criação de tabelas, dupla inicialização, path do arquivo).

#### ❓ Por que corrigir:
Garantir que o setup do banco funciona em ambiente limpo e em CI.

#### 📦 Entregáveis:
- [ ] `database.test.ts` com 3+ testes

---

## 🔗 Referências

- [Protocolo V&V](../../.ai-factory/standards/vv-protocol.md)
- [Log de Validações](../LOG-VALIDACOES.md)
- [Painel Geral](../INDEX.md)
