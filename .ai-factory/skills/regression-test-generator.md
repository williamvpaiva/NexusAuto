# Skill: Regression Test Generator

> Geração automática de testes de regressão a partir de bugs corrigidos para prevenir reincidência

---

## 🎯 Objetivo

Criar testes de regressão automatizados para cada bug corrigido, garantindo que o mesmo erro não reintroduza no futuro, e mantendo uma suite de regressão sempre atualizada.

---

## 🔁 Gatilhos de Acionamento

- Bug corrigido e mergeado
- Hotfix aplicado em produção
- Teste de regressão ausente para bug anterior
- Solicitação de "gere teste de regressão para este bug"
- Ciclo de CI/CD após correção

---

## 📋 Processo de 4 Passos

### PASSO 1: ANALISAR O BUG E O FIX

**Objetivo:** Entender exatamente o que quebrou e como foi corrigido

**Ações:**
1. Identificar a causa raiz do bug
2. Analisar o diff do fix (antes/depois)
3. Identificar a asserção que falharia sem o fix
4. Documentar o cenário que reproduz o bug

**Output:**
```markdown
## Análise do Bug: BUG-042

### Causa Raiz
`order.items` era undefined para pedidos cancelados porque o
campo era removido do banco ($unset) ao invés de setado como
array vazio ($set).

### Diff do Fix
```diff
- await db.collection('orders').updateOne(
-   { _id: orderId },
-   { $unset: { items: '' } }
- );
+ await db.collection('orders').updateOne(
+   { _id: orderId },
+   { $set: { items: [] } }
+ );
```

### Cenário de Reprodução
1. Criar pedido com 150+ itens
2. Cancelar pedido
3. Acessar dashboard → erro 500 no `items.length`

### Asserção Chave
`order.items` deve sempre ser um array (nunca undefined/null)
```

---

### PASSO 2: CRIAR TESTE UNITÁRIO DE REGRESSÃO

**Objetivo:** Teste que falhava antes do fix e passa depois

**Ações:**
1. Escrever teste que reproduz o cenário exato do bug
2. Asserção deve falhar SEM o fix e passar COM o fix
3. Nomear teste claramente com referência ao bug ID
4. Incluir apenas o cenário relevante (minimalista)

**Output:**
```markdown
## Teste de Regressão: BUG-042

### Teste Unitário
```typescript
import { OrderService } from './order.service';
import { createOrder } from '../test-utils/factories';

describe('OrderService - Regressão BUG-042', () => {
  it('deve retornar items como array vazio para pedido cancelado', async () => {
    // Arrange
    const order = await createOrder({ itemCount: 150 });
    await OrderService.cancel(order.id);

    // Act
    const result = await OrderService.getOrder(order.id);

    // Assert
    expect(Array.isArray(result.items)).toBe(true);
    expect(result.items).toEqual([]);
    expect(() => result.items.length).not.toThrow();
  });
});
```

### Resultado Esperado
- ❌ **Antes do fix:** `TypeError: Cannot read properties of undefined`
- ✅ **Depois do fix:** Passa com items = []
```

---

### PASSO 3: CRIAR TESTE DE INTEGRAÇÃO

**Objetivo:** Garantir que o fluxo completo funciona

**Ações:**
1. Criar teste que exercita o fluxo completo
2. Incluir setup e teardown de dados
3. Validar estado no banco de dados
4. Verificar logs e side effects

