# 🛡️ Protocolo V&V — Verificação e Validação

> **REGRA CRÍTICA:** Nenhuma alteração pode ser considerada concluída sem passar pelo processo V&V.

---

## 🔁 CICLO V&V — 7 Passos Obrigatórios

Após **CADA** mudança no código, estrutura ou configuração:

### PASSO 1 — 🧪 TESTE DE INTEGRIDADE
- [ ] Código compila/transpila sem erros
- [ ] Sem erros de sintaxe, tipagem ou imports
- [ ] Todas as dependências resolvidas

### PASSO 2 — 🔗 TESTE DE INTEGRAÇÃO
- [ ] Módulos dependentes continuam funcionando
- [ ] Interfaces/contratos não foram quebrados
- [ ] Chamadas de API/funções mantêm compatibilidade

### PASSO 3 — 🔄 TESTE DE REGRESSÃO
- [ ] Funcionalidades existentes continuam OK
- [ ] Fluxos completos do usuário não afetados
- [ ] Comportamento antes × depois comparado

### PASSO 4 — 🧨 EDGE CASES E CENÁRIOS EXTREMOS
- [ ] Dados vazios, nulos, undefined testados
- [ ] Dados muito grandes (overflow) testados
- [ ] Entrada maliciosa (XSS, injection) testada
- [ ] Concorrência e race conditions (se aplicável)
- [ ] Timeout e falha de rede (se aplicável)

### PASSO 5 — 📱 AMBIENTES E PLATAFORMAS
- [ ] Compatibilidade entre ambientes (dev, staging, prod)
- [ ] Compatibilidade entre navegadores/devices (frontend)
- [ ] Variáveis de ambiente corretas

### PASSO 6 — ⚡ PERFORMANCE E SIDE EFFECTS
- [ ] Sem degradação de performance
- [ ] Sem memory leaks
- [ ] Sem loops infinitos ou recursões
- [ ] Sem duplicação de processos ou listeners

### PASSO 7 — ✅ VALIDAÇÃO FINAL E REGISTRO
- [ ] Mudança documentada
- [ ] Testes executados registrados
- [ ] Resultado: ✅ PASSOU / ❌ FALHOU
- [ ] Se FALHOU: corrigir e repetir do PASSO 1

---

## ⛔ REGRAS DE BLOQUEIO (STOP RULES)

1. **NÃO** avançar para próxima tarefa se V&V não passou
2. **NÃO** avançar para próxima etapa se alguma tarefa tem V&V pendente
3. **NÃO** marcar tarefa como 🟢 sem RELATÓRIO V&V preenchido
4. **NÃO** ignorar falha no V&V — SEMPRE corrigir e re-testar
5. **NÃO** acumular alterações sem V&V — testar CADA uma individualmente
6. Se o mesmo erro aparecer 3+ vezes, criar TAREFA NOVA para causa raiz

---

## 📄 RELATÓRIO V&V (Modelo para TAREFAS.md)

```markdown
#### 🛡️ RELATÓRIO V&V (Verificação & Validação)

| # | Verificação                              | Status | Observações        |
|---|------------------------------------------|--------|--------------------|
| 1 | 🧪 Integridade (compila sem erros)       | ⬜     |                    |
| 2 | 🔗 Integração (módulos dependentes OK)   | ⬜     |                    |
| 3 | 🔄 Regressão (funcionalidades mantidas)  | ⬜     |                    |
| 4 | 🧨 Edge Cases (cenários extremos)        | ⬜     |                    |
| 5 | 📱 Ambientes (compatibilidade)           | ⬜     |                    |
| 6 | ⚡ Performance (sem degradação)           | ⬜     |                    |
| 7 | ✅ Validação Final                        | ⬜     |                    |

**Resultado V&V:** ⬜ NÃO EXECUTADO / ✅ APROVADO / ❌ REPROVADO  
**Ciclos de correção:** 0  
**Erros encontrados e corrigidos:**
> Nenhum / Lista de erros

⚠️ Status da tarefa SÓ pode ser 🟢 se Resultado V&V = ✅ APROVADO
```

---

## 📊 LOG-VALIDACOES.md (Histórico Global)

Manter em `MELHORIAS/LOG-VALIDACOES.md`:

