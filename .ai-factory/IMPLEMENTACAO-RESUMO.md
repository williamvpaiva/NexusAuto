# 🎯 Implementação Recon-Sills no NexusAuto

> **Resumo da implementação dos padrões do recon-skills mantendo TECH-LEAD.md como orquestrador central**

---

## ✅ O Que Foi Implementado

### **1. Estrutura de Pastas**

```
.ai-factory/
├── hunt/                    # NOVO: Skills por classe de problema
│   ├── README.md
│   ├── hunt-n-plus-one-queries.md
│   ├── hunt-missing-input-validation.md
│   ├── hunt-hardcoded-secrets.md
│   ├── hunt-dead-code.md
│   └── hunt-missing-error-handling.md
│
├── chains/                  # NOVO: Cadeias de problemas compostos
│   └── README.md
│
├── meta/                    # NOVO: Playbooks de orquestração
│   ├── README.md
│   ├── cross-wave-delta.md
│   └── audit-playbook.md
│
├── output/                  # NOVO: Estrutura de outputs
│   ├── deep/
│   ├── components/
│   ├── techniques/
│   ├── skills/
│   └── scripts/
│
├── workflows/               # ATUALIZADO
│   └── self-improvement-loop.md
│
└── ... (existente: agents, MELHORIAS, etc.)
```

---

### **2. TECH-LEAD.md Atualizado**

**Adições principais:**

```markdown
### Scoring para Escalonamento (NOVO)

| Fator | Score |
|-------|-------|
| Auth/Pagamento envolvido | +5 |
| Schema change | +4 |
| Multi-agent handoff | +3 |
| Nova dependência | +2 |
| Apenas UI/CSS | +1 |

**Escalonamento:**
- Score >= 8: 🔴 Crítico → V&V Nível 1, 2 agents
- Score 4-7: 🟡 Alto → V&V Nível 2, 1 agent senior
- Score < 4: 🟢 Normal → V&V Nível 2 ou 3

### Hunt Skills (NOVO)

| Hunt Skill | Problema | Quando Acionar |
|------------|----------|----------------|
| `hunt-n-plus-one-queries` | N+1 queries | "lentidão no banco" |
| `hunt-missing-input-validation` | Inputs sem validação | "segurança dos inputs" |
| `hunt-hardcoded-secrets` | Secrets hardcoded | Code review, pré-push |
| `hunt-dead-code` | Código morto | "limpeza de código" |
| `hunt-missing-error-handling` | Sem try-catch | "erros silenciosos" |

### Technical Debt Chains (NOVO)

| Chain | Ingredientes | Score | Ação |
|-------|-------------|-------|------|
| A: Database Collapse | N+1 + Missing Index | 14+ | V&V Nível 1 |
| B: SQL Injection | Missing Validation + Raw SQL | 16+ | V&V Nível 1 |
| C: Secret Exposure | Hardcoded Secrets + Public Repo | 13+ | Rotacionar IMEDIATO |
| D: Cascade Failure | Missing Error Handling + Retry | 11+ | V&V Nível 2 |
```

---

### **3. Hunt Skills Criadas (5)**

Cada skill segue template padronizado:

```markdown
## When to Use      → Gatilhos exatos
## Prerequisites    → Pré-condições
## How to Run       → Comandos copy-paste
## Procedure        → Passo a passo numerado
## Pitfalls         → Falsos positivos
## Verification     → Como confirmar detecção e fix
## Score Calculation → Tabela de scoring
## Fix Patterns     → Como corrigir
```

**Skills:**
1. `hunt-n-plus-one-queries.md` — Detecta queries em loops
2. `hunt-missing-input-validation.md` — Detecta inputs sem validação
3. `hunt-hardcoded-secrets.md` — Detecta secrets no código
4. `hunt-dead-code.md` — Detecta código não usado
5. `hunt-missing-error-handling.md` — Detecta promises sem catch

---

### **4. Chains de Problemas Compostos**

**Conceito:** 2+ problemas isolados (Médios) → Combinados (Críticos)

```
Problema A (Score 6) + Problema B (Score 5) = Chain (Score 14 → Crítico)
```

**Chains catalogadas:**
- Chain A: Database Collapse (N+1 + Missing Index)
- Chain B: SQL Injection (Missing Validation + Raw SQL)
- Chain C: Secret Exposure (Hardcoded + Public Repo)
- Chain D: Cascade Failure (Missing Error Handling + Retry)
- Chain E: IDOR + Data Leak (Missing Auth + Direct Object Ref)

---

### **5. Cross-Wave Delta Analysis**

**Template para comparar iterações:**

```markdown
| Check | Wave N | Wave N+1 | Delta |
|-------|--------|----------|-------|
| N+1 Queries | 12 found | 8 found | REGRESSION ✅ |
| Missing Tests | 45 files | 52 files | NEW ❌ |
| Security Issues | 3 critical | 3 critical | PERSISTENT ❌ |
```

**Categorias:** NEW / REGRESSION / PERSISTENT / CHANGE