**Output:**
```markdown
## Teste de Integração: BUG-042

```typescript
describe('OrderService Integration - Regressão BUG-042', () => {
  let orderId: string;

  beforeAll(async () => {
    await db.connect(testDatabase);
  });

  afterAll(async () => {
    await db.disconnect();
  });

  it('pedido cancelado deve manter items no banco', async () => {
    // Arrange
    const order = await createFullOrder({
      userId: 'test-user',
      items: Array(150).fill({ productId: 'prod-1', qty: 1 }),
    });
    orderId = order.id;

    // Act
    await OrderService.cancel(orderId);
    const rawOrder = await db.collection('orders').findOne(
      { _id: orderId }
    );

    // Assert
    expect(rawOrder).toHaveProperty('items');
    expect(rawOrder.items).toEqual([]);
  });

  it('dashboard não deve quebrar com pedido cancelado', async () => {
    // Arrange
    const user = await createTestUser();
    const order = await createFullOrder({ userId: user.id });
    await OrderService.cancel(order.id);

    // Act
    const dashboard = await DashboardService.load(user.id);

    // Assert
    expect(dashboard.orders.cancelled).toContainEqual(
      expect.objectContaining({ id: order.id })
    );
  });
});
```
```

---

### PASSO 4: ATUALIZAR SUITE DE REGRESSÃO

**Objetivo:** Integrar testes ao pipeline de CI/CD

**Ações:**
1. Adicionar teste ao arquivo de regressão existente
2. Verificar que todos os testes de regressão passam
3. Mapear bug ID para teste ID no registro
4. Configurar alerta se teste de regressão falhar no CI

**Output:**
```markdown
## Atualização da Suite de Regressão

### Arquivo Atualizado
`test/regression/bugs-reproduction.spec.ts`
- Adicionado: `BUG-042 - order.items deve ser array`

### Verificação
- [x] Teste unitário passa (npm test)
- [x] Teste de integração passa (npm run test:integration)
- [x] Suite completa de regressão: 156 testes passando
- [ ] Pipeline CI configurado para alertar em falha

### Registro de Bugs vs Testes
| Bug ID | Arquivo de Teste | Data | Autor |
|--------|-----------------|------|-------|
| BUG-001 | regression/orders.spec.ts | 2026-06-15 | dev-1 |
| BUG-015 | regression/users.spec.ts | 2026-06-20 | dev-2 |
| BUG-042 | regression/orders.spec.ts | 2026-07-02 | dev-1 |

### CI/CD Integration
```yaml
# .github/workflows/regression.yml
name: Regression Tests
on: [push]
jobs:
  regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:regression
      - name: Notify on failure
        if: failure()
        run: |
          echo "Regression test failed! Bug BUG-042 reintroduced."
          # Notify Slack/webhook
```
```

---

## 💻 Exemplo de Prompt

```
O bug BUG-042 foi corrigido com o diff abaixo. Gere:
1. Teste unitário de regressão (falha sem fix, passa com fix)
2. Teste de integração (fluxo completo)
3. Atualização da suite de regressão com CI config alerta

Bug: order.items undefined para pedidos cancelados
Fix: substituir $unset por $set items = []
```

---

## ✅ Métricas de Sucesso

| Métrica | Alvo | Como Medir |
|---------|------|------------|
| Cobertura de regressão | 100% dos bugs | Bug ID → Teste ID mapeados |
| Testes por bug | ≥ 1 unitário + 1 integração | Contagem no relatório |
| Suite de regressão | Sempre verde no CI | Pipeline status |
| Tempo por teste | < 100ms (unit) / < 1s (integration) | CI timings |
| Falso-positivos (flaky) | < 1% nos últimos 30 dias | Run history |
| Reincidência de bugs | 0 para bugs com teste | Bug tracker |

---

## 🔗 Integrações

### Acionado Por
- `systematic-debugging` (após corrigir bug)
- `edge-case-detector` (edge cases viram regressão)
- `tech-lead` (para bugs críticos ou hotfixes)
- `qa-tester` (durante validação de fix)

### Aciona
- CI/CD pipeline (executa suite de regressão)
- `debug-session-recorder` (se regressão falhar)
- `error-pattern-matcher` (alimenta padrões de erro)

### Registra Em
- `.ai-factory/logs/regression-tests/REGRESSION-YYYY-MM-DD.json`
- `.ai-factory/MELHORIAS/INDEX.md`
- Arquivo de teste em `test/regression/`

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer framework de teste)  
**Tempo Médio:** 30-60min por bug  
**Taxa de Sucesso:** >90% (testes que efetivamente previnem reincidência)
