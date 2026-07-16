---
name: root-cause-analyzer
category: general
complexity: high
agents: []
created: 2026-07-11
---

# Skill: Root Cause Analyzer

> Análise de causa raiz usando técnica dos 5 Whys para qualquer problema técnico

---

## 🎯 Objetivo

Aplicar a técnica dos "5 Whys" (5 Porquês) de forma sistemática para identificar a causa raiz verdadeira de problemas, indo além dos sintomas e evitando soluções superficiais.

---

## 🔁 Gatilhos de Acionamento

- Problema recorrente (mesmo erro > 3 vezes)
- Incidente crítico em produção
- Bug com impacto alto em usuários
- Solicitação de "encontre a causa raiz"
- Post-mortem de incidente

---

## 📋 Processo de 5 Passos

### PASSO 1: DEFINIR O PROBLEMA

**Objetivo:** Descrever o problema de forma clara e específica

**Ações:**
1. Coletar descrições do problema de múltiplas fontes
2. Separar fatos de opiniões
3. Quantificar impacto (usuários afetados, tempo, custo)
4. Definir critério de "problema resolvido"

**Técnica: 5W2H**
- **What:** O que está acontecendo?
- **When:** Quando ocorre?
- **Where:** Onde ocorre (ambiente, módulo)?
- **Who:** Quem é afetado?
- **Why (inicial):** Por que é um problema?
- **How:** Como se manifesta?
- **How much:** Qual o impacto?

**Output:**
```markdown
## Definição do Problema

**O que:** API de login retorna erro 500 intermitentemente
**Quando:** 15% das requisições, sem padrão horário claro
**Onde:** Produção, endpoint POST /api/login
**Quem:** 300 usuários afetados nas últimas 24h
**Por que é problema:** Usuários não conseguem acessar sistema
**Como:** Erro 500 com mensagem "Internal Server Error"
**Quanto:** 15% de falha, estimativa de R$ 50k/dia em vendas perdidas

**Critério de Sucesso:**
- Erro 500 reduzido para < 0.1%
- Nenhum usuário reportando problema de login
- Monitoramento estável por 7 dias
```

---

### PASSO 2: PRIMEIRO WHY (Sintoma → Causa Direta)

**Objetivo:** Identificar causa direta do sintoma

**Ações:**
1. Perguntar: "Por que [problema] ocorre?"
2. Buscar evidências concretas (logs, métricas)
3. Validar com dados (não suposições)
4. Documentar resposta

**Output:**
```markdown
## Why 1

**Pergunta:** Por que a API retorna erro 500?

**Evidências:**
- Stack trace: `NullReferenceException em UserService.Authenticate():linha 42`
- Log: `User not found for email: test@example.com`
- Métrica: Pico de erro coincide com aumento de tráfego

**Resposta:** Porque `UserService.Authenticate()` lança NullReferenceException quando usuário não existe

**Validação:** ✅ Confirmado em 100% dos erros (50/50 casos)

**Próxima Pergunta:** Por que NullReferenceException ocorre?
```

---

### PASSO 3: SEGUNDO WHY (Causa Direta → Causa Sistêmica)

**Objetivo:** Ir além da causa imediata

**Ações:**
1. Perguntar: "Por que [causa do Why 1] ocorre?"
2. Investigar condições que permitem a causa
3. Identificar falhas de processo ou design

**Output:**
```markdown
## Why 2

**Pergunta:** Por que NullReferenceException ocorre em UserService.Authenticate()?

**Evidências:**
- Código linha 42: `var email = user.Email;`
- Método `GetUserByEmail()` retorna null se usuário não existe
- Não há check de null antes de acessar `user.Email`

**Resposta:** Porque o código não verifica se `user` é null antes de acessar propriedades

**Validação:** ✅ Code review confirma: 0 de 5 chamadores faz check de null

**Próxima Pergunta:** Por que não há verificação de null?
```

---

### PASSO 4: TERCEIRO WHY (Causa Sistêmica → Processo)

**Objetivo:** Identificar falhas de processo

**Ações:**
1. Perguntar: "Por que [causa do Why 2] ocorre?"
2. Analisar processos de desenvolvimento
3. Identificar gaps em guidelines ou treinamento

**Output:**
```markdown
## Why 3

**Pergunta:** Por que não há verificação de null no código?

**Evidências:**
- Code review: 8 de 10 PRs sem validação de null
- Guidelines: CONTRIBUTING.md não menciona tratamento de null
- TypeScript: strictNullChecks está desativado no tsconfig.json
- Entrevista com time: "Não sabíamos que era obrigatório"

**Resposta:** Porque não há processo obrigatório de validação de null e TypeScript não está configurado para forçar

**Validação:** ✅ 100% do time confirma: nunca houve treinamento

**Próxima Pergunta:** Por que não há processo ou configuração?
```

---

### PASSO 5: QUARTO WHY (Processo → Cultura/Decisão)

**Objetivo:** Identificar causas culturais ou de decisão