---

### **6. Self-Improvement Loop**

**Fluxo infinito de evolução:**

```
Agents audit → Findings em output/
              ↓
Skill Architect lê → Cria/melhora skills
              ↓
Cross-wave synthesis → Intelligence report
              ↓
        Próxima iteração usa skills melhoradas
              ↓
        INFINITO
```

---

### **7. Audit Playbook**

**Pipeline de 3 fases:**

```
Fase 1: Quick Scan (5-10 min)
├── Lint + Type Check
├── Detect hotspots
└── Output: lista de críticos

Fase 2: Deep Audit (30-60 min)
├── Hunt skills específicas
├── Análise de chains
└── Output: findings detalhados

Fase 3: Fix + Verify (1-2 horas)
├── Atribuição para agents
├── Fix com V&V apropriado
└── Output: código fixado + relatório
```

---

## 🎯 Como TECH-LEAD Usa (Fluxo Prático)

### **Exemplo 1: Usuário diz "auditar segurança"**

```
1. TECH-LEAD lê TECH-LEAD.md → vê seção "Hunt Skills"
2. Aciona: hunt-hardcoded-secrets + hunt-missing-input-validation
3. Skills detectam problemas com scores
4. TECH-LEAD verifica chains (Chain B: SQL Injection?)
5. Atribui fixes baseado em scores
6. QA valida com V&V Nível apropriado
7. Salva findings em .ai-factory/output/
8. Skill Architect lê findings → melhora skills
```

### **Exemplo 2: Usuário diz "sistema lento"**

```
1. TECH-LEAD lê TECH-LEAD.md → vê seção "Hunt Skills"
2. Aciona: hunt-n-plus-one-queries
3. Skill detecta 3 N+1 queries (scores 8, 6, 10)
4. TECH-LEAD verifica chains (Chain A: Database Collapse?)
5. Atribui fix para backend-dev + performance
6. QA valida performance improvement
7. Salva em output/
```

### **Exemplo 3: Pós-sprint (melhoria contínua)**

```
1. TECH-LEAD executa cross-wave-delta.md
2. Compara Wave N vs Wave N+1
3. Identifica:
   - NEW: 2 problemas novos
   - REGRESSION: 1 problema fixo que voltou
   - PERSISTENT: 3 problemas há 3+ waves
4. Cria tarefas para problemas persistentes
5. Skill Architect atualiza skills baseado em gaps
```

---

## 📊 Métricas de Sucesso

| Métrica | Antes | Depois (Meta) |
|---------|-------|---------------|
| Skills de detecção | 0 | 5 |
| Chains catalogadas | 0 | 5 |
| Scoring para escalonamento | Não existia | Implementado |
| Cross-wave comparison | Não existia | Implementado |
| Self-improvement loop | Não existia | Implementado |
| Audit playbook estruturado | Não existia | 3 fases definidas |

---

## 🔗 Arquivos Criados/Atualizados

### Novos (11 arquivos):
1. `.ai-factory/hunt/README.md`
2. `.ai-factory/hunt/hunt-n-plus-one-queries.md`
3. `.ai-factory/hunt/hunt-missing-input-validation.md`
4. `.ai-factory/hunt/hunt-hardcoded-secrets.md`
5. `.ai-factory/hunt/hunt-dead-code.md`
6. `.ai-factory/hunt/hunt-missing-error-handling.md`
7. `.ai-factory/chains/README.md`
8. `.ai-factory/meta/README.md`
9. `.ai-factory/meta/cross-wave-delta.md`
10. `.ai-factory/meta/audit-playbook.md`
11. `.ai-factory/workflows/self-improvement-loop.md`

### Atualizados (1 arquivo):
1. `TECH-LEAD.md` — Adicionado scoring, hunt skills, chains

### Pastas Criadas (4):
1. `.ai-factory/hunt/`
2. `.ai-factory/chains/`
3. `.ai-factory/meta/`
4. `.ai-factory/output/`

---

## 🚀 Próximos Passos Sugeridos

1. **Testar hunt skills** em código real do projeto
2. **Adicionar ## Verification** em agentes existentes (agents/*.md)
3. **Executar primeira wave** de auditoria completa
4. **Preencher cross-wave-delta** após primeira wave
5. **Criar mais hunt skills** baseado em necessidades (ex: hunt-missing-tests, hunt-inefficient-render)

---

## 📖 Referências

- **Inspirado em:** https://github.com/uphiago/recon-skills
- **Padrão de skills:** Template recon-skills (When to Use, Procedure, Verification)
- **Scoring:** Adaptado de recon-skills scoring system
- **Chains:** Adaptado de recon-skills cross-attack-chains
- **Cross-wave:** Adaptado de recon-skills cross-wave-delta-analysis
- **Self-improvement:** Adaptado de recon-skills self-improvement-loop

---

**Versão:** 1.0.0  
**Data:** 2026-01-XX  
**Status:** ✅ Implementado, pronto para teste