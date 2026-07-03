# 🎯 Hunt Missing Input Validation

> **Detecta inputs de usuário sem validação que podem levar a injection, XSS, ou corrupção de dados**

---

## When to Use

- [ ] TECH-LEAD identifica "segurança dos inputs" como preocupação
- [ ] Code review de endpoints novos ou modificados
- [ ] Auditoria de segurança pós-incidente
- [ ] Integração com APIs externas (webhooks, callbacks)
- [ ] Formulários, uploads, ou qualquer entrada de usuário

---

## Prerequisites

- [ ] Acesso ao código backend (controllers, routes, services)
- [ ] Acesso ao código frontend (forms, inputs, API calls)
- [ ] Lista de endpoints que aceitam input de usuário

---

## How to Run

```bash
# 1. Buscar endpoints que recebem input
node scripts/memory-manager.js search "input validation pattern" --topK 3

# 2. Executar scan automatizado
node .ai-factory/scripts/hunt-validation.js backend/src/

# 3. Ou manualmente: buscar req.body sem validação
grep -r "req.body\|request.body" backend/src/ --include="*.ts" | grep -v "zod\|joi\|yup\|validate"
```

---

## Procedure

### **Passo 1: Mapear Endpoints com Input**

Liste todos os endpoints que aceitam dados de usuário:

```typescript
// Backend (Express)
POST   /api/users          → body: name, email, password
PUT    /api/users/:id      → body: name, email
POST   /api/orders         → body: items, paymentInfo
```

### **Passo 2: Verificar Validação em Cada Endpoint**

Para cada endpoint, verifique se há:

**✅ Validação Adequada:**
```typescript
// Schema definido com Zod
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase'),
});

// Validação explícita
app.post('/api/users', async (req, res) => {
  const data = createUserSchema.parse(req.body);
  // ... usa data validado
});
```

**❌ Sem Validação:**
```typescript
// ❌ Input bruto sem validação
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body; // ← DANGEROUS
  await db.query('INSERT INTO users ...', [name, email, password]);
});
```

**⚠️ Validação Parcial:**
```typescript
// ⚠️ Validação apenas de tipos, sem regras de negócio
app.post('/api/users', async (req, res) => {
  if (typeof req.body.name !== 'string') return res.status(400).send();
  // ← Falta validar email, password strength, etc.
});
```

### **Passo 3: Classificar Tipo de Input**

| Tipo de Input | Risco | Validação Mínima |
|---------------|-------|-----------------|
| **Texto livre** | XSS, Injection | Length limit, sanitize HTML |
| **Email** | Injection, enum | Regex email, normalize |
| **Senha** | Weak creds | Min length, complexity |
| **Número/ID** | IDOR, Injection | Integer check, range, auth check |
| **URL** | SSRF, Redirect | Protocol whitelist, domain check |
| **File Upload** | RCE, XSS | MIME type, extension, size limit |
| **JSON/Object** | Prototype pollution, Injection | Schema strict, no __proto__ |

### **Passo 4: Verificar Validação em Camadas**

Validação ideal ocorre em **3 camadas**:

```
┌─────────────────────────────────────┐
│ Camada 1: Frontend                  │ ← UX (não confiar!)
│ - Validação em tempo real           │
│ - Feedback imediato                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Camada 2: Backend (API Boundary)    │ ← CRÍTICA (obrigatória)
│ - Schema validation (Zod/Joi)       │
│ - Type checking                     │
│ - Sanitização                       │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Camada 3: Database (Last Line)      │ ← Segurança adicional
│ - Constraints (NOT NULL, UNIQUE)    │
│ - Check constraints                 │
│ - Triggers                          │
└─────────────────────────────────────┘
```

### **Passo 5: Calcular Score de Risco**

| Fator | Score |
|-------|-------|
| Input vai direto para SQL | +5 |
| Input renderizado como HTML | +4 |
| Input armazena arquivos | +4 |
| Input de usuário não autenticado | +3 |
| Input afeta outros usuários | +3 |
| Sem validação em nenhuma camada | +5 |
| Validação apenas no frontend | +4 |

**Total:** <score>

---

## Pitfalls

