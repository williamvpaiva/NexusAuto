---
name: modularity-optimizer
category: general
complexity: high
agents: []
created: 2026-07-11
---

# Skill: Modularity Optimizer

> Otimização da modularidade do código para reduzir acoplamento e aumentar coesão entre módulos

---

## 🎯 Objetivo

Analisar e melhorar a modularidade do sistema aplicando princípios de alta coesão e baixo acoplamento, reorganizando módulos, pacotes e diretórios para maximizar a independência e reutilização de componentes.

---

## 🔁 Gatilhos de Acionamento

- Acoplamento excessivo detectado pelo coupling-detector
- Dificuldade para reutilizar código entre módulos
- Build lento (módulos muito dependentes invalidam cache)
- Testes lentos (muitos módulos precisam ser carregados)
- Solicitação de "otimize a modularidade deste projeto"

---

## 📋 Processo de 4 Passos

### PASSO 1: ANALISAR ESTRUTURA DE MÓDULOS ATUAL

**Objetivo:** Mapear a estrutura atual de módulos e suas relações

**Ações:**
1. Identificar módulos/pacotes/diretórios existentes
2. Mapear dependências entre módulos (quem importa quem)
3. Calcular métricas de modularidade:
   - **Coesão (LCOM):** Lack of Cohesion of Methods
   - **Acoplamento Aferente/Eferente**
   - **Tamanho do módulo** (linhas, classes)
4. Identificar violações de boundaries

**Output:**
```markdown
## Análise de Modularidade Atual

### Estrutura de Módulos
```
src/
├── services/        (15 classes, 8.2K linhas) 🔴 Muito grande
│   ├── order/       (5 classes)
│   ├── user/        (3 classes)
│   └── payment/     (2 classes)
├── models/          (12 classes, 3.5K linhas)
├── utils/           (25 funções, 2.8K linhas) 🔴 Sacola miscelânea
├── repositories/    (8 classes, 2.1K linhas)
└── shared/          (3 classes, 800 linhas)
```

### Matriz de Dependências entre Módulos

```
          | services | models | utils | repos | shared
----------|----------|--------|-------|-------|--------
services  |    -     |  12    |  15   |  10   |   5
models    |    0     |   -    |   3   |   0   |   2
utils     |    0     |   0    |   -   |   0   |   1
repos     |    8     |  12    |   5   |   -   |   3
shared    |    0     |   0    |   0   |   0   |   -
```

### Violações de Modularidade

| Violação | Localização | Impacto |
|----------|-------------|---------|
| Services importa de utils (15x) | services/*.ts | 🔴 Alto |
| Repos importa de services (círculo) | repos/*.ts | 🔴 Alto |
| Utils é sacola genérica | utils/*.ts | 🟡 Médio |
| Models sem coesão (LCOM = 0.8) | models/*.ts | 🟡 Médio |
```

---

### PASSO 2: CALCULAR MÉTRICAS DE COESÃO

**Objetivo:** Medir o quanto os elementos de cada módulo pertencem juntos

**Ações:**
1. **LCOM (Lack of Cohesion of Methods):**
   - LCOM = 1 - (soma de métodos que compartilham campos / total de pares)
   - Ideal: < 0.5 (coeso)
   - Problema: > 0.7 (baixa coesão)
2. **Tight Class Cohesion (TCC):** métodos diretamente conectados
3. **Cohesion Among Classes (CAC):** coesão entre classes do pacote

**Output:**
```markdown
## Métricas de Coesão

### LCOM por Módulo

| Módulo | LCOM | Status | Recomendação |
|--------|------|--------|--------------|
| services/order | 0.85 | 🔴 Ruim | Extrair em 2-3 módulos |
| services/user | 0.65 | 🟡 Médio | Revisar responsabilidades |
| services/payment | 0.35 | 🟢 Bom | OK |
| models | 0.80 | 🔴 Ruim | Separar por domínio |
| utils | 0.90 | 🔴 Ruim | Quebrar em utils específicas |
| repositories | 0.55 | 🟡 Médio | Revisar dependências |
| shared | 0.30 | 🟢 Bom | OK |

### Análise Detalhada: services/order (LCOM = 0.85)

```
Métodos de OrderService e campos que acessam:
                    | orderRepo | userRepo | cache | emailer | logger
--------------------|-----------|----------|-------|---------|-------
createOrder()       |    ✅     |    ✅    |  ✅   |   ❌   |  ✅
cancelOrder()       |    ✅     |    ✅    |  ✅   |   ✅   |  ✅
getOrder()          |    ✅     |    ❌    |  ✅   |   ❌   |  ✅
listOrders()        |    ✅     |    ❌    |  ✅   |   ❌   |  ✅
sendReceipt()       |    ✅     |    ❌    |  ❌   |   ✅   |  ✅
calculateTotal()    |    ❌     |    ❌    |  ❌   |   ❌   |  ✅
validateCoupon()    |    ❌     |    ❌    |  ❌   |   ❌   |  ✅

Problema: sendReceipt e calculateTotal não compartilham campos
com os outros métodos → baixa coesão.
```

---

### PASSO 3: PROPOR REORGANIZAÇÃO DE MÓDULOS

**Objetivo:** Definir nova estrutura de módulos com alta coesão e baixo acoplamento

**Ações:**
1. Agrupar classes por responsabilidade (domínio)
2. Definir boundaries claros entre módulos
3. Extrair módulos que cresceram demais (God Module)
4. Consolidar módulos muito pequenos/incoesos
5. Eliminar dependências circulares

**Output:**
```markdown
## Proposta de Reorganização

