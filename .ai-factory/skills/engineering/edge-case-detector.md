---
name: edge-case-detector
category: general
complexity: medium
agents: []
created: 2026-07-11
---

# Skill: Edge Case Detector

> Detecção sistemática de edge cases em lógica de negócio para prevenir bugs em produção

---

## 🎯 Objetivo

Identificar edge cases em qualquer função, módulo ou regra de negócio antes que causem bugs em produção, aplicando heurísticas de teste de limites, combinações inválidas e estados excepcionais.

---

## 🔁 Gatilhos de Acionamento

- Nova regra de negócio implementada
- Code review de lógica complexa
- Antes de merge para produção
- Função com condicionais aninhadas
- Solicitação de "encontre edge cases nesta função"

---

## 📋 Processo de 4 Passos

### PASSO 1: MAPEAR ENTRADAS E ESTADOS

**Objetivo:** Identificar todas as dimensões de variação

**Ações:**
1. Listar todos os parâmetros de entrada da função:
   - Tipos, faixas de valor, formatos esperados
2. Identificar estados internos que afetam o fluxo:
   - Flags, configurações, dependências
3. Mapear dependências externas:
   - APIs, banco de dados, cache, sistema de arquivos

**Output:**
```markdown
## Mapeamento de Entradas

### Função: `calculateShipping(order, user, coupon)`

| Parâmetro | Tipo | Faixa Válida | Formato |
|-----------|------|-------------|---------|
| order.items | OrderItem[] | 1-100 | Array |
| order.total | number | 0.01-99999.99 | Decimal |
| user.address | Address | Obrigatório | Objeto |
| user.isPremium | boolean | true/false | Boolean |
| coupon.code | string | 8-20 chars | Alphanum |
| coupon.discount | number | 0-100 | Integer |

### Estados Internos
- `featureFlags.newShipping`: true/false
- `cache.regionRates`: presente/ausente
```

---

### PASSO 2: APLICAR HEURÍSTICAS DE EDGE CASE

**Objetivo:** Gerar casos de borda sistematicamente

**Ações:**
1. **Limites numéricos:** zero, negativo, máximo, mínimo, NaN, Infinity
2. **Coleções vazias:** array vazio, null, undefined, objeto sem campos
3. **Strings:** vazia, muito longa, caracteres especiais, unicode, SQL injection
4. **Booleanos:** ambos valores, estado indefinido
5. **Tempo:** data passada, futura, 29/fev, fuso horário, epoch zero
6. **Concorrência:** requisições simultâneas, deadlock, timeout
7. **Dependências:** falha de API, banco offline, cache expirado

**Output:**
```markdown
## Edge Cases Identificados

### Limites Numéricos (5 casos)
| # | Caso | Entrada | Resultado Esperado |
|---|------|---------|-------------------|
| 1 | Frete zero | order.total = 0 | Erro: pedido sem valor |
| 2 | Frete máximo | order.total = 99999.99 | Calcula normal |
| 3 | Total negativo | order.total = -50 | Erro: valor inválido |
| 4 | NaN | order.total = NaN | Erro: tipo inválido |
| 5 | Overflow | order.total = 1e20 | Erro: valor excede limite |

### Coleções Vazias (4 casos)
| # | Caso | Entrada | Resultado Esperado |
|---|------|---------|-------------------|
| 6 | Sem itens | order.items = [] | Erro: pedido vazio |
| 7 | Itens null | order.items = null | Erro: tipo inválido |
| 8 | Itens undefined | order.items = undefined | Erro: tipo inválido |
| 9 | Sem endereço | user.address = null | Erro: endereço obrigatório |

### Cupons (3 casos)
| # | Caso | Entrada | Resultado Esperado |
|---|------|---------|-------------------|
| 10 | Código vazio | coupon.code = '' | Ignora cupom |
| 11 | Desconto 100% | coupon.discount = 100 | Frete grátis |
| 12 | Cupom expirado | coupon.expires = past | Cupom inválido |

### Casos Especiais (3 casos)
| # | Caso | Entrada | Resultado Esperado |
|---|------|---------|-------------------|
| 13 | Premium sem endereço | isPremium, address = null | Erro: endereço obrigatório |
| 14 | API de frete offline | axios.get fails | Fallback para frete padrão |
| 15 | Concorrência | 10 requisições simultâneas | Processa em fila |
```

---

### PASSO 3: GERAR TESTES PARA EDGE CASES

**Objetivo:** Criar testes automatizados para cada edge case

**Ações:**
1. Para cada edge case, criar teste unitário
2. Agrupar por categoria (limites, coleções, etc.)
3. Marcar casos críticos que devem ser prioridade

