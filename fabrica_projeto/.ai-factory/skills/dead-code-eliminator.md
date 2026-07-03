# Skill: Dead Code Eliminator

> Identificação e remoção segura de código morto, unused imports, variáveis não utilizadas e funções obsoletas

---

## 🎯 Objetivo

Detectar e remover código que não é mais usado no projeto, incluindo imports não utilizados, variáveis locais não usadas, funções/métodos nunca chamados, classes obsoletas e código comentado antigo, garantindo que nada seja removido acidentalmente.

---

## 🔁 Gatilhos de Acionamento

- Code review solicitado
- Antes de merge de PR
- Auditoria de limpeza de código
- Quando projeto tem muitos comentários de código antigo
- Solicitação de "limpe este código"

---

## 📋 Processo de 5 Passos

### PASSO 1: DETECTAR CÓDIGO NÃO UTILIZADO

**Objetivo:** Identificar todo código que não é executado

**Ações:**
1. **Imports não utilizados:**
   - Varre todos os arquivos
   - Identifica imports que não são referenciados no arquivo
   - Detecta imports de módulos que não existem mais

2. **Variáveis locais não utilizadas:**
   - Identifica variáveis declaradas mas nunca lidas
   - Detecta parâmetros de função não usados
   - Encontra constantes definidas mas não referenciadas

3. **Funções/métodos não chamados:**
   - Mapeia todas as funções declaradas
   - Rastreia todas as chamadas de função
   - Identifica funções nunca chamadas (exceto entry points)

4. **Classes/interfaces não usadas:**
   - Identifica classes declaradas mas não instanciadas
   - Detecta interfaces não implementadas
   - Encontra tipos exportados mas não importados

5. **Código comentado antigo:**
   - Identifica blocos de código comentado (> 3 linhas)
   - Detecta console.log/debug statements
   - Encontra TODOs/FIXMEs antigos (> 6 meses)

**Output:**
```markdown
## Código Não Utilizado Detectado

### Imports Não Utilizados (15 encontrados)

| Arquivo | Import | Usado Em | Status |
|---------|--------|----------|--------|
| `UserService.ts` | `import { Logger } from './logger'` | Nenhuma | ❌ |
| `OrderController.ts` | `import * as utils from './utils'` | Nenhuma | ❌ |
| `PaymentService.ts` | `import { EmailService } from './email'` | Nenhuma | ❌ |

---

### Variáveis Locais Não Utilizadas (23 encontradas)

| Arquivo | Variável | Linha | Motivo |
|---------|----------|-------|--------|
| `UserService.ts` | `const tempData` | 45 | Declarada, nunca lida |
| `OrderManager.ts` | `let retryCount` | 78 | Atribuída, nunca lida |
| `PaymentProcessor.ts` | `const unusedResult` | 120 | Resultado não usado |

---

### Funções Não Chamadas (12 encontradas)

| Arquivo | Função | Última Vez Usada | Status |
|---------|--------|------------------|--------|
| `utils/helpers.ts` | `formatDateOld()` | Nunca | ❌ |
| `OrderManager.ts` | `legacyProcess()` | 2024-01-15 | ❌ (substituída) |
| `PaymentService.ts` | `calculateTotalV1()` | 2024-03-20 | ❌ (substituída) |

---

### Classes Não Utilizadas (5 encontradas)

| Arquivo | Classe | Motivo |
|---------|--------|--------|
| `models/LegacyOrder.ts` | `LegacyOrder` | Modelo antigo, não usado |
| `services/OldPaymentGateway.ts` | `OldPaymentGateway` | Gateway substituído |

---

### Código Comentado (34 blocos)

| Arquivo | Linhas | Conteúdo | Idade |
|---------|--------|----------|-------|
| `UserService.ts` | 15-45 | Função inteira comentada | 8 meses |
| `OrderController.ts` | 78-120 | Lógica antiga comentada | 6 meses |

---

### Debug Statements (8 encontrados)

| Arquivo | Linha | Tipo |
|---------|-------|------|
| `PaymentService.ts` | 34 | `console.log('DEBUG: payment processed')` |
| `OrderManager.ts` | 67 | `console.error('ERROR:', error)` |
```

---

### PASSO 2: VALIDAR QUE É SEGURO REMOVER

**Objetivo:** Garantir que código não está sendo usado de forma dinâmica

**Ações:**
1. **Verificar uso dinâmico:**
   - Buscar referências por string (ex: `obj['methodName']`)
   - Verificar reflection/introspection
   - Checar se função é callback registrado dinamicamente

2. **Verificar exports públicos:**
   - Se é library/package, verificar se é API pública
   - Checar se há consumers externos
   - Verificar documentação

