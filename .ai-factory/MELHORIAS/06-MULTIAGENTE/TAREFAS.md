# 06 — MULTIAGENTE

> Sistema multiagente: orquestração, handoff, memória distribuída, skills registry e coordenação
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Alta
> **Dependências:** 03-SISTEMAS (Redis/filas), 01-ARQUITETURA

---

## 📋 Tarefas

### MTA-001 — Skill Registry Service
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar serviço de registro de skills (agentes) com descoberta, metadata (nome, versão, capacidades, dependências) e health check
- **Critério de aceite:** Skill pode ser registrada em runtime; `/skills` lista skills ativas com status (online/offline); health check periódico
- **Esforço:** 5h
- **Prioridade:** Alta

### MTA-002 — Handoff Protocol entre Agentes
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar protocolo de handoff entre agentes com contexto serializado, timeout, fallback e chain de responsabilidade
- **Critério de aceite:** Agente A chama agente B com contexto → B processa → B retorna resultado → A continua; timeout de 30s com fallback
- **Esforço:** 6h
- **Prioridade:** Alta

### MTA-003 — Memória Distribuída (Redis/Valkey)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Camada de memória compartilhada entre agentes via Redis com TTL, namespaces por skill e suporte a cache de conversas
- **Critério de aceite:** Agente escreve `memoria:skill-a:key` → agente B lê; TTL configuravel por namespace; LRU eviction
- **Esforço:** 4h
- **Prioridade:** Alta

### MTA-004 — Orchestrator Brain (Router de Skills)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar "orquestrador central" que analisa intent do usuário, roteia para skill apropriada e consolida respostas multi-skill
- **Critério de aceite:** Mensagem "quero criar lead" → roteia para skill CRM → resposta consolidada; fallback se nenhuma skill cobre o intent
- **Esforço:** 8h
- **Prioridade:** Alta

### MTA-005 — Chain of Thought + Reflexão Pós-Ação
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Adicionar ciclo de reflexão: agente executa → avalia resultado → ajusta → reexecuta se necessário (max 3 tentativas)
- **Critério de aceite:** Log mostra chain: `[pensou] → [agiu] → [refletiu: sucesso/fallha] → [ajustou/repetiu]`; máximo 3 ciclos
- **Esforço:** 4h
- **Prioridade:** Média

### MTA-006 — Circuit Breaker por Skill
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar circuit breaker para skills com falha: 5 erros consecutivos → circuito abre → 30s cooldown → half-open → testa
- **Critério de aceite:** Skill com falha não bloqueia outras skills; log indica "circuito aberto para skill X"; requisições vão para fallback
- **Esforço:** 3h
- **Prioridade:** Média

### MTA-007 — Log e Auditoria de Chamadas entre Agentes
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Log estruturado de toda chamada inter-agente: origem, destino, timestamp, payload size, status e duração
- **Critério de aceite:** Tabela `agent_calls` no SQLite ou Redis; consultável por período, skill origem/destino; retenção de 7 dias
- **Esforço:** 3h
- **Prioridade:** Baixa

### MTA-008 — Integração GNHF (Workflow Autônomo)
- [x] **Status:** 🟢 Concluído
- **Descrição:** Implementar projeto GNHF (`scripts/gnhf/`) para automação de tarefas noturnas em loop, incluindo GitManager e ExecutionLoop.
- **Critério de aceite:** Diretório configurado, máquina de estados iniciada e relatórios markdown estruturados.
- **Esforço:** 2h
- **Prioridade:** Alta

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
