# 🎯 Hunt Dead Code

> **Detecta código morto, inalcançável, ou não referenciado que aumenta complexidade e dívida técnica**

---

## When to Use

- [ ] TECH-LEAD identifica "limpeza de código" como necessidade
- [ ] Antes de refatoração grande (reduzir superfície)
- [ ] Auditoria de complexidade ciclomática
- [ ] Pós-migração (código legado não removido)
- [ ] Housekeeping sprint (técnica dívida cleanup)

---

## Prerequisites

- [ ] Acesso completo ao código
- [ ] Testes rodando (para verificar se código é usado indiretamente)
- [ ] Ferramentas de análise estática (ts-prune, ts-unused-exports) opcionais

---

## How to Run

```bash
# 1. Buscar código não referenciado
node scripts/memory-manager.js search "dead code pattern" --topK 3

# 2. Executar scan automatizado
npx ts-prune --error
npx ts-unused-exports tsconfig.json

# 3. Ou manualmente: buscar funções/export não usadas
grep -r "^export " backend/src/ --include="*.ts" | grep -v "from"
```

---

## Procedure

### **Passo 1: Identificar Tipos de Dead Code**

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Unused Function** | Função declarada, nunca chamada | `function helper() {...}` sem calls |
| **Unused Variable** | Variável declarada, nunca lida | `const x = 5;` sem uso de `x` |
| **Unused Export** | Export não importado em lugar nenhum | `export const FOO = 'bar';` sem imports |
| **Unreachable Code** | Código após return/throw | `return; console.log('never');` |
| **Empty Component** | Componente sem lógica/render | `const X = () => null;` sem uso |
| **Commented Code** | Código comentado (git tem o código!) | `// const old = ...` |
| **Legacy Imports** | Import não usado | `import { unused } from 'x';` |

### **Passo 2: Scan com Ferramentas**

**Para TypeScript:**

```bash
# ts-prune: Detecta exports não usados
npx ts-prune --error

# ts-unused-exports: Similar, mais configurável
npx ts-unused-exports tsconfig.json --excludePathsFromConfig

# knip: Mais moderno, detecta também deps não usadas
npx knip
```

**Para JavaScript:**

```bash
# eslint com regra no-unused-vars
npx eslint . --rule 'no-unused-vars: error'

# unimported: Detecta imports não usados
npx unimported
```

### **Passo 3: Verificar Falsos Positivos**

Alguns padrões **parecem dead code mas não são**:

```typescript
// ✅ NÃO É DEAD CODE: Export para uso externo (SDK, plugin)
export const VERSION = '1.0.0'; // ← Usado por consumidores da lib

// ✅ NÃO É DEAD CODE: Hook lifecycle (React, etc.)
useEffect(() => { ... }, []); // ← Chamado pelo framework

// ✅ NÃO É DEAD CODE: Handler registrado dinamicamente
app.get('/route', handler); // ← handler parece não usado, mas é

// ✅ NÃO É DEAD CODE: Export condicional (feature flags)
if (FEATURE_X_ENABLED) {
  export const NewFeature = ...;
}
```

### **Passo 4: Classificar Severidade**

| Tipo | Impacto | Severidade | Score |
|------|---------|------------|-------|
| Dead code em production | Complexidade, confusão | 🟡 Média | 4 |
| Dead code em testes | Falsa sensação de cobertura | 🟡 Média | 4 |
| Comentado code (grande) | Poluição visual | 🟢 Baixa | 2 |
| Unused imports | Bundle size, confusão | 🟢 Baixa | 2 |
| Dead code com lógica sensível | Risco de segurança (código não auditado) | 🟠 Alta | 6 |

### **Passo 5: Decidir Ação**

| Cenário | Ação Recomendada |
|---------|-----------------|
| Código não usado há > 3 meses (git log) | **Remover** |
| Código comentado "pra segurança" | **Remover** (git tem histórico) |
| Código usado apenas em testes | Manter ou mockar |
| Código de feature flag desativada | Remover se flag foi removida |
| Código de SDK pública | Manter (pode ser usado externamente) |

