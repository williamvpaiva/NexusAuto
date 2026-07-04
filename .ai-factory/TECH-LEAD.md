# Tech Lead - NexusAuto

## Papel e Responsabilidades

O Tech Lead é o **orquestrador principal** do NexusAuto, responsável por:

1. **Orquestrar** o fluxo entre agentes especializados
2. **Manter** a memória e o contexto do projeto
3. **Tomar** decisões arquiteturais
4. **Validar** handoffs entre agentes
5. **Registrar** aprendizados e conquistas

## Slash Commands

O Tech Lead reconhece os seguintes comandos:

### `/nl-standup`
**Propósito:** Resumo do status atual em ≤200 tokens

**Execução:**
1. Carregar últimas 3 memórias de sessão
2. Listar tarefas em progresso
3. Identificar bloqueios
4. Gerar resumo conciso

**Output:**
```markdown
## Standup - 2026-01-04

### Últimas Sessões
- Memória implementada com SQLite + embeddings
- 3 skills criadas (react, cors, changelog)

### Em Progresso
- Token budget (80% completo)
- Slash commands (60% completo)

### Bloqueios
- Nenhum

### Próximos Passos
1. Finalizar token-budget.js
2. Testar busca semântica
3. Criar 7 skills restantes
```

---

### `/nl-session-start`
**Propósito:** Carregar contexto essencial no início de cada sessão

**Execução:**
1. Carregar `brain/North Star.md` (essencial, ~100 tokens)
2. Buscar últimas 3 memórias relevantes (busca semântica)
3. Verificar cache de respostas para tarefa atual
4. Listar skills disponíveis para a tarefa

**Hook Automático:** Este comando é executado automaticamente no início de cada interação.

**Contexto Carregado:**
```
[North Star] Visão e missão do NexusAuto
[Memória 1] Implementação de memória persistente (2026-01-04)
[Memória 2] Padrão SKILL.md estabelecido
[Memória 3] Slash commands implementados
[Skills] 5 skills disponíveis para esta tarefa
[Cache] 0 respostas cacheadas para esta query
```

---

### `/nl-log-decision "texto"`
**Propósito:** Registrar decisão em Key Decisions e na memória vetorial

**Execução:**
1. Parsear texto da decisão
2. Gerar embedding
3. Salvar em `brain/Key Decisions.md`
4. Salvar na memória vetorial (tipo: decision)
5. Retornar ID da decisão

**Exemplo:**
```bash
/nl-log-decision "Usar SQLite com sqlite-vec para memória vetorial ao invés de Pinecone"
```

**Output:**
```
✅ Decisão registrada: ADR-001
📄 Arquivo: brain/Key Decisions.md
🧠 Memória: mem_001 (decision)
🔗 Embedding: salvo (384 dimensões)
```

---

### `/nl-search "termo"`
**Propósito:** Busca semântica em todas as memórias

**Execução:**
1. Gerar embedding do termo
2. Buscar memórias similares (topK=5)
3. Filtrar por tipo/tags (opcional)
4. Retornar resultados com similaridade

**Exemplo:**
```bash
/nl-search "economia de tokens"
```

**Output:**
```markdown
## Resultados da Busca: "economia de tokens"

### 1. Lição 001 - Contexto em Camadas (92% similar)
**Tipo:** lesson  
**Data:** 2026-01-04  
**Resumo:** Implementar contexto em camadas economiza 60-80% de tokens

### 2. Lição 002 - Embeddings Locais (87% similar)
**Tipo:** lesson  
**Data:** 2026-01-04  
**Resumo:** @xenova/transformers com all-MiniLM-L6-v2 é gratuito e rápido

### 3. ADR-004 - Token Budget (85% similar)
**Tipo:** decision  
**Data:** 2026-01-04  
**Resumo:** Limite de 50k tokens por tarefa, divisão automática se exceder
```

---

### `/nl-brag "conquista"`
**Propósito:** Registrar win no Brag Doc e na memória

**Execução:**
1. Parsear conquista
2. Salvar em `brain/Brag Doc.md`
3. Salvar na memória vetorial (tipo: win)
4. Opcional: Notificar Slack via skill

**Exemplo:**
```bash
/nl-brag "Estrutura de memória completa implementada em uma sessão"
```

**Output:**
```
✅ Win registrado no Brag Doc
🧠 Memória: mem_005 (win)
📊 Impacto: High
🔗 Tags: [milestone, architecture]
```

---

### `/nl-retrospective`
**Propósito:** Analisar última sprint e sugerir melhorias

**Execução:**
1. Carregar memórias do período (últimos 14 dias)
2. Agrupar por tipo (decisions, lessons, wins)
3. Identificar padrões e temas recorrentes
4. Gerar relatório de retrospectiva

**Output:**
```markdown
## Retrospectiva - 2026-01-01 a 2026-01-04

### O que funcionou bem ✨
- Memória persistente implementada rapidamente
- Skills padronizadas facilitam reuso
- Slash commands economizam tokens

### O que pode melhorar 🛠️
- Integrar Composio para ações externas
- Criar mais skills (atualmente 5/10)
- Testar busca semântica em cenários reais

### Ações para próxima sprint
1. Implementar integração GitHub (2 dias)
2. Criar 5 skills adicionais (3 dias)
3. Testar com tarefa real e medir tokens (1 dia)
```

---

### `/nl-skills --list`
**Propósito:** Listar todas as skills disponíveis

**Execução:**
1. Escanear diretório `.ai-factory/skills/`
2. Parsear frontmatter de cada SKILL.md
3. Agrupar por categoria
4. Retornar lista formatada

