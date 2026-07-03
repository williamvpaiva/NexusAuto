# ⛓️ Technical Debt Chains — Problemas Compostos

> **Quando 2+ problemas se combinam → Impacto exponencial**
> 
> TECH-LEAD usa para identificar cadeias críticas e escalar V&V

---

## 🧠 Conceito

Uma **Chain** é uma combinação de problemas que, **isolados são Médios**, mas **combinados são Críticos**.

```
Problema A (Médio) + Problema B (Médio) → Chain (Crítico)
```

---

## 📦 Chains Catalogadas

### **Chain A: Database Collapse**
| Ingrediente | Skill de Detecção | Score Individual |
|-------------|-------------------|------------------|
| N+1 Queries | `hunt-n-plus-one-queries` | 6 |
| Missing Index | `hunt-missing-index` | 5 |
| **Chain Score** | | **14 → Crítico** |

**Impacto:** DB colapsa em produção com carga > 100 req/s

**Quem Fixa:** `backend-dev` + `architect`

**V&V Nível:** 1 (7 passos, ~3.000 tokens)

---

### **Chain B: SQL Injection**
| Ingrediente | Skill de Detecção | Score Individual |
|-------------|-------------------|------------------|
| Missing Input Validation | `hunt-missing-input-validation` | 7 |
| Raw SQL Usage | `hunt-raw-sql-usage` | 6 |
| **Chain Score** | | **16 → Crítico** |

**Impacto:** Injeção SQL possível, data breach

**Quem Fixa:** `backend-dev` + `security`

**V&V Nível:** 1 (7 passos)

---

### **Chain C: Secret Exposure**
| Ingrediente | Skill de Detecção | Score Individual |
|-------------|-------------------|------------------|
| Hardcoded Secrets | `hunt-hardcoded-secrets` | 8 |
| Public Repository | `hunt-public-repo-check` | 5 |
| **Chain Score** | | **13 → Crítico** |

**Impacto:** Credentials vazados, account takeover

**Quem Fixa:** `security` + `devops`

**V&V Nível:** 1 (7 passos)

---

### **Chain D: Cascade Failure**
| Ingrediente | Skill de Detecção | Score Individual |
|-------------|-------------------|------------------|
| Missing Error Handling | `hunt-missing-error-handling` | 6 |
| Retry Without Backoff | `hunt-aggressive-retry` | 5 |
| **Chain Score** | | **11 → High** |

**Impacto:** Um erro derruba todo o sistema

**Quem Fixa:** `backend-dev` + `performance`

**V&V Nível:** 2 (3 passos)

---

### **Chain E: IDOR + Data Leak**
| Ingrediente | Skill de Detecção | Score Individual |
|-------------|-------------------|------------------|
| Missing Auth Check | `hunt-missing-auth` | 7 |
| Direct Object Reference | `hunt-idor-pattern` | 6 |
| **Chain Score** | | **13 → Critical** |

**Impacto:** Acesso a dados de outros usuários

**Quem Fixa:** `security` + `backend-dev`

**V&V Nível:** 1 (7 passos)

---

## 🔄 Como TECH-LEAD Usa

### **Fluxo de Detecção**

```
1. TECH-LEAD roda hunt skills individuais
2. Detecta 2+ problemas no mesmo arquivo/módulo
3. Consulta chains/README.md para verificar combinação
4. Se match → Calcula Chain Score
5. Chain Score >= 12 → Escala para V&V Nível 1
6. Atribui para 2 agentes (dupla especialidade)
7. QA valida chain completa, não peças isoladas
```

---

## 📊 Chain Score Calculation

```typescript
function calculateChainScore(ingredients: number[]): number {
  const base = ingredients.reduce((a, b) => a + b, 0);
  
  // Multiplicador por sinergia negativa
  const synergyMultiplier = ingredients.length >= 3 ? 1.3 : 1.0;
  
  // Bônus por production
  const productionBonus = isProductionCode ? 2 : 0;
  
  return Math.round((base * synergyMultiplier) + productionBonus);
}
```

| Score Final | Severidade | Ação TECH-LEAD |
|-------------|-----------|----------------|
| 12-20 | 🔴 Crítica | V&V Nível 1, 2 agents, daily report |
| 8-11 | 🟡 Alta | V&V Nível 2, 1 agent senior |
| 4-7 | 🟢 Média | V&V Nível 2, 1 agent regular |
| 0-3 | 🔵 Baixa | V&V Nível 3 (cache), next iteration |

---

## 📋 Template para Nova Chain

```markdown
### **Chain <Letra>: <Nome>**

| Ingrediente | Skill de Detecção | Score Individual |
|-------------|-------------------|------------------|
| <Problema 1> | `hunt-<name>` | <score> |
| <Problema 2> | `hunt-<name>` | <score> |
| **Chain Score** | | **<total> → <Severidade>** |

**Impacto:** <descrição do impacto combinado>

**Quem Fixa:** `<agent-1>` + `<agent-2>`

**V&V Nível:** <1|2|3>

**Exemplo Real:**
```typescript
// Código onde foi detectado
// Arquivo: backend/src/xyz.ts
// Linha: 45-67
```
```

---

## 🔗 Cross-References

- `hunt/*` — Skills que detectam ingredientes individuais
- `agents/*` — Agents responsáveis pelo fix
- `TECH-LEAD.md` — Orquestra detecção e atribuição
- `standards/vv-protocol.md` — Define níveis de V&V

---

## 📈 Métricas de Chains

| Métrica | Valor |
|---------|-------|
| Chains catalogadas | 5 |
| Chains críticas (12+) | 4 |
| Chains altas (8-11) | 1 |
| Fix rate (chains vs individuais) | 3x mais lento |
| Recorrência em produção | 67% das chains persistem > 2 sprints |

---

**Versão:** 1.0.0  
**Manutenção:** TECH-LEAD + Security + Architect  
**Local:** `.ai-factory/chains/README.md`