### Nova Estrutura Sugerida

```
src/
├── orders/                  # Módulo de pedidos (coeso)
│   ├── application/         # Casos de uso
│   │   ├── create-order.usecase.ts
│   │   ├── cancel-order.usecase.ts
│   │   └── get-order.usecase.ts
│   ├── domain/              # Domínio puro
│   │   ├── order.entity.ts
│   │   ├── order.repository.ts (interface)
│   │   └── order-event.ts
│   ├── infrastructure/      # Implementações
│   │   ├── order.repository.impl.ts
│   │   └── order.controller.ts
│   └── index.ts
│
├── users/                   # Módulo de usuários
│   ├── application/
│   ├── domain/
│   └── infrastructure/
│
├── payments/                # Módulo de pagamentos
│   ├── application/
│   ├── domain/
│   └── infrastructure/
│
├── notifications/           # Módulo de notificações
│   ├── application/
│   ├── domain/
│   └── infrastructure/
│
└── shared/                  # Código compartilhado (minimalista)
    ├── kernel/              # Value objects, base classes
    └── utils/              # Utilitários genéricos
```

### Mudanças Específicas

| Ação | Módulo Atual | Novo Módulo | Benefício | Esforço |
|------|-------------|-------------|-----------|---------|
| Extrair | services/order | orders/, notifications/ | LCOM 0.85 → 0.35 | 8h |
| Extrair | services/user | users/ | LCOM 0.65 → 0.30 | 4h |
| Dividir | utils/ | shared/utils/, domain kernel/ | Coesão + clareza | 3h |
| Remover círculo | services ↔ repos | Domain interfaces | Acoplamento reduzido | 2h |
| Separar | models/ | orders/domain, users/domain | Domínios isolados | 4h |
```

---

### PASSO 4: CRIAR PLANO DE MIGRAÇÃO

**Objetivo:** Executar a reorganização sem quebrar o código em produção

**Ações:**
1. Criar nova estrutura de diretórios
2. Migrar arquivos um módulo por vez
3. Atualizar imports em todo o projeto
4. Verificar se todos os testes passam
5. Remover estrutura antiga

**Output:**
```markdown
## Plano de Migração

### Fase 1: Orders (8h)
```
1. Criar src/orders/{application,domain,infrastructure}/
2. Mover order.service.ts para orders/application/
3. Extrair sendReceipt() para notifications/
4. Extrair calculateTotal() para orders/domain/
5. Criar interfaces em orders/domain/
6. Mover repos para orders/infrastructure/
7. Atualizar imports (grep -r 'services/order' → orders/)
8. Rodar testes e verificar
```

### Fase 2: Users (4h)
```
1. Criar src/users/{application,domain,infrastructure}/
2. Mover user.service.ts para users/application/
3. Extrair responsabilidades de autenticação
4. Atualizar imports
5. Rodar testes
```

### Fase 3: Shared/Utils (3h)
```
1. Mover funções de domínio para módulos específicos
2. Manter apenas utilitários genéricos em shared/utils/
3. Renomear pasta utils/ para shared/utils/
4. Atualizar imports
5. Rodar testes
```

### Validação Final

| Verificação | Critério | Como Verificar |
|-------------|----------|----------------|
| Acoplamento | I < 0.7 | coupling-detector |
| Coesão | LCOM < 0.5 | modularity-analyzer |
| Dependências circulares | Zero | grep circular imports |
| Build | < 50% do tempo original | CI/CD timing |
| Testes | 100% passando | npm test |
| Imports órfãos | Zero | typescript compiler |

### Rollback
Se algo quebrar em produção:
```bash
git revert HEAD --no-commit  # Reverte mudanças
# Manter testes antigos até próxima tentativa
```
```

---

## 💻 Exemplo de Prompt

```
Analise a modularidade do diretório src/.
1. Calcule LCOM de cada módulo
2. Identifique módulos com baixa coesão
3. Proponha nova estrutura de módulos
4. Crie plano de migração faseado

Foco em services/ (muito grande) e utils/ (sacola genérica).
```

---

## ✅ Métricas de Sucesso

| Métrica | Antes | Depois | Alvo |
|---------|-------|--------|------|
| LCOM médio | 0.72 | < 0.50 | -31% |
| Dependências circulares | 3 | 0 | -100% |
| Módulos | 5 | 6-8 | +20-60% |
| Tamanho médio do módulo | 3.5K linhas | < 1.5K linhas | -57% |
| Build time | 12min | < 5min | -58% |
| Testes afetados por mudança | 45% | < 20% | -55% |

---

## 🔗 Integrações

### Acionado Por
- `architecture-analyzer` (estrutura atual identificada)
- `coupling-detector` (acoplamento excessivo detectado)
- `tech-lead` (planejamento de refatoração)
- `architect` (definição de arquitetura-alvo)

### Aciona
- `refactoring-advisor` (refatorações específicas)
- `adr-generator` (documentar nova estrutura)
- `code-smell-detector` (verificar novo código)
- `complexity-analyzer` (medir melhoria)

### Registra Em
- `.ai-factory/logs/architecture-analysis/MODULARITY-YYYY-MM-DD.json`
- `.ai-factory/adr/ADR-NNN.md` (se houver decisão arquitetural)
- `.ai-factory/MELHORIAS/INDEX.md`

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem)  
**Tempo Médio:** 4-8h por análise completa  
**Taxa de Sucesso:** >75% (migração concluída sem incidentes)