---

## Pitfalls

### ⚠️ Falso Positivo: Código Chamado Dinamicamente

```typescript
// ✅ NÃO É DEAD CODE: Chamado via reflection/dependency injection
@Injectable()
class MyService {
  doSomething() { ... } // ← Nunca chamado diretamente, mas injetado
}
```

### ⚠️ Falso Positivo: Export para Consumo Externo

```typescript
// ✅ NÃO É DEAD CODE: SDK pública
export { createClient } from './client';
export { VERSION } from './version';
// ← Consumidores externos importam, não há refs internas
```

### ⚠️ Edge Case: Code Only Used in Tests

```typescript
// ⚠️ DEBÁTIVEL: Função usada apenas em testes
export function testHelper() { ... } // ← Usada só em *.test.ts

// Decisão: Manter se for utilitário de teste válido
//          Remover se for apenas setup de teste específico
```

---

## Verification

### Para Detecção

- [ ] Tipos de dead code identificados
- [ ] Scan com ferramentas executado
- [ ] Falsos positivos verificados
- [ ] Severidade classificada
- [ ] Score calculado

### Para Fix

- [ ] Código morto removido
- [ ] Imports não usados removidos
- [ ] Comentários com código removidos (ou movidos para docs se relevante)
- [ ] Testes ainda passam após remoção
- [ ] Build/compilation ainda funciona

---

## Score Calculation

| Fator | Score |
|-------|-------|
| Dead code em production | +4 |
| Dead code em testes | +4 |
| Comentado code (> 10 linhas) | +2 |
| Unused imports | +2 |
| Dead code com lógica sensível (auth, payment) | +2 |
| Código não tocado há > 6 meses (git log) | +1 |
| Código em arquivo crítico (auth, config) | +1 |

**Total:** <score>

**Ação Recomendada:**
- **Score >= 8:** 🟠 Alto → V&V Nível 2, remover em próxima sprint
- **Score 4-7:** 🟡 Médio → V&V Nível 2, agendar housekeeping
- **Score < 4:** 🟢 Baixo → V&V Nível 3, remover quando conveniente

---

## Fix Patterns

### **Pattern 1: Safe Removal with Git**

```bash
# ✅ ANTES DE REMOVER: Verificar histórico
git log -p --all -S "functionName" --source --all

# Se não houver uso em 6+ meses → remover com confiança

# Remover
git rm src/utils/oldFunction.ts
git commit -m "refactor: remove unused oldFunction (not used since 2024)"
```

### **Pattern 2: Gradual Deprecation**

```typescript
// ✅ PARA CÓDIGO USADO INTERNAMENTE: Deprecar antes de remover

// Passo 1: Adicionar deprecation warning
/**
 * @deprecated Will be removed in v2.0. Use newFunction() instead.
 */
export function oldFunction() {
  console.warn('oldFunction is deprecated, use newFunction()');
  return oldFunctionInternal();
}

// Passo 2: Aguardar 1-2 sprints (monitorar logs)

// Passo 3: Remover completamente
```

### **Pattern 3: Commented Code → Git Only**

```typescript
// ❌ ANTES: Código comentado no source
// function oldLogic() {
//   const x = 1;
//   return x + 1;
// }

// ✅ DEPOIS: Remover comentários, git tem histórico
// Se precisar referenciar: adicionar nota nos docs
// "Antiga lógica removida em commit abc123"
```

---

## Related Skills

- `agents/backend-dev` → Responsável por remover dead code backend
- `agents/frontend-dev` → Responsável por remover dead code frontend
- `standards/clean-code.md` → Padrões de código limpo
- `chains/README.md` → Dead code pode mascarar outras issues

---

**Versão:** 1.0.0  
**Autor:** TECH-LEAD (inspirado em recon-skills)  
**Local:** `.ai-factory/hunt/hunt-dead-code.md`