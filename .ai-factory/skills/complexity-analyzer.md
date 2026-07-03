# Skill: Complexity Analyzer

> Análise de complexidade ciclomática e cognitiva de código para identificar pontos de dificuldade de manutenção

---

## 🎯 Objetivo

Calcular e analisar métricas de complexidade de código (ciclomática, cognitiva, Halstead) para identificar funções e métodos que são difíceis de entender, testar e manter, recomendando simplificações específicas.

---

## 🔁 Gatilhos de Acionamento

- Code review de código complexo
- Antes de refatoração de funções grandes
- Dificuldade de escrever testes (muitos cenários)
- Bug recorrente em função específica
- Solicitação de "avalie a complexidade deste código"

---

## 📋 Processo de 4 Passos

### PASSO 1: CALCULAR MÉTRICAS DE COMPLEXIDADE

**Objetivo:** Medir complexidade objetivamente

**Ações:**
1. **Complexidade Ciclomática (McCabe):**
   - Conta caminhos independentes no código
   - Fórmula: M = E - N + 2P (arestas - nós + componentes)
   - Prática: +1 para cada if, while, for, case, catch, &&, ||

2. **Complexidade Cognitiva:**
   - Mede dificuldade de entender o código
   - Conta: aninhamentos, boolean operators, exceções, recursão
   - Pondera por profundidade de aninhamento

3. **Métricas Halstead:**
   - Volume: tamanho do código em termos de operadores/operandos
   - Dificuldade: esforço para implementar/manter
   - Esforço: tempo estimado para entender/modificar

**Limites de Referência:**
```
Complexidade Ciclomática:
1-5   ✅ Simples (fácil de testar)
6-10  ⚠️ Moderada (testável)
11-20 ❌ Complexa (difícil de testar)
21+   🔴 Muito complexa (quase impossível de testar)

Complexidade Cognitiva:
0-15  ✅ Baixa (fácil entendimento)
16-25 ⚠️ Média (entendimento moderado)
26-50 ❌ Alta (difícil entendimento)
51+   🔴 Muito alta (quase impossível de entender)
```

**Output:**
```markdown
## Métricas de Complexidade

### Complexidade Ciclomática por Função

| Função | Localização | Complexidade | Status |
|--------|-------------|--------------|--------|
| `processOrder()` | OrderManager.cs:45 | 25 | 🔴 |
| `calculateTotal()` | PaymentProcessor.cs:78 | 18 | ❌ |
| `validateUser()` | UserService.cs:120 | 15 | ⚠️ |
| `sendEmail()` | EmailService.cs:45 | 8 | ⚠️ |
| `getUserById()` | UserRepository.cs:23 | 3 | ✅ |

**Média do Projeto:** 12.3 ❌ (ideal: < 5)

**Distribuição:**
- 1-5 (Simples): 35% ✅
- 6-10 (Moderada): 30% ⚠️
- 11-20 (Complexa): 20% ❌
- 21+ (Muito Complexa): 15% 🔴

---

### Complexidade Cognitiva por Função

| Função | Localização | Cognitiva | Aninhamento Max | Status |
|--------|-------------|-----------|-----------------|--------|
| `processOrder()` | OrderManager.cs:45 | 67 | 7 | 🔴 |
| `calculateTotal()` | PaymentProcessor.cs:78 | 45 | 5 | ❌ |
| `validateUser()` | UserService.cs:120 | 32 | 4 | ❌ |
| `sendEmail()` | EmailService.cs:45 | 18 | 3 | ⚠️ |
| `getUserById()` | UserRepository.cs:23 | 5 | 1 | ✅ |

**Média do Projeto:** 28.4 ❌ (ideal: < 15)

---

### Métricas Halstead

**Função:** `processOrder()`

- **Operadores únicos (n1):** 18
- **Operandos únicos (n2):** 25
- **Ocorrências de operadores (N1):** 85
- **Ocorrências de operandos (N2):** 120

**Calculados:**
- **Volume (V):** 892 bits (tamanho da informação)
- **Dificuldade (D):** 15.6 (esforço para modificar)
- **Esforço (E):** 13,915 (tempo estimado em segundos = ~4h para entender)

**Interpretação:**
- Volume > 500: Código muito grande
- Dificuldade > 10: Muito difícil de modificar
- Esforço > 10,000: Leva horas para entender completamente
```

