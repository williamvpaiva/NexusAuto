# Patterns - NexusAuto

## Padrões de Código

### 1. Estrutura de Skills (SKILL.md)
```markdown
---
name: nome-da-skill
description: "Descrição curta da habilidade"
agent: agente-alvo
tags: [tag1, tag2]
---

# Instruções
1. Passo 1
2. Passo 2
3. Passo 3

# Exemplos
## Exemplo 1
Entrada: ...
Saída: ...
```

### 2. Handoff entre Agentes
```markdown
# Handoff: {origem} -> {destino}

## O que foi feito
- resumo em 3-5 bullets

## Artefatos entregues
- caminho/arquivo: descrição

## Decisões tomadas
- decisão + motivo

## Pontos de atenção
- riscos, limitações, known issues

## O que se espera de você
- tarefas do próximo agente
```

### 3. Registro de Memória
```javascript
await memoryManager.saveMemory(content, {
  agent: 'tech-lead',
  session: '2026-01-04-001',
  type: 'decision', // decision, lesson, context, win
  tags: ['architecture', 'memory']
});
```

## Padrões de Arquitetura

### 1. Contexto em Camadas
**Problema:** Carregar todo o contexto em cada sessão é caro e lento.

**Solução:**
```
Camada 1 (Sempre): brain/North Star.md (~100 tokens)
Camada 2 (Sob demanda): brain/Patterns.md, brain/Key Decisions.md
Camada 3 (Sob demanda): Memórias relevantes via busca semântica
Camada 4 (Cache): Respostas cacheadas por hash do prompt
```

**Implementação:**
```javascript
async function loadContext(task) {
  const essential = await loadFile('brain/North Star.md');
  const relevant = await memoryManager.searchMemories(task, { topK: 3 });
  const cached = await memoryManager.getCachedResponse(task);
  
  if (cached) return cached;
  
  return essential + relevant;
}
```

### 2. Handoff Resumido
**Problema:** Passar arquivos inteiros entre agentes consome tokens.

**Solução:** Enviar apenas diff/hash + contexto essencial.

```javascript
function createHandoff(from, to, changes) {
  return {
    from,
    to,
    summary: summarize(changes),
    hash: hashChanges(changes),
    diff: generateDiff(changes),
    context: getEssentialContext(changes)
  };
}
```

### 3. Sumarização Dinâmica
**Problema:** Contexto recuperado pode exceder limite de tokens.

**Solução:**
```javascript
async function getContextWithBudget(query, budget = 500) {
  const memories = await memoryManager.searchMemories(query, { topK: 10 });
  
  if (countTokens(memories) > budget) {
    return await summarize(memories, budget);
  }
  
  return memories;
}
```

## Padrões de Segurança

### 1. Validação de Input em Skills
```javascript
// Sempre validar input antes de executar
function validateInput(input, schema) {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new Error(`Invalid input: ${result.error.message}`);
  }
  return result.data;
}
```

### 2. Sanitização de Paths
```javascript
// Prevenir path traversal
function sanitizePath(input) {
  const sanitized = path.normalize(input).replace(/^(\.\.(\/|\\|$))+/, '');
  if (!sanitized.startsWith(projectRoot)) {
    throw new Error('Path traversal detected');
  }
  return sanitized;
}
```

## Padrões de Documentação

### 1. Wikilinks em Todos os MD
```markdown
Sempre usar [[caminho/para/arquivo]] para criar grafo navegável.

Exemplo:
- Veja [[brain/Key Decisions#ADR-001]] para detalhes da arquitetura
- Consulte [[brain/Patterns]] para padrões de implementação
```

### 2. Frontmatter em Todos os Arquivos
```markdown
---
title: Título do Documento
type: doc-type (adr, pattern, skill, agent)
agent: agente-responsavel (opcional)
tags: [tag1, tag2]
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

## Padrões de Performance

### 1. Cache de Embeddings
```javascript
async function getEmbedding(text) {
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  const cached = await db.get('SELECT * FROM cache_embeddings WHERE hash = ?', [hash]);
  
  if (cached) {
    return JSON.parse(cached.embedding);
  }
  
  const embedding = await model.encode(text);
  await db.run('INSERT INTO cache_embeddings (hash, embedding) VALUES (?, ?)', [hash, JSON.stringify(embedding)]);
  
  return embedding;
}
```

### 2. Busca Vetorial com Filtros
```javascript
async function searchMemories(query, { topK = 5, agent, type, tags }) {
  const queryEmbedding = await getEmbedding(query);
  
  let filters = [];
  let params = [JSON.stringify(queryEmbedding), topK];
  
  if (agent) {
    filters.push('agent = ?');
    params.push(agent);
  }
  
  if (type) {
    filters.push('type = ?');
    params.push(type);
  }
  
  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';
  
  const results = await db.all(`
    SELECT * FROM memories
    ${whereClause}
    ORDER BY distance_cosine(vector, ?)
    LIMIT ?
  `, params);
  
  return results;
}
```

## Links Relacionados
- [[brain/North Star]] - Visão e missão
- [[brain/Key Decisions]] - Decisões arquiteturais
- [[SOUL]] - Filosofia do NexusAuto
- [[ORCHESTRATOR]] - Orquestração de agentes