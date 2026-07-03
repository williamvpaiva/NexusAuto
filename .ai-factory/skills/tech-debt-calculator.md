# Skill: Tech Debt Calculator

> Cálculo e priorização de dívida técnica em horas/custo para guiar decisões de refatoração com ROI

---

## 🎯 Objetivo

Quantificar a dívida técnica do projeto em termos de horas de refatoração, custo financeiro e impacto na produtividade, priorizando itens por ROI (Retorno sobre Investimento) para orientar decisões de engenharia.

---

## 🔁 Gatilhos de Acionamento

- Planejamento de sprint/iteração
- Antes de grande refatoração
- Solicitação de "qual é nossa dívida técnica?"
- Decisão entre refatorar ou seguir com workaround
- Review trimestral de qualidade

---

## 📋 Processo de 4 Passos

### PASSO 1: IDENTIFICAR ITENS DE DÍVIDA TÉCNICA

**Objetivo:** Catalogar toda dívida técnica conhecida e estimável

**Ações:**
1. **Dívida de Código:**
   - Code smells detectados (Long Method, God Class, etc.)
   - Complexidade ciclomática excessiva (> 15)
   - Código morto, comentários obsoletos
   - Falta de testes (cobertura < 60%)

2. **Dívida de Arquitetura:**
   - Acoplamento excessivo entre módulos
   - Dependências circulares
   - Falta de interfaces/abstração
   - Violações de SOLID

3. **Dívida de Infraestrutura:**
   - Dependências desatualizadas (major versions atrasadas)
   - Build lento (> 5min)
   - CI/CD não automatizado
   - Falta de monitoring/observability

4. **Dívida de Processo:**
   - Documentação desatualizada
   - Testes manuais não automatizados
   - Falta de padrões de código

**Output:**
```markdown
## Inventário de Dívida Técnica

### Categoria: Código

| Item | Localização | Severidade | Tipo |
|------|-------------|------------|------|
| God Class OrderManager (850 linhas) | OrderManager.ts | 🔴 Crítica | Complexidade |
| Função processOrder (120 linhas) | OrderManager.ts:45 | 🔴 Crítica | Long Method |
| Sem testes em PaymentService | payment.service.ts | 🟡 Alta | Cobertura |
| 15 imports não utilizados | *.ts | 🟢 Baixa | Código morto |

### Categoria: Arquitetura

| Item | Localização | Severidade | Tipo |
|------|-------------|------------|------|
| Dependência circular A→B→A | order-manager, user-service | 🔴 Crítica | Acoplamento |
| Sem interfaces nos repositories | repositories/ | 🟡 Alta | Abstração |
| Violação SRP em OrderManager | OrderManager.ts | 🔴 Crítica | SOLID |

### Categoria: Infraestrutura

| Item | Severidade | Tipo |
|------|------------|------|
| Node.js 14 (LTS atual: 22) | 🔴 Crítica | Deps desatualizadas |
| Build leva 12min | 🟡 Alta | Pipeline |
| Sem logs estruturados | 🟡 Alta | Observability |
```

---

### PASSO 2: CALCULAR CUSTO DE CADA ITEM

**Objetivo:** Estimar horas e custo financeiro para pagar cada dívida

**Ações:**
1. Calcular **Principal** (custo para refatorar agora):
   - Horas estimadas de engenharia
   - Custo financeiro (horas × taxa horária)
2. Calcular **Juros** (custo de manter a dívida):
   - Horas extras gastas por semana trabalhando com a dívida
   - Bugs causados pela dívida (horas de debug + fix)
   - Perda de produtividade (tempo extra para implementar)
3. Calcular **ROI** = (Juros anuais - Principal) / Principal

**Output:**
```markdown
## Cálculo de Custos

### Taxa Horária de Referência
- Desenvolvedor: $50/h
- Tech Lead: $80/h

### Item: God Class OrderManager

**Principal (Refatorar):**
| Atividade | Horas | Custo |
|-----------|-------|-------|
| Extrair OrderPayment | 8h | $400 |
| Extrair OrderShipping | 6h | $300 |
| Extrair OrderNotification | 4h | $200 |
| Extrair OrderStock | 6h | $300 |
| Testes e validação | 8h | $400 |
| **Total** | **32h** | **$1,600** |

**Juros (Não Refatorar - Mensal):**
| Atividade | Horas/semana | Custo/mês |
|-----------|-------------|-----------|
| Conflitos de merge na classe | 2h | $400 |
| Debug de bugs complexos | 3h | $600 |
| Dificuldade de implementar features | 4h | $800 |
| Testes manuais extras | 2h | $400 |
| **Total Mensal** | **11h/sem** | **$2,200/mês** |

**ROI:**
- Principal: $1,600 (uma vez)
- Juros anual: $26,400
- ROI: ($26,400 - $1,600) / $1,600 = **1,550%**
- Payback: 22 dias
```

---

### PASSO 3: PRIORIZAR POR ROI

**Objetivo:** Ordenar itens pelo melhor retorno sobre investimento

**Ações:**
1. Calcular ROI de cada item
2. Ordenar por ROI decrescente
3. Considerar restrições: dependências, capacidade da equipe
4. Agrupar por sprint/milestone

