# Skill: Error Pattern Matcher

> Identificação automática de padrões de erro recorrentes em qualquer linguagem ou framework

---

## 🎯 Objetivo

Analisar logs de erro, stack traces e falhas para identificar padrões sistemáticos que indicam causas raiz comuns, permitindo fixes que resolvam múltiplos erros de uma vez.

---

## 🔁 Gatilhos de Acionamento

- Múltiplos erros similares reportados
- Logs de erro acumulados (> 10 erros)
- Solicitação de "analise padrões de erro"
- Antes de refatoração de tratamento de erros
- Monitoramento detecta pico de erros

---

## 📋 Processo de 5 Passos

### PASSO 1: COLETAR ERROS

**Objetivo:** Consolidar todos os erros relevantes

**Ações:**
1. Varre logs de aplicação (nível ERROR e WARN)
2. Coleta stack traces de sistemas de monitoramento
3. Agrupa erros por similaridade textual
4. Identifica frequência de cada padrão
5. Filtra ruído (erros únicos, irrelevantes)

**Fontes de Dados:**
- Arquivos de log (.log, .txt)
- Sistemas de monitoramento (Sentry, Datadog, New Relic)
- CI/CD pipelines (testes falhando)
- Reports de produção

**Output:**
```markdown
## Erros Coletados

**Período:** Últimas 48 horas
**Total de erros:** 247
**Erros únicos:** 15 padrões

**Top 5 Padrões:**
1. NullReferenceException (87 ocorrências)
2. TimeoutException (45 ocorrências)
3. ValidationError (32 ocorrências)
4. ConnectionRefused (28 ocorrências)
5. OutOfMemory (12 ocorrências)
```

---

### PASSO 2: IDENTIFICAR PADRÕES

**Objetivo:** Categorizar erros por tipo e causa comum

**Ações:**
1. Agrupar erros por categoria:
   - **Erros de Null/Undefined**: NullReference, NoneType, undefined is not
   - **Erros de Tipo**: TypeError, ClassCastException, invalid type
   - **Erros de Validação**: ValidationError, ConstraintViolation
   - **Erros de Concorrência**: RaceCondition, Deadlock, LockTimeout
   - **Erros de Resource**: OutOfMemory, FileNotFound, ConnectionPool
   - **Erros de Timeout**: RequestTimeout, SocketTimeout, GatewayTimeout
   - **Erros de Permissão**: Unauthorized, Forbidden, AccessDenied
   - **Erros de Integração**: APIError, WebServiceException, NetworkError

2. Para cada padrão, identificar:
   - Locais afetados (arquivo:linha)
   - Condições que disparam o erro
   - Frequência temporal (pico em horários específicos)

**Output:**
```markdown
## Padrão Identificado: NullReferenceException

**Frequência:** 87 ocorrências em 48h
**Locais Afetados:**
- `UserService.cs:42` (35 vezes)
- `OrderController.cs:78` (28 vezes)
- `PaymentService.cs:15` (15 vezes)
- `NotificationHelper.cs:92` (9 vezes)

**Condição Comum:**
Todos ocorrem quando método retorna null e código chamador não trata

**Horário de Pico:**
- 14:00-16:00 (horário comercial)
- 02:00-04:00 (batch processing)
```

---

### PASSO 3: MAPEAR CAUSAS COMUNS

**Objetivo:** Identificar causa raiz sistêmica

**Ações:**
1. Analisar cada padrão com 5 Whys
2. Identificar causa comum entre múltiplos erros
3. Mapear dependências entre erros
4. Classificar causa como:
   - **Input não validado**: Dados externos sem validação
   - **Estado inconsistente**: Objeto em estado inválido
   - **Race condition**: Concorrência não tratada
   - **Resource leak**: Recurso não liberado
   - **Configuração incorreta**: Settings errados
   - **Falha de integração**: Serviço externo indisponível
   - **Memory leak**: Acúmulo de memória não liberada

