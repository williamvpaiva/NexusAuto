# 🎯 Hunt N+1 Queries

> **Detecta queries SQL repetidas em loops que causam degradação exponencial de performance**

---

## When to Use

- [ ] Usuário reporta "lentidão no banco" ou "timeout"
- [ ] TECH-LEAD identifica loops em código backend
- [ ] Auditoria de performance em endpoints críticos
- [ ] Code review de features que listam dados (listagens, grids, relatórios)

---

## Prerequisites

- [ ] Acesso ao código backend (controllers, services, repositories)
- [ ] Database schema disponível para análise de índices
- [ ] Query logs ou slow query log habilitado (opcional, mas recomendado)

---

## How to Run

```bash
# 1. Buscar padrões suspeitos no código
node scripts/memory-manager.js search "N+1 query pattern" --topK 3

# 2. Executar scan automatizado (se disponível)
node .ai-factory/scripts/hunt-n-plus-one.js backend/src/

# 3. Ou manualmente: buscar loops com queries dentro
grep -r "forEach\|for\|map" backend/src/ --include="*.ts" | grep -i "query\|find\|select"
```

---

## Procedure

### **Passo 1: Identificar Loops Suspeitos**

Busque padrões onde **query ocorre dentro de loop**:

```typescript
// ❌ PADRÃO N+1: Query dentro de forEach
const users = await db.query('SELECT * FROM users');
users.forEach(async (user) => {
  const orders = await db.query('SELECT * FROM orders WHERE user_id = ?', [user.id]);
});

// ❌ PADRÃO N+1: Query dentro de map
const userIds = [1, 2, 3];
const users = await Promise.all(userIds.map(id => 
  db.query('SELECT * FROM users WHERE id = ?', [id])
));

// ✅ CORRETO: Single query com JOIN
const usersWithOrders = await db.query(`
  SELECT u.*, o.* 
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
`);
```

### **Passo 2: Contar Queries por Requisição**

Para cada loop identificado:

1. **Conte iterações típicas:** Quantos itens o loop processa?
2. **Multiplique queries:** `1 query inicial + (N iterações × 1 query/iteração)`
3. **Calcule impacto:** `Total queries × tempo médio por query`

```
Exemplo:
- Loop sobre 50 usuários
- 1 query inicial (SELECT users)
- 50 queries dentro do loop (SELECT orders por user)
- Total: 51 queries por requisição
- Tempo médio: 10ms por query
- Impacto: 510ms só em queries (sem contar overhead)
```

### **Passo 3: Verificar Se Indexação Ajuda**

Mesmo com índice, N+1 é problemático em alta carga:

