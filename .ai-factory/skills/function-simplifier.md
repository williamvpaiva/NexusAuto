# Skill: Function Simplifier

> Simplificação de funções complexas aplicando técnicas de refatoração para reduzir complexidade ciclomática e cognitiva

---

## 🎯 Objetivo

Analisar funções com alta complexidade ciclomática e cognitiva, aplicar técnicas de simplificação (extração, guard clauses, substituição de condicionais) para reduzir a complexidade para níveis aceitáveis (< 10 ciclomática, < 15 cognitiva).

---

## 🔁 Gatilhos de Acionamento

- Complexidade ciclomática > 10 detectada
- Função com mais de 30 linhas
- Múltiplos níveis de aninhamento (> 3)
- Dificuldade para escrever testes para a função
- Bug recorrente em função específica
- Solicitação de "simplifique esta função"

---

## 📋 Processo de 4 Passos

### PASSO 1: ANALISAR ESTRUTURA DA FUNÇÃO

**Objetivo:** Entender a estrutura atual e calcular métricas

**Ações:**
1. Calcular complexidade ciclomática (McCabe)
2. Calcular complexidade cognitiva (aninhamento, booleanos)
3. Identificar pontos específicos de complexidade:
   - Condicionais aninhados
   - Loops complexos
   - Expressões booleanas longas
   - Múltiplas responsabilidades
   - Muitos parâmetros
4. Identificar responsabilidades misturadas

**Output:**
```markdown
## Análise da Função: processOrder

```typescript
function processOrder(order: any, user: any, coupon?: any,
                      options?: any) {
  // 120 linhas, 6 responsabilidades

  if (order && order.items && order.items.length > 0) {
    if (user && user.isAuthenticated) {
      if (coupon) {
        if (coupon.isValid) {
          // aplica desconto
        }
      }
      for (const item of order.items) {
        if (item.stock > 0) {
          if (item.price > 0) {
            total += item.price * item.qty;
          } else {
            errors.push('Preço inválido');
          }
        } else {
          errors.push('Sem estoque');
        }
      }
      if (total > 0) {
        try {
          const payment = await processPayment(total, user);
          if (payment.success) {
            try {
              await sendEmail(user.email, 'confirmed');
            } catch (e) {
              logger.error('Email failed', e);
            }
            return { success: true, orderId: payment.id };
          } else {
            return { success: false, error: 'Payment failed' };
          }
        } catch (e) {
          return { success: false, error: e.message };
        }
      }
    }
  }
  return { success: false, error: 'Invalid request' };
}
```

### Métricas Atuais

| Métrica | Valor | Status |
|---------|-------|--------|
| Complexidade Ciclomática | 24 | 🔴 Crítica |
| Complexidade Cognitiva | 58 | 🔴 Crítica |
| Aninhamento Máximo | 7 | 🔴 Crítico |
| Linhas de Código | 120 | 🔴 Longa |
| Parâmetros | 4 | 🟡 Médio |
| Responsabilidades | 6 | 🔴 Muitas |
| Pontos de Retorno | 5 | 🟡 Médio |
```

---

### PASSO 2: APLICAR TÉCNICAS DE SIMPLIFICAÇÃO

**Objetivo:** Reduzir complexidade aplicando técnicas específicas

**Ações:**
1. **Guard Clauses:** Substituir ifs aninhados por early returns
2. **Extract Method:** Extrair blocos coesos em funções nomeadas
3. **Introduce Parameter Object:** Agrupar parâmetros relacionados
4. **Replace Conditional with Polymorphism:** Substituir switches por estratégias
5. **Decompose Conditional:** Quebrar condições complexas em funções
6. **Remove Control Flag:** Substituir flags por early return

