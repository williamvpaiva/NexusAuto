# {{feature_name}} - Plano Técnico

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

---

## Arquitetura

### Diagrama de Componentes

```
┌─────────────┐
│  Frontend   │
│   (React)   │
└──────┬──────┘
       │ REST/GraphQL
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
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── models/
│   └── middleware/
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── services/
```

---

## Decisões Técnicas (ADRs)

### ADR-001: [Título da Decisão]

**Contexto:** [Por que esta decisão foi necessária?]

**Decisão:** [O que foi decidido?]

**Consequências:** [Prós e contras]

**Status:** ✅ Aceita

---

### ADR-002: [Título da Decisão]

**Contexto:** [Por que esta decisão foi necessária?]

**Decisão:** [O que foi decidido?]

**Consequências:** [Prós e contras]

**Status:** 📝 Em discussão

---

## Schema do Banco de Dados

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Adicionar campos conforme necessário
}
```

---

## APIs e Endpoints

### REST Endpoints

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/users` | Criar usuário | ✅ |
| GET | `/api/users/:id` | Obter usuário | ✅ |
| PUT | `/api/users/:id` | Atualizar usuário | ✅ |
| DELETE | `/api/users/:id` | Deletar usuário | ✅ |

### Schema da Request/Response

```typescript
// POST /api/users
interface CreateUserRequest {
  email: string;
  name: string;
}

interface CreateUserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
```

---

## Integrações Externas

| Serviço | Propósito | Autenticação | Rate Limit |
|---------|-----------|--------------|------------|
| [Ex: SendGrid] | [Emails transacionais] | [API Key] | [100 req/min] |

---

## Estratégia de Testes

| Tipo | Ferramenta | Cobertura Mínima |
|------|------------|------------------|
| Unitários | Jest | 80% |
| Integração | Jest + Supertest | Endpoints críticos |
| E2E | Playwright | Fluxos principais |

---

## Performance e Escalabilidade

- **Cache:** [Ex: Redis para sessões]
- **CDN:** [Ex: Cloudflare para assets]
- **Rate Limiting:** [Ex: 100 req/min por usuário]
- **Monitoramento:** [Ex: New Relic + Sentry]

---

## Segurança

- [ ] Input validation (Zod/Joi)
- [ ] Output encoding (XSS prevention)
- [ ] CSRF protection
- [ ] Rate limiting
- [ ] SQL injection prevention (Prisma)
- [ ] Auth/JWT validation

---

## Deploy e CI/CD

```yaml
# GitHub Actions
- lint
- test
- build
- deploy (staging)
- smoke tests
- deploy (production)
```

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
**Criado em:** {{date}}  
**Última atualização:** {{date}}