---

### PASSO 2: IDENTIFICAR FONTES DE COMPLEXIDADE

**Objetivo:** Entender O QUE torna o código complexo

**Ações:**
1. Para cada função complexa, decompor fontes:
   - **Condicionais:** Muitos ifs/switches
   - **Loops:** Múltiplos loops aninhados
   - **Exceções:** Muitos try-catch
   - **Booleanos:** Expressões booleanas complexas
   - **Retornos:** Múltiplos pontos de retorno
   - **Parâmetros:** Muitos parâmetros
   - **Variáveis:** Muitas variáveis locais

**Output:**
```markdown
## Análise de Fontes de Complexidade

### Função: processOrder() - Complexidade 25

**Decomposição:**
```
Complexidade Total: 25
├── Condicionais (if/else):     +12  (48%)
│   ├── if (order.isValid)      +1
│   ├── if (user.isAuthenticated) +1
│   ├── if (payment.approved)   +1
│   ├── if (stock.available)    +1
│   ├── if (freight.calculated) +1
│   └── ... mais 7 ifs
│
├── Loops (for/while):          +6   (24%)
│   ├── for (item in items)     +1
│   ├── while (retryCount < 3)  +1
│   └── ... mais 4 loops
│
├── Booleanos (&&, ||):         +4   (16%)
│   ├── if (a && b || c)        +2
│   └── if (x && y && z)        +2
│
├── Exceções (try/catch):       +2   (8%)
│   └── try-catch aninhados     +2
│
└── Switch-case:                +1   (4%)
    └── switch (paymentType)    +1
```

**Problemas Específicos:**

1. **Aninhamento Profundo (7 níveis):**
```typescript
if (order.isValid) {                    // Nível 1
  if (user.isAuthenticated) {           // Nível 2
    if (payment.approved) {             // Nível 3
      if (stock.available) {            // Nível 4
        for (item in items) {           // Nível 5
          if (item.hasDiscount) {       // Nível 6
            try {                       // Nível 7
              // código aqui
            } catch (e) { }
          }
        }
      }
    }
  }
}
```

2. **Expressão Booleana Complexa:**
```typescript
if ((order.total > 100 && user.isPremium) || 
    (order.total > 50 && user.isGold && !order.hasDiscount) ||
    (order.items.length >= 5 && stock.available)) {
  // 8 operadores booleanos em uma linha
}
```

3. **Múltiplos Pontos de Retorno:**
```typescript
if (!order.isValid) return { error: 'Invalid' };
if (!user.isAuthenticated) return { error: 'Unauthorized' };
if (!payment.approved) return { error: 'Payment failed' };
if (!stock.available) return { error: 'No stock' };
// ... mais 5 retornos
return { success: true, order: saved };
```
```

---

### PASSO 3: RECOMENDAR TÉCNICAS DE SIMPLIFICAÇÃO

**Objetivo:** Propor técnicas específicas para reduzir complexidade

**Ações:**
1. Para cada fonte de complexidade, recomendar técnica:
   - **Condicionais →** Guard Clauses, Strategy Pattern, Table-Driven Methods
   - **Loops →** Stream/LINQ, Extract Method, Map/Filter/Reduce
   - **Booleanos →** Extract Method, Replace with Polymorphism
   - **Exceções →** Try-Catch em nível superior, Result Pattern
   - **Retornos →** Single Exit Point ou Guard Clauses consistentes
   - **Parâmetros →** Parameter Object, Builder Pattern
   - **Variáveis →** Extract Variable, Reduce escopo

