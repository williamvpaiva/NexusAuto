# 08-SEGURANÇA — Tarefas de Melhoria

## Status Geral da Área

**Status:** 🟡 Em Progresso
**Progresso:** 0% concluído (0 de 3 tarefas)

---

## 📋 Tarefas

### TAREFA SEG-001: Implementar middleware de autenticação JWT

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente                                  |
| 🗓️ Iniciado em     | -                                            |
| ✅ Concluído em    | -                                            |
| 👤 Responsável     | security / backend-dev                       |
| ⚡ Prioridade      | 🔴 Crítica                                   |

#### 🔍 O que existe hoje:
`JWT_SECRET` e `JWT_EXPIRES_IN` definidos em `.env.example` e validados em `env.ts`. Classe `UnauthorizedError` existe em `utils/app-error.ts`. Mas **nenhum middleware de autenticação** foi implementado — todas as rotas são públicas.

#### 🎯 O que deve ser feito:
Criar middleware `auth.middleware.ts` que valida token JWT do header `Authorization: Bearer <token>`, extrai payload (`userId`, `role`), e injeta no `req`. Implementar rota `POST /api/v1/auth/login` e proteger rotas de memória e users.

#### ❓ Por que corrigir:
Rotas expostas publicamente permitem que qualquer um acesse/crie dados; JWT é requisito para segurança em produção.

#### 📦 Entregáveis:
- [ ] `middleware/auth.middleware.ts` — verifica e decodifica JWT
- [ ] `controllers/auth.controller.ts` — login com validação de credenciais
- [ ] `routes/auth.routes.ts` — rota pública de login
- [ ] Rotas de memória e users protegidas com `requireAuth`
- [ ] Testes: login válido, token inválido, ausência de token, expiração

---

### TAREFA SEG-002: Rate limiting nas rotas da API

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente                                  |
| 🗓️ Iniciado em     | -                                            |
| ✅ Concluído em    | -                                            |
| 👤 Responsável     | security                                     |
| ⚡ Prioridade      | 🟡 Média                                     |

#### 🔍 O que existe hoje:
Nenhum limite de requisição implementado — ataques de força bruta ou DoS podem sobrecarregar o SQLite.

#### 🎯 O que deve ser feito:
Adicionar `express-rate-limit` com limites configuráveis por rota (ex: 100 req/min para `/api/v1/memory`, 20 req/min para `/api/v1/auth/login`).

#### ❓ Por que corrigir:
Proteção básica contra abuso de API; requisito OWASP ASVS.

#### 📦 Entregáveis:
- [ ] `middleware/rate-limit.middleware.ts` — factory de rate limiters
- [ ] Limite estrito em `/auth/login` (prevenir brute force)
- [ ] Limite moderado em `/memory` e `/users`

---

### TAREFA SEG-003: Validação e sanitização de entrada em todas as rotas

| Campo              | Detalhe                                      |
|--------------------|----------------------------------------------|
| 📌 Status          | 🔴 Pendente                                  |
| 🗓️ Iniciado em     | -                                            |
| ✅ Concluído em    | -                                            |
| 👤 Responsável     | security / backend-dev                       |
| ⚡ Prioridade      | 🟡 Média                                     |

#### 🔍 O que existe hoje:
Users controller usa Zod (bom). Memory controller usa `res.status(400).json(...)` com validação manual inconsistente. Não há sanitização de strings longas ou caracteres especiais.

#### 🎯 O que deve ser feito:
Migrar validação do `memory.controller.ts` para schemas Zod (mesmo padrão de `users.controller.ts`). Adicionar limites de tamanho em campos `content`, `title`, `error_message`.

#### ❓ Por que corrigir:
Previne injeção de conteúdo malicioso no banco de memória; Zod garante erros tipados e consistentes.

#### 📦 Entregáveis:
- [ ] Schemas Zod em `types/memory.ts` para `CreateConversationDTO`, `CreateMessageDTO`, `CreateErrorLogDTO`
- [ ] Validação via middleware `validate(schema)` em todas as rotas de memória
- [ ] Limites de tamanho (ex: `title` max 255, `content` max 10000)

---

## 🔗 Referências

- [Protocolo V&V](../../.ai-factory/standards/vv-protocol.md)
- [Log de Validações](../LOG-VALIDACOES.md)
- [Painel Geral](../INDEX.md)