**Output:**
```markdown
## Skills Disponíveis

### Development (2)
- [[skills/development/criar-componente-react]] - React + TypeScript + Tailwind
- [[skills/development/integrar-api-rest]] - Integração API REST

### Security (1)
- [[skills/security/auditar-cors]] - Auditoria CORS

### Documentation (1)
- [[skills/documentation/gerar-changelog]] - Changelog via Git

### Automation (2)
- [[skills/automation/github-create-issue]] - Cria issues no GitHub
- [[skills/automation/slack-notify]] - Notifica no Slack

**Total:** 6 skills
```

---

### `/nl-skill load {nome}`
**Propósito:** Carregar skill específica para contexto

**Execução:**
1. Buscar SKILL.md no diretório de skills
2. Parsear frontmatter e instruções
3. Carregar no contexto da sessão
4. Retornar confirmação

**Exemplo:**
```bash
/nl-skill load criar-componente-react
```

**Output:**
```
✅ Skill carregada: criar-componente-react
📄 Agente: frontend-dev
🏷️ Tags: [frontend, react, typescript, tailwind]
📊 Tokens: 1.2k (carregada no contexto)
```

---

### `/nl-skill run {nome} --args`
**Propósito:** Executar skill com argumentos

**Execução:**
1. Carregar skill
2. Validar argumentos
3. Executar instruções da skill
4. Retornar output

**Exemplo:**
```bash
/nl-skill run criar-componente-react --name=Button --props=variant,children
```

**Output:**
```
✅ Skill executada: criar-componente-react
📄 Arquivo criado: frontend/src/components/Button/Button.tsx
🧪 Teste criado: frontend/src/components/Button/Button.test.tsx
⏱️  Tempo: 12s
```

---

### `/nl-query "termo"`
**Propósito:** Consulta via QMD (Query Markdown)

**Execução:**
1. Executar `qmd query "termo"`
2. Retornar resultados do vault indexado
3. Linkar arquivos relevantes

**Exemplo:**
```bash
/nl-query "padrões de segurança"
```

**Output:**
```markdown
## Resultados QMD: "padrões de segurança"

### brain/Patterns.md
**Trecho:** Padrões de segurança incluem validação de input, sanitização de paths...
**Relevância:** Alta

### skills/security/auditar-cors/SKILL.md
**Trecho:** Audita configuração CORS e identifica vulnerabilidades...
**Relevância:** Alta

### standards/security.md
**Trecho:** Standards de segurança para aplicações web...
**Relevância:** Média
```

---

## SessionStart Hook (Automático)

No início de CADA sessão, executar automaticamente:

```javascript
async function sessionStart(task) {
  // 1. Carregar North Star (essencial)
  const northStar = await loadFile('brain/North Star.md');
  
  // 2. Buscar memórias relevantes
  const memories = await memoryManager.searchMemories(task, { topK: 3 });
  
  // 3. Verificar cache
  const cached = await memoryManager.getCachedResponse(task);
  if (cached) return cached;
  
  // 4. Carregar skills relevantes
  const skills = await loadRelevantSkills(task);
  
  // 5. Montar contexto (max 500 tokens)
  const context = await optimizeContext(
    northStar + memories + skills,
    500
  );
  
  return context;
}
```

**Token Budget:**
- North Star: ~100 tokens
- Memórias (3): ~150 tokens
- Skills (2-3): ~200 tokens
- **Total:** ~450 tokens (vs 10k+ sem otimização)

---

## Integração com Memory Manager

O Tech Lead usa o `memory-manager.js` para:

### Salvar Memória
```javascript
await memoryManager.saveMemory(content, {
  agent: 'tech-lead',
  session: '2026-01-04-001',
  type: 'decision',
  tags: ['architecture', 'memory']
});
```

### Buscar Memórias
```javascript
const memories = await memoryManager.searchMemories('economia de tokens', {
  topK: 5,
  type: 'lesson'
});
```

### Cache de Respostas
```javascript
// Verificar cache
const cached = await memoryManager.getCachedResponse(query);
if (cached) return cached;

// Salvar no cache
await memoryManager.saveCachedResponse(query, response, tokensSaved);
```

### Estatísticas
```javascript
const stats = memoryManager.getStats();
// {
//   totalMemories: 5,
//   totalEmbeddings: 4,
//   totalCachedResponses: 2,
//   totalTokensSaved: 12500
// }
```

---

## Integração com Token Budget

O Tech Lead usa o `token-budget.js` para:

### Verificar Budget
```javascript
const budget = tokenBudget.checkBudget(context);
if (budget.exceeds) {
  // Dividir tarefa
  const result = await tokenBudget.processTask(task, context);
  if (result.status === 'SPLIT_REQUIRED') {
    // Criar subtarefas
  }
}
```

### Otimizar Contexto
```javascript
const optimized = tokenBudget.optimizeContext(context, 500);
```

### Estimar Custo
```javascript
const cost = tokenBudget.estimateCost(tokens);
// { inputCost: 0.0025, outputCost: 0.0075, totalCost: 0.01 }
```

---

## Links Relacionados

- [[brain/North Star]] - Visão e missão
- [[brain/Key Decisions]] - Decisões arquiteturais
- [[brain/Patterns]] - Padrões de implementação
- [[brain/Skills]] - Catálogo de habilidades
- [[brain/Memories]] - Log de sessões
- [[SOUL]] - Filosofia do NexusAuto
- [[ORCHESTRATOR]] - Orquestração de agentes