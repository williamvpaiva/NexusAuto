# 🎯 Hunt Missing Error Handling

> **Detecta promises, async/await, e operações que podem falhar sem try-catch ou .catch()**

---

## When to Use

- [ ] TECH-LEAD identifica "erros silenciosos" ou "falhas sem log"
- [ ] Code review de features críticas (pagamentos, auth, dados)
- [ ] Pós-incidente (erro não foi capturado/logado)
- [ ] Auditoria de resiliência e graceful degradation

---

## Prerequisites

- [ ] Acesso ao código backend e frontend
- [ ] Conhecimento dos pontos de falha comuns (API calls, DB queries, file I/O)
- [ ] Logs de erro disponíveis (para correlacionar com código)

---

## How to Run

```bash
# 1. Buscar async/await sem try-catch
node scripts/memory-manager.js search "missing error handling pattern" --topK 3

# 2. Executar scan automatizado
node .ai-factory/scripts/hunt-error-handling.js backend/src/

# 3. Ou manualmente: buscar await sem try
grep -r "await " backend/src/ --include="*.ts" | grep -v "try\|catch"
```

---

## Procedure

### **Passo 1: Identificar Pontos de Falha**

Busque operações que **podem falhar**:

```typescript
// ❌ PADRÕES DE RISCO

// 1. Async/await sem try-catch
async function getUser(id: string) {
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]); // ← Pode falhar!
  return user;
}

// 2. Promise sem .catch()
fetch('/api/data')
  .then(res => res.json()) // ← E se falhar?
  .then(data => console.log(data));

// 3. forEach com async (erros silenciosos)
items.forEach(async (item) => {
  await processItem(item); // ← Erro aqui não é capturado!
});

// 4. Event handler com async
button.addEventListener('click', async () => {
  await submitForm(); // ← Erro aqui é unhandled
});

// 5. Top-level await sem catch (módulos)
const data = await fetch('/api/data'); // ← Em module top-level
```

### **Passo 2: Verificar Cada Ponto**

Para cada operação de risco, verifique:

**✅ Error Handling Adequado:**
```typescript
// Try-catch com logging
try {
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return user;
} catch (error) {
  logger.error('Failed to fetch user', { id, error });
  throw error; // ou return default value
}

// .catch() em promises
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(error => logger.error('Fetch failed', error));

// Promise.allSettled para múltiplas ops
const results = await Promise.allSettled([
  fetchUser(id),
  fetchOrders(id),
  fetchPreferences(id),
]);
// Processar results mesmo se alguns falharem
```

**❌ Sem Error Handling:**
```typescript
// Silent failure
const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
return user; // ← E se falhar?

// Empty catch (pior que sem catch!)
try {
  await riskyOperation();
} catch (error) {
  // ← Silencioso = debugging impossível
}
```

### **Passo 3: Classificar Tipo de Erro**

| Tipo de Operação | Erros Comuns | Impacto |
|-----------------|--------------|---------|
| **Database Query** | Connection error, timeout, constraint violation | 🔴 Alto |
| **API Call (HTTP)** | Network error, timeout, 4xx/5xx | 🔴 Alto |
| **File I/O** | File not found, permission denied | 🟡 Médio |
| **JSON Parse** | Invalid JSON, malformed | 🟡 Médio |
| **Auth/Payment** | Token expired, payment declined | 🔴 Crítico |
| **External Service** | Rate limit, service unavailable | 🟡 Médio |

### **Passo 4: Calcular Score de Risco**

| Fator | Score |
|-------|-------|
| Operação em endpoint de auth/pagamento | +5 |
| Operação em production code | +3 |
| Erro seria silencioso (sem log) | +4 |
| Operação afeta múltiplos usuários | +3 |
| Sem fallback ou retry | +2 |
| Código em critical path (startup, init) | +3 |

**Total:** <score>

---

## Pitfalls

### ⚠️ Falso Positivo: Erro Tratado em Camada Superior

```typescript
// ✅ NÃO É PROBLEMA: Error boundary trata
async function handleSubmit() {
  await apiCall(); // ← Sem try-catch aqui
}

// Mas o componente pai tem error boundary
<ErrorBoundary fallback={<ErrorUI />}>
  <Form onSubmit={handleSubmit} />
</ErrorBoundary>
```

### ⚠️ Falso Positivo: Promise com .catch() em Cadeia

