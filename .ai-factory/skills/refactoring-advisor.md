# Skill: Refactoring Advisor

> Recomenda técnicas específicas de refatoração para cada code smell ou problema de design identificado

---

## 🎯 Objetivo

Para cada code smell ou problema de design identificado, recomendar a técnica de refatoração mais adequada, com exemplos de código antes/depois, estimativa de esforço e riscos.

---

## 🔁 Gatilhos de Acionamento

- Code smell detectado pelo `code-smell-detector`
- Solicitação de "como refatorar este código"
- Antes de refatoração de funções complexas
- Quando código é difícil de entender ou modificar

---

## 📋 Catálogo de Refatoração

### Composição de Métodos

#### 1. Extract Method
**Quando usar:** Método muito longo (> 20 linhas)

**Exemplo:**
```typescript
// ANTES
function processOrder(order: Order) {
  // Validar pedido (15 linhas)
  if (order.items.length === 0) { /* ... */ }
  if (!order.user) { /* ... */ }
  // ... mais 10 linhas de validação
  
  // Calcular total (20 linhas)
  let total = 0;
  for (const item of order.items) { /* ... */ }
  // ... mais 15 linhas de cálculo
  
  // Salvar (10 linhas)
  const saved = db.save(order);
  // ... mais 5 linhas
  
  // Notificar (15 linhas)
  email.send(order.user.email, 'Pedido confirmado');
  // ... mais 10 linhas
}

// DEPOIS
function processOrder(order: Order) {
  validateOrder(order);
  const total = calculateTotal(order);
  const saved = saveOrder(order, total);
  notifyCustomer(saved);
}

function validateOrder(order: Order) { /* ... */ }
function calculateTotal(order: Order): number { /* ... */ }
function saveOrder(order: Order, total: number): Order { /* ... */ }
function notifyCustomer(order: Order) { /* ... */ }
```

---

#### 2. Extract Class
**Quando usar:** Classe muito grande (> 300 linhas)

**Exemplo:**
```typescript
// ANTES: OrderManager com 850 linhas
class OrderManager {
  validateOrder(order: Order) { /* ... */ }
  calculateTotal(order: Order) { /* ... */ }
  calculateFreight(order: Order) { /* ... */ }
  processPayment(order: Order) { /* ... */ }
  saveOrder(order: Order) { /* ... */ }
  notifyCustomer(order: Order) { /* ... */ }
  generateInvoice(order: Order) { /* ... */ }
  // ... mais 30 métodos
}

// DEPOIS
class OrderValidator { validateOrder(order: Order) { /* ... */ } }
class OrderCalculator { calculateTotal(order: Order) { /* ... */ } }
class FreightCalculator { calculateFreight(order: Order) { /* ... */ } }
class PaymentProcessor { processPayment(order: Order) { /* ... */ } }
class OrderRepository { saveOrder(order: Order) { /* ... */ } }
class OrderNotifier { notifyCustomer(order: Order) { /* ... */ } }
class InvoiceGenerator { generateInvoice(order: Order) { /* ... */ } }

class OrderManager {
  constructor(
    private validator: OrderValidator,
    private calculator: OrderCalculator,
    private freightCalc: FreightCalculator,
    private paymentProcessor: PaymentProcessor,
    private repository: OrderRepository,
    private notifier: OrderNotifier,
    private invoiceGen: InvoiceGenerator
  ) {}
  
  processOrder(order: Order) {
    this.validator.validate(order);
    const total = this.calculator.calculate(order);
    const freight = this.freightCalc.calculate(order);
    this.paymentProcessor.process(order, total);
    const saved = this.repository.save(order);
    this.notifier.notify(saved);
    this.invoiceGen.generate(saved);
    return saved;
  }
}
```

---

#### 3. Extract Variable
**Quando usar:** Expressão complexa usada múltiplas vezes

**Exemplo:**
```typescript
// ANTES
if (order.items.filter(i => i.price > 100).length > 5 && 
    order.user.isPremium && 
    order.total > 1000) {
  // aplica desconto
}

// DEPOIS
const hasExpensiveItems = order.items.filter(i => i.price > 100).length > 5;
const isPremiumUser = order.user.isPremium;
const isLargeOrder = order.total > 1000;
const qualifiesForDiscount = hasExpensiveItems && isPremiumUser && isLargeOrder;

if (qualifiesForDiscount) {
  // aplica desconto
}
```

---

### Movimento de Código

#### 4. Move Method
**Quando usar:** Método usa mais dados de outra classe que da própria