**Output:**
```markdown
## Priorização por ROI

| # | Item | Principal | Juros/mês | ROI | Payback | Prioridade |
|---|------|-----------|-----------|-----|---------|------------|
| 1 | God Class OrderManager | 32h | 44h | 1,550% | 22 dias | 🔴 Crítica |
| 2 | Node.js 14 → 22 | 16h | 20h | 1,400% | 24 dias | 🔴 Crítica |
| 3 | Dep. Circular Order-User | 8h | 12h | 1,700% | 20 dias | 🔴 Crítica |
| 4 | PaymentService sem testes | 20h | 10h | 500% | 60 dias | 🟡 Alta |
| 5 | Build lento (12min) | 8h | 4h | 500% | 60 dias | 🟡 Alta |
| 6 | Imports não utilizados | 2h | 0.5h | 200% | 120 dias | 🟢 Baixa |

### Alocação por Sprint

**Sprint Atual (Sprint 12):**
- [ ] God Class OrderManager (32h) - 4 dias
- [ ] Node.js 14 → 22 (16h) - 2 dias

**Sprint 13:**
- [ ] Dep. Circular (8h) - 1 dia
- [ ] PaymentService testes (20h) - 2.5 dias

**Backlog:**
- Build lento (8h)
- Imports não utilizados (2h)
```

---

### PASSO 4: GERAR RELATÓRIO EXECUTIVO

**Objetivo:** Criar visão consolidada para stakeholders

**Ações:**
1. Calcular dívida total do projeto
2. Calcular juros total (burn rate)
3. Calcular anos até o "technical bankruptcy"
4. Gerar gráfico de tendência

**Output:**
```markdown
## Relatório Executivo - Dívida Técnica

### 🔢 Números Gerais

| Métrica | Valor |
|---------|-------|
| Dívida Total | 86h ($4,300) |
| Juros Mensais | 92h ($4,600) |
| Juros Anuais | 1,104h ($55,200) |
| Tamanho da Equipe | 8 devs |
| Produtividade Perdida | 22% |
| Technical Bankruptcy | 14 meses |

### 📉 Tendência (Últimos 6 Meses)

```
Dívida Técnica (em horas)
Mês 1: 45h  ████████░░░░
Mês 2: 52h  █████████░░░
Mês 3: 61h  ██████████░░
Mês 4: 70h  ███████████░
Mês 5: 78h  ████████████
Mês 6: 86h  ████████████
```

**Tendência:** Aumento de 91% em 6 meses
**Alerta:** Se continuar, atingirá 150h em 12 meses

### 📊 Distribuição por Categoria

```
Código:      42h (49%)  ████████████████████
Arquitetura: 28h (33%)  ██████████████
Infra:       16h (19%)  ████████
```

### 💰 Custo Anual Estimado

| Cenário | Custo | Diferença |
|---------|-------|-----------|
| Manter dívida | $55,200/ano | - |
| Pagar toda dívida | $4,300 (uma vez) | -$50,900/ano |
| Pagar 50% (prioridades) | $2,800 (uma vez) | -$44,000/ano |

### 🎯 Recomendação

Pagar os top 3 itens (custo $2,800) para economizar $44,000/ano = **15.7x ROI**

**Plano:** 1 sprint de refatoração → recupera investimento em 20 dias úteis
```

---

## 💻 Exemplo de Prompt

```
Calcule a dívida técnica do projeto. Tenho os seguintes itens
identificados: God Class OrderManager (est. refatoração: 32h),
Node.js 14 desatualizado (est. upgrade: 16h), dependência circular
(est. 8h), PaymentService sem testes (est. 20h), build lento
(est. 8h). Considere taxa horária de $50/h e equipe de 8 devs.
Calcule principal, juros mensais e ROI de cada item.
```

---

## ✅ Métricas de Sucesso

| Métrica | Alvo | Como Medir |
|---------|------|------------|
| Itens catalogados | 100% da dívida conhecida | Inventário completo |
| Precisão da estimativa | ±20% do real | Comparação pós-refatoração |
| ROI calculado | 100% dos itens | Fórmula aplicada |
| Dívida total | Reduzindo a cada trimestre | Relatório periódico |
| Technical bankruptcy | > 24 meses | Projeção mensal |
| Itens priorizados implementados | > 60% | Tracking no board |

---

## 🔗 Integrações

### Acionado Por
- `tech-lead` (planejamento de sprints)
- `architect` (revisão trimestral)
- `code-smell-detector` (smells viram dívida)
- `complexity-analyzer` (complexidade vira dívida)

### Aciona
- `refactoring-advisor` (detalhar refatoração)
- `adr-generator` (decidir abordagem de pagamento)
- `modularity-optimizer` (refatoração de módulos)
- `dead-code-eliminator` (limpeza de código morto)

### Registra Em
- `.ai-factory/logs/tech-debt/DEBT-YYYY-MM-DD.json`
- `.ai-factory/MELHORIAS/INDEX.md`
- Board do sprint

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer projeto)  
**Tempo Médio:** 2-4h por avaliação  
**Taxa de Sucesso:** >80% (itens priorizados são implementados)