**Output:**
```markdown
## Causa Raiz Sistêmica

**Padrão:** NullReferenceException (87 ocorrências)

**Causa Comum:** Falta de validação de input em APIs públicas

**Análise 5 Whys:**
1. **Por que erro ocorre?** → Método retorna null
2. **Por que retorna null?** → Usuário não existe no banco
3. **Por que não existe?** → Input não validado antes de usar
4. **Por que não validado?** → Não há padrão de validação
5. **Por que não há padrão?** → Falta guideline de tratamento de erros

**Causa Raiz:** Ausência de padrão de validação de input

**Solução Sistêmica:** Implementar validação em todas as APIs públicas
```

---

### PASSO 4: RECOMENDAR FIXES

**Objetivo:** Propor fixes individuais e sistêmicos

**Ações:**
1. Para cada padrão, recomendar:
   - **Fix individual**: Corrige erro específico
   - **Fix sistêmico**: Previne classe inteira de erros
   - **Prevenção futura**: Evita recorrência

2. Priorizar por:
   - **Impacto**: Quantos erros resolve
   - **Esforço**: Tempo para implementar
   - **Risco**: Chance de introduzir bugs

**Output:**
```markdown
## Recomendações de Fix

### Fix Individual (Curto Prazo)

**Para UserService.cs:42:**
```csharp
// Antes
var email = user.Email;

// Depois
if (user == null)
{
    throw new UserNotFoundException(userId);
}
var email = user.Email;
```

**Tempo estimado:** 30min por local
**Total:** 4 locais × 30min = 2h

### Fix Sistêmico (Médio Prazo)

**Implementar Result Pattern:**
```csharp
public Result<User> GetUserById(int id)
{
    var user = _repository.GetById(id);
    if (user == null)
        return Result.Failure<User>("User not found");
    return Result.Success(user);
}
```

**Tempo estimado:** 8h
**Impacto:** Previne 100% de NullReference em APIs públicas

### Prevenção Futura

**Adicionar lint rule:**
```json
{
  "@typescript-eslint/no-unnecessary-condition": "error"
}
```

**Treinamento:** Workshop de tratamento de erros (2h)
**Documentação:** Atualizar CONTRIBUTING.md
```

---

### PASSO 5: PRIORIZAR E ATRIBUIR

**Objetivo:** Criar plano de ação priorizado

**Ações:**
1. Ordenar fixes por prioridade (impacto/esforço)
2. Atribuir para agentes responsáveis
3. Estimar tempo total
4. Definir critérios de sucesso

**Output:**
```markdown
## Plano de Ação

### Prioridade 1: Fix Individual (2h)
**Responsável:** backend-dev
**Tarefa:** MELHORIAS/02-DEBUGGING/TAREFAS.md → TAREFA X
**Critério de Sucesso:** 0 NullReference em produção por 7 dias

### Prioridade 2: Result Pattern (8h)
**Responsável:** architect + backend-dev
**Tarefa:** MELHORIAS/01-ARQUITETURA/TAREFAS.md → TAREFA Y
**Critério de Sucesso:** 90% das APIs públicas usando Result

### Prioridade 3: Lint Rules (1h)
**Responsável:** devops
**Tarefa:** MELHORIAS/10-CI-CD/TAREFAS.md → TAREFA Z
**Critério de Sucesso:** CI bloqueia PR sem validação de null

### Tempo Total Estimado:** 11h
### ROI:** 87 erros eliminados, redução de 95% em NullReference
```

---

## 📊 Output Estruturado (JSON)

