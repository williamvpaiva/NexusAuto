---
name: systematic-debugging
category: testing
complexity: high
agents: []
created: 2026-07-11
---

# Skill: Systematic Debugging

> Método científico de depuração aplicável a QUALQUER linguagem ou framework

---

## 🎯 Objetivo

Aplicar abordagem sistemática e reproduzível para identificação e correção de bugs, eliminando adivinhação e garantindo que a causa raiz seja encontrada e prevenida.

---

## 🔁 Gatilhos de Acionamento

- Bug reportado em produção
- Teste falhando consistentemente
- Comportamento inesperado detectado
- Erro recorrente em logs
- Solicitação de "investigar este erro"

---

## 📋 Processo de 6 Passos

### PASSO 1: REPRODUZIR

**Objetivo:** Criar cenário mínimo e reproduzível

**Ações:**
1. Coletar relatório completo do bug
2. Identificar condições necessárias para reproduzir
3. Criar teste unitário que falha (TDD: Red phase)
4. Documentar passos exatos de reprodução
5. Isolar variáveis (remover ruído)

**Output:**
```markdown
## Cenário de Reprodução

**Passos:**
1. [passo 1]
2. [passo 2]
3. [erro ocorre]

**Teste criado:** `tests/BUG-001-repro.test.js`
**Status:** ❌ Falhando (como esperado)
```

---

### PASSO 2: OBSERVAR

**Objetivo:** Coletar evidências objetivas

**Ações:**
1. Capturar stack trace completo
2. Coletar logs relevantes (nível DEBUG)
3. Identificar sintomas visíveis
4. Medir comportamento (timing, memória, CPU)
5. Comparar com comportamento esperado

**Ferramentas:**
- Debugger (breakpoints)
- Logging estruturado
- Profiling (se performance)
- Network inspection (se API)

**Output:**
```markdown
## Evidências Coletadas

**Stack Trace:**
```
[stack trace completo]
```

**Logs Relevantes:**
```
[logs filtrados]
```

**Sintomas:**
- Sintoma 1
- Sintoma 2

**Métricas:**
- Tempo: X ms (esperado: Y ms)
- Memória: X MB (esperado: Y MB)
```

---

### PASSO 3: HIPOTETIZAR

**Objetivo:** Listar causas possíveis com raciocínio documentado

**Ações:**
1. Brainstorm de 3-5 causas possíveis
2. Ordenar por probabilidade (mais provável primeiro)
3. Para cada hipótese:
   - Descrever mecanismo causal
   - Identificar evidências que suportam
   - Identificar evidências que contradizem
   - Definir teste para confirmar/rejeitar

**Output:**
```markdown
## Hipóteses

### Hipótese 1 (Probabilidade: ALTA)
**Causa:** Null reference em `userService.getUser()`
**Mecanismo:** Usuário não existe, retorna null, código não trata
**Evidências a favor:**
- Stack trace aponta linha 42
- Linha 42 chama `.email` em objeto potencialmente null
**Evidências contra:**
- Nenhuma
**Teste:** Adicionar check `if (user === null)` e ver se erro persiste

### Hipótese 2 (Probabilidade: MÉDIA)
**Causa:** Race condition na busca do usuário
**Mecanismo:** Dois requests simultâneos, segundo pega estado inconsistente
**Evidências a favor:**
- Erro ocorre apenas sob carga
**Evidências contra:**
- Erro também ocorre em ambiente de dev sem carga
**Teste:** Simular requests simultâneos

### Hipótese 3 (Probabilidade: BAIXA)
...
```

---

### PASSO 4: EXPERIMENTAR

**Objetivo:** Testar hipóteses sistematicamente

**Ações:**
1. Começar pela hipótese mais provável
2. Criar experimento controlado
3. Executar teste
4. Registrar resultado objetivamente
5. Se confirmada → ir para PASSO 5
6. Se rejeitada → iterar para próxima hipótese

**Output:**
```markdown
## Experimentos

### Experimento 1: Testar Hipótese 1
**Ação:** Adicionar null check antes de acessar `.email`
```javascript
if (user === null) {
  throw new UserNotFoundError(userId);
}
```
**Resultado:** ✅ Erro desapareceu
**Conclusão:** Hipótese 1 CONFIRMADA

### Experimento 2: (não necessário)
```

---

### PASSO 5: CONCLUIR

**Objetivo:** Documentar causa raiz e fix aplicado

**Ações:**
1. Descrever causa raiz claramente
2. Documentar fix aplicado
3. Explicar por que este fix resolve
4. Identificar lições aprendidas
5. Compartilhar com time (se relevante)

**Output:**
```markdown
## Conclusão

**Causa Raiz:**
`userService.getUser()` retorna `null` quando usuário não existe, e o código chamador não trata este caso, acessando `.email` em null.

**Fix Aplicado:**
```javascript
// Antes
const email = user.email;

// Depois
if (!user) {
  throw new UserNotFoundError(userId);
}
const email = user.email;
```

**Por que resolve:**
O check explícito previne acesso a propriedade de null e lança erro semântico.

**Lição Aprendida:**
- Sempre tratar caso de retorno null/undefined
- Preferir Result/Either pattern para erros esperados
- Adicionar TypeScript strict null checks
```

