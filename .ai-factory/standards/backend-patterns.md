# Padrões Backend

## Arquitetura de Camadas

```
Request → Route → Middleware → Controller → Service → Repository → Database
```

## Responsabilidade de cada Camada

| Camada | Responsabilidade | NÃO faz |
|--------|------------------|---------|
| **Route** | Define endpoint, aplica schema de validação | Lógica |
| **Middleware** | Auth, logging, rate limit | Regra de negócio |
| **Controller** | Extrai dados do request, chama service, formata response | Regra de negócio, acesso a dados |
| **Service** | Regras de negócio, orquestração, transactions | SQL direto, conhece HTTP |
| **Repository** | Acesso a dados, queries | Regras de negócio |
| **Entity/Domain** | Estruturas e invariantes do domínio | I/O |

## Design de API REST

### Endpoints Padrão
```
GET    /api/v1/users          # Listar (com paginação)
GET    /api/v1/users/:id      # Buscar um
POST   /api/v1/users          # Criar
PUT    /api/v1/users/:id      # Substituir (completo)
PATCH  /api/v1/users/:id      # Atualizar (parcial)
DELETE /api/v1/users/:id      # Remover
GET    /api/v1/users/:id/orders  # Sub-recursos
POST   /api/v1/orders/:id/cancel # Ações não-CRUD
```

### Regras de API
- ✅ Substantivos no plural (sempre em inglês)
- ✅ Kebab-case em URLs: `/order-items`
- ✅ Versionamento obrigatório: `/api/v1`
- ❌ Nunca verbos no recurso: NÃO usar `/getUsers` ou `/createOrder`

## Status Codes

| Código | Significado | Quando usar |
|--------|-------------|-------------|
| 200 | Sucesso com corpo | GET, PATCH bem-sucedidos |
| 201 | Criado | POST bem-sucedido (retornar recurso + header Location) |
| 204 | Sucesso sem corpo | DELETE bem-sucedido |
| 400 | Bad Request | JSON inválido, malformado |
| 401 | Unauthorized | Não autenticado |
| 403 | Forbidden | Autenticado mas sem permissão |
| 404 | Not Found | Recurso não existe |
| 409 | Conflict | Duplicidade, conflito |
| 422 | Unprocessable Entity | Validação falhou (dados semânticos) |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Erro interno (nunca vazar detalhes) |

## Paginação Padrão

### Request
```
GET /api/v1/users?page=1&perPage=20&sortBy=createdAt&order=desc&search=termo
```

### Response (Sucesso)
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Response (Erro)
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição legível",
    "details": [...]
  }
}
```

## Validação de Input
- ✅ Toda entrada validada com schema (Zod, Joi, class-validator)
- ✅ Validar na borda (route ou controller)
- ✅ Whitelist de campos (rejeitar campos extras)
- ❌ Nunca confiar no client

## Banco de Dados

### Migrations
- ✅ Migrations sempre reversíveis (up + down)
- ✅ Nunca editar migration já aplicada (criar nova)

### Nomenclatura
- ✅ Tabelas: snake_case, plural (`users`, `order_items`)
- ✅ PK: `id` UUID v7 ou bigserial
- ✅ Timestamps obrigatórios: `created_at`, `updated_at`
- ✅ Soft delete (quando necessário): `deleted_at`
- ✅ FKs: `tabela_singular_id` (`user_id`)

### Performance
- ✅ Índices para toda coluna em WHERE, JOIN frequente
- ✅ Nunca `SELECT *` em produção
- ✅ Constraints de integridade (FK, unique, check)

## Logging

### Formato
```json
{
  "level": "info",
  "message": "User created",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "userId": "123",
  "requestId": "abc-456"
}
```

### Níveis
- `error`: falhas
- `warn`: anomalias
- `info`: eventos de negócio
- `debug`: dev only (não usar em produção)

### Proibido em Logs
- ❌ Senhas
- ❌ Tokens
- ❌ Secrets
- ❌ Dados de cartão
- ❌ PII completa

## Operações Assíncronas (mover para fila quando)

- ✅ Envio de emails e notificações
- ✅ Processamento de arquivos e imagens
- ✅ Integrações com terceiros (lentos)
- ✅ Relatórios pesados
- ✅ Qualquer coisa acima de 2 segundos

### Obrigatório em Filas
- ✅ Idempotência
- ✅ Retry com backoff exponencial + jitter
- ✅ Dead Letter Queue