**Output:**
```markdown
## Técnicas de Simplificação Recomendadas

### Para Condicionais (12 ifs)

#### Técnica 1: Guard Clauses
**Antes:**
```typescript
if (order.isValid) {
  if (user.isAuthenticated) {
    if (payment.approved) {
      // processa
    }
  }
}
```

**Depois:**
```typescript
if (!order.isValid) {
  return { error: 'Invalid order' };
}
if (!user.isAuthenticated) {
  return { error: 'Unauthorized' };
}
if (!payment.approved) {
  return { error: 'Payment failed' };
}
// processa (sem aninhamento)
```

**Redução:** De 7 níveis para 0 níveis de aninhamento
**Complexidade:** De 25 para 15

---

#### Técnica 2: Strategy Pattern
**Antes:**
```typescript
switch (paymentType) {
  case 'credit':
    // 20 linhas de lógica
    break;
  case 'debit':
    // 20 linhas de lógica
    break;
  case 'paypal':
    // 20 linhas de lógica
    break;
}
```

**Depois:**
```typescript
interface PaymentStrategy {
  process(order: Order): Result;
}

class CreditPayment implements PaymentStrategy {
  process(order: Order): Result {
    // 20 linhas de lógica
  }
}

// Uso
const strategy = PaymentStrategyFactory.create(paymentType);
return strategy.process(order);
```

**Redução:** Complexidade de 8 para 2 na função principal

---

### Para Expressões Booleanas Complexas

#### Técnica: Extract Method com Nomes Semânticos
**Antes:**
```typescript
if ((order.total > 100 && user.isPremium) || 
    (order.total > 50 && user.isGold && !order.hasDiscount) ||
    (order.items.length >= 5 && stock.available)) {
  applyDiscount();
}
```

**Depois:**
```typescript
if (qualifiesForDiscount(order, user)) {
  applyDiscount();
}

function qualifiesForDiscount(order: Order, user: User): boolean {
  return isPremiumWithLargeOrder(order, user) ||
         isGoldWithMediumOrder(order, user) ||
         isBulkOrderWithStock(order);
}
```

**Benefício:** Código auto-explicativo, complexidade movida para função com nome claro

---

### Para Loops Aninhados

#### Técnica: Stream/LINQ
**Antes:**
```typescript
for (const order of orders) {
  for (const item of order.items) {
    if (item.hasDiscount) {
      for (const discount of item.discounts) {
        if (discount.isValid) {
          total += discount.value;
        }
      }
    }
  }
}
```

**Depois:**
```typescript
const total = orders
  .flatMap(order => order.items)
  .filter(item => item.hasDiscount)
  .flatMap(item => item.discounts)
  .filter(discount => discount.isValid)
  .reduce((sum, discount) => sum + discount.value, 0);
```

**Benefício:** Mais declarativo, menos propenso a erros de loop

---

### Para Múltiplos Parâmetros (9 parâmetros)

#### Técnica: Parameter Object
**Antes:**
```typescript
function createOrder(userId, email, items, freight, payment, 
                     discount, tax, notes, priority) {
  // usa 9 parâmetros
}
```

**Depois:**
```typescript
interface CreateOrderRequest {
  userId: number;
  email: string;
  items: OrderItem[];
  freight: Freight;
  payment: PaymentInfo;
  discount?: Discount;
  tax: number;
  notes?: string;
  priority: Priority;
}

function createOrder(request: CreateOrderRequest) {
  // usa request.userId, request.email, etc.
}
```

**Benefício:** 1 parâmetro ao invés de 9, tipagem clara
```

---

### PASSO 4: VALIDAR REDUÇÃO DE COMPLEXIDADE

**Objetivo:** Medir melhoria após refatoração

**Ações:**
1. Recalcular métricas após refatoração
2. Comparar antes/depois
3. Verificar se complexidade está dentro dos limites
4. Validar que testes ainda passam

**Output:**
```markdown
## Validação de Redução de Complexidade

### Função: processOrder()

| Métrica | Antes | Depois | Redução | Status |
|---------|-------|--------|---------|--------|
| Complexidade Ciclomática | 25 | 8 | -68% | ✅ |
| Complexidade Cognitiva | 67 | 18 | -73% | ✅ |
| Linhas de Código | 120 | 45 | -62% | ✅ |
| Aninhamento Máximo | 7 | 1 | -86% | ✅ |
| Parâmetros | 9 | 1 | -89% | ✅ |

### Decomposição Após Refatoração

**Função Principal (processOrder):**
- Complexidade: 8 (de 25)
- Responsabilidade: Orquestrar fluxo
- Delega para: `OrderValidator`, `PaymentProcessor`, `StockChecker`, `OrderNotifier`

**Funções Extraídas:**
- `validateOrder()`: Complexidade 5
- `calculateTotal()`: Complexidade 6
- `checkStock()`: Complexidade 4
- `notifyCustomer()`: Complexidade 3

**Média do Projeto Após Refatoração:**
- Complexidade Ciclomática: 6.2 (de 12.3) ✅
- Complexidade Cognitiva: 14.1 (de 28.4) ✅

### Testabilidade

**Antes:**
- Testes unitários: 0 (muito complexo para testar)
- Cobertura: 0%

**Depois:**
- Testes unitários: 23 (um por função extraída)
- Cobertura: 92%

### Tempo de Entendimento (Halstead)

**Antes:** 13,915 unidades de esforço (~4 horas)
**Depois:** 2,450 unidades de esforço (~40 minutos)
**Melhoria:** 82% mais rápido de entender

---

## Critérios de Aceite

- [ ] Complexidade ciclomática < 10 para todas as funções
- [ ] Complexidade cognitiva < 25 para todas as funções
- [ ] Aninhamento máximo < 4 níveis
- [ ] Parâmetros < 5 por função
- [ ] Cobertura de testes > 80%
- [ ] Todos os testes passando
```

---

## 📊 Output Estruturado (JSON)

```json
{
  "skill": "complexity-analyzer",
  "projeto": "POLYMARKETING",
  "data": "2026-07-02T19:00:00Z",
  "agente": "tech-lead",
  
  "metricas_gerais": {
    "complexidade_ciclomatica_media": 12.3,
    "complexidade_cognitiva_media": 28.4,
    "aninhamento_medio": 3.8,
    "parametros_medios": 5.2
  },
  
  "funcoes_criticas": [
    {
      "nome": "processOrder",
      "localizacao": "OrderManager.cs:45",
      "complexidade_ciclomatica": 25,
      "complexidade_cognitiva": 67,
      "linhas": 120,
      "aninhamento_max": 7,
      "parametros": 9,
      "fontes_complexidade": {
        "condicionais": 12,
        "loops": 6,
        "booleanos": 4,
        "excecoes": 2,
        "switches": 1
      },
      "tempo_entendimento": "4h"
    }
  ],
  
  "refatoracoes_recomendadas": [
    {
      "tecnica": "Guard Clauses",
      "alvo": "processOrder",
      "reducao_esperada": "68%",
      "esforco": "2h"
    },
    {
      "tecnica": "Strategy Pattern",
      "alvo": "payment switch",
      "reducao_esperada": "75%",
      "esforco": "4h"
    }
  ],
  
  "validacao_pos_refatoracao": {
    "complexidade_antes": 25,
    "complexidade_depois": 8,
    "reducao": "68%",
    "cobertura_testes_antes": "0%",
    "cobertura_testes_depois": "92%",
    "tempo_entendimento_antes": "4h",
    "tempo_entendimento_depois": "40min"
  },
  
  "tempo_total": "1h 30min",
  "complexidade": "média"
}
```

---

## 🔗 Integrações

### Acionado Por
- `tech-lead` (em code reviews)
- `backend-dev` / `frontend-dev` (ao escrever código complexo)
- `qa-tester` (quando é difícil escrever testes)
- `refactoring-advisor` (para identificar alvos de refatoração)

### Aciona
- `refactoring-advisor` (para recomendar técnicas específicas)
- `function-simplifier` (para aplicar simplificações)
- `code-smell-detector` (complexidade é um code smell)

### Registra Em
- `.ai-factory/logs/complexity-analysis/COMPLEX-YYYY-MM-DD.json`
- `.ai-factory/MELHORIAS/21-LIMPEZA/TAREFAS.md`
- `.ai-factory/MELHORIAS/LOG-VALIDACOES.md`

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem)  
**Tempo Médio:** 1-2h por análise  
**Taxa de Sucesso:** >90% (com refatoração aplicada)