---

### PASSO 6: PREVENIR

**Objetivo:** Garantir que bug não retorne

**Ações:**
1. Criar teste de regressão permanente
2. Adicionar teste ao suite principal
3. Verificar se há padrões similares no código
4. Atualizar documentação (se necessário)
5. Adicionar lint rule (se aplicável)

**Output:**
```markdown
## Prevenção

**Teste de Regressão Criado:**
`tests/user-service.test.ts` → `should throw UserNotFoundError when user does not exist`

**Padrões Similares Verificados:**
- [x] Verificar todos os chamadores de `getUser()`
- [x] Verificar todos os acessos a propriedades de objetos potencialmente null

**Documentação Atualizada:**
- [x] JSDoc de `getUser()` atualizado
- [x] README de UserService atualizado

**Lint Rules:**
- [ ] Adicionar regra `@typescript-eslint/no-unnecessary-condition`

**Checklist V&V:**
- [x] Teste de regressão passa
- [x] Suite completa passa
- [x] Sem mudanças fora do escopo
- [x] Performance não degradada
```

---

## 📊 Output Estruturado (JSON)

```json
{
  "skill": "systematic-debugging",
  "bug_id": "BUG-001",
  "data": "2026-07-02T14:30:00Z",
  "agente": "backend-dev",
  
  "reproducao": {
    "teste_criado": "tests/BUG-001-repro.test.js",
    "passos": ["1", "2", "3"],
    "status": "reproduzido"
  },
  
  "observacao": {
    "stack_trace": "UserService.ts:42 → ...",
    "logs": ["log1", "log2"],
    "sintomas": ["sintoma1", "sintoma2"],
    "metricas": {"tempo_ms": 150, "memoria_mb": 45}
  },
  
  "hipoteses": [
    {
      "id": 1,
      "descricao": "Null reference",
      "probabilidade": "ALTA",
      "confirmada": true
    }
  ],
  
  "experimentos": [
    {
      "hipotese_id": 1,
      "acao": "Adicionar null check",
      "resultado": "confirmado"
    }
  ],
  
  "conclusao": {
    "causa_raiz": "Acesso a propriedade de objeto null",
    "fix_aplicado": "Adicionar check explícito",
    "licao_aprendida": "Sempre tratar null"
  },
  
  "prevencao": {
    "teste_regressao": "tests/user-service.test.ts",
    "padroes_verificados": 5,
    "documentacao_atualizada": true,
    "lint_rules_adicionadas": []
  },
  
  "vv_protocol": {
    "integridade": "✅",
    "integracao": "✅",
    "regressao": "✅",
    "edge_cases": "✅",
    "ambientes": "✅",
    "performance": "✅",
    "validacao_final": "✅",
    "ciclos_correcao": 1
  },
  
  "tempo_total": "45min",
  "complexidade": "média"
}
```

---

## 🔗 Integrações

### Acionado Por
- `tech-lead` (ao identificar bug crítico)
- `qa-tester` (ao reportar bug)
- `backend-dev` / `frontend-dev` (ao encontrar bug próprio)
- `security` (ao identificar vulnerabilidade explorável)

### Aciona
- `regression-test-generator` (para criar teste permanente)
- `error-pattern-matcher` (se bug parece ser parte de padrão)
- `debug-session-recorder` (para gravar sessão completa)

### Registra Em
- `.ai-factory/logs/debug-sessions/BUG-001.json`
- `.ai-factory/MELHORIAS/02-DEBUGGING/TAREFAS.md`
- `.ai-factory/MELHORIAS/LOG-VALIDACOES.md`

---

## 📚 Exemplos de Uso

### Exemplo 1: Bug em Produção

**Usuário diz:**
> "Tech Lead, usuários estão recebendo erro 500 ao fazer login"

**Tech Lead faz:**
1. Aciona `systematic-debugging` com `backend-dev`
2. Skill executa 6 passos
3. Identifica causa: token expirado não tratado
4. Cria fix + teste de regressão
5. Registra em `debug-sessions/BUG-login-500.json`
6. Atualiza `INDEX.md` → tarefa 🟢

---

### Exemplo 2: Teste Falhando

**Usuário diz:**
> "Teste `user-service.test.ts` está falhando"

**Tech Lead faz:**
1. Aciona `systematic-debugging` com `qa-tester`
2. Skill reproduz teste falhando
3. Identifica: ordem dos testes afetando estado
4. Fix: isolar estado com `beforeEach()`
5. Cria teste para prevenir regressão

---

## ✅ Checklist de Qualidade

Antes de marcar como concluído:

- [ ] Cenário de reprodução documentado
- [ ] Teste de reprodução criado
- [ ] Stack trace e logs coletados
- [ ] Mínimo 3 hipóteses listadas
- [ ] Hipóteses ordenadas por probabilidade
- [ ] Experimentos documentados
- [ ] Causa raiz identificada claramente
- [ ] Fix aplicado e testado
- [ ] Teste de regressão criado
- [ ] Padrões similares verificados
- [ ] V&V executado (7 passos)
- [ ] Registro JSON completo

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem)  
**Tempo Médio:** 30-60min por bug  
**Taxa de Sucesso:** >95% (com V&V)