```json
{
  "skill": "error-pattern-matcher",
  "data": "2026-07-02T15:45:00Z",
  "agente": "tech-lead",
  "periodo_analise": "48h",
  
  "resumo": {
    "total_erros": 247,
    "padroes_identificados": 15,
    "locais_afetados": 23,
    "impacto_usuarios": "alto"
  },
  
  "padroes": [
    {
      "nome": "NullReferenceException",
      "categoria": "Erros de Null/Undefined",
      "frequencia": 87,
      "percentual": 35.2,
      "locais": [
        {"arquivo": "UserService.cs", "linha": 42, "ocorrencias": 35},
        {"arquivo": "OrderController.cs", "linha": 78, "ocorrencias": 28}
      ],
      "causa_comum": "Falta de validação de input",
      "solucao_sistemica": "Implementar Result Pattern",
      "fix_individual": "Adicionar null checks",
      "prioridade": "alta",
      "esforco_estimado": "2h individual + 8h sistemico"
    },
    {
      "nome": "TimeoutException",
      "categoria": "Erros de Timeout",
      "frequencia": 45,
      "percentual": 18.2,
      "locais": [
        {"arquivo": "ExternalApiService.cs", "linha": 15, "ocorrencias": 45}
      ],
      "causa_comum": "Timeout muito baixo para API externa",
      "solucao_sistemica": "Implementar retry com backoff exponencial",
      "fix_individual": "Aumentar timeout de 5s para 30s",
      "prioridade": "media",
      "esforco_estimado": "4h"
    }
  ],
  
  "plano_acao": {
    "fixes_individuais": {
      "total": 4,
      "tempo_estimado": "2h",
      "responsavel": "backend-dev"
    },
    "fixes_sistemicos": {
      "total": 2,
      "tempo_estimado": "12h",
      "responsavel": "architect"
    },
    "prevencao": {
      "lint_rules": 2,
      "documentacao": 3,
      "treinamento": 1,
      "tempo_estimado": "3h"
    }
  },
  
  "metricas_esperadas": {
    "reducao_erros": "95%",
    "tempo_economizado": "10h/semana",
    "impacto_usuario": "alto"
  },
  
  "tempo_total": "2h 30min",
  "complexidade": "média"
}
```

---

## 🔗 Integrações

### Acionado Por
- `tech-lead` (ao identificar múltiplos erros similares)
- `qa-tester` (ao analisar relatórios de testes falhando)
- `backend-dev` / `frontend-dev` (ao investigar erros recorrentes)
- `security` (ao identificar padrão de vulnerabilidades)

### Aciona
- `systematic-debugging` (para investigar cada padrão em profundidade)
- `code-smell-detector` (se padrão indica code smell sistêmico)
- `refactoring-advisor` (para recomendar refatoração sistêmica)

### Registra Em
- `.ai-factory/logs/error-patterns/PADRAO-YYYY-MM-DD.json`
- `.ai-factory/MELHORIAS/02-DEBUGGING/TAREFAS.md`
- `.ai-factory/MELHORIAS/LOG-VALIDACOES.md`

---

## 📚 Exemplos de Uso

### Exemplo 1: Múltiplos Erros de Null

**Usuário diz:**
> "Error pattern matcher, analise estes 50 erros de NullReference"

**Skill faz:**
1. Coleta 50 erros de logs
2. Identifica 4 locais afetados
3. Mapeia causa comum: falta de validação
4. Recomenda Result Pattern
5. Cria 4 tarefas em MELHORIAS/

---

### Exemplo 2: Pico de Timeouts

**Usuário diz:**
> "Por que temos tantos timeouts às 14h?"

**Skill faz:**
1. Coleta erros por horário
2. Identifica pico às 14:00-16:00
3. Descobre: API externa lenta neste horário
4. Recomenda: cache + retry + circuit breaker
5. Atribui tarefa para `backend-dev`

---

## ✅ Checklist de Qualidade

Antes de marcar como concluído:

- [ ] Mínimo de 10 erros coletados
- [ ] Padrões agrupados por categoria
- [ ] Frequência calculada para cada padrão
- [ ] Locais afetados mapeados (arquivo:linha)
- [ ] Causa comum identificada com 5 Whys
- [ ] Fix individual recomendado
- [ ] Fix sistêmico recomendado
- [ ] Prevenção futura definida
- [ ] Plano de ação priorizado
- [ ] Tarefas criadas em MELHORIAS/
- [ ] V&V executado
- [ ] Registro JSON completo

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer linguagem)  
**Tempo Médio:** 1-3h por análise  
**Taxa de Sucesso:** >90% (com fixes sistêmicos)