**Ações:**
1. Perguntar: "Por que [causa do Why 3] existe?"
2. Analisar decisões arquiteturais passadas
3. Identificar trade-offs feitos

**Output:**
```markdown
## Why 4

**Pergunta:** Por que não há processo de validação de null ou TypeScript configurado?

**Evidências:**
- Histórico: Projeto começou como JavaScript (2020)
- Migração: TypeScript adotado em 2022, mas sem strict mode
- Decisão documentada: "Vamos ativar strict depois" (nunca feito)
- Priorização: Features sempre priorizadas sobre qualidade

**Resposta:** Porque decisão de adotar TypeScript strict foi postergada repetidamente em favor de features

**Validação:** ✅ Ata de reunião de 2022-03-15 confirma decisão

**Próxima Pergunta:** Por que qualidade foi postergada?
```

---

### PASSO 6: QUINTO WHY (Causa Raiz)

**Objetivo:** Chegar à causa raiz fundamental

**Ações:**
1. Perguntar: "Por que [causa do Why 4] persiste?"
2. Identificar causa raiz (geralmente cultural, de processo ou de priorização)
3. Validar que resolver isso previne recorrência

**Output:**
```markdown
## Why 5 (Causa Raiz)

**Pergunta:** Por que qualidade (strict TypeScript) foi postergada repetidamente?

**Evidências:**
- OKRs: 100% focados em entregas de features (0 em qualidade)
- Pressão: "Ship fast" vindo de leadership
- Medição: Bugs em produção não são métrica de performance
- Incentivo: Bônus atrelado a entregas, não a qualidade

**Resposta:** Porque sistema de incentivos e OKRs prioriza exclusivamente velocidade de entrega, não qualidade

**Causa Raiz:** Modelo mental "velocity over quality" + falta de métricas de qualidade

**Validação:** ✅ Resolver isso (mudar OKRs) previne recorrência de problemas similares
```

---

### PASSO 7: DEFINIR SOLUÇÕES

**Objetivo:** Criar ações corretivas para cada nível

**Ações:**
1. Para cada Why (1-5), definir solução correspondente
2. Priorizar soluções de níveis mais profundos (maior impacto)
3. Estimar esforço e impacto
4. Atribuir responsáveis

**Output:**
```markdown
## Soluções por Nível

### Nível 1 (Sintoma): Fix Imediato
**Ação:** Adicionar null check em UserService.Authenticate()
```typescript
if (user === null) {
  throw new UserNotFoundException(email);
}
```
**Responsável:** backend-dev
**Tempo:** 30min
**Impacto:** Resolve erro imediato

### Nível 2 (Causa Direta): Padronização
**Ação:** Adicionar null checks em todos os 5 chamadores de GetUserByEmail()
**Responsável:** backend-dev
**Tempo:** 2h
**Impacto:** Previne NullReference neste método

### Nível 3 (Processo): Guidelines + Configuração
**Ação 1:** Ativar strictNullChecks no tsconfig.json
**Ação 2:** Atualizar CONTRIBUTING.md com regra de validação
**Ação 3:** Adicionar lint rule `@typescript-eslint/no-unnecessary-condition`
**Responsável:** tech-lead + devops
**Tempo:** 4h
**Impacto:** Previne NullReference em TODO o código

### Nível 4 (Cultura): Treinamento
**Ação:** Workshop de TypeScript + tratamento de erros
**Responsável:** tech-lead
**Tempo:** 2h (preparação) + 2h (workshop)
**Impacto:** Time consciente de boas práticas

### Nível 5 (Causa Raiz): Mudança de Incentivos
**Ação 1:** Adicionar "Bugs em produção < 1%" como OKR
**Ação 2:** Incluir "Qualidade de código" em reviews de performance
**Ação 3:** Criar dashboard de qualidade (bugs, tech debt, coverage)
**Responsável:** product-owner + tech-lead
**Tempo:** 1 semana (mudança cultural)
**Impacto:** Previne TODOS problemas de qualidade futuros

---

## Plano de Ação Consolidado

| Prioridade | Ação | Responsável | Tempo | Impacto |
|------------|------|-------------|-------|---------|
| 🔴 Imediata | Fix UserService.Authenticate() | backend-dev | 30min | 100% dos erros atuais |
| 🔴 Curto | Ativar strictNullChecks | devops | 2h | Previne 80% de NullRef |
| 🟡 Médio | Treinamento TypeScript | tech-lead | 4h | Conscientização do time |
| 🟢 Longo | Mudar OKRs + incentivos | product-owner | 1 semana | Cultura de qualidade |

**Tempo Total:** 1 semana
**ROI:** Redução de 95% em bugs de null, economia de 10h/semana em firefighting
```

---

## 📊 Output Estruturado (JSON)