**Exemplo:**
```typescript
// ANTES: Order.getTotal() usa dados de Money
class Order {
  getTotal(): number {
    let total = 0;
    for (const item of this.items) {
      total += item.price * item.quantity;
    }
    total -= this.discount.percent * total;
    total += this.freight.value;
    total = this.tax.rate * total;
    return total;
  }
}

// DEPOIS: Mover para Money.calculateTotal()
class Money {
  calculateTotal(items: OrderItem[], discount: Discount, freight: Freight, tax: Tax): number {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const afterDiscount = subtotal - (discount.percent * subtotal);
    const afterFreight = afterDiscount + freight.value;
    return afterFreight * tax.rate;
  }
}

class Order {
  getTotal(): number {
    return this.money.calculateTotal(this.items, this.discount, this.freight, this.tax);
  }
}
```

---

#### 5. Move Field
**Quando usar:** Campo é mais usado em outra classe

**Exemplo:**
```typescript
// ANTES: Campo em Order, mas usado em Payment
class Order {
  paymentStatus: string; // "pending", "paid", "failed"
}

class Payment {
  processPayment(order: Order) {
    if (payment.success) {
      order.paymentStatus = "paid";
    } else {
      order.paymentStatus = "failed";
    }
  }
}

// DEPOIS: Mover campo para Payment
class Order {
  // paymentStatus removido
}

class Payment {
  status: string; // "pending", "paid", "failed"
  
  processPayment(order: Order) {
    if (payment.success) {
      this.status = "paid";
    } else {
      this.status = "failed";
    }
  }
}
```

---

### Organização de Dados

#### 6. Replace Primitive with Value Object
**Quando usar:** Tipo primitivo tem comportamento associado

**Exemplo:**
```typescript
// ANTES: Email como string
class User {
  email: string;
  
  isValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
  
  getDomain(): string {
    return this.email.split('@')[1];
  }
}

// DEPOIS: Email como Value Object
class Email {
  constructor(private value: string) {
    if (!this.isValid()) {
      throw new InvalidEmailError(value);
    }
  }
  
  private isValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
  }
  
  getDomain(): string {
    return this.value.split('@')[1];
  }
  
  toString(): string {
    return this.value;
  }
}

class User {
  email: Email;
}
```

---

#### 7. Replace Type Code with Class
**Quando usar:** Tipo primitivo representa categoria com comportamento

**Exemplo:**
```typescript
// ANTES: Tipo como string
class Order {
  status: string; // "pending", "processing", "shipped", "delivered"
  
  canCancel(): boolean {
    return this.status === "pending" || this.status === "processing";
  }
  
  canShip(): boolean {
    return this.status === "processing";
  }
}

// DEPOIS: Status como classe
abstract class OrderStatus {
  abstract canCancel(): boolean;
  abstract canShip(): boolean;
  abstract next(): OrderStatus;
}

class PendingStatus extends OrderStatus {
  canCancel() { return true; }
  canShip() { return false; }
  next() { return new ProcessingStatus(); }
}

class ProcessingStatus extends OrderStatus {
  canCancel() { return true; }
  canShip() { return true; }
  next() { return new ShippedStatus(); }
}

class Order {
  status: OrderStatus;
  
  advanceStatus() {
    this.status = this.status.next();
  }
}
```

---

### Simplificação de Condicionais

#### 8. Replace Conditional with Polymorphism
**Quando usar:** Switch-case ou if-else baseado em tipo

**Exemplo:**
```typescript
// ANTES: Switch-case
class PaymentProcessor {
  process(order: Order, type: string) {
    switch (type) {
      case 'credit':
        return this.processCredit(order);
      case 'debit':
        return this.processDebit(order);
      case 'paypal':
        return this.processPaypal(order);
      case 'pix':
        return this.processPix(order);
      default:
        throw new Error('Unknown payment type');
    }
  }
}

// DEPOIS: Polimorfismo
interface PaymentStrategy {
  process(order: Order): Result;
}

class CreditPayment implements PaymentStrategy {
  process(order: Order): Result { /* ... */ }
}

class DebitPayment implements PaymentStrategy {
  process(order: Order): Result { /* ... */ }
}

class PaypalPayment implements PaymentStrategy {
  process(order: Order): Result { /* ... */ }
}

class PixPayment implements PaymentStrategy {
  process(order: Order): Result { /* ... */ }
}

class PaymentProcessor {
  process(order: Order, strategy: PaymentStrategy): Result {
    return strategy.process(order);
  }
}
```

---

#### 9. Decompose Conditional
**Quando usar:** Condicional complexa (> 3 cláusulas)

