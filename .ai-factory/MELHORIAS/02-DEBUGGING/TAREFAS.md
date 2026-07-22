# 02 — DEBUGGING

> Infraestrutura de debug, logging estruturado, tracing e ferramentas de diagnóstico
>
> **Status:** 🟡 Em Progresso (5/5 tarefas concluídas)
> **Prioridade:** Alta
> **Dependências:** 01-ARQUITETURA (concluído)

---

### DBG-001 — Logger Estruturado Centralizado

- [x] **Status:** ✅ Concluído
- **Descrição:** Criar logger estruturado (pino) com níveis configuráveis, formato JSON e pretty-print em dev
- **Arquivo:** `src/utils/logger.ts`
- **Critério de aceite:** `logger.info('msg', { ctx })` produz JSON parseável com timestamp, nível, mensagem, requestId e metadados
- **V&V:** ✅ APROVADO

### DBG-002 — Request ID Tracing via Middleware Express

- [x] **Status:** ✅ Concluído (já existente)
- **Descrição:** Middleware Express que injeta `x-request-id` em cada requisição HTTP, propaga para logs e responde com header
- **Arquivo:** `src/middleware/request-id.ts` (já existente e funcional)
- **Critério de aceite:** Toda requisição tem requestId único no log, no header de resposta e em erros lançados
- **V&V:** ✅ APROVADO

### DBG-003 — Endpoint /health + /debug/env

- [x] **Status:** ✅ Concluído
- **Descrição:** Endpoints de diagnóstico: `/health` (status Redis/SQLite/uptime/memória) e `/debug/env` (variáveis sanitizadas)
- **Arquivo:** `src/routes/health.routes.ts`
- **Critério de aceite:** `/health` retorna 200/503 com status de dependências; `/debug/env` retorna vars sem expor secrets
- **V&V:** ✅ APROVADO

### DBG-004 — Pretty Error Stack no Desenvolvimento

- [x] **Status:** ✅ Concluído
- **Descrição:** Middleware que formata stack traces coloridos com contexto em dev
- **Arquivo:** `src/middleware/pretty-error.ts`
- **Critério de aceite:** Erros não tratados exibem stack formatado com cores e arquivos-fonte
- **V&V:** ✅ APROVADO

### DBG-005 — Error Tracking Service Abstraction

- [x] **Status:** ✅ Concluído
- **Descrição:** Camada de abstração para error tracking com adapter pattern (console default, Sentry plugável)
- **Arquivo:** `src/services/error-tracking.service.ts`
- **Critério de aceite:** Erro não tratado é capturado e enviado ao serviço configurado sem vazar stack para o cliente
- **V&V:** ✅ APROVADO

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