**Output:**
```markdown
## Técnicas de Simplificação Aplicadas

### Técnica 1: Guard Clauses (Remove 4 níveis de aninhamento)

```typescript
// Substituir ifs aninhados por early returns
function processOrder(order: any, user: any, coupon?: any,
                      options?: any) {
  // Guard Clauses
  if (!order?.items?.length) {
    return { success: false, error: 'Pedido vazio' };
  }
  if (!user?.isAuthenticated) {
    return { success: false, error: 'Não autenticado' };
  }
  if (order.items.some(item => !item.stock || item.stock <= 0)) {
    return { success: false, error: 'Item sem estoque' };
  }
```

**[Redução:** 7 níveis → 1 nível de aninhamento]

### Técnica 2: Extract Method (5 funções extraídas)

```typescript
// Extrair validação de cupom
function applyCouponDiscount(total: number, coupon: Coupon): number {
  if (!coupon?.isValid) return total;
  return total - (total * coupon.discount / 100);
}

// Extrair cálculo de total
function calculateItemsTotal(items: OrderItem[]): number {
  return items
    .filter(item => item.price > 0)
    .reduce((sum, item) => sum + item.price * item.qty, 0);
}

// Extrair processamento de pagamento
async function processOrderPayment(
  total: number, user: User
): Promise<PaymentResult> {
  try {
    return await processPayment(total, user);
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// Extrair notificação
async function sendOrderConfirmation(email: string): Promise<void> {
  try {
    await sendEmail(email, 'confirmed');
  } catch (e) {
    logger.error('Falha ao enviar email de confirmação', e);
  }
}
```

### Técnica 3: Parameter Object

```typescript
// Antes: 4 parâmetros
function processOrder(order: any, user: any,
                      coupon?: any, options?: any);

// Depois: 1 parameter object
interface ProcessOrderRequest {
  order: Order;
  user: User;
  coupon?: Coupon;
  options?: ProcessingOptions;
}

function processOrder(request: ProcessOrderRequest): OrderResult {
  // usa request.order, request.user, etc.
}
```
---

### PASSO 3: GERAR VERSÃO SIMPLIFICADA

**Objetivo:** Produzir a função refatorada completa

**Ações:**
1. Combinar todas as técnicas em uma versão final
2. Garantir que a função principal orquestra apenas (baixa complexidade)
3. Cada função extraída tem uma única responsabilidade
4. Validar que o comportamento é idêntico ao original

**Output:**
```markdown
## Função Simplificada

```typescript
interface ProcessOrderRequest {
  order: Order;
  user: User;
  coupon?: Coupon;
}

function processOrder(request: ProcessOrderRequest): OrderResult {
  // Todas as validações como guard clauses no início
  validateOrder(request);

  // Orquestração simples (delega para funções especializadas)
  const itemsTotal = calculateItemsTotal(request.order.items);
  const totalWithDiscount = applyCouponDiscount(itemsTotal, request.coupon);
  const payment = await processOrderPayment(totalWithDiscount, request.user);

  if (!payment.success) {
    return { success: false, error: payment.error };
  }

  await sendOrderConfirmation(request.user.email);
  return { success: true, orderId: payment.id };
}

// Funções extraídas (cada uma com complexidade < 5)

function validateOrder(request: ProcessOrderRequest): void {
  if (!request.order?.items?.length) {
    throw new ValidationError('Pedido vazio');
  }
  if (!request.user?.isAuthenticated) {
    throw new ValidationError('Não autenticado');
  }
  if (request.order.items.some(item => !item.stock || item.stock <= 0)) {
    throw new ValidationError('Item sem estoque');
  }
}

function calculateItemsTotal(items: OrderItem[]): number {
  return items
    .filter(item => item.price > 0)
    .reduce((sum, item) => sum + item.price * item.qty, 0);
}

function applyCouponDiscount(total: number, coupon?: Coupon): number {
  if (!coupon?.isValid) return total;
  return total - (total * coupon.discount / 100);
}

async function processOrderPayment(
  total: number, user: User
): Promise<PaymentResult> {
  try {
    return await processPayment(total, user);
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function sendOrderConfirmation(email: string): Promise<void> {
  try {
    await sendEmail(email, 'confirmed');
  } catch (e) {
    logger.error('Falha ao enviar email de confirmação', e);
  }
}
```

### Métricas Pós-Simplificação

| Função | Complexidade | Linhas | Responsabilidade |
|--------|-------------|--------|-----------------|
| `processOrder` | 4 ✅ | 15 | Orquestrar |
| `validateOrder` | 3 ✅ | 12 | Validar |
| `calculateItemsTotal` | 2 ✅ | 5 | Calcular |
| `applyCouponDiscount` | 2 ✅ | 4 | Aplicar desconto |
| `processOrderPayment` | 2 ✅ | 7 | Processar pagamento |
| `sendOrderConfirmation` | 1 ✅ | 6 | Notificar |
```

---

### PASSO 4: VALIDAR COMPORTAMENTO IDÊNTICO

**Objetivo:** Garantir que a simplificação não alterou o comportamento

**Ações:**
1. Comparar output da função original vs simplificada para mesmas entradas
2. Executar testes existentes na versão simplificada
3. Adicionar testes para edge cases cobertos pela original
4. Verificar cobertura de código

**Output:**
```markdown
## Validação de Comportamento

### Testes de Equivalência

| Cenário | Entrada | Original | Simplificada | Match? |
|---------|---------|----------|--------------|--------|
| Pedido válido | order={items:[...]}, user={auth:true} | success | success | ✅ |
| Sem items | order={items:[]} | error("vazio") | error("vazio") | ✅ |
| Não autenticado | user={auth:false} | error("auth") | error("auth") | ✅ |
| Cupom inválido | coupon={isValid:false} | sem desconto | sem desconto | ✅ |
| Pagamento falha | payment=fail | error("failed") | error("failed") | ✅ |

### Resultados

| Verificação | Resultado |
|-------------|-----------|
| Testes existentes | 12/12 passando ✅ |
| Testes de equivalência | 15/15 passando ✅ |
| Cobertura | 100% (era 75%) ✅ |
| Complexidade ciclomática | 24 → 5 (função principal) ✅ |
| Sugestão: Adicionar testes para | `applyCouponDiscount` com desconto 100% |

### Checklist de Qualidade Final

- [x] Complexidade ciclomática < 10 em todas as funções
- [x] Complexidade cognitiva < 15 em todas as funções
- [x] Aninhamento máximo ≤ 2 níveis
- [x] Cada função tem 1 responsabilidade (SRP)
- [x] Nomes descritivos (intenção clara)
- [x] Testes de equivalência passam
- [x] Cobertura de 100% no código simplificado
```
---

## 💻 Exemplo de Prompt

```
Simplifique a função processOrder abaixo. Calcule complexidade
ciclomática antes e depois. Use Guard Clauses, Extract Method e
Parameter Object. Para cada técnica, mostre antes/depois e a
redução de complexidade.

function processOrder(order: any, user: any, coupon?: any) {
  // 120 linhas com 7 níveis de aninhamento
}
```

---

## ✅ Métricas de Sucesso

| Métrica | Antes | Depois | Alvo |
|---------|-------|--------|------|
| Complexidade Ciclomática | > 15 | < 8 | -53% |
| Complexidade Cognitiva | > 30 | < 12 | -60% |
| Aninhamento Máximo | > 4 | ≤ 2 | -50% |
| Linhas da Função Principal | > 50 | < 20 | -60% |
| Parâmetros | > 4 | < 3 | -25% |
| Responsabilidades | > 3 | 1 | -67% |
| Cobertura de Testes | < 60% | > 90% | +30pp |

---

## 🔗 Integrações

### Acionado Por
- `complexity-analyzer` (complexidade excessiva detectada)
- `refactoring-advisor` (recomendação de simplificação)
- `code-smell-detector` (Long Method / Complex Conditional)
- `tech-lead` (code review de função complexa)

### Aciona
- `naming-improver` (funções extraídas precisam de bons nomes)
- `dead-code-eliminator` (verificar código original não mais usado)
- `regression-test-generator` (testes de equivalência)
- `complexity-analyzer` (recalcular métricas após simplificação)

### Registra Em
- `.ai-factory/logs/refactoring/SIMPLIFY-YYYY-MM-DD.json`
- `.ai-factory/logs/complexity-analysis/COMPLEX-YYYY-MM-DD.json`
- `.ai-factory/MELHORIAS/LOG-VALIDACOES.md`

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem)  
**Tempo Médio:** 1-3h por função  
**Taxa de Sucesso:** >90% (com testes de equivalência)