```markdown
# 📄 Log de Validações V&V

| #  | Data       | Área          | Tarefa          | Resultado | Ciclos | Erros  |
|----|------------|---------------|-----------------|-----------|--------|--------|
| 1  | DD/MM/AAAA | 01-Arquitetura| Tarefa 1        | ✅        | 1      | 0      |
| 2  | DD/MM/AAAA | 01-Arquitetura| Tarefa 2        | ✅        | 3      | 2      |

### 📊 Métricas de Qualidade
- Total de validações executadas: X
- Taxa de aprovação na 1ª tentativa: Y%
- Média de ciclos por tarefa: Z
- Erros mais comuns: [lista]
- Áreas com mais retrabalho: [lista]
```

---

## 🔁 FLUXO DE DECISÃO V&V

```
  ┌──────────────────┐
  │ ALTERAÇÃO FEITA  │
  └────────┬─────────┘
           ▼
  ┌──────────────────┐
  │ PASSO 1:         │
  │ Teste Integridade│──── ❌ FALHOU ──→ CORRIGIR → Voltar ao PASSO 1
  └────────┬─────────┘
           ▼ ✅
  ┌──────────────────┐
  │ PASSO 2:         │
  │ Teste Integração │──── ❌ FALHOU ──→ CORRIGIR → Voltar ao PASSO 1
  └────────┬─────────┘
           ▼ ✅
  ┌──────────────────┐
  │ PASSO 3:         │
  │ Teste Regressão  │──── ❌ FALHOU ──→ CORRIGIR → Voltar ao PASSO 1
  └────────┬─────────┘
           ▼ ✅
  ┌──────────────────┐
  │ PASSO 4:         │
  │ Teste Edge Cases │──── ❌ FALHOU ──→ CORRIGIR → Voltar ao PASSO 1
  └────────┬─────────┘
           ▼ ✅
  ┌──────────────────┐
  │ PASSO 5:         │
  │ Teste Ambientes  │──── ❌ FALHOU ──→ CORRIGIR → Voltar ao PASSO 1
  └────────┬─────────┘
           ▼ ✅
  ┌──────────────────┐
  │ PASSO 6:         │
  │ Teste Performance│──── ❌ FALHOU ──→ CORRIGIR → Voltar ao PASSO 1
  └────────┬─────────┘
           ▼ ✅
  ┌──────────────────────────────────────────────┐
  │ PASSO 7: VALIDAÇÃO FINAL                     │
  │                                               │
  │ ✅ Registrar no RELATÓRIO V&V da tarefa       │
  │ ✅ Registrar no LOG-VALIDACOES.md             │
  │ ✅ Atualizar status da tarefa para 🟢         │
  │ ✅ Recalcular % no INDEX.md                   │
  │ ✅ LIBERADO para próxima tarefa               │
  └───────────────────────────────────────────────┘
```

---

## 📌 INTEGRAÇÃO COM WORKFLOWS EXISTENTES

### Bugfix Workflow
Adicionar em `.ai-factory/workflows/bugfix.md`:

```markdown
## Stage 3 - Fix (ATUALIZADO)

**Gate V&V Obrigatório:**
- [ ] RELATÓRIO V&V preenchido com ✅ APROVADO
- [ ] Registro em LOG-VALIDACOES.md
- [ ] Ciclos de correção documentados
```

### New Feature Workflow
Adicionar em `.ai-factory/workflows/new-feature.md`:

```markdown
## Stage 4 - Validação (ATUALIZADO)

**V&V Obrigatório:**
- Executar ciclo V&V completo (7 passos)
- Registrar em TAREFAS.md e LOG-VALIDACOES.md
- Só marcar como 🟢 com V&V ✅ APROVADO
```

---

## 🎯 MÉTRICAS V&V

### KPIs de Qualidade
- **Taxa de Aprovação V&V:** `(✅ Aprovados / Total) × 100`
- **Média de Ciclos por Tarefa:** `Total de Ciclos / Total de Tarefas`
- **Bugs Capturados pelo V&V:** Contagem de erros encontrados antes de avançar
- **Retrabalho por Área:** Áreas com mais ciclos de correção

### Meta
- Taxa de aprovação na 1ª tentativa: **> 85%**
- Média de ciclos por tarefa: **< 1.5**
- Bugs capturados antes de produção: **100%**