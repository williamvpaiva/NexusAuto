# Token Economy — NexusAuto

## 🎯 Objetivo

Reduzir custos operacionais com tokens em **70-80%** através de arquitetura de contexto em camadas, handoffs resumidos e validação por cache.

## 📊 Economia Estimada

| Item | Antes | Depois | Redução |
|------|-------|--------|---------|
| Tokens/tarefa | ~25.000 | ~5.000 | -80% |
| Tokens/handoff | ~5.000 | ~200 | -96% |
| Validações repetidas | 100% | 20% | -80% |
| Contexto carregado | ~20.000 | ~2.000 | -90% |
| **Custo estimado/dia** | **R$ 500** | **R$ 100** | **-80%** |

---

## 🏗️ Arquitetura

### 1. Contexto em Camadas (Layered Context)

```
Layer 1 (Sempre): CONTEXT_SUMMARY.md (~200 tokens)
  ↓
Layer 2 (Sob demanda): PROJECT_CONTEXT.md (~2.000 tokens)
  ↓
Layer 3 (Específico): retrieve-context.js (3-5 arquivos, ~1.000 tokens)
```

**Como usar:**
```bash
# Tech Lead sempre carrega Layer 1
cat .ai-factory/CONTEXT_SUMMARY.md

# Layer 2 apenas se necessário (arquitetura, roadmap)
cat .ai-factory/PROJECT_CONTEXT.md

# Layer 3 via RAG (busca semântica)
node scripts/retrieve-context.js "criar validação de email"
```

---

### 2. Handoffs Resumidos

**Template obrigatório:** `.ai-factory/handoffs/HANDOFF_TEMPLATE.md`

**Regras:**
- ❌ NUNCA copie código inteiro
- ✅ USE apenas template (~200 tokens máximos)
- ✅ INCLUA hash do git para cache
- ✅ ESPECIFIQUE próxima ação claramente

**Exemplo:**
```markdown
## HANDOFF: frontend-dev -> qa-tester

- **Arquivos alterados**: src/pages/Login.tsx, src/components/Form.tsx
- **Resumo**: Adicionado formulário de login com validação Zod
- **Pontos críticos**: Validação de e-mail, redirect após sucesso
- **Hash**: abc123def
- **Próxima ação**: Testar fluxo completo de login
```

---

### 3. RAG (Busca Semântica)

**Script:** `scripts/retrieve-context.js`

**Como funciona:**
1. Indexa todos os arquivos `.ts`/`.tsx` com TF-IDF
2. Busca por similaridade com a query
3. Retorna 3-5 arquivos mais relevantes + snippets

**Uso:**
```bash
node scripts/retrieve-context.js "criar validação de email no backend"
```

**Output:**
```json
{
  "query": "criar validação de email no backend",
  "results": [
    {
      "file": "backend/src/auth/controller.ts",
      "score": 0.85,
      "snippet": "export async function login(ctx) { const email = ctx.request.body.email; ... }"
    }
  ]
}
```

---

### 4. Validação por Cache

**Arquivo:** `.ai-factory/VALIDATION_CACHE.md`

**Script:** `scripts/check-cache.js`

**Fluxo:**
```
1. Verificar hash atual do arquivo
2. Comparar com hash cacheado
3. Se igual → Cache Hit (pular V&V)
4. Se diferente → Cache Miss (aplicar V&V)
```

**Uso:**
```bash
node scripts/check-cache.js backend/src/auth/login.ts

# Output (Cache Hit):
{
  "cacheHit": true,
  "action": "SKIP_VV",
  "message": "Cache hit - validação pode ser pulada"
}

# Output (Cache Miss):
{
  "cacheHit": false,
  "action": "APPLY_VV",
  "message": "Cache miss - aplicar validação V&V"
}
```

---

### 5. Token Budget

**Script:** `scripts/token-budget.js`

**Funcionamento:**
1. Estima tokens do prompt (caracteres / 4)
2. Se > 50.000 tokens → divide em subtarefas
3. Salva subtarefas em `.ai-factory/tasks-split/`

**Uso:**
```bash
node scripts/token-budget.js tasks/task-001-prompt.txt
```

**Output:**
```json
{
  "estimation": {
    "rawTokens": 45000,
    "adjustedTokens": 36000,
    "utilizationPercent": 72
  },
  "decision": "OK",
  "complexity": {
    "level": "MÉDIA"
  }
}
```

**Se SPLIT_REQUIRED:**
```json
{
  "decision": "SPLIT_REQUIRED",
  "split": {
    "strategy": "Full Stack",
    "subtasks": [
      "1. Definir contrato API (backend)",
      "2. Implementar backend (rotas + DB)",
      "3. Integrar frontend-backend"
    ]
  }
}
```

---

### 6. Diff-based Updates

**Script:** `scripts/apply-diff.js`

**Fluxo:**
1. Agente gera apenas diff/patch (não arquivo completo)
2. Próximo agente aplica patch sobre versão cacheada
3. Fallback: copia direta se patch falhar

