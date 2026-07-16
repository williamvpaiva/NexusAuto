---
name: pattern-matcher
category: architecture
complexity: high
agents: []
created: 2026-07-11
---

# Skill: Pattern Matcher

> Identificação sistemática de padrões de projeto (GoF) e anti-patterns no código para guiar refatorações

---

## 🎯 Objetivo

Analisar o código para identificar padrões de projeto existentes (Singleton, Factory, Strategy, Observer, etc.) e anti-patterns (God Class, Spaghetti Code, etc.), documentando a arquitetura real do sistema e recomendando padrões adequados para problemas recorrentes.

---

## 🔁 Gatilhos de Acionamento

- Análise de arquitetura de projeto existente
- Antes de refatoração significativa
- Code review de novo módulo
- Solicitação de "identifique padrões neste código"
- Suspeita de anti-patterns

---

## 📋 Processo de 4 Passos

### PASSO 1: IDENTIFICAR PADRÕES DE PROJETO EXISTENTES

**Objetivo:** Mapear quais padrões GoF estão presentes no código

**Ações:**
1. **Padrões Criacionais:**
   - Singleton: classe com instância estática, construtor privado
   - Factory Method: método que retorna interface/subtipo
   - Abstract Factory: família de factories relacionadas
   - Builder: construção passo a passo com fluent interface
   - Prototype: clone/copy de objetos

2. **Padrões Estruturais:**
   - Adapter: wrapper que traduz interface
   - Decorator: wrapper que adiciona comportamento
   - Facade: interface simplificada para subsistema
   - Proxy: substituto que controla acesso
   - Composite: árvore de objetos com interface comum

3. **Padrões Comportamentais:**
   - Strategy: família de algoritmos intercambiáveis
   - Observer: publish/subscribe de eventos
   - Command: encapsula requisição como objeto
   - Template Method: esqueleto com hooks
   - State: comportamento varia com estado

**Output:**
```markdown
## Padrões Identificados

| Padrão | Localização | Confiança | Uso Correto? |
|--------|-------------|-----------|--------------|
| Singleton | DatabaseConnection.ts:5 | 95% | ✅ Sim, conexão única |
| Factory | PaymentProcessorFactory.ts:12 | 90% | ⚠️ Switch oculto |
| Strategy | ShippingCalculator.ts:45 | 85% | ✅ Bem aplicado |
| Observer | EventBus.ts:30 | 90% | ✅ Correto |
| Adapter | LegacyPaymentAdapter.ts:8 | 80% | ⚠️ Muito código boil |
| God Class ❌ | OrderManager.ts | - | 🔴 Anti-pattern |

### Detalhes dos Padrões

#### Singleton - DatabaseConnection
```typescript
class DatabaseConnection {
  private static instance: DatabaseConnection;
  static getInstance(): DatabaseConnection {
    if (!this.instance) this.instance = new DatabaseConnection();
    return this.instance;
  }
}
```
**Veredito:** ✅ Uso legítimo de Singleton para recurso compartilhado
```

---

### PASSO 2: DETECTAR ANTI-PATTERNS

**Objetivo:** Identificar padrões prejudiciais no código

**Ações:**
1. **God Class:** Classe com > 500 linhas ou > 10 métodos públicos
2. **Spaghetti Code:** Métodos longos, condicionais aninhados, sem estrutura clara
3. **Golden Hammer:** Solução única para todos os problemas
4. **Lava Flow:** Código morto, comentários antigos, imports não usados
5. **Copy & Paste:** Blocos de código duplicados (DRM violation)
6. **Shotgun Surgery:** Mudança em um lugar requer mudanças em muitos arquivos

**Output:**
```markdown
## Anti-Patterns Detectados

### Anti-Pattern 1: God Class 🚫
**OrderManager.ts** (850 linhas, 15 métodos públicos)
- Responsabilidades: pedidos, pagamento, frete, estoque, notificação
- Impacto: Alto (qualquer mudança afeta múltiplos fluxos)
- Recomendação: Extrair OrderPayment, OrderShipping, OrderNotification

### Anti-Pattern 2: Spaghetti Code 🚫
**processOrder()** (OrderManager.ts:45, 120 linhas)
- Aninhamento máximo: 7 níveis
- Mix de lógica de negócio com infraestrutura
- Recomendação: Extrair métodos por responsabilidade

### Anti-Pattern 3: Copy & Paste 🚫
**Bloco duplicado** encontrado em 3 arquivos:
- `validateUser()` em UserService.ts:23, AdminService.ts:45, AuthService.ts:67
- 15 linhas idênticas
- Recomendação: Extrair para UserValidator compartilhado
```

---

### PASSO 3: RECOMENDAR PADRÕES ADEQUADOS

**Objetivo:** Sugerir padrões que resolvam problemas identificados

**Ações:**
1. Para cada anti-pattern, sugerir padrão de correção
2. Para cada problema recorrente, sugerir padrão preventivo
3. Priorizar por impacto e facilidade de implementação

