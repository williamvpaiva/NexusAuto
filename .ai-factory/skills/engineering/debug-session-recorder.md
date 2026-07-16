---
name: debug-session-recorder
category: testing
complexity: medium
agents: []
created: 2026-07-11
---

# Skill: Debug Session Recorder

> Gravação estruturada de sessões de debug para análise posterior e aprendizado contínuo

---

## 🎯 Objetivo

Registrar toda sessão de debug de forma estruturada, capturando hipóteses, experimentos, resultados e lições aprendidas, criando uma base de conhecimento reutilizável para acelerar futuros debugs.

---

## 🔁 Gatilhos de Acionamento

- Bug reportado e iniciado debug
- Sessão de debug concluída
- Múltiplas tentativas sem sucesso
- Bug intermitente difícil de reproduzir
- Solicitação de "registre esta sessão de debug"

---

## 📋 Processo de 4 Passos

### PASSO 1: INICIAR SESSÃO

**Objetivo:** Capturar contexto inicial antes de começar o debug

**Ações:**
1. Registrar metadados da sessão:
   - Bug ID, ambiente, data/hora
   - Severidade, impacto, componente afetado
2. Documentar sintomas observados
3. Capturar estado inicial (logs, screenshots, stack trace)
4. Definir objetivo da sessão

**Output:**
```markdown
## Sessão de Debug: BUG-042

**Data:** 2026-07-02T14:30:00Z
**Agente:** backend-dev
**Componente:** UserService (autenticação)
**Severidade:** Alta (produção)

### Sintomas
- Usuário logado recebe erro 500 ao acessar dashboard
- Apenas usuários com mais de 100 pedidos
- Erro intermitente (30% das requisições)

### Stack Trace Inicial
```
Error: Cannot read properties of undefined (reading 'length')
  at OrderService.calculateTotal (orders.ts:45)
  at DashboardController.load (dashboard.ts:12)
```

### Objetivo
Identificar por que `order.items` é undefined para alguns usuários
```

---

### PASSO 2: REGISTRAR HIPÓTESES E EXPERIMENTOS

**Objetivo:** Manter rastro de todas as tentativas e resultados

**Ações:**
1. Listar hipóteses ordenadas por probabilidade
2. Para cada hipótese, registrar:
   - Experimento executado
   - Resultado observado
   - Conclusão (confirmada/rejeitada)
3. Manter timeline de tentativas

**Output:**
```markdown
## Hipóteses Testadas

### Hipótese 1: Pedido sem items (alta probabilidade)
**Experimento:** Adicionar log antes de calcular total
**Resultado:** order.items = undefined quando order.status = 'cancelled'
**Conclusão:** ✅ CONFIRMADA

### Hipótese 2: Cache corrompido (média probabilidade)
**Experimento:** Limpar cache e reproduzir
**Resultado:** Erro persiste
**Conclusão:** ❌ REJEITADA

### Hipótese 3: Concorrência na escrita (baixa probabilidade)
**Experimento:** Adicionar lock no update de order
**Resultado:** Erro persiste
**Conclusão:** ❌ REJEITADA
```

---

### PASSO 3: DOCUMENTAR CAUSA RAIZ E FIX

**Objetivo:** Registrar descoberta final e solução aplicada

**Ações:**
1. Descrever causa raiz em linguagem clara
2. Documentar o fix aplicado (com diff)
3. Registrar como reproduzir o bug
4. Estimar impacto do fix

**Output:**
```markdown
## Causa Raiz

Ao cancelar um pedido, o campo `items` era removido do documento
no banco (`delete order.items` ao invés de `order.items = []`).
Isso fazia com que `order.items.length` lançasse erro para pedidos
cancelados.

**Por que ocorria:** A migration de cancelamento foi otimizada
removendo o array vazio para economizar espaço, sem considerar
que o código esperava items sempre presente.

## Fix Aplicado

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

## Como Reproduzir
1. Criar pedido com 150+ itens
2. Cancelar pedido
3. Acessar dashboard → erro 500

## Validação do Fix
- [x] Bug não reproduz após fix
- [x] Teste unitário adicionado para pedido cancelado
- [x] Teste de regressão para pedidos normais
- [x] Teste de carga: 1000 pedidos cancelados simultâneos
```

---

### PASSO 4: REGISTRAR APRENDIZADO

**Objetivo:** Extrair lições para prevenir bugs similares

**Ações:**
1. Identificar o que permitiu o bug existir
2. Sugerir mudanças no processo
3. Criar entrada na base de conhecimento

**Output:**
```markdown
## Lições Aprendidas

### O que Permitiu o Bug
- `items` não tinha validação de tipo na interface
- Testes não cobriam pedidos cancelados
- Remoção de campo no banco não passou por code review

### Ações Preventivas
1. Adicionar validação: `order.items ?? []`
2. Criar teste para `OrderService.getOrder()` com pedido cancelado
3. Adicionar regra no linter: proibir `$unset` sem approval

### Tags
`#null-pointer` `#mongodb` `#intermitente` `#alta-severidade`
```

---

## 💻 Exemplo de Prompt

```
Inicie uma sessão de debug para BUG-042. Registre o stack trace,
documente 3 hipóteses ordenadas por probabilidade, execute o experimento
para cada uma, e ao final entregue um relatório completo com causa raiz,
diff do fix e lições aprendidas.
```

---

## ✅ Métricas de Sucesso

| Métrica | Alvo | Como Medir |
|---------|------|------------|
| Sessões registradas | 100% dos bugs | Log em `.ai-factory/logs/debug-sessions/` |
| Hipóteses por sessão | ≥ 3 | Contagem no relatório |
| Hipóteses documentadas | 100% | Checklist no template |
| Tempo médio de registro | < 5 min | Timestamp início/fim |
| Lições extraídas | ≥ 1 por sessão | Seção de aprendizado |
| Reaproveitamento | 20% de match | Busca por tags similares |

---

## 🔗 Integrações

### Acionado Por
- `systematic-debugging` (ao iniciar sessão de debug)
- `tech-lead` (para revisão pós-mortem)
- `backend-dev` / `frontend-dev` (durante debug ativo)

### Aciona
- `error-pattern-matcher` (alimenta base de padrões)
- `regression-test-generator` (gera testes do fix)
- `root-cause-analyzer` (aprofundamento 5 Whys)

### Registra Em
- `.ai-factory/logs/debug-sessions/DEBUG-YYYY-MM-DD.json`
- `.ai-factory/MELHORIAS/LICOES-APRENDIDAS.md`

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem)  
**Tempo Médio:** 5-10min por sessão  
**Taxa de Sucesso:** >95% (com documentação consistente)