**Uso:**
```bash
# Agente gera novo.ts (apenas trechos modificados)
node scripts/apply-diff.js old.ts new.ts

# Script aplica patch automaticamente
```

---

## 📋 Protocolo V&V Adaptativo

### Matriz de Decisão

| Tipo de Arquivo | Criticidade | Nível V&V | Tokens |
|-----------------|-------------|-----------|--------|
| `backend/src/auth/**` | 🔴 Crítica | Nível 1 (7 passos) | ~3.000 |
| `backend/src/payments/**` | 🔴 Crítica | Nível 1 (7 passos) | ~3.000 |
| `backend/prisma/schema.prisma` | 🔴 Crítica | Nível 1 (7 passos) | ~3.000 |
| `backend/src/**` | 🟡 Média | Nível 2 (3 passos) | ~1.000 |
| `frontend/src/components/**` | 🟡 Média | Nível 2 (3 passos) | ~1.000 |
| `frontend/src/utils/**` | 🟢 Baixa | Nível 2 (3 passos) | ~1.000 |
| Cache Hit | - | Nível 3 (0 passos) | ~50 |

### Fluxo de Decisão

```
Início
  ↓
Verificar Cache (check-cache.js)
  ↓
Cache Hit? ──Sim──→ Nível 3 (Pular, ~50 tokens)
  ↓ Não
Analisar Criticidade
  ↓
┌─────────────────┬─────────────────┬────────────────┐
│   🔴 Crítica    │   🟡 Média      │   🟢 Baixa     │
│   Nível 1       │   Nível 2       │   Nível 2      │
│   (7 passos)    │   (3 passos)    │   (3 passos)   │
└─────────────────┴─────────────────┴────────────────┘
```

---

## 🛠️ Scripts Disponíveis

| Script | Propósito | Uso | Economia |
|--------|-----------|-----|----------|
| `retrieve-context.js` | Busca semântica (TF-IDF) | `node scripts/retrieve-context.js "query"` | -60% |
| `token-budget.js` | Estima e divide tarefas | `node scripts/token-budget.js task.txt` | Evita estouros |
| `check-cache.js` | Verifica cache de validação | `node scripts/check-cache.js file.ts` | -80% |
| `apply-diff.js` | Aplica patches | `node scripts/apply-diff.js old.ts new.ts` | -60% |

---

## 📈 Métricas

### Acompanhamento Diário

Adicionar no `PROGRESS.md`:

```markdown
## Token Economy - Dia 2026-07-03

| Métrica | Valor | Meta |
|---------|-------|------|
| Tokens gastos (total) | 15.000 | < 20.000 |
| Tokens/tarefa (média) | 3.750 | < 5.000 |
| Cache hit rate | 75% | > 80% |
| Handoffs resumidos | 100% | 100% |
| Tarefas divididas | 2 | < 5 |
```

### Acompanhamento Semanal

```markdown
## Token Economy - Semana 2026-W27

| Métrica | Semana Anterior | Semana Atual | Variação |
|---------|-----------------|--------------|----------|
| Custo total | R$ 350 | R$ 100 | -71% ✅ |
| Tarefas/tokens | 25.000 | 5.000 | -80% ✅ |
| Cache hit rate | 60% | 75% | +25% ✅ |
```

---

## 🎯 Checklist de Implementação

### Tech Lead (Orquestração)

- [ ] Carregar sempre `CONTEXT_SUMMARY.md` (Layer 1)
- [ ] Executar `token-budget.js` antes de delegar
- [ ] Usar `retrieve-context.js` para código específico
- [ ] Validar handoffs com template (~200 tokens)
- [ ] Verificar cache antes de V&V
- [ ] Dividir tarefas > 50k tokens

### Agentes (Execução)

- [ ] Ler apenas Layer 1 ( CONTEXT_SUMMARY.md)
- [ ] Solicitar contexto específico via Tech Lead
- [ ] Usar `HANDOFF_TEMPLATE.md` obrigatoriamente
- [ ] Gerar diff para arquivos > 100 linhas
- [ ] Incluir hash do git em handoffs

### QA-Tester (Validação)

- [ ] Executar `check-cache.js` antes de validar
- [ ] Aplicar nível de V&V apropriado
- [ ] Atualizar `VALIDATION_CACHE.md`
- [ ] Registrar métricas de tokens no PROGRESS.md

---

## 📚 Referências

- [CONTEXT_SUMMARY.md](../CONTEXT_SUMMARY.md) — Layer 1
- [HANDOFF_TEMPLATE.md](../handoffs/HANDOFF_TEMPLATE.md) — Template obrigatório
- [VALIDATION_CACHE.md](../VALIDATION_CACHE.md) — Cache de validação
- [VV_PROTOCOL_ADAPTATIVE.md](../standards/VV_PROTOCOL_ADAPTATIVE.md) — V&V adaptativo
- [README.md](README.md) — Detalhes da melhoria #23

---

*Documentação viva — Atualizar conforme evolução da fábrica*