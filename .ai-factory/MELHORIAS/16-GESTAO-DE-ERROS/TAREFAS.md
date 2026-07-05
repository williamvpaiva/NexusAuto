# 16 — GESTÃO DE ERROS

> Tratamento centralizado de erros, mensagens amigáveis, fallbacks e resiliência
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Alta
> **Dependências:** 02-DEBUGGING (logger), 07-UI-COMPONENTS (ErrorFallback)

---

## 📋 Tarefas

### GER-001 — Middleware Global de Erro (Backend)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Middleware Express que captura todo erro não tratado, loga estruturado, retorna JSON padronizado e não vaza stack trace
- **Critério de aceite:** Erro síncrono/assíncrono → resposta `{ error: code, message, requestId }`; ambiente dev inclui stack; prod omite
- **Esforço:** 2h
- **Prioridade:** Alta

### GER-002 — Error Boundary no React Router
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Envolver rotas do React Router com ErrorBoundary por rota, com fallback UI e logging para console/sentry
- **Critério de aceite:** Erro na página Home → ErrorFallback visível → clique "Tentar novamente" → reload da rota; erro não afeta outras rotas
- **Esforço:** 2h
- **Prioridade:** Alta

### GER-003 — Tratamento de Erros de API (Frontend)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Camada de tratamento de erros HTTP no frontend: 401 → redirect login, 403 → "sem permissão", 429 → "muitas requisições", 500 → "tente novamente"
- **Critério de aceite:** 401 redireciona para /login; 429 exibe toast "Muitas requisições. Aguarde..."; 500 exibe erro amigável
- **Esforço:** 3h
- **Prioridade:** Alta

### GER-004 — Retry Automático com Backoff
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar retry automático para requisições HTTP falhas (5xx, network error) com backoff exponencial e jitter
- **Critério de aceite:** 502 → retry após 1s, 2s, 4s (max 3); sucesso na 2ª tentativa → sem erro visível ao usuário; todas falham → mostra erro
- **Esforço:** 3h
- **Prioridade:** Média

### GER-005 — Erros de Validação Padronizados
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Formato unificado de erro de validação (Zod): `{ errors: [{ field: "email", code: "invalid_string", message: "E-mail inválido" }] }`
- **Critério de aceite:** Validação de formulário retorna erros mapeados por campo; mensagens internacionalizáveis e em português
- **Esforço:** 2h
- **Prioridade:** Alta

### GER-006 — Graceful Degradation de Funcionalidades
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Identificar funcionalidades não-críticas que podem falhar sem quebrar a app: histórico, notificações, recomendações
- **Critério de aceite:** Seção "Histórico" falha → seção oculta ou mostra "Indisponível no momento"; app principal continua funcional
- **Esforço:** 2h
- **Prioridade:** Média

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
