---
name: naming-improver
category: general
complexity: high
agents: []
created: 2026-07-11
---

# Skill: Naming Improver

> Melhoria sistemática de nomenclatura de variáveis, funções, classes e módulos para aumentar legibilidade e expressividade do código

---

## 🎯 Objetivo

Identificar nomes pouco expressivos no código (abreviações, nomes genéricos, inconsistências) e sugerir nomes mais descritivos que comuniquem a intenção do código sem necessidade de comentários.

---

## 🔁 Gatilhos de Acionamento

- Code review de novo código
- Refatoração de módulo existente
- Solicitação de "melhore os nomes neste código"
- Onboarding de novo dev no projeto
- Implementação de padrão de nomenclatura do time

---

## 📋 Processo de 4 Passos

### PASSO 1: IDENTIFICAR NOMES PROBLEMÁTICOS

**Objetivo:** Encontrar nomes que não comunicam intenção claramente

**Ações:**
1. **Abreviações obscuras:** `usr`, `calc`, `tmp`, `val`, `arr`, `obj`, `str`
2. **Nomes genéricos:** `data`, `info`, `manager`, `helper`, `util`, `thing`, `stuff`
3. **Nomes enganosos:** `getUser()` que salva no banco, `isValid()` que modifica estado
4. **Inconsistências:** `fetchUser` vs `getUser`, `createOrder` vs `makeOrder`
5. **Nomes muito curtos:** `x`, `i`, `j`, `k` (exceto loops simples)
6. **Nomes muito longos:** `getUserByEmailAndSortByNameAndFilterByStatusAndReturnDTO`
7. **Prefixos/Sufixos desnecessários:** `IUserInterface`, `AbstractBaseClass`, `UserServiceImpl`
8. **Tipos em nomes:** `userArray`, `emailString`, `idNumber`

**Output:**
```markdown
## Nomes Problemáticos Identificados

### Categoria: Abreviações Obscuras

| Arquivo | Linha | Atual | Sugestão | Razão |
|---------|-------|-------|----------|-------|
| order.ts | 15 | `calcTotal(usr)` | `calculateTotal(user)` | Evitar abreviações |
| payment.ts | 32 | `procPmt(pmtData)` | `processPayment(paymentData)` | Ilegível |
| utils.ts | 8 | `fmtDate(d)` | `formatDate(date)` | Nome muito curto |

### Categoria: Nomes Genéricos

| Arquivo | Linha | Atual | Sugestão | Razão |
|---------|-------|-------|----------|-------|
| manager.ts | 1 | `class DataManager` | `class OrderProcessor` | DataManager é genérico |
| helpers.ts | 5 | `function process(data)` | `function processRefund(refundData)` | Genérico demais |
| utils.ts | 12 | `function get(id)` | `function getUserById(id)` | O quê? De onde? |

### Categoria: Nomes Enganosos

| Arquivo | Linha | Atual | Problema | Sugestão |
|---------|-------|-------|----------|----------|
| user.ts | 23 | `getUser(id)` | Salva log de acesso | `getUserWithLog(id)` |
| validator.ts | 45 | `isValid(order)` | Modifica order se inválido | `validateAndFix(order)` |
| cache.ts | 8 | `getCache(key)` | Faz requisição HTTP se miss | `getOrFetch(key)` |

### Categoria: Inconsistências

| Padrão 1 | Padrão 2 | Padrão Correto |
|----------|----------|----------------|
| `fetchUser` | `getOrder` | `getUser` / `getOrder` (unificar) |
| `UserRepo` | `OrderRepository` | `UserRepository` / `OrderRepository` |
| `createUser` | `makeOrder` | `createUser` / `createOrder` |
| `toDto` | `asDTO` | `toDto` (unificar) |
```

---

### PASSO 2: APLICAR REGRAS DE NOMENCLATURA

**Objetivo:** Sugerir nomes que seguem boas práticas estabelecidas

**Ações:**
1. **Regra da Intenção:** Nome deve responder "o que isto faz?" sem ler o código
2. **Regra do Escopo:** Mais curto para escopo menor, mais longo para escopo maior
3. **Regra do Verbosidade:** Verbo + Substantivo para funções, Substantivo para classes
4. **Regra da Consistência:** Mesmo padrão para mesmas operações em todo o projeto
5. **Regra do Domínio:** Usar linguagem do domínio (ubiquitous language)

**Output:**
```markdown
## Sugestões de Melhoria por Regra

### Regra da Intenção

```typescript
// ❌ Antes
function calc(a, b) {
  // 30 linhas de cálculo de frete
}

// ✅ Depois
function calculateShipping(subtotal: number, weight: number): number {
  // 30 linhas
}
```

### Regra do Escopo

```typescript
// Loop curto: OK usar i (escopo de 3 linhas)
for (let i = 0; i < items.length; i++) { ... }

// Loop longo: usar nome descritivo
for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
  // 30 linhas de lógica
}
```

### Regra do Verbosidade - Prefixos Padrão

| Prefixo | Significado | Exemplo |
|---------|-------------|---------|
| `get` | Retorna dado (sem side effect) | `getUser(id)` |
| `set` | Altera valor | `setName(name)` |
| `is` | Retorna boolean | `isValid()` |
| `has` | Retorna boolean (posse) | `hasPermission()` |
| `create` | Cria novo recurso | `createOrder()` |
| `update` | Atualiza recurso existente | `updateUser()` |
| `delete` | Remove recurso | `deleteOrder()` |
| `fetch` | Busca remota (API/DB) | `fetchUser(id)` |

### Regra da Consistência

```typescript
// ❌ Inconsistente
const userRepo = new UserRepo();
const orderRepository = new OrderRepository();

