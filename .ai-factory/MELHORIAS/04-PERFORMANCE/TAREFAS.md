# 04 — PERFORMANCE

> Otimização de performance no backend e frontend: caching, lazy loading, compressão, queries
>
> **Status:** 🔴 Não Iniciado
> **Prioridade:** Alta
> **Dependências:** 03-SISTEMAS (Redis para caching)

---

## 📋 Tarefas

### PERF-001 — Cache Layer com Redis
- [x] **Status:** 🟢 Concluído
- **Descrição:** Implementar camada de cache Redis para respostas de API com TTL configurável, cache invalidation por tag e fallback automático (cache miss → DB)
- **Critério de aceite:** GET /api/* com header `Cache-Control: max-age=60` retorna do Redis em < 5ms; invalidação por tag funciona (ex: `user:*`)
- **Esforço:** 5h
- **Prioridade:** Alta

### PERF-002 — Compressão e Otimização de Assets Frontend
- [x] **Status:** 🟢 Concluído
- **Descrição:** Configurar compressão brotli no Nginx, chunk splitting no Vite, tree-shaking e análise de bundle com vite-bundle-analyzer
- **Critério de aceite:** Bundle JS < 100 KB gzip; primeiro paint < 1.5s; relatório de análise gerado
- **Esforço:** 3h
- **Prioridade:** Alta

### PERF-003 — Lazy Loading e Code Splitting (Frontend)
- [x] **Status:** 🟢 Concluído
- **Descrição:** Implementar React.lazy + Suspense para todas as rotas, lazy loading de componentes pesados e import() dinâmico para bibliotecas grandes
- **Critério de aceite:** Página Health carrega chunk separado; bundle inicial não inclui código de páginas não visitadas
- **Esforço:** 2h
- **Prioridade:** Alta

### PERF-004 — Indexação e Otimização de Queries SQLite
- [x] **Status:** 🟢 Concluído
- **Descrição:** Auditar queries do backend com EXPLAIN QUERY PLAN, adicionar índices compostos onde necessário, otimizar joins e N+1 queries nos services/repositories
- **Critério de aceite:** Nenhuma query sequencial scanning table full > 100 rows; EXPLAIN mostra índices sendo usados
- **Esforço:** 4h
- **Prioridade:** Média

### PERF-005 — Rate Limiting Inteligente
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Rate limiting por IP, rota e usuário com Redis (sliding window), respostas 429 com Retry-After header
- **Critério de aceite:** 100 req/min por IP, 1000 req/min por usuário autenticado; header `Retry-After` presente em 429
- **Esforço:** 3h
- **Prioridade:** Média

### PERF-006 — Timeout e Abort Controller nas Chamadas Frontend
- [ ] **Status:** 🔴 Pendente
- **Descrição:** Adicionar AbortController + timeout global nas chamadas fetch/api do frontend, com fallback UI de timeout
- **Critério de aceite:** Requisição > 10s é abortada; UI mostra "Serviço temporariamente indisponível" com botão "Tentar novamente"
- **Esforço:** 2h
- **Prioridade:** Média

### PERF-007 — Database Connection Pool (SQLite WAL Mode)
- [x] **Status:** 🟢 Concluído
- **Descrição:** Configurar SQLite em WAL mode, pooling de conexões (better-sqlite3 ou wrapper) e limite de concorrência para evitar lock
- **Critério de aceite:** WAL mode ativo; 10 leituras simultâneas sem bloqueio; escrita não bloqueia leitura
- **Esforço:** 2h
- **Prioridade:** Alta

---

<div align="center">

[← Voltar ao Índice](../INDEX.md)

</div>
