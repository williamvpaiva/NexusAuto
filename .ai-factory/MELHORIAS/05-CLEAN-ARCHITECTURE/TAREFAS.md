# 05 — CLEAN ARCHITECTURE

> Separação de camadas, DTOs, interfaces, injeção de dependência e isolamento de domínio
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Alta
> **Dependências:** Nenhuma

---

## 📋 Tarefas

### CLN-001 — Interfaces de Repositório (Contracts)
- [x] **Status:** ✅ Concluído
- **Descrição:** Extrair interfaces TypeScript para todos os repositórios (IUserRepository, IMessageRepository, IAgentRepository) e injetar via construtor
- **Critério de aceite:** Repositórios implementam interface; services dependem da interface, não da implementação concreta
- **Esforço:** 3h
- **Prioridade:** Alta

### CLN-002 — DTOs de Entrada e Saída
- [x] **Status:** 🟡 Em Andamento (Users feito)
- **Descrição:** Criar DTOs (Data Transfer Objects) para todas as rotas: request validation (Zod) + response serialization (exclui campos internos)
- **Critério de aceite:** Controller recebe DTO validado; retorna DTO sem expor props internas (ex: `password_hash`, `deleted_at`)
- **Esforço:** 3h
- **Prioridade:** Alta

### CLN-003 — Error Hierarchy (Domain Errors)
- [x] **Status:** ✅ Concluído
- **Descrição:** Criar hierarquia de erros de domínio (NotFoundError, ValidationError, UnauthorizedError, ConflictError) com código HTTP mapeado
- **Critério de aceite:** Service lança `new NotFoundError('User')` → middleware captura e retorna 404 com `{ error: 'not_found', message }`
- **Esforço:** 2h
- **Prioridade:** Alta

### CLN-004 — Use Cases / Application Services
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Separar lógica de aplicação em Use Cases (ex: CreateUserUseCase, SendMessageUseCase) independentes de framework (Express)
- **Critério de aceite:** UseCase não importa Express nem HTTP; recebe DTO e retorna resultado; testável sem servidor HTTP
- **Esforço:** 5h
- **Prioridade:** Média

### CLN-005 — Validação Centralizada com Zod
- [x] **Status:** 🟡 Em Andamento (Middleware atualizado)
- **Descrição:** Schema de validação Zod centralizado para todas as entradas (body, query, params), com mensagens de erro padronizadas e i18n-ready
- **Critério de aceite:** Schema inválido retorna `{ errors: [{ field, message, code }] }`; mensagens em português
- **Esforço:** 3h
- **Prioridade:** Alta

### CLN-006 — Mapper Layer (Entity ↔ DTO)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Criar mappers para conversão entre entidades do banco (Prisma/SQLite row) e DTOs, com tratamento de datas, enums e relações
- **Critério de aceite:** `toDTO(entity)` retorna objeto limpo; `toEntity(dto)` prepara para persistência; níveis de profundidade configuráveis
- **Esforço:** 3h
- **Prioridade:** Média

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
