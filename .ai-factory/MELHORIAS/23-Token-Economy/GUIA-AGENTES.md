# Guia Rápido — Token Economy para Agentes

## 🎯 Sua Missão

Economizar tokens em **TODA** ação. Cada token economizado é dinheiro real economizado.

---

## 📋 Checklist Rápido (Antes de Cada Ação)

### 1. Contexto Carregado
- [ ] Estou carregando apenas `CONTEXT_SUMMARY.md` (Layer 1)?
- [ ] Preciso mesmo de `PROJECT_CONTEXT.md` (Layer 2)?
- [ ] Usei `retrieve-context.js` para código específico?

### 2. Handoff
- [ ] Usei `HANDOFF_TEMPLATE.md`?
- [ ] Meu handoff tem < 200 tokens?
- [ ] Incluí hash do git?
- [ ] Especifiquei próxima ação claramente?

### 3. Código
- [ ] Arquivo > 100 linhas? → Entregar apenas **diff**
- [ ] Posso usar `apply-diff.js`?
- [ ] Zero comentários desnecessários?

### 4. Validação
- [ ] Verifiquei cache com `check-cache.js`?
- [ ] Apliquei nível de V&V apropriado?
- [ ] Atualizei `VALIDATION_CACHE.md`?

---

## 💰 Impacto por Ação

| Ação | Tokens Economizados | Impacto Financeiro |
|------|---------------------|-------------------|
| Usar Layer 1 apenas | ~18.000 | R$ 0,36 |
| Handoff resumido | ~4.800 | R$ 0,10 |
| Cache hit (pular V&V) | ~3.000 | R$ 0,06 |
| Diff em vez de arquivo completo | ~2.000 | R$ 0,04 |
| RAG (3 arquivos vs diretório) | ~15.000 | R$ 0,30 |

**Total por tarefa:** ~42.800 tokens = **R$ 0,86 economizados**

**Em 100 tarefas/dia:** **R$ 86/dia = R$ 2.580/mês**

---

## 🚫 Erros Comuns (NUNCA Faça Isso)

### ❌ Copiar Código Inteiro no Handoff

**Errado:**
```markdown
## Handoff

Aqui está o código completo do Login.tsx:

```tsx
import React from 'react';
// ... 500 linhas de código
```
```
**Tokens:** ~5.000

**Certo:**
```markdown
## Handoff

- **Arquivos:** `src/pages/Login.tsx`
- **Mudanças:** Adicionado formulário com validação Zod
- **Hash:** abc123
- **Próxima ação:** Testar fluxo de login
```
**Tokens:** ~150

---

### ❌ Carregar Diretório Inteiro

**Errado:**
```
Vou ler todo backend/src/ para entender o contexto
```
**Tokens:** ~20.000

**Certo:**
```bash
node scripts/retrieve-context.js "criar validação de email"
```
**Tokens:** ~1.000

---

### ❌ Validar Sem Verificar Cache

**Errado:**
```
Vou aplicar V&V completo em todos os arquivos
```
**Tokens:** ~3.000 por arquivo

**Certo:**
```bash
node scripts/check-cache.js backend/src/app.ts
# Output: Cache Hit → Pular validação
```
**Tokens:** ~50

---

## ✅ Padrões de Economia

### 1. Prompt Enxuto

**Template de Agente:**
```markdown
# Backend-Dev

**Regras:**
1. Use Express + TS + Zod
2. Gere APENAS o arquivo solicitado
3. Limite: 200 linhas/arquivo
4. Zero comentários explicativos
5. Se > 100 linhas → diff/patch

**Contexto:** Carregar apenas se solicitado
```

**Tokens:** ~80 (vs 400+ antes)

---

### 2. Resposta Direta

**Errado:**
```markdown
Claro! Vou criar um controller de autenticação para você.
Primeiro, vamos entender o contexto...
Agora, implementando a função de login...
Aqui está o código completo:
```

