# 02 — DEBUGGING

> Infraestrutura de debug, logging estruturado, tracing e ferramentas de diagnóstico
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Alta
> **Dependências:** 01-ARQUITETURA (concluído)

---

## 📋 Tarefas

### DBG-001 — Logger Estruturado Centralizado
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Criar logger estruturado (winston/pino) com níveis configuráveis, formato JSON e saída para console + arquivo
- **Critério de aceite:** `logger.info('msg', { ctx })` produz JSON parseável com timestamp, nível, mensagem, requestId e metadados
- **Esforço:** 2h
- **Prioridade:** Alta

### DBG-002 — Request ID Tracing via Middleware Express
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Middleware Express que injeta `x-request-id` em cada requisição HTTP, propaga para logs e responde com header correlatable
- **Critério de aceite:** Toda requisição tem requestId único no log, no header de resposta e em erros lançados
- **Esforço:** 1h
- **Prioridade:** Alta

### DBG-003 — Endpoint /health + /debug/env
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Endpoints de diagnóstico: `/health` (status Redis/SQLite/uptime) e `/debug/env` (variáveis sanitizadas — valores ocultos)
- **Critério de aceite:** `/health` retorna 200 com status de dependências; `/debug/env` retorna vars sem expor secrets
- **Esforço:** 2h
- **Prioridade:** Média

### DBG-004 — Pretty Error Stack no Desenvolvimento
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Plugin/middleware que formata stack traces para leitura humana em dev, com links para arquivos-fonte
- **Critério de aceite:** Erros não tratados exibem stack formatado com contexto (source maps ou código adjacente)
- **Esforço:** 1h
- **Prioridade:** Média

### DBG-005 — Error Tracking Service Abstraction
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Camada de abstração para error tracking (Sentry/Bugsnag/roll-your-own) que captura exceções não tratadas, rejeições de Promise e erros de middleware
- **Critério de aceite:** Erro não tratado é capturado e enviado ao serviço configurado sem vazar stack para o cliente
- **Esforço:** 3h
- **Prioridade:** Alta

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
