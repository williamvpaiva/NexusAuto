# crud-tarefas-test - Plano Técnico

> **COMO construir** - Tecnologia, arquitetura e decisões técnicas

---

## Stack Tecnológico

| Camada | Tecnologia | Versão | Justificativa |
|--------|------------|--------|---------------|
| Frontend | React + TypeScript | 18.x | Type-safety, ecossistema |
| Backend | Node.js + Express | 20.x | Performance, familiaridade |
| Banco | PostgreSQL | 15.x | ACID, JSONB, full-text search |
| ORM | Prisma | 5.x | Type-safety, migrations |
| Testes | Jest + Playwright | - | Unitários + E2E |

**Stack definido:** Node.js/TypeScript, Express, Prisma, PostgreSQL, React, Tailwind CSS

---

## Arquitetura

### Diagrama de Componentes

```
┌─────────────┐
│  Frontend   │
│   (React)   │
└──────┬──────┘
       │ REST API
┌──────▼──────┐
│   Backend   │
│  (Express)  │
└──────┬──────┘
       │ Prisma
┌──────▼──────┐
│ PostgreSQL  │
└─────────────┘
```

### Estrutura de Diretórios

```
backend/
├── src/
│   ├── controllers/crud-tarefas-test.ts
│   ├── services/crud-tarefas-test.ts
│   ├── repositories/crud-tarefas-test.ts
│   └── models/crud-tarefas-test.ts
frontend/
├── src/
│   ├── components/crud-tarefas-test/
│   ├── pages/crud-tarefas-test/
│   └── services/crud-tarefas-test.ts
```

---

## Schema do Banco de Dados

```prisma
model crud_tarefas_test {
  id          String   @id @default(uuid())
  title       String
  description String?
  status      String   @default("pending")
  dueDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## APIs e Endpoints

### REST Endpoints

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/crud-tarefas-test` | Criar registro | ✅ |
| GET | `/api/crud-tarefas-test` | Listar registros | ✅ |
| GET | `/api/crud-tarefas-test/:id` | Obter registro | ✅ |
| PUT | `/api/crud-tarefas-test/:id` | Atualizar registro | ✅ |
| DELETE | `/api/crud-tarefas-test/:id` | Deletar registro | ✅ |

---

## Estratégia de Testes

| Tipo | Ferramenta | Cobertura Mínima |
|------|------------|------------------|
| Unitários | Jest | 80% |
| Integração | Jest + Supertest | Endpoints críticos |
| E2E | Playwright | Fluxos principais |

---

## Segurança

- [ ] Input validation (Zod/Joi)
- [ ] Output encoding (XSS prevention)
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] SQL injection prevention (Prisma)
- [ ] Auth/JWT validation

---

## Cronograma Estimado

| Fase | Duração | Entregáveis |
|------|---------|-------------|
| Setup | 1 dia | Ambiente, boilerplate |
| Backend | 3 dias | API, models, tests |
| Frontend | 3 dias | Components, pages, tests |
| Integração | 1 dia | E2E, ajustes |
| **Total** | **8 dias** | **Feature completa** |

---

**Status:** 📝 Rascunho  
**Versão:** 1.0.0  
**Criado em:** 2026-07-04  
**Última atualização:** 2026-07-04