**Certo:**
```markdown
**Arquivo:** `backend/src/auth/controller.ts`

```typescript
export async function login(ctx: Context) {
  const { email, password } = ctx.request.body;
  // ... código direto
}
```

**Handoff:** `HANDOFF_TEMPLATE.md`
```

---

### 3. Diff Inteligente

**Errado:**
```typescript
// Arquivo completo de 500 linhas
export class AuthController {
  // ... tudo
}
```

**Certo:**
```diff
--- a/backend/src/auth/controller.ts
+++ b/backend/src/auth/controller.ts
@@ -15,6 +15,15 @@ export class AuthController {
+  async validateEmail(email: string) {
+    return z.string().email().safeParse(email).success;
+  }
+
   async login(ctx: Context) {
-    const { email } = ctx.request.body;
+    const { email, password } = ctx.request.body;
+    
+    if (!await this.validateEmail(email)) {
+      throw new ValidationError('Email inválido');
+    }
   }
 }
```

---

## 🧠 Dicas de Economia

### 1. Use Placeholders

**Errado:**
```markdown
O arquivo backend/src/auth/controller.ts precisa ser modificado
para adicionar a validação de email usando a biblioteca Zod
que já está instalada no projeto desde o dia 2026-06-15
```

**Certo:**
```markdown
`backend/src/auth/controller.ts` + validação Zod
```

---

### 2. Referencie, Não Copie

**Errado:**
```markdown
Como definido em backend/src/config/database.ts:
```typescript
export const databaseConfig = {
  host: process.env.DB_HOST,
  port: 3306,
  // ... 50 linhas
}
```
```

**Certo:**
```markdown
Usar `databaseConfig` de `backend/src/config/database.ts`
```

---

### 3. Condicionais de Contexto

**No prompt do Tech Lead:**
```markdown
SE tarefa envolver "banco de dados" OU "schema":
  → Anexar `standards/db.md`
SENÃO:
  → Ignorar
```

---

## 📊 Seu Dashboard Pessoal

Ao final de cada sessão, registre:

```markdown
## Minha Economia - [DATA] - [AGENTE]

| Métrica | Valor |
|---------|-------|
| Tarefas executadas | 5 |
| Tokens estimados (sem economia) | 125.000 |
| Tokens reais (com economia) | 25.000 |
| **Economia** | **100.000 tokens (R$ 2,00)** |
| Handoffs resumidos | 5/5 (100%) |
| Cache hits | 3/5 (60%) |
| Diffs gerados | 2 |
```

---

## 🎯 Metas por Agente

| Agente | Meta Tokens/Tarefa | Meta Cache Hit | Meta Handoff |
|--------|-------------------|----------------|--------------|
| TECH-LEAD | 5.000 | 80% | 200 tokens |
| BACKEND-DEV | 4.000 | 70% | 200 tokens |
| FRONTEND-DEV | 4.000 | 70% | 200 tokens |
| QA-TESTER | 3.000 | 90% | 200 tokens |
| DEVOPS | 3.000 | 80% | 200 tokens |
| SECURITY | 5.000 | 60% | 200 tokens |

---

## 🏆 Ranking de Economia

Atualizar semanalmente no `PROGRESS.md`:

```markdown
## Ranking Token Economy - Semana 2026-W27

| Posição | Agente | Economia Total | % Meta |
|---------|--------|----------------|--------|
| 🥇 1 | qa-tester | R$ 15,00 | 120% |
| 🥈 2 | backend-dev | R$ 12,00 | 100% |
| 🥉 3 | frontend-dev | R$ 10,00 | 85% |
| 4 | tech-lead | R$ 8,00 | 70% |
```

---

## 🚀 Comece Agora

1. **Antes de agir:** Verifique checklist
2. **Durante ação:** Use padrões de economia
3. **Após ação:** Registre métricas

**Lembre-se:** Cada token economizado é um passo para uma fábrica mais eficiente!

---

*Versão: 1.0.0 | Atualização: 2026-07-03*