```sql
-- Verificar índices existentes
SELECT tablename, indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Verificar queries lentas no log
SELECT query, calls, total_time, mean_time 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### **Passo 4: Classificar Severidade**

| Iterações Típicas | Queries Totais | Severidade | Score |
|-------------------|----------------|------------|-------|
| 1-10 | 2-11 | 🟢 Baixa | 2 |
| 11-50 | 12-51 | 🟡 Média | 5 |
| 51-200 | 52-201 | 🟠 Alta | 8 |
| 200+ | 201+ | 🔴 Crítica | 10 |

### **Passo 5: Documentar Findings**

Para cada N+1 detectado:

```markdown
**Arquivo:** `backend/src/controllers/userController.ts`  
**Linhas:** 45-52  
**Padrão:** `forEach` com query dentro  
**Iterações típicas:** 50 usuários  
**Queries totais:** 51 por requisição  
**Impacto:** ~500ms adicionados  
**Score:** 8 (Alta)
```

---

## Pitfalls

### ⚠️ Falso Positivo: Loop Sobre Array em Memória

```typescript
// ✅ NÃO É N+1: Array já está em memória
const users = await db.query('SELECT * FROM users');
const activeUsers = users.filter(user => user.active); // Array.filter, sem query
```

### ⚠️ Falso Positivo: Promise.all com Limite Baixo

```typescript
// ⚠️ DEBÁTIVEL: Promise.all é paralelo, mas ainda é N+1
// Se N <= 3, pode ser aceitável por legibilidade
const ids = [1, 2, 3];
const results = await Promise.all(ids.map(id => fetchById(id)));
```

### ⚠️ Edge Case: Cache Mitiga N+1

```typescript
// ⚠️ ATENUADO: Redis cache reduz impacto, mas não elimina N+1
const users = await db.query('SELECT * FROM users');
users.forEach(async (user) => {
  const orders = await redis.get(`orders:${user.id}`) 
    || await db.query('SELECT * FROM orders WHERE user_id = ?', [user.id]);
});
```

---

## Verification

### Para Detecção

- [ ] Loop identificado com query dentro
- [ ] Contagem de iterações típicas documentada
- [ ] Total de queries calculado (1 + N)
- [ ] Impacto em ms estimado
- [ ] Score calculado conforme tabela

### Para Fix

- [ ] Query única com JOIN implementada
- [ ] OU batch query com `WHERE id IN (...)` implementada
- [ ] OU DataLoader pattern implementado (para GraphQL)
- [ ] Performance test mostra redução de queries
- [ ] Código antigo removido ou comentado com referência ao fix

---

## Score Calculation

| Fator | Score |
|-------|-------|
| Auth/Pagamento envolvido | +5 |
| Production code | +3 |
| Iterações > 50 | +2 |
| Sem índice na FK | +2 |
| Endpoint público (sem rate limit) | +1 |

**Total:** <score>

**Ação Recomendada:**
- **Score >= 10:** 🔴 Crítico → V&V Nível 1, architect + backend-dev
- **Score 6-9:** 🟡 Alto → V&V Nível 2, backend-dev senior
- **Score < 6:** 🟢 Normal → V&V Nível 2, backend-dev

---

## Fix Patterns

### **Pattern 1: JOIN Single Query**

```typescript
// ❌ ANTES: N+1
const users = await db.query('SELECT * FROM users');
for (const user of users) {
  user.orders = await db.query('SELECT * FROM orders WHERE user_id = ?', [user.id]);
}

// ✅ DEPOIS: JOIN
const result = await db.query(`
  SELECT u.id, u.name, o.id as order_id, o.total
  FROM users u
  LEFT JOIN orders o ON u.id = o.user_id
`);

// Agrupar em memória (1 query)
const usersMap = new Map();
result.rows.forEach(row => {
  if (!usersMap.has(row.id)) {
    usersMap.set(row.id, { id: row.id, name: row.name, orders: [] });
  }
  if (row.order_id) {
    usersMap.get(row.id).orders.push({ id: row.order_id, total: row.total });
  }
});
```

### **Pattern 2: WHERE IN Batch**

```typescript
// ❌ ANTES: N+1
const userIds = [1, 2, 3, ..., 100];
for (const id of userIds) {
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
}

// ✅ DEPOIS: WHERE IN
const userIds = [1, 2, 3, ..., 100];
const users = await db.query(
  'SELECT * FROM users WHERE id IN (?)',
  [userIds]
);
```

### **Pattern 3: DataLoader (GraphQL)**

```typescript
// ❌ ANTES: N+1 em GraphQL resolvers
const userResolvers = {
  user: async (_, { id }) => db.query('SELECT * FROM users WHERE id = ?', [id]),
};

// ✅ DEPOIS: DataLoader com batching
import DataLoader from 'dataloader';

const userLoader = new DataLoader(async (ids) => {
  const users = await db.query('SELECT * FROM users WHERE id IN (?)', [ids]);
  return ids.map(id => users.find(u => u.id === id));
});

const userResolvers = {
  user: (_, { id }) => userLoader.load(id),
};
```

---

## Related Skills

- `chains/README.md` → Chain A: Database Collapse (N+1 + Missing Index)
- `hunt-missing-index` → Detecta índices faltantes em FKs
- `agents/backend-dev` → Responsável pelo fix
- `agents/performance` → Valida melhoria de performance

---

**Versão:** 1.0.0  
**Autor:** TECH-LEAD (inspirado em recon-skills)  
**Local:** `.ai-factory/hunt/hunt-n-plus-one-queries.md`