**Output:**
```markdown
## Testes Gerados

### Grupo 1: Limites Numéricos

```typescript
describe('calculateShipping - Limites Numéricos', () => {
  test('order.total = 0 deve retornar erro', () => {
    const order = createOrder({ total: 0 });
    expect(() => calculateShipping(order, user, null))
      .toThrow('Pedido sem valor');
  });

  test('order.total = NaN deve retornar erro', () => {
    const order = createOrder({ total: NaN });
    expect(() => calculateShipping(order, user, null))
      .toThrow('Valor inválido');
  });

  test('order.total = 99999.99 deve calcular normalmente', () => {
    const order = createOrder({ total: 99999.99 });
    const result = calculateShipping(order, user, null);
    expect(result).toBeGreaterThan(0);
  });
});

### Grupo 2: Coleções Vazias

describe('calculateShipping - Coleções', () => {
  test('order.items = [] deve retornar erro', () => {
    const order = createOrder({ items: [] });
    expect(() => calculateShipping(order, user, null))
      .toThrow('Pedido vazio');
  });

  test('order.items = null deve retornar erro', () => {
    const order = createOrder({ items: null });
    expect(() => calculateShipping(order, user, null))
      .toThrow('Tipo inválido');
  });
});
```

### Prioridade de Correção
⚠️ **Crítico:** Casos 1, 3, 6, 7, 8 (causam crash)
✅ **Desejável:** Casos 2, 4, 5, 9, 10 (comportamento inesperado)
🔄 **Fallback:** Casos 11, 12, 13, 14, 15 (lidar graciosamente)
```

---

### PASSO 4: RECOMENDAR MITIGAÇÕES

**Objetivo:** Sugerir validações e guards para cada edge case

**Ações:**
1. Para cada caso crítico, sugerir validação específica
2. Recomendar guard clauses no início da função
3. Sugerir tipos mais específicos (ex: `Order` → `NonEmptyOrder`)
4. Indicar onde adicionar fallbacks

**Output:**
```markdown
## Mitigações Recomendadas

### Validações no Início da Função

```typescript
function calculateShipping(order: Order, user: User, coupon?: Coupon) {
  // Guard clauses para edge cases
  if (!order?.items?.length) throw new Error('Pedido vazio');
  if (order.total <= 0) throw new Error('Valor inválido');
  if (!user?.address) throw new Error('Endereço obrigatório');
  if (!Number.isFinite(order.total)) throw new Error('Tipo inválido');

  // Fallback para dependências
  try {
    const rates = await shippingAPI.getRates(order);
    return calculate(rates, coupon);
  } catch (apiError) {
    logger.warn('API de frete offline, usando fallback', apiError);
    return FALLBACK_RATE;
  }
}
```

### Melhorias de Tipo Sugeridas
```typescript
// Antes
interface Order {
  items?: OrderItem[];
  total?: number;
}

// Depois
interface Order {
  items: NonEmptyArray<OrderItem>;  // nunca vazio
  total: PositiveNumber;             // > 0 e finito
}
```

### Checklist de Merge
- [ ] Todos os 15 edge cases cobertos
- [ ] Testes passando para casos críticos (1-8)
- [ ] Guard clauses adicionadas
- [ ] Tipos refinados (se aplicável)
- [ ] Log de erro para fallbacks
```
---

## 💻 Exemplo de Prompt

```
Analise a função calculateShipping abaixo e identifique todos os edge cases.
Para cada caso, mostre: entrada, resultado esperado, teste unitário e
mitigação recomendada. Priorize por criticidade.

function calculateShipping(order, user, coupon) {
  const baseRate = getBaseRate(order.total);
  const discount = coupon ? applyCoupon(baseRate, coupon) : 0;
  const premiumDiscount = user.isPremium ? 0.1 : 0;
  return baseRate - discount - (baseRate * premiumDiscount);
}
```

---

## ✅ Métricas de Sucesso

| Métrica | Alvo | Como Medir |
|---------|------|------------|
| Edge cases detectados | ≥ 10 por função complexa | Contagem no relatório |
| Testes gerados | 100% dos edge cases | Cobertura no output |
| Casos críticos cobertos | 100% | Prioridade no relatório |
| Guard clauses adicionadas | ≥ 1 por categoria | Checklist de merge |
| Falso-positivos | < 10% | Validação em code review |
| Bugs evitados em produção | Zero para função analisada | Monitoramento pós-merge |

---

## 🔗 Integrações

### Acionado Por
- `tech-lead` (code review de lógica complexa)
- `backend-dev` / `frontend-dev` (antes de implementar)
- `qa-tester` (para complementar planos de teste)

### Aciona
- `regression-test-generator` (incorpora testes ao suite)
- `systematic-debugging` (quando edge case vira bug)
- `complexity-analyzer` (edge cases indicam complexidade)

### Registra Em
- `.ai-factory/logs/edge-cases/EDGE-YYYY-MM-DD.json`
- `.ai-factory/MELHORIAS/INDEX.md`

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem)  
**Tempo Médio:** 1-2h por função complexa  
**Taxa de Sucesso:** >85% (edge cases confirmados em produção)
