# Memories - NexusAuto

## Log de Sessões

### 2026-01-04 - Evolução para Memória Persistente
**Agente:** tech-lead  
**Tipo:** session  
**Tags:** [memory, architecture, milestone]

**Resumo:**
- Implementada estrutura completa de memória persistente com SQLite + sqlite-vec
- Criados diretórios brain/, org/, bases/, skills/
- Implementados scripts memory-manager.js e token-budget.js
- Adicionados slash commands no TECH-LEAD.md
- Criadas 3 skills de exemplo

**Decisões Tomadas:**
- SQLite escolhido por ser local e sem custos (ADR-001)
- Limite de 50k tokens por tarefa (ADR-004)
- Estrutura Obsidian Mind adotada (ADR-003)

**Memórias Salvas:**
- ID: mem_001 - North Star definido
- ID: mem_002 - Key Decisions registrado
- ID: mem_003 - Patterns documentado
- ID: mem_004 - Skills catalogadas

**Próximos Passos:**
1. Testar busca semântica com queries reais
2. Medir redução de tokens em sessão real
3. Criar mais 7 skills para total de 10
4. Integrar com Composio (opcional)

---

### 2026-07-06 — Auditoria de Conformidade
**Agente:** tech-lead  
**Tipo:** session  
**Tags:** [audit, compliance, housekeeping]

**Resumo:**
- Auditoria completa contra identidade do NexusAuto (21 agentes, memória, Spec-Kit, UI/UX, OpenWA)
- Score final: 93/100 🟢 — todas as exigências da identidade cumpridas
- Corrigido tech-lead.md: frontmatter YAML adicionado (name, division, role, voice) — versão 1.1.0
- Removido arquivo morto `memory-routes.ts` (nunca importado, memoryApi null)
- Atualizado PROJECT_CONTEXT.md: gaps de memory routes + JWT auth marcados como ✅ RESOLVIDOS; adicionado item sobre legacy file removido
- Nenhuma não conformidade crítica encontrada

**Decisões Tomadas:**
- tech-lead.md agora segue o padrão YAML frontmatter dos demais 12 agentes
- Arquivos mortos (dead code) podem ser removidos — não viola princípio de compatibilidade
- PROJECT_CONTEXT.md deve ser mantido sincronizado com o código real

**Próximos Passos:**
1. Resolver gap de Users sem persistência (mock em array)
2. Resolver path hardcoded do SQLite (`./data/memory.db`)
3. Adicionar devDependencies de teste no frontend
4. Implementar design-spec.md nas próximas features

---

### 2026-07-06 — Correção de Testes + Validação Token Economy
**Agente:** tech-lead  
**Tipo:** session  
**Tags:** [tests, debugging, token-economy, supertest, auth]

**Resumo:**
- Redis rate-limiter causava timeouts nos testes — corrigido; testes agora completam em ~10.9s
- 3 testes ainda falhavam pós-correção do Redis; todos corrigidos:
  1. `memory.test.ts`: bracket notation `request(app)[method]` não funciona com SuperTest — trocado para `.get()`, `.post()`, etc.
  2. `error-handler.test.ts`: teste 422 usava tokens fake `'test-token'` — middleware de auth executa ANTES do validation pipe, então precisa de JWT real + CSRF registrado
  3. `users.test.ts`: código de erro `NOT_FOUND` não correspondia ao `USER_NOT_FOUND` lançado pelo service — alinhado
- **Test suite final:** 84/84 passando, 0 falhas, ~10.9s

**Validação Token Economy:**
- Summary de 330 bytes (~82 tokens) substitui ~59.250 tokens de contexto cheio
- Economia: **722× menor** (~99.9% menos tokens por turno)
- Método: `summary_bytes × 0.25 = tokens_estimados`

**Decisões Tomadas:**
- `Supertest` em TypeScript: usar `.get()`, `.post()` direto, não `[method]` (bracket notation retorna undefined)
- Testes de validação (422) precisam de auth real (JWT + CSRF), não fake tokens
- `HttpStatus` codes em testes devem bater exatamente com os códigos lançados pelo service layer