**Exemplo:**
```typescript
// ANTES
if ((order.total > 100 && user.isPremium) || 
    (order.total > 50 && user.isGold && !order.hasDiscount) ||
    (order.items.length >= 5 && stock.available)) {
  applyDiscount();
} else {
  applyStandardPrice();
}

// DEPOIS
if (qualifiesForDiscount(order, user, stock)) {
  applyDiscount();
} else {
  applyStandardPrice();
}

function qualifiesForDiscount(order: Order, user: User, stock: Stock): boolean {
  return isPremiumWithLargeOrder(order, user) ||
         isGoldWithMediumOrder(order, user) ||
         isBulkOrderWithStock(order, stock);
}

function isPremiumWithLargeOrder(order: Order, user: User): boolean {
  return order.total > 100 && user.isPremium;
}

function isGoldWithMediumOrder(order: Order, user: User): boolean {
  return order.total > 50 && user.isGold && !order.hasDiscount;
}

function isBulkOrderWithStock(order: Order, stock: Stock): boolean {
  return order.items.length >= 5 && stock.available;
}
```

---

#### 10. Replace Nested Conditional with Guard Clauses
**Quando usar:** Aninhamento profundo (> 3 níveis)

**Exemplo:**
```typescript
// ANTES: Aninhamento profundo
function processOrder(order: Order) {
  if (order.isValid) {
    if (user.isAuthenticated) {
      if (payment.approved) {
        if (stock.available) {
          // processa pedido
          return { success: true };
        } else {
          return { error: 'No stock' };
        }
      } else {
        return { error: 'Payment failed' };
      }
    } else {
      return { error: 'Unauthorized' };
    }
  } else {
    return { error: 'Invalid order' };
  }
}

// DEPOIS: Guard clauses
function processOrder(order: Order) {
  if (!order.isValid) {
    return { error: 'Invalid order' };
  }
  if (!user.isAuthenticated) {
    return { error: 'Unauthorized' };
  }
  if (!payment.approved) {
    return { error: 'Payment failed' };
  }
  if (!stock.available) {
    return { error: 'No stock' };
  }
  
  // processa pedido (sem aninhamento)
  return { success: true };
}
```

---

### Generalização

#### 11. Pull Up Method
**Quando usar:** Método duplicado em subclasses

**Exemplo:**
```typescript
// ANTES: Duplicação
class Cat extends Animal {
  breathe(): void {
    console.log('Breathing...');
    // lógica de respiração
  }
}

class Dog extends Animal {
  breathe(): void {
    console.log('Breathing...');
    // mesma lógica de respiração
  }
}

// DEPOIS: Mover para superclasse
class Animal {
  breathe(): void {
    console.log('Breathing...');
    // lógica de respiração
  }
}

class Cat extends Animal {
  // breathe removido, herda de Animal
}

class Dog extends Animal {
  // breathe removido, herda de Animal
}
```

---

#### 12. Replace Inheritance with Delegation
**Quando usar:** Subclasse usa apenas parte da superclasse

**Exemplo:**
```typescript
// ANTES: Herança inadequada
class List {
  add(item: any) { /* ... */ }
  remove(item: any) { /* ... */ }
  // 20 outros métodos de lista
}

class Stack extends List {
  // usa apenas add e remove
  // outros 18 métodos não fazem sentido para Stack
}

// DEPOIS: Delegação
class Stack {
  private list: List = new List();
  
  push(item: any) {
    this.list.add(item);
  }
  
  pop(): any {
    return this.list.remove(this.list.length - 1);
  }
  
  // expõe apenas métodos relevantes para Stack
}
```

---

## 📊 Output Estruturado (JSON)

```json
{
  "skill": "refactoring-advisor",
  "projeto": "POLYMARKETING",
  "data": "2026-07-02T20:00:00Z",
  "agente": "tech-lead",
  
  "smells_analisados": [
    {
      "smell": "Long Method",
      "local": "OrderManager.processOrder()",
      "linhas": 120,
      "tecnicas_recomendadas": [
        {
          "nome": "Extract Method",
          "prioridade": 1,
          "exemplo_codigo": "...",
          "esforco": "2h",
          "risco": "baixo"
        }
      ]
    },
    {
      "smell": "Large Class",
      "local": "OrderManager.cs",
      "linhas": 850,
      "tecnicas_recomendadas": [
        {
          "nome": "Extract Class",
          "prioridade": 1,
          "exemplo_codigo": "...",
          "esforco": "8h",
          "risco": "médio"
        }
      ]
    }
  ],
  
  "tempo_total": "1h",
  "complexidade": "média"
}
```

---

## 🔗 Integrações

### Acionado Por
- `code-smell-detector` (após identificar smells)
- `complexity-analyzer` (após analisar complexidade)
- `backend-dev` / `frontend-dev` (ao solicitar ajuda para refatorar)

### Aciona
- `function-simplifier` (para aplicar simplificações)
- `naming-improver` (para melhorar nomes após extração)

### Registra Em
- `.ai-factory/logs/refactoring/REFACT-YYYY-MM-DD.json`
- `.ai-factory/MELHORIAS/21-LIMPEZA/TAREFAS.md`

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem)  
**Tempo Médio:** 1-2h por análise  
**Taxa de Sucesso:** >95% (com exemplos claros)