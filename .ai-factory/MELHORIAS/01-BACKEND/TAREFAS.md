# 01-BACKEND - Tarefas

> **Gestão de tarefas da área**

---

## Feature: crud-tarefas-test (2026-07-04)

# crud-tarefas-test - Lista de Tarefas

> **Tarefas ordenadas por dependência** - Executar em sequência

---

## Tarefas

### ✅ TAREFA 1: Configurar ambiente e boilerplate

**Tipo:** Infra  
**Prioridade:** 🟡 Alta  
**Estimativa:** 4 horas  
**Dependências:** Nenhuma

**Descrição:**
Configurar ambiente de desenvolvimento, criar estrutura de diretórios e boilerplate do projeto.

**Critérios de Conclusão:**
- [x] Repositório configurado
- [x] Docker compose para PostgreSQL
- [x] ESLint + Prettier configurados
- [x] CI/CD básico

**Atribuído para:** devops

---

### ✅ TAREFA 2: Criar modelo e migrations Prisma

**Tipo:** Backend  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 3 horas  
**Dependências:** TAREFA 1

**Descrição:**
Definir schema Prisma e criar migrations para o banco de dados.

**Critérios de Conclusão:**
- [x] Schema definido em schema.prisma
- [x] Migration criada e aplicada
- [x] Seed data para testes

**Atribuído para:** backend-dev

---

### ✅ TAREFA 3: Implementar API REST

**Tipo:** Backend  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 8 horas  
**Dependências:** TAREFA 2

**Descrição:**
Criar endpoints REST para CRUD completo.

**Critérios de Conclusão:**
- [x] POST /api/crud-tarefas-test
- [x] GET /api/crud-tarefas-test
- [x] GET /api/crud-tarefas-test/:id
- [x] PUT /api/crud-tarefas-test/:id
- [x] DELETE /api/crud-tarefas-test/:id
- [x] Validação com Zod
- [x] Tratamento de erros

**Atribuído para:** backend-dev

---

### ✅ TAREFA 4: Criar componentes React

**Tipo:** Frontend  
**Prioridade:** 🟡 Alta  
**Estimativa:** 8 horas  
**Dependências:** TAREFA 3

**Descrição:**
Implementar componentes React para UI do CRUD.

**Critérios de Conclusão:**
- [x] Lista de registros com paginação
- [x] Formulário de criação/edição
- [x] Modal de confirmação de exclusão
- [x] Loading states e error states

**Atribuído para:** frontend-dev

---

### ✅ TAREFA 5: Integrar frontend com backend

**Tipo:** Frontend + Backend  
**Prioridade:** 🔴 Crítica  
**Estimativa:** 4 horas  
**Dependências:** TAREFA 3, TAREFA 4

**Descrição:**
Conectar frontend à API backend.

**Critérios de Conclusão:**
- [x] Service layer para chamadas API
- [x] React Query para cache
- [x] Toast notifications
- [x] Error handling global

**Atribuído para:** frontend-dev

---

### ✅ TAREFA 6: Testes E2E

**Tipo:** QA  
**Prioridade:** 🟡 Alta  
**Estimativa:** 4 horas  
**Dependências:** TAREFA 5

**Descrição:**
Criar testes end-to-end com Playwright.

**Critérios de Conclusão:**
- [x] Teste de criação
- [x] Teste de listagem
- [x] Teste de edição
- [x] Teste de exclusão

**Atribuído para:** qa-tester

---

## Progresso

| Tarefa | Status | Agente | Iniciado em | Concluído em |
|--------|--------|--------|-------------|--------------|
| 1 | ✅ Concluído | devops | 2026-07-19 | 2026-07-19 |
| 2 | ✅ Concluído | backend-dev | 2026-07-19 | 2026-07-19 |
| 3 | ✅ Concluído | backend-dev | 2026-07-19 | 2026-07-19 |
| 4 | ✅ Concluído | frontend-dev | 2026-07-19 | 2026-07-19 |
| 5 | ✅ Concluído | frontend-dev | 2026-07-19 | 2026-07-19 |
| 6 | ✅ Concluído | qa-tester | 2026-07-19 | 2026-07-19 |

---

**Status:** ✅ Concluído
**Versão:** 1.1.0  
**Criado em:** 2026-07-04  
**Última atualização:** 2026-07-19

---

## Feature: auth-advanced (2026-07-19)

# Autenticação Avançada (JWT + RBAC)

> **Tarefas ordenadas por dependência**

---

### ✅ TAREFA 7: Modelos de Auth no Prisma
**Tipo:** Backend
**Prioridade:** 🔴 Crítica
**Atribuído para:** backend-dev
**Descrição:** Atualizar schema.prisma com User, Session e roles.

### ✅ TAREFA 8: Lógica JWT e Hash (auth.service)
**Tipo:** Backend
**Prioridade:** 🔴 Crítica
**Atribuído para:** backend-dev

### ✅ TAREFA 9: Middlewares e Rotas de Auth
**Tipo:** Backend
**Prioridade:** 🔴 Crítica
**Atribuído para:** backend-dev

---

## Feature: sales-automation (2026-07-19)

# Automação de Vendas/Leads (Captação)

> **Tarefas ordenadas por dependência**

---

### ✅ TAREFA 10: Modelos de Lead no Prisma
**Tipo:** Backend
**Prioridade:** 🟡 Alta
**Atribuído para:** backend-dev
**Descrição:** Atualizar schema.prisma com Lead model e relacional com User.

### ✅ TAREFA 11: Webhook e Lógica de Round Robin
**Tipo:** Backend
**Prioridade:** 🟡 Alta
**Atribuído para:** backend-dev

---