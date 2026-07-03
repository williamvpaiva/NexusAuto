# Workflow: Refatoração

## Trigger
TAREFA.md em MELHORIAS com tipo "refactor" ou tech lead identificando débito técnico

---

## Stage 1 — Análise de Escopo
**Agente:** tech-lead + architect

**Tarefas:**
1. Identificar arquivos afetados (diretos e indiretos)
2. Mapear dependências (quem depende do código a ser alterado)
3. Documentar contrato atual vs desejado

**Gate:**
- [ ] Escopo completo documentado
- [ ] Risco de regressão avaliado

---

## Stage 2 — Plano de Refatoração
**Agente:** architect

**Tarefas:**
1. Definir estratégia (big bang vs incremental)
2. Estimar ciclos de devolução (máx 2)
3. Criar tarefas no MELHORIAS com V&V gates

**Gate:**
- [ ] Estratégia aprovada pelo tech lead

---

## Stage 3 — Testes de Regressão
**Agente:** qa-tester

**Tarefas:**
1. Verificar cobertura atual dos arquivos afetados
2. Adicionar testes faltantes para comportamento existente
3. Todos os testes passam ANTES da refatoração

**Gate:**
- [ ] Suite completa passando no estado atual

---

## Stage 4 — Refatoração
**Agente:** backend-dev ou frontend-dev

**Tarefas:**
1. Refatorar incrementalmente (pequenos commits)
2. Rodar suite completa a cada commit
3. Manter contrato de API intacto (se pública)

**Gate:**
- [ ] Suite completa passando no estado refatorado
- [ ] Sem mudanças de comportamento

---

## Stage 5 — Validação
**Agente:** qa-tester

**Tarefas:**
1. Testar funcionalidades afetadas (diretas e indiretas)
2. Verificar performance não degradou
3. Parecer final (go/no-go)

**Gate:**
- [ ] Parecer GO do QA
- [ ] Performance mantida ou melhorada

---

## Estratégias de Refatoração

### Big Bang
- **Quando:** Código isolado, poucos dependentes, teste de regressão robusto
- **Risco:** Alto. Tudo de uma vez.
- **Uso:** Raro — apenas para módulos com 100% de cobertura

### Incremental (Strangler Fig)
- **Quando:** Código com muitos dependentes, baixa cobertura, sistema legado
- **Risco:** Baixo. Convive lado a lado com o antigo.
- **Uso:** Preferencial — 90% dos casos

### Parallel Change
- **Quando:** API pública que outros consomem (outros serviços ou frontend)
- **Risco:** Médio. Requer coordenação.
- **Uso:** Mudanças em contratos de API

---

## Regras de Ouro
1. **Nunca** refatorar e adicionar features no mesmo PR
2. **Sempre** ter testes passando antes de começar
3. **Máximo 2 ciclos** de devolução
4. **Não refatorar** código sem cobertura de testes (a menos que seja para adicionar testes)