**Output:**
```markdown
## Recomendações de Padrões

### Prioridade Alta

| Problema | Padrão Recomendado | Benefício | Esforço |
|----------|-------------------|-----------|---------|
| Switch de pagamento | Strategy + Factory | Elimina switch, Open/Closed | 4h |
| God Class OrderManager | Facade por domínio | Separa responsabilidades | 8h |
| Muitos ifs aninhados | Guard Clauses + Strategy | Reduz complexidade | 2h |

### Prioridade Média

| Problema | Padrão Recomendado | Benefício | Esforço |
|----------|-------------------|-----------|---------|
| Notificações acopladas | Observer pattern | Desacopla remetentes | 4h |
| Código duplicado | Template Method | Reúso de esqueleto | 3h |
| Validações espalhadas | Chain of Responsibility | Pipeline de validação | 3h |

### Exemplo: Implementar Strategy para Pagamento

```typescript
// Antes: switch gigante
function processPayment(order, method) {
  switch (method) {
    case 'credit': return processCredit(order);
    case 'debit': return processDebit(order);
    case 'pix': return processPix(order);
    case 'boleto': return processBoleto(order);
  }
}

// Depois: Strategy Pattern
interface PaymentStrategy {
  process(order: Order): PaymentResult;
}

class CreditStrategy implements PaymentStrategy {
  process(order: Order): PaymentResult { /* ... */ }
}

class DebitStrategy implements PaymentStrategy {
  process(order: Order): PaymentResult { /* ... */ }
}

class PaymentProcessor {
  constructor(private strategy: PaymentStrategy) {}
  process(order: Order): PaymentResult {
    return this.strategy.process(order);
  }
}
```
```

---

### PASSO 4: GERAR DIAGRAMA DE PADRÕES

**Objetivo:** Visualizar a arquitetura real do sistema

**Ações:**
1. Gerar diagrama de classes com padrões identificados
2. Marcar onde padrões são bem aplicados vs violados
3. Mostrar dependências entre componentes
4. Destacar áreas críticas para refatoração

**Output:**
```markdown
## Diagrama de Padrões

```mermaid
classDiagram
    class DatabaseConnection {
        -instance: DatabaseConnection
        +getInstance() DatabaseConnection
    }
    <<Singleton>> DatabaseConnection
    
    class PaymentStrategy {
        <<interface>>
        +process(order) PaymentResult
    }
    class CreditStrategy {
        +process(order) PaymentResult
    }
    class DebitStrategy {
        +process(order) PaymentResult
    }
    class PixStrategy {
        +process(order) PaymentResult
    }
    PaymentStrategy <|.. CreditStrategy
    PaymentStrategy <|.. DebitStrategy
    PaymentStrategy <|.. PixStrategy
    <<Strategy>> PaymentStrategy
    
    class EventBus {
        +subscribe(event, handler)
        +publish(event, data)
    }
    class EmailNotifier {
        +onOrderCreated(data)
    }
    EventBus --> EmailNotifier
    <<Observer>> EventBus
    
    class OrderManager {
        +createOrder()
        +processPayment()
        +calculateShipping()
        +sendNotification()
    }
    <<God Class>> OrderManager
    
    note for OrderManager "Anti-pattern: 4 responsabilidades\nExtrair para Facades"
```

### Legenda
- ✅ Verde: Padrão bem aplicado
- ⚠️ Amarelo: Padrão com desvios
- 🔴 Vermelho: Anti-pattern detectado
```

---

## 💻 Exemplo de Prompt

```
Analise o diretório src/ do projeto e identifique:
1. Quais padrões de projeto GoF estão presentes (com localização)
2. Anti-patterns existentes
3. Recomendações de padrões para problemas encontrados
4. Diagrama da arquitetura real

Foco especial em OrderManager e PaymentProcessor.
```

---

## ✅ Métricas de Sucesso

| Métrica | Alvo | Como Medir |
|---------|------|------------|
| Padrões identificados | ≥ 5 por módulo | Contagem no relatório |
| Anti-patterns detectados | Zero falso-positivos | Validação manual |
| Precisão na detecção | >80% | Amostragem por tech-lead |
| Recomendações aplicadas | >60% | Acompanhamento pós-análise |
| Cobertura de análise | 100% dos módulos | Lista de módulos analisados |
| Redução de anti-patterns | -50% em 3 meses | Reavaliação periódica |

---

## 🔗 Integrações

### Acionado Por
- `architecture-analyzer` (durante análise arquitetural)
- `tech-lead` (code review de arquitetura)
- `architect` (planejamento de refatoração)

### Aciona
- `coupling-detector` (aprofundar análise de acoplamento)
- `refactoring-advisor` (recomendar refatorações específicas)
- `adr-generator` (documentar decisão de aplicar padrão)
- `modularity-optimizer` (otimizar modularidade)

### Registra Em
- `.ai-factory/logs/architecture-analysis/PATTERNS-YYYY-MM-DD.json`
- `.ai-factory/MELHORIAS/INDEX.md`

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem OOP)  
**Tempo Médio:** 2-4h por módulo  
**Taxa de Sucesso:** >80% (recomendações aplicadas com sucesso)