3. **Verificar entry points:**
   - Rotas de API podem usar reflection
   - Event handlers podem ser registrados dinamicamente
   - Hooks/plugins podem carregar código dinamicamente

4. **Analisar histórico git:**
   - Quando foi adicionado
   - Por que foi comentado (ver commits)
   - Se foi substituído ou apenas desativado temporariamente

**Output:**
```markdown
## Validação de Segurança

### ✅ Seguro Remover (95%)

| Item | Verificação | Resultado |
|------|-------------|-----------|
| `Logger` import em UserService | Busca por "Logger" no arquivo | ✅ Não usado |
| `formatDateOld()` | Busca por "formatDateOld" em todo código | ✅ Nenhuma referência |
| `LegacyOrder` class | Busca por "new LegacyOrder" | ✅ Nenhuma instância |
| Código comentado em UserService | Git blame: commit "removing old logic" | ✅ Substituído |

---

### ⚠️ Requer Atenção (5%)

| Item | Preocupação | Ação |
|------|-------------|------|
| `legacyProcess()` | Usado em migração antiga | Verificar com time se migração completou |
| `calculateTotalV1()` | Pode ser usado em reports legados | Checar sistema de reports |

---

### ❌ Não Remover

| Item | Motivo | Alternativa |
|------|--------|-------------|
| Nenhum | - | - |
```

---

### PASSO 3: PRIORIZAR REMOÇÃO

**Objetivo:** Ordenar remoções por impacto e segurança

**Ações:**
1. Priorizar por:
   - **Segurança:** 100% seguro primeiro
   - **Impacto:** Maior redução de código primeiro
   - **Risco:** Menor risco primeiro

2. Agrupar por tipo:
   - Imports não utilizados (baixo risco)
   - Debug statements (baixo risco)
   - Variáveis não usadas (baixo risco)
   - Funções não chamadas (médio risco)
   - Classes não usadas (médio risco)
   - Código comentado (baixo risco)

**Output:**
```markdown
## Priorização de Remoção

### Prioridade 🔴 Imediata (Baixo Risco, Alto Impacto)

| Tipo | Quantidade | Arquivos | Tempo |
|------|------------|----------|-------|
| Imports não utilizados | 15 | 12 | 30min |
| Debug statements | 8 | 6 | 15min |
| Variáveis não usadas | 23 | 15 | 45min |

**Total:** 1h 30min para remover 46 itens

---

### Prioridade 🟡 Esta Semana (Médio Risco)

| Tipo | Quantidade | Arquivos | Tempo |
|------|------------|----------|-------|
| Funções não chamadas | 12 | 8 | 2h |
| Classes não usadas | 5 | 4 | 1h |

**Validação Extra Necessária:**
- [ ] Confirmar com time que `legacyProcess()` não é usado
- [ ] Verificar sistema de reports para `calculateTotalV1()`

**Total:** 3h para remover 17 itens

---

### Prioridade 🟢 Quando Possível (Baixa Prioridade)

| Tipo | Quantidade | Motivo |
|------|------------|--------|
| Código comentado | 34 blocos | Pode conter contexto histórico útil |

**Recomendação:** Manter código comentado < 30 dias, remover após
```

---

### PASSO 4: REMOVER COM SEGURANÇA

**Objetivo:** Remover código com rollback seguro

**Ações:**
1. **Criar branch de backup:**
   ```bash
   git checkout -b backup-dead-code-$(date +%Y%m%d)
   git push origin backup-dead-code-$(date +%Y%m%d)
   ```

2. **Remover em grupos:**
   - Grupo 1: Imports e debug statements
   - Grupo 2: Variáveis locais
   - Grupo 3: Funções e classes

3. **Rodar testes após cada grupo:**
   ```bash
   npm test
   npm run build
   ```

4. **Commitar com mensagem clara:**
   ```
   chore: remove 15 unused imports
   
   - UserService.ts: Logger import
   - OrderController.ts: utils import
   - ...
   
   Safe to remove: no references found in codebase
   ```

**Output:**
```markdown
## Remoção Executada

### Grupo 1: Imports e Debug (✅ Concluído)

**Imports Removidos:**
- [x] `UserService.ts`: Logger
- [x] `OrderController.ts`: utils
- [x] `PaymentService.ts`: EmailService
- [x] ... mais 12

**Debug Statements Removidos:**
- [x] `PaymentService.ts:34`: console.log
- [x] `OrderManager.ts:67`: console.error
- [x] ... mais 6

**Testes:** ✅ Todos passando
**Build:** ✅ Sucesso

---

### Grupo 2: Variáveis Locais (✅ Concluído)

**Variáveis Removidas:**
- [x] `UserService.ts:45`: tempData
- [x] `OrderManager.ts:78`: retryCount
- [x] ... mais 21

**Testes:** ✅ Todos passando
**Build:** ✅ Sucesso

---

### Grupo 3: Funções e Classes (🟡 Em Progresso)

**Funções Removidas:**
- [x] `utils/helpers.ts`: formatDateOld()
- [ ] `OrderManager.ts`: legacyProcess() (aguardando confirmação)
- [ ] `PaymentService.ts`: calculateTotalV1() (aguardando confirmação)

**Classes Removidas:**
- [x] `models/LegacyOrder.ts`: LegacyOrder
- [ ] `services/OldPaymentGateway.ts`: OldPaymentGateway (aguardando confirmação)

**Testes:** ✅ Todos passando até agora
```

