# 18 — API E INTEGRAÇÕES

> Integrações externas: webhooks, APIs de terceiros, adapters e contratos
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Alta
> **Dependências:** 01-ARQUITETURA

---

## 📋 Tarefas

### API-001 — Adapter Pattern para APIs Externas
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar adapter pattern para integrações externas (WhatsApp, OpenAI, Telegram), com interface comum, retry e fallback
- **Critério de aceite:** Adapter WhatsApp + adapter Telegram implementam `IMessagingAdapter.send(msg)`; falha em um não afeta o outro
- **Esforço:** 6h
- **Prioridade:** Alta

### API-002 — Webhook Receiver Padronizado
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Endpoint unificado `/webhooks/:provider` que valida assinatura (HMAC), filtra eventos duplicados (idempotency key) e roteia para handler
- **Critério de aceite:** Webhook com HMAC válido → processa; inválido → 401; mesmo `X-Idempotency-Key` repetido → 200 sem processar
- **Esforço:** 4h
- **Prioridade:** Alta

### API-003 — Rate Limit por Integração
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Rate limiter por provider externo com bucket token, fila de espera e alerta de接近 limite
- **Critério de aceite:** OpenAI 60 RPM → 55ª req no minuto enfileira; 61ª → 429; log alerta quando > 80% do limite
- **Esforço:** 3h
- **Prioridade:** Alta

### API-004 — API Key Management (Interna)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Sistema de chaves de API para integradores: geração, rotação, revogação e permissões por chave
- **Critério de aceite:** `POST /api-keys` gera key; `DELETE /api-keys/:id` revoga; request com API key inválida → 401
- **Esforço:** 4h
- **Prioridade:** Média

### API-005 — Cache de Respostas Externas
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Cache respostas de APIs externas (OpenAI, por exemplo) por hash do request, com TTL e invalidação manual
- **Critério de aceite:** Mesmo prompt → retorna cached (se TTL válido); invalidação manual via endpoint admin
- **Esforço:** 3h
- **Prioridade:** Média

### API-006 — Documentação de Integrações
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Documentar cada integração: endpoint, autenticação, rate limits, exemplos de request/response, erros possíveis
- **Critério de aceite:** Documento por integração em `docs/integrations/`; exemplos em curl e JavaScript
- **Esforço:** 3h
- **Prioridade:** Média

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
