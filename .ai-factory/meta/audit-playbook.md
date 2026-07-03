# 📘 Audit Playbook

> **Pipeline de 3 fases para auditorias de codebase**
> 
> TECH-LEAD usa para orquestrar auditorias do início ao fim

---

## 📖 Visão Geral

```
Fase 1: Quick Scan (5-10 min)
├── Lint + Type Check
├── Detect hotspots óbvios
└── Output: lista de arquivos críticos

Fase 2: Deep Audit (30-60 min)
├── Hunt skills específicas
├── Análise de chains
├── Score calculation
└── Output: findings detalhados

Fase 3: Fix + Verify (1-2 horas)
├── Atribuição para agents
├── Fix com V&V apropriado
├── QA valida
└── Output: código fixado + relatório
```

---

## 🎯 Quando Usar

- [ ] TECH-LEAD precisa auditar codebase novo
- [ ] Sprint de dívida técnica
- [ ] Pós-incidente (root cause analysis)
- [ ] Pré-release (security/performance check)
- [ ] Onboarding de novo dev (entender codebase)

---

## 📋 Fase 1: Quick Scan

**Duração:** 5-10 minutos  
**Objetivo:** Identificar hotspots óbvios para focar Fase 2

### Passos

```bash
# 1. Lint + Type Check
npm run lint
npm run type-check

# 2. Buscar padrões suspeitos (grep)
grep -r "TODO\|FIXME\|HACK\|XXX" backend/src/ frontend/src/ --include="*.ts" --include="*.tsx"

# 3. Listar arquivos maiores (> 500 linhas)
find backend/src/ frontend/src/ -name "*.ts" -exec wc -l {} \; | sort -rn | head -20

# 4. Verificar dependencies desatualizadas
npm outdated

# 5. Checar testes falhando
npm test -- --passWithNoTests=false
```

### Output Esperado

```markdown
## Quick Scan Results

### Arquivos Críticos (> 500 linhas)
1. `backend/src/complexModule.ts` — 847 linhas
2. `frontend/src/LegacyComponent.tsx` — 623 linhas

### TODOs/FIXMEs
- `backend/src/auth.ts:45` — FIXME: Implement rate limiting
- `frontend/src/api.ts:12` — TODO: Add error handling

### Dependencies Desatualizadas
- `express` — 4.x → 5.x (major)
- `react` — 18.x → 19.x (major)

### Testes Falhando
- `auth.test.ts` — 3 failing
- `api.test.ts` — 1 failing

### Hotspots para Fase 2
1. `backend/src/complexModule.ts` — Complexidade ciclomática alta
2. `backend/src/auth.ts` — FIXME de segurança
```

---

## 📋 Fase 2: Deep Audit

**Duração:** 30-60 minutos  
**Objetivo:** Detectar problemas específicos com hunt skills

### Passos

```bash
# 1. TECH-LEAD seleciona hunt skills baseado no Quick Scan
# Ex: Se muitos TODOs de segurança → hunt-hardcoded-secrets
# Ex: Se arquivos grandes → hunt-dead-code + hunt-n-plus-one

# 2. Executar hunt skills
node .ai-factory/scripts/run-hunt.js hunt-n-plus-one-queries backend/src/
node .ai-factory/scripts/run-hunt.js hunt-missing-validation backend/src/
node .ai-factory/scripts/run-hunt.js hunt-hardcoded-secrets backend/src/

# 3. Verificar chains
cat .ai-factory/chains/README.md
# Identificar se 2+ findings se combinam em chain

# 4. Calcular scores
# Cada hunt skill retorna score conforme seus critérios
```

### Output Esperado

```markdown
## Deep Audit Results

### Hunt: N+1 Queries
| Arquivo | Linhas | Score | Severidade |
|---------|--------|-------|------------|
| `backend/src/users.ts` | 45-52 | 8 | 🟠 Alta |

### Hunt: Missing Validation
| Arquivo | Linhas | Score | Severidade |
|---------|--------|-------|------------|
| `backend/src/auth.ts` | 78-90 | 12 | 🔴 Crítica |

### Hunt: Hardcoded Secrets
| Arquivo | Linhas | Score | Severidade |
|---------|--------|-------|------------|
| `backend/src/config.ts` | 12 | 10 | 🔴 Crítica |

### Chains Detectadas
| Chain | Ingredientes | Score Total |
|-------|-------------|-------------|
| B: SQL Injection | Missing Validation + Raw SQL | 16 |

### Priorização
1. 🔴 Chain B (SQL Injection) — Score 16
2. 🔴 Hardcoded Secrets — Score 10
3. 🟠 N+1 Queries — Score 8
```