**Próximos Passos (mantidos):**
1. Resolver gap de Users sem persistência (mock em array)
2. Resolver path hardcoded do SQLite (`./data/memory.db`)
3. Adicionar devDependencies de teste no frontend
4. Implementar design-spec.md nas próximas features

---

## Lições Aprendidas

### Lição 001 - Contexto em Camadas Economiza Tokens
**Data:** 2026-01-04  
**Agente:** tech-lead  
**Tipo:** lesson  
**Tags:** [optimization, tokens, context]

**Problema:** Carregar todo o contexto em cada sessão consumia 10k+ tokens desnecessariamente.

**Solução:** Implementar contexto em camadas:
- Camada 1: North Star (~100 tokens, sempre carrega)
- Camada 2: Patterns/Decisions (sob demanda)
- Camada 3: Memórias relevantes (busca semântica)
- Camada 4: Cache de respostas

**Resultado:** Redução estimada de 60-80% no consumo de tokens.

---

### Lição 002 - Embeddings Locais São Viáveis
**Data:** 2026-01-04  
**Agente:** tech-lead  
**Tipo:** lesson  
**Tags:** [embeddings, cost, performance]

**Problema:** APIs de embedding (OpenAI, Cohere) têm custo por requisição.

**Solução:** Usar @xenova/transformers com modelo all-MiniLM-L6-v2:
- Totalmente local
- Rápido (<100ms por embedding)
- Zero custos recorrentes

**Resultado:** Embeddings gratuitos com qualidade suficiente para busca semântica.

---

## Decisões do Dia

### 2026-01-04 - Decisão 001
**Agente:** tech-lead  
**Tipo:** decision  
**Tags:** [architecture, memory]

**Decisão:** Usar SQLite com sqlite-vec para memória vetorial.

**Motivo:**
- Zero custos de infraestrutura
- Simples de gerenciar
- Consultas rápidas (<100ms)
- Embeddings locais

**Impacto:** Todas as memórias futuras serão armazenadas neste formato.

---

## Wins Registrados (Brag Doc)

### Win 001 - Estrutura de Memória Completa
**Data:** 2026-01-04  
**Agente:** tech-lead  
**Tipo:** win  
**Tags:** [milestone, architecture]

**Conquista:** Implementada estrutura completa de memória persistente em uma única sessão.

**Impacto:**
- NexusAuto agora tem memória de longo prazo
- Sessões futuras começarão com contexto carregado
- Economia de 60-80% de tokens estimada

**Reconhecimento:** Arquitetura elogiada por seguir princípios de simplicidade e baixo custo.

---

## Como Adicionar Nova Memória

### Via Slash Command
```bash
/nl-log-decision "Descrição da decisão"
/nl-brag "Conquista registrada"
```

### Via Script
```javascript
await memoryManager.saveMemory(content, {
  agent: 'tech-lead',
  session: '2026-01-04-001',
  type: 'decision', // decision, lesson, context, win
  tags: ['architecture', 'memory']
});
```

### Tipos de Memória
- **decision:** Decisões arquiteturais ou de implementação
- **lesson:** Lições aprendidas (problema → solução → resultado)
- **context:** Contexto de sessão (o que foi feito, próximos passos)
- **win:** Conquistas e wins para Brag Doc

---

## Estatísticas de Memória

| Métrica | Valor |
|---------|-------|
| Total de memórias | 7 |
| Decisões | 2 |
| Lições | 2 |
| Wins | 1 |
| Sessões | 3 |
| Embeddings cacheados | 4 |
| Respostas cacheadas | 0 |

---

## Links Relacionados
- [North Star](North%20Star.md) - Visão e missão
- [Key Decisions](Key%20Decisions.md) - Decisões consolidadas
- [Patterns](Patterns.md) - Padrões de implementação
- [Brag Doc](Brag%20Doc.md) - Conquistas