```json
{
  "skill": "root-cause-analyzer",
  "problema_id": "RCA-2026-001",
  "data": "2026-07-02T16:30:00Z",
  "facilitador": "tech-lead",
  
  "definicao_problema": {
    "o_que": "API retorna erro 500",
    "quando": "15% das requisições",
    "onde": "POST /api/login",
    "quem": "300 usuários/24h",
    "impacto": "R$ 50k/dia",
    "criterio_sucesso": "Erro < 0.1%, 7 dias estáveis"
  },
  
  "cinco_whys": [
    {
      "nivel": 1,
      "pergunta": "Por que API retorna erro 500?",
      "resposta": "NullReferenceException em UserService.Authenticate()",
      "evidencias": ["stack trace", "logs"],
      "validacao": true
    },
    {
      "nivel": 2,
      "pergunta": "Por que NullReferenceException ocorre?",
      "resposta": "Código não verifica null antes de acessar user.Email",
      "evidencias": ["codigo linha 42", "0 de 5 chamadores faz check"],
      "validacao": true
    },
    {
      "nivel": 3,
      "pergunta": "Por que não há verificação de null?",
      "resposta": "Não há processo obrigatório + TypeScript sem strict mode",
      "evidencias": ["CONTRIBUTING.md", "tsconfig.json", "entrevista"],
      "validacao": true
    },
    {
      "nivel": 4,
      "pergunta": "Por que não há processo ou configuração?",
      "resposta": "Decisão postergada em favor de features",
      "evidencias": ["ata de reunião 2022-03-15"],
      "validacao": true
    },
    {
      "nivel": 5,
      "pergunta": "Por que qualidade foi postergada?",
      "resposta": "OKRs e incentivos priorizam apenas velocidade",
      "evidencias": ["OKRs 2026", "politica de bonus"],
      "validacao": true,
      "causa_raiz": true
    }
  ],
  
  "solucoes": [
    {
      "nivel": 1,
      "acao": "Adicionar null check",
      "responsavel": "backend-dev",
      "tempo": "30min",
      "impacto": "Resolve erro imediato"
    },
    {
      "nivel": 3,
      "acao": "Ativar strictNullChecks",
      "responsavel": "devops",
      "tempo": "2h",
      "impacto": "Previne 80% de NullRef"
    },
    {
      "nivel": 5,
      "acao": "Adicionar OKR de qualidade",
      "responsavel": "product-owner",
      "tempo": "1 semana",
      "impacto": "Cultura de qualidade"
    }
  ],
  
  "metricas_esperadas": {
    "reducao_erros": "95%",
    "tempo_economizado": "10h/semana",
    "custo_evitado": "R$ 350k/semana"
  },
  
  "tempo_total": "1 semana",
  "complexidade": "alta"
}
```

---

## 🔗 Integrações

### Acionado Por
- `tech-lead` (para incidentes críticos)
- `security` (para vulnerabilidades exploradas)
- `product-owner` (para problemas de negócio)
- `qa-tester` (para bugs recorrentes)

### Aciona
- `systematic-debugging` (se causa raiz é bug técnico)
- `adr-generator` (se solução requer decisão arquitetural)
- `architecture-analyzer` (se causa raiz é arquitetura)

### Registra Em
- `.ai-factory/logs/root-cause-analysis/RCA-YYYY-NNN.json`
- `.ai-factory/MELHORIAS/02-DEBUGGING/TAREFAS.md`
- `.ai-factory/MELHORIAS/LOG-VALIDACOES.md`

---

## 📚 Exemplos de Uso

### Exemplo 1: Incidente de Produção

**Usuário diz:**
> "Root cause analyzer, investigue incidente de ontem (2h de indisponibilidade)"

**Skill faz:**
1. Define problema: "API indisponível por 2h"
2. Executa 5 Whys
3. Identifica causa raiz: deploy sem rollback automático
4. Recomenda: implementar pipeline com rollback automático
5. Cria tarefas em MELHORIAS/10-CI-CD/

---

### Exemplo 2: Bug Recorrente

**Usuário diz:**
> "Este bug de checkout já ocorreu 5 vezes. Qual a causa raiz?"

**Skill faz:**
1. Define problema: "Checkout falha 5 vezes em 2 semanas"
2. Executa 5 Whys
3. Identifica causa raiz: teste de integração não cobre caso de borda
4. Recomenda: adicionar teste + review de cobertura
5. Atribui para `qa-tester`

---

## ✅ Checklist de Qualidade

Antes de marcar como concluído:

- [ ] Problema definido com 5W2H
- [ ] Impacto quantificado (números, não opiniões)
- [ ] 5 Whys executados (ou até causa raiz ser encontrada)
- [ ] Cada Why validado com evidências concretas
- [ ] Causa raiz identificada (não sintoma)
- [ ] Soluções definidas para cada nível
- [ ] Plano de ação priorizado
- [ ] Responsáveis atribuídos
- [ ] Critério de sucesso claro
- [ ] V&V executado
- [ ] Registro JSON completo

---

**Versão:** 1.0.0  
**Universal:** Sim (aplicável a qualquer domínio)  
**Tempo Médio:** 2-4h por análise  
**Taxa de Sucesso:** >90% (quando causa raiz é abordada)