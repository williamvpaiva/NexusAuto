# 13 — MONITORAMENTO

> Observabilidade: logs centralizados, métricas, alerts, dashboards e tracing
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Média
> **Dependências:** 02-DEBUGGING (logger), 03-SISTEMAS (Redis)

---

## 📋 Tarefas

### MON-001 — Métricas de Negócio (Prometheus)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Exportar métricas no formato Prometheus: requests total, requests por rota, latency p50/p95/p99, erros por tipo, agent calls
- **Critério de aceite:** GET /metrics retorna texto Prometheus; métricas têm labels (method, route, status, agent); histograma de latency
- **Esforço:** 5h
- **Prioridade:** Alta

### MON-002 — Health Check Aprofundado (/health)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Endpoint /health detalhado: status SQLite, Redis, workers MCP, versão da app, uptime, memória, CPU
- **Critério de aceite:** /health retorna JSON com status individual de cada dependência; response time < 50ms; inclui versão do build
- **Esforço:** 2h
- **Prioridade:** Alta

### MON-003 — Dashboard Grafana (ou JSON Model)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Dashboard Grafana com visão geral: RPS, latência, erros, uso de memória, status das skills/agentes e health score
- **Critério de aceite:** Dashboard JSON exportável no repositório (`grafana/dashboard.json`); 4+ painéis com dados reais
- **Esforço:** 4h
- **Prioridade:** Média

### MON-004 — Alertas (Webhook + Slack/E-mail)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Configurar alertas automáticos: erro 5xx > 1% em 5 min, disco < 10%, worker offline > 30s, latência p99 > 3s
- **Critério de aceite:** Alerta dispara → webhook POST para Slack/E-mail com contexto (timestamp, valor, threshold)
- **Esforço:** 3h
- **Prioridade:** Média

### MON-005 — Structured Request Logging
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Log estruturado de toda requisição HTTP: method, path, status, duration, user-agent, requestId, ip
- **Critério de aceite:** Cada request gera 1 linha JSON no log; parseável por ferramentas de log aggregation
- **Esforço:** 2h
- **Prioridade:** Alta

### MON-006 — Audit Trail (Tabela de Auditoria)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Tabela `audit_log` no SQLite que registra operações sensíveis: login, criação/deleção de agente, alteração de permissões
- **Critério de aceite:** Operação sensível → INSERT em audit_log com timestamp, usuário, ação, payload e IP; consultável por período
- **Esforço:** 3h
- **Prioridade:** Média

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