---

### PASSO 5: VALIDAR E REGISTRAR

**Objetivo:** Garantir que nada quebrou e registrar economia

**Ações:**
1. Rodar suite completa de testes
2. Verificar coverage (não deve cair)
3. Medir redução de código
4. Registrar em LOG-VALIDACOES.md
5. Fazer merge da branch

**Output:**
```markdown
## Validação Final

### Testes
- **Unitários:** ✅ 234/234 passando
- **Integração:** ✅ 45/45 passando
- **E2E:** ✅ 12/12 passando
- **Coverage:** 82.3% (antes: 82.1%) ✅

### Métricas de Redução

| Métrica | Antes | Depois | Redução |
|---------|-------|--------|---------|
| Linhas de Código | 10,400 | 9,850 | -550 (5.3%) |
| Arquivos | 81 | 79 | -2 |
| Imports | 245 | 230 | -15 |
| Funções | 230 | 218 | -12 |
| Classes | 45 | 40 | -5 |

### Economia Estimada

- **Tempo de build:** 2min 30s → 2min 15s (-15s, 10%)
- **Tempo de review:** Código 5% menor = review 5% mais rápido
- **Manutenibilidade:** Menos código para manter = menos bugs

### Registro

**Branch:** `cleanup/dead-code-20260702`
**Commits:** 3
**PR:** #1234
**Aprovado por:** tech-lead

**LOG-VALIDACOES.md:**
```markdown
| Data | Tipo | Itens Removidos | Testes | Coverage | Status |
|------|------|-----------------|--------|----------|--------|
| 2026-07-02 | Dead Code | 46 | ✅ | 82.3% | ✅ APROVADO |
```
```

---

## 📊 Output Estruturado (JSON)

```json
{
  "skill": "dead-code-eliminator",
  "projeto": "POLYMARKETING",
  "data": "2026-07-02T21:00:00Z",
  "agente": "backend-dev",
  
  "detecao": {
    "imports_nao_utilizados": 15,
    "variaveis_nao_usadas": 23,
    "funcoes_nao_chamadas": 12,
    "classes_nao_usadas": 5,
    "codigo_comentado": 34,
    "debug_statements": 8,
    "total": 97
  },
  
  "validacao": {
    "seguro_remover": 92,
    "requer_atencao": 5,
    "nao_remover": 0
  },
  
  "remocao": {
    "prioridade_imediata": {
      "itens": 46,
      "tempo": "1h 30min",
      "status": "concluído"
    },
    "prioridade_semana": {
      "itens": 17,
      "tempo": "3h",
      "status": "em progresso"
    }
  },
  
  "resultado": {
    "linhas_removidas": 550,
    "arquivos_removidos": 2,
    "reducao_percentual": "5.3%",
    "tempo_build_antes": "2min 30s",
    "tempo_build_depois": "2min 15s",
    "economia": "15s (10%)"
  },
  
  "validacao_final": {
    "testes_unitarios": "234/234",
    "testes_integracao": "45/45",
    "testes_e2e": "12/12",
    "coverage_antes": "82.1%",
    "coverage_depois": "82.3%",
    "status": "✅ APROVADO"
  },
  
  "tempo_total": "2h",
  "complexidade": "baixa"
}
```

---

## 🔗 Integrações

### Acionado Por
- `tech-lead` (em code reviews)
- `code-smell-detector` (como parte da análise)
- `backend-dev` / `frontend-dev` (ao solicitar limpeza)

### Aciona
- `naming-improver` (se encontrar nomes ruins durante remoção)
- `function-simplifier` (se encontrar código que pode ser simplificado ao invés de removido)

### Registra Em
- `.ai-factory/logs/dead-code/DEADCODE-YYYY-MM-DD.json`
- `.ai-factory/MELHORIAS/21-LIMPEZA/TAREFAS.md`
- `.ai-factory/MELHORIAS/LOG-VALIDACOES.md`

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem)  
**Tempo Médio:** 1-3h por limpeza  
**Taxa de Sucesso:** >99% (com validação adequada)