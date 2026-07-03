# Skill: Memory Management

> Sistema de memória persistente com SQLite + busca semântica para agents da AI Factory

---

## Objetivo

Permitir que todos os agents compartilhem, consultem e aprendam continuamente através de um banco de memórias centralizado. Evita repetição de decisões, acelera diagnósticos e mantém contexto entre sessões.

**Benefícios:**
- Agents aprendem com decisões passadas de outros agents
- Deduplicação automática (mesmo conteúdo não é salvo duas vezes)
- Cache de embeddings e respostas de LLM para economia de tokens
- Busca semântica por similaridade (TF-IDF + embeddings quando disponível)

---

## Gatilhos de Acionamento

- Início de nova tarefa (consultar memórias relevantes primeiro)
- Após tomar decisão importante (salvar para referência futura)
- Handoff entre agents (salvar contexto da transição)
- Debugging de bug recorrente (consultar se já foi resolvido)
- Code review (verificar decisões de arquitetura documentadas)

---

## Database

O banco SQLite fica em `nexusauto_memory.db` na raiz do projeto.

### Tabelas

| Tabela | Propósito |
|--------|-----------|
| `memories` | Conteúdo principal + embedding + metadados |
| `cache_embeddings` | Cache de embeddings para evitar reprocessamento |
| `cache_responses` | Cache de respostas de LLM (query → resposta) |
| `memory_stats` | Cache de estatísticas para sumário rápido |

### Schema da Tabela `memories`

```sql
CREATE TABLE memories (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  metadata TEXT DEFAULT '{}',     -- JSON: { agent, type, tags }
  hash TEXT,                       -- SHA256 da content (dedup)
  embedding BLOB,                  -- Float32Array serializado (384d)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Metadados (`metadata` JSON)

| Campo | Exemplo | Descrição |
|-------|---------|-----------|
| `agent` | `"architect"` | Agent que criou a memória |
| `type` | `"decision"` | Tipo: decision, code, lesson, adr, context |
| `tags` | `["orm", "prisma"]` | Tags para categorização |

---

## Scripts

### `scripts/memory-manager.js`

Script principal de gerenciamento de memória. Ponto de entrada único para todas as operações.

#### CLI (linha de comando)

```bash
# Salvar memória
node scripts/memory-manager.js save "Decisão: usar Prisma como ORM" --agent architect --type decision --tags orm,prisma

# Buscar memórias
node scripts/memory-manager.js search "qual ORM usamos" --topK 5 --agent architect

# Cache de respostas LLM
node scripts/memory-manager.js cache-set "Qual ORM?" "Prisma com PostgreSQL"
node scripts/memory-manager.js cache-get "Qual ORM?"

# Estatísticas
node scripts/memory-manager.js stats
node scripts/memory-manager.js summarize
```

#### API (programática)

```js
const MemoryManager = require('./memory-manager');
const mm = new MemoryManager();
await mm.init();

// Salvar
const { id, deduplicated } = await mm.saveMemory("conteúdo", {
  agent: 'architect',
  type: 'decision',
  tags: ['orm']
});

// Buscar semântica (embedding ou TF-IDF fallback)
const results = await mm.searchMemories("consulta", 5, {
  agent: 'architect',
  type: 'decision',
  days: 30
});

// Cache
const cached = await mm.getCachedResponse("pergunta");
await mm.saveCachedResponse("pergunta", "resposta");

// Estatísticas
const stats = await mm.getStats(); // { total_memories, cached_embeddings, ... }
await mm.close();
```

### `scripts/memory-test.js`

Suite de testes (9 testes, valida save, dedup, search, filter, cache, stats).

```bash
node scripts/memory-test.js
```

---

## Integração com Agents

### Fluxo Recomendado

1. **Início de tarefa:** `search` para recuperar contexto relevante
2. **Durante execução:** `cache-set` / `cache-get` para evitar recomputação
3. **Fim da tarefa:** `save` com decisões e lições aprendidas
4. **Handoff:** `save` com tipo `context` para preservar estado

### Tipos de Memória

| Type | Quando Usar | Exemplo |
|------|-------------|---------|
| `decision` | Decisão arquitetural ou técnica | "Escolhemos Prisma por type-safety" |
| `code` | Fragmento de código relevante | "Função X resolve problema Y" |
| `lesson` | Lição aprendida ou erro evitado | "Cuidado: lib Z quebra com Node 22" |
| `adr` | Architecture Decision Record | "ADR-001: PostgreSQL como banco primário" |
| `context` | Estado de handoff entre agents | "Arquivo X está sendo refatorado" |

### Cache de Respostas

Use `cache-set`/`cache-get` para perguntas frequentes que agents fazem uns aos outros:

```bash
# Agent A salva resposta
node scripts/memory-manager.js cache-set "Qual a porta do banco?" "5432"

# Agent B consulta sem precisar perguntar
node scripts/memory-manager.js cache-get "Qual a porta do banco?"
# → {"status": "hit", "response": "5432"}
```

---

## Integração

- **Agents:** `tech-lead`, `architect`, `backend-dev`, `frontend-dev`, `security`, `devops`, `qa-tester`, `performance`
- **Skill relacionada:** `project-analyzer` (para análise de código antes de salvar)
- **Script:** `scripts/retrieve-context.js` (RAG legado, complementar)

---

## Manutenção

```bash
# Backup do banco
copy nexusauto_memory.db nexusauto_memory_backup.db

# Reset (cuidado!)
del nexusauto_memory.db
```
