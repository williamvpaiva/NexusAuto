# Backend - Polymarketing API

API RESTful desenvolvida com Express + TypeScript.

## 🚀 Scripts

```bash
# Desenvolvimento (watch)
npm run dev --workspace backend

# Build
npm run build --workspace backend

# Produção
npm run start --workspace backend

# Testes
npm run test --workspace backend
npm run test:watch --workspace backend
npm run test:coverage --workspace backend

# Lint
npm run lint --workspace backend
```

## 📚 Endpoints

### Health
- `GET /api/v1/health` - Healthcheck da API

### Users
- `GET /api/v1/users` - Listar usuários
- `GET /api/v1/users/:id` - Buscar usuário por ID
- `POST /api/v1/users` - Criar usuário
- `PUT /api/v1/users/:id` - Atualizar usuário
- `DELETE /api/v1/users/:id` - Remover usuário

## 📝 Exemplo de Requisição

### Criar Usuário
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Marie Curie", "email": "marie@example.com"}'
```

### Response
```json
{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "name": "Marie Curie",
    "email": "marie@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🧪 Testes

Os testes usam Vitest + Supertest:

```bash
# Rodar testes
npm run test --workspace backend

# Com coverage
npm run test:coverage --workspace backend
```

## 🏗️ Arquitetura

```
src/
├── config/         # Configurações (env, database)
├── controllers/    # Handlers de request
├── middleware/     # Middlewares (auth, error handler)
├── routes/         # Definição de rotas
├── services/       # Regras de negócio
├── types/          # Types TypeScript
└── utils/          # Helpers e utilitários
```

## 🔒 Segurança

- Validação de inputs com Zod
- CORS configurado
- Helmet (security headers)
- Rate limiting
- Tratamento de erros centralizado

## 📊 Status Codes

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado |
| 204 | Sucesso sem conteúdo |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

## 🔗 Links

- [Backend Patterns](../../.ai-factory/standards/backend-patterns.md)
- [Code Style](../../.ai-factory/standards/code-style.md)
- [Testing Policy](../../.ai-factory/standards/testing-policy.md)