### ⚠️ Falso Positivo: Input Já Validado por Middleware

```typescript
// ✅ NÃO É PROBLEMA: Middleware valida antes
app.post('/api/users', 
  validateUserMiddleware, // ← Validação aqui
  async (req, res) => {
    const { name, email } = req.body; // ← Já validado
  }
);
```

### ⚠️ Falso Positivo: Input Interno (Não-Usuário)

```typescript
// ✅ NÃO É PROBLEMA: Input gerado internamente
const internalData = generateReport(); // ← Não vem de usuário
await saveToDb(internalData);
```

### ⚠️ Edge Case: Validação Dinâmica por Tipo

```typescript
// ⚠️ ATENÇÃO: Validação depende de tipo dinâmico
app.post('/api/dynamic', async (req, res) => {
  const { type, data } = req.body;
  const validator = getValidatorByType(type); // ← Validação dinâmica
  validator.parse(data);
});
// Verificar se getValidatorByType cobre todos os tipos possíveis
```

---

## Verification

### Para Detecção

- [ ] Endpoint mapeado com input de usuário
- [ ] Validação verificada (presente/ausente/parcial)
- [ ] Tipo de input classificado
- [ ] Camadas de validação verificadas (frontend, backend, DB)
- [ ] Score calculado conforme fatores de risco

### Para Fix

- [ ] Schema de validação implementado (Zod/Joi/Yup)
- [ ] Validação ocorre no boundary da API (primeira linha do handler)
- [ ] Tipos e regras de negócio cobertos
- [ ] Sanitização aplicada onde necessário
- [ ] Testes de validação adicionados (casos positivos e negativos)

---

## Score Calculation

| Fator | Score |
|-------|-------|
| Input vai direto para SQL | +5 |
| Input renderizado como HTML | +4 |
| Input armazena arquivos | +4 |
| Input de usuário não autenticado | +3 |
| Input afeta outros usuários | +3 |
| Sem validação em nenhuma camada | +5 |
| Validação apenas no frontend | +4 |

**Total:** <score>

**Ação Recomendada:**
- **Score >= 12:** 🔴 Crítico → V&V Nível 1, security + backend-dev
- **Score 8-11:** 🟡 Alto → V&V Nível 2, backend-dev senior
- **Score < 8:** 🟢 Normal → V&V Nível 2, backend-dev

---

## Fix Patterns

### **Pattern 1: Zod Schema Validation**

```typescript
// ❌ ANTES: Sem validação
app.post('/api/users', async (req, res) => {
  const { name, email, password } = req.body;
  await db.query('INSERT INTO users ...', [name, email, password]);
});

// ✅ DEPOIS: Zod validation
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name required').max(100, 'Name too long'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number'),
});

app.post('/api/users', async (req, res) => {
  try {
    const data = createUserSchema.parse(req.body);
    await db.query('INSERT INTO users ...', [data.name, data.email, data.password]);
    res.status(201).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    throw error;
  }
});
```

### **Pattern 2: Validation Middleware**

```typescript
// ✅ Middleware reutilizável
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  };
}

// Uso
app.post('/api/users', 
  validate(createUserSchema),
  async (req, res) => {
    // req.body já está validado e tipado
    const { name, email, password } = req.body;
  }
);
```

### **Pattern 3: Sanitização para HTML**

```typescript
// ✅ Sanitizar input que será renderizado como HTML
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

app.post('/api/comments', async (req, res) => {
  const { content } = commentSchema.parse(req.body);
  
  // Sanitizar HTML (permitir apenas tags seguras)
  const sanitized = purify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href'],
  });
  
  await db.query('INSERT INTO comments ...', [sanitized]);
});
```

---

## Related Skills

- `chains/README.md` → Chain B: SQL Injection (Missing Validation + Raw SQL)
- `hunt-hardcoded-secrets` → Detecta secrets expostos
- `hunt-xss` → Detecta vulnerabilidades XSS
- `agents/security` → Responsável por auditoria
- `agents/backend-dev` → Responsável pelo fix

---

**Versão:** 1.0.0  
**Autor:** TECH-LEAD (inspirado em recon-skills)  
**Local:** `.ai-factory/hunt/hunt-missing-input-validation.md`