---

## 📋 Fase 3: Fix + Verify

**Duração:** 1-2 horas  
**Objetivo:** Corrigir problemas e validar com V&V

### Passos

```bash
# 1. TECH-LEAD atribui tasks baseado em scores
# Score >= 12 → security + backend-dev, V&V Nível 1
# Score 8-11 → backend-dev senior, V&V Nível 2
# Score < 8 → backend-dev, V&V Nível 2 ou 3

# 2. Agents executam fixes
# Cada fix segue padrão: código + teste + docs

# 3. QA valida com V&V apropriado
node scripts/check-cache.js backend/src/auth.ts
# Se cache miss → aplicar Nível 1 ou 2

# 4. Atualizar INDEX.md e LOG-VALIDACOES.md
```

### Output Esperado

```markdown
## Fix + Verify Results

### Fixes Aplicados
| Finding | Arquivo | Status | V&V |
|---------|---------|--------|-----|
| SQL Injection | `backend/src/auth.ts` | ✅ Fixado | Nível 1 ✅ |
| Hardcoded Secret | `backend/src/config.ts` | ✅ Fixado | Nível 1 ✅ |
| N+1 Query | `backend/src/users.ts` | ✅ Fixado | Nível 2 ✅ |

### Validação QA
- [ ] Todos os testes passando
- [ ] Lint sem erros
- [ ] Type check sem erros
- [ ] V&V Level 1 completo para críticos
- [ ] V&V Level 2 completo para altos

### Relatório Final
**Total Findings:** 3  
**Total Fixes:** 3  
**V&V Approval Rate:** 100%  
**Tech Debt Score:** 36 → 0 (nesta auditoria)
```

---

## 🔄 Decision Matrix

| Resultado Quick Scan | Ação Fase 2 | Agents Envolvidos |
|---------------------|-------------|-------------------|
| Muitos TODOs de segurança | `hunt-hardcoded-secrets` + `hunt-missing-validation` | security + backend-dev |
| Arquivos > 500 linhas | `hunt-dead-code` + `hunt-n-plus-one` | backend-dev + performance |
| Testes falhando | `hunt-missing-error-handling` | qa-tester + backend-dev |
| Dependencies desatualizadas | Auditoria manual de changelogs | devops + backend-dev |

---

## 📊 Template de Relatório Final

```markdown
# Audit Report

**Data:** YYYY-MM-DD  
**Tipo:** <Security | Performance | General>  
**Fases Executadas:** 1, 2, 3  
**Agents Envolvidos:** <lista>

---

## Resumo

| Métrica | Valor |
|---------|-------|
| Total Findings | X |
| Critical (Score >= 12) | X |
| High (Score 8-11) | X |
| Medium (Score 4-7) | X |
| Fixes Aplicados | X |
| V&V Approval Rate | X% |

---

## Findings por Categoria

| Categoria | Count | % do Total |
|-----------|-------|------------|
| Security | X | X% |
| Performance | X | X% |
| Code Quality | X | X% |
| Tests | X | X% |

---

## Chains Detectadas

| Chain | Ingredientes | Score | Status |
|-------|-------------|-------|--------|
| <nome> | <ingrediente 1> + <ingrediente 2> | XX | ✅ Fixada / 🟡 Pendente |

---

## Próximos Passos

1. **Imediato:** <ação>
2. **Próxima Sprint:** <ação>
3. **Longo Prazo:** <ação>
```

---

## 🔗 Cross-References

- `TECH-LEAD.md` → Orquestra execução do playbook
- `hunt/*` → Skills usadas na Fase 2
- `chains/README.md` → Chains para verificar
- `standards/vv-protocol.md` → Níveis de V&V
- `meta/cross-wave-delta.md` → Comparar com auditorias anteriores

---

**Versão:** 1.0.0  
**Autor:** TECH-LEAD (inspirado em recon-skills)  
**Local:** `.ai-factory/meta/audit-playbook.md`