// ✅ Consistente
const userRepository = new UserRepository();
const orderRepository = new OrderRepository();
```

### Regra do Domínio

```typescript
// ❌ Nome técnico genérico
function processItems(items) { /* valida estoque */ }

// ✅ Nome do domínio
function validateStockAvailability(orderItems: OrderItem[]): StockResult {
  // valida estoque
}
```
```

---

### PASSO 3: GERAR PADRÃO DE NOMENCLATURA DO PROJETO

**Objetivo:** Criar/atualizar guia de nomenclatura consistente

**Ações:**
1. Compilar regras de nomenclatura do projeto
2. Detectar padrões existentes e recomendar unificação
3. Gerar arquivo `.ai-factory/STANDARDS/NAMING.md`
4. Incluir exemplos de nomes bons e ruins

**Output:**
```markdown
## Padrão de Nomenclatura do Projeto

### Arquivos

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Classes/Entities | PascalCase | `OrderEntity`, `UserService` |
| Funções/Métodos | camelCase | `getUserById()`, `createOrder()` |
| Variáveis | camelCase | `userName`, `orderTotal` |
| Constantes globais | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_VERSION` |
| Tipos/Interfaces | PascalCase | `UserDTO`, `CreateOrderRequest` |
| Enums | PascalCase (membros UPPER) | `enum Status { PENDING, APPROVED }` |
| Arquivos | kebab-case | `order-service.ts`, `user-repository.ts` |

### Glossário do Domínio

| Termo | Significado | Usar | Evitar |
|-------|-------------|------|--------|
| Cliente | Quem compra | `customer` | `user`, `client` |
| Pedido | Compra realizada | `order` | `purchase`, `transaction` |
| Item | Produto no pedido | `item` | `product`, `sku` |
| Pagamento | Transação financeira | `payment` | `charge`, `billing` |
| Frete | Entrega | `shipping` | `delivery`, `freight` |

### Anti-Padrões (NÃO Usar)

| ❌ Errado | ✅ Correto | Justificativa |
|-----------|-----------|---------------|
| `UserManager` | `UserService` | Manager é genérico demais |
| `IUserRepository` | `UserRepository` | Prefixo I é C#-style, não TypeScript |
| `UserRepositoryImpl` | `PostgresUserRepository` | Nome da implementação concreta |
| `data` como variável | `orderData`, `userData` | data não diz nada |
```

---

### PASSO 4: APLICAR CORREÇÕES NO CÓDIGO

**Objetivo:** Renomear identificadores seguindo as regras definidas

**Ações:**
1. Para cada nome problemático, gerar diff de renomeação
2. Usar rename refactoring da IDE (não search/replace simples)
3. Atualizar todos os arquivos que referenciam o nome
4. Verificar se build e testes continuam passando

**Output:**
```markdown
## Correções Aplicadas

### Renomeação: DataManager → OrderProcessor

```diff
- class DataManager {
+ class OrderProcessor {
    // mesma implementação
  }
```

**Arquivos afetados:** 12
- `src/services/order-manager.ts` (definição)
- `src/controllers/order.controller.ts` (import)
- `src/use-cases/create-order.ts` (import)
- ... mais 9 arquivos

### Renomeação: calcTotal → calculateTotal

```diff
- function calcTotal(usr: User, ord: Order): number {
+ function calculateTotal(user: User, order: Order): number {
```

**Arquivos afetados:** 8

### Renomeação: get → getUserById

```diff
- const user = await userRepo.get(id);
+ const user = await userRepository.getUserById(id);
```

**Arquivos afetados:** 15

### Verificação

- [x] Build passa (tsc --noEmit)
- [x] Testes unitários passam (npm test)
- [x] Testes de integração passam
- [x] Linter não acusa erros
- [x] Nenhum teste quebrado por renomeação
```

---

## 💻 Exemplo de Prompt

```
Analise os nomes no código abaixo e sugira melhorias seguindo
Clean Code naming rules. Para cada sugestão, mostre: nome atual,
nome sugerido, regra violada e diff da correção.

function calc(a, b, c) {
  let tmp = a * b;
  let data = tmp > 100 ? tmp * c : tmp;
  return { val: data, info: 'calculated' };
}
```

---

## ✅ Métricas de Sucesso

| Métrica | Alvo | Como Medir |
|---------|------|------------|
| Nomes problemáticos detectados | ≥ 10 por módulo | Scanner automático |
| Correções aplicadas | > 80% dos detectados | Tracking de implementação |
| Build pós-rename | 100% verde | CI pipeline |
| Inconsistências resolvidas | Zero | Varredura final |
| Padrão de nomenclatura | 100% seguido | Linter configurado |
| Legibilidade (percepção) | +30% | Survey com time |

---

## 🔗 Integrações

### Acionado Por
- `refactoring-advisor` (durante refatoração)
- `code-smell-detector` (nomes genéricos são smell)
- `tech-lead` (code review)
- `backend-dev` / `frontend-dev` (durante desenvolvimento)

### Aciona
- `dead-code-eliminator` (renomeação pode revelar código morto)
- `complexity-analyzer` (reavaliar após renomeação)
- `code-smell-detector` (verificar novo código)

### Registra Em
- `.ai-factory/STANDARDS/NAMING.md`
- `.ai-factory/logs/refactoring/RENAME-YYYY-MM-DD.json`

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem)  
**Tempo Médio:** 1-3h por módulo  
**Taxa de Sucesso:** >95% (renomeações seguras com IDE refactoring)
