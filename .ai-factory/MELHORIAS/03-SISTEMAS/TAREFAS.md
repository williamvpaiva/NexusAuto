# 03 — SISTEMAS

> Orquestração de containers, filas, eventos, worker pool e integração OpenWA/MCP
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Alta
> **Dependências:** Nenhuma

---

## 📋 Tarefas

### SIS-001 — Dockerfile da Aplicação (Backend)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Criar Dockerfile multi-stage para o backend Node.js com alpine, instalação de deps de produção apenas, copia build e executa com usuário não-root
- **Critério de aceite:** `docker build` produz imagem < 150 MB; container inicia sem warnings; saúde via HEALTHCHECK
- **Esforço:** 3h
- **Prioridade:** Alta

### SIS-002 — Dockerfile do Frontend (Nginx)
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Criar Dockerfile multi-stage para o frontend Vite + Nginx alpine com compressão gzip/brotli, cache de assets e headers de segurança
- **Critério de aceite:** Build produz imagem < 50 MB; assets servidos com Content-Encoding, Cache-Control e security headers
- **Esforço:** 2h
- **Prioridade:** Alta

### SIS-003 — docker-compose com Todos os Serviços
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Atualizar docker-compose.yml para incluir backend, frontend, Redis (cache/filas) e PostgreSQL opcional, com redes isoladas, volumes e healthchecks
- **Critério de aceite:** `docker compose up` deixa app + frontend + Redis acessíveis; `docker compose down --volumes` limpa tudo
- **Esforço:** 3h
- **Prioridade:** Alta

### SIS-004 — Docker Compose Override para Dev
- [ ] **Status:** 🔴 Pendente
- **Descrição:** `docker-compose.override.yml` com hot-reload (volumes bind), variáveis de ambiente dev e perfil de logs verbose
- **Critério de aceite:** Alteração no código backend é refletida sem rebuild; frontend Vite HMR funciona
- **Esforço:** 1h
- **Prioridade:** Média

### SIS-005 — Fila de Eventos com Bull/BullMQ + Redis
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar fila de processamento assíncrono com Bull (Redis) para webhooks, disparo de MCP e jobs de longa duração
- **Critério de aceite:** Job enfileirado é processado em até 5s; falhas geram retry com backoff exponencial; dashboard de filas acessível
- **Esforço:** 6h
- **Prioridade:** Média

### SIS-006 — Worker Pool para Tarefas MCP
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Worker pool dedicado para execução de comandos MCP/agentes com controle de concorrência, timeout e rate-limit por skill
- **Critério de aceite:** Até 3 workers simultâneos por skill; timeout global de 60s; fila de espera não bloqueante
- **Esforço:** 5h
- **Prioridade:** Baixa

### SIS-007 — Graceful Shutdown
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Implementar shutdown graceful: captura SIGTERM/SIGINT, drena filas, fecha conexões (SQLite/Redis/HTTP) e aguarda jobs ativos terminarem
- **Critério de aceite:** SIGTERM → servidor rejeita novas reqs → aguarda até 30s → fecha conexões → process.exit(0)
- **Esforço:** 3h
- **Prioridade:** Alta

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