```typescript
// ✅ NÃO É PROBLEMA: .catch() no final
fetch('/api/data')
  .then(res => res.json())
  .then(data => processData(data))
  .catch(error => logger.error(error)); // ← Tratado aqui
```

### ⚠️ Edge Case: Erro Intencionalmente Ignorado

```typescript
// ⚠️ DEBÁTIVEL: Ignorar erro é válido em alguns casos
try {
  await fs.unlink('/tmp/old-file.txt');
} catch (error) {
  // Arquivo pode não existir, tudo bem
  // MAS: Pelo menos logar em debug
  logger.debug('File not found, skipping', { path: '/tmp/old-file.txt' });
}
```

---

## Verification

### Para Detecção

- [ ] Pontos de falha identificados (await, promises, I/O)
- [ ] Error handling verificado (presente/ausente/parcial)
- [ ] Tipo de erro classificado
- [ ] Score calculado conforme fatores de risco

### Para Fix

- [ ] Try-catch adicionado onde apropriado
- [ ] Logging implementado (não apenas throw)
- [ ] Fallback ou retry strategy definida
- [ ] Erros específicos tratados (não apenas `catch (error)`)
- [ ] Testes de erro adicionados (cenários de falha)

---

## Score Calculation

| Fator | Score |
|-------|-------|
| Operação em endpoint de auth/pagamento | +5 |
| Operação em production code | +3 |
| Erro seria silencioso (sem log) | +4 |
| Operação afeta múltiplos usuários | +3 |
| Sem fallback ou retry | +2 |
| Código em critical path (startup, init) | +3 |

**Total:** <score>

**Ação Recomendada:**
- **Score >= 12:** 🔴 Crítico → V&V Nível 1, backend-dev + security
- **Score 8-11:** 🟡 Alto → V&V Nível 2, backend-dev senior
- **Score < 8:** 🟢 Normal → V&V Nível 2, backend-dev

---

## Fix Patterns

### **Pattern 1: Try-Catch com Logging**

```typescript
// ❌ ANTES: Sem error handling
async function getUser(id: string) {
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return user;
}

// ✅ DEPOIS: Try-catch com logging
async function getUser(id: string) {
  try {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return user;
  } catch (error) {
    logger.error('Failed to fetch user', { 
      id, 
      error: error instanceof Error ? error.message : error 
    });
    
    // Opções:
    // 1. Re-throw (deixa camada superior tratar)
    throw error;
    
    // 2. Return default/null
    // return null;
    
    // 3. Return custom error
    // throw new AppError('USER_NOT_FOUND', { id });
  }
}
```

### **Pattern 2: Error Boundary (Frontend)**

```typescript
// ✅ React Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Component error', { error, errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorUI />;
    }
    return this.props.children;
  }
}

// Uso
<ErrorBoundary fallback={<ErrorUI />}>
  <UserProfile userId={id} />
</ErrorBoundary>
```

### **Pattern 3: Retry com Backoff**

```typescript
// ✅ Retry strategy para falhas transitórias
async function fetchWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === maxRetries - 1) throw error; // Última tentativa
      
      // Backoff exponencial: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      logger.warn(`Fetch failed, retrying in ${delay}ms`, { url, attempt: i + 1 });
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### **Pattern 4: Promise.allSettled para Resiliência**

```typescript
// ✅ Continuar mesmo se algumas ops falharem
const results = await Promise.allSettled([
  fetchUser(id),
  fetchOrders(id),
  fetchPreferences(id),
]);

const user = results[0].status === 'fulfilled' ? results[0].value : null;
const orders = results[1].status === 'fulfilled' ? results[1].value : [];
const preferences = results[2].status === 'fulfilled' ? results[2].value : {};

// Renderizar com dados parciais
return { user, orders, preferences };
```

---

## Related Skills

- `chains/README.md` → Chain D: Cascade Failure (Missing Error Handling + Retry Without Backoff)
- `agents/backend-dev` → Responsável por implementar error handling
- `agents/frontend-dev` → Responsável por error boundaries no frontend
- `standards/error-handling.md` → Padrões de tratamento de erro

---

**Versão:** 1.0.0  
**Autor:** TECH-LEAD (inspirado em recon-skills)  
**Local:** `.ai-factory/hunt/hunt-missing-error-handling.md`