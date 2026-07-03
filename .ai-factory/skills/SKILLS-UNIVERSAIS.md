# 🧠 Skills Universais de Engenharia de Software

> Skills especializadas para depuração, arquitetura e simplificação de código
> **Universal:** Funciona em QUALQUER projeto (Node, Python, Java, Go, etc.)

---

## 📋 Índice de Skills

### 🔍 Depuração (Debug)
1. `systematic-debugging` - Método científico de debug
2. `error-pattern-matcher` - Identificação de padrões de erro
3. `root-cause-analyzer` - Análise de causa raiz (5 Whys)
4. `debug-session-recorder` - Gravação de sessões de debug
5. `edge-case-detector` - Detecção de edge cases
6. `regression-test-generator` - Geração de testes de regressão

### 🏗️ Arquitetura de Software
7. `architecture-analyzer` - Análise de arquitetura existente
8. `pattern-matcher` - Identificação de padrões de projeto
9. `coupling-detector` - Detecção de acoplamento excessivo
10. `adr-generator` - Geração automática de ADRs
11. `tech-debt-calculator` - Cálculo de dívida técnica
12. `modularity-optimizer` - Otimização de modularidade

### 🧹 Simplificação de Código
13. `code-smell-detector` - Detecção de code smells
14. `refactoring-advisor` - Recomendação de refatoração
15. `complexity-analyzer` - Análise de complexidade ciclomática
16. `dead-code-eliminator` - Eliminação de código morto
17. `naming-improver` - Melhoria de nomenclatura
18. `function-simplifier` - Simplificação de funções

---

## 🔍 SKILL 1: Systematic Debugging

### Objetivo
Aplicar método científico para debug de bugs em qualquer linguagem.

### Implementação

```markdown
# Skill: systematic-debugging

## Trigger
- Bug reportado
- Teste falhando
- Comportamento inesperado
- Erro em produção

## Capacidades
1. **Reproduzir**
   - Isolar cenário mínimo
   - Criar teste que falha
   - Documentar passos exatos

2. **Observar**
   - Coletar logs relevantes
   - Capturar stack trace
   - Identificar sintomas

3. **Hipotetizar**
   - Listar 3-5 causas possíveis
   - Ordenar por probabilidade
   - Documentar raciocínio

4. **Experimentar**
   - Testar hipótese mais provável
   - Registrar resultado
   - Iterar para próxima hipótese

5. **Concluir**
   - Identificar causa raiz
   - Documentar aprendizado
   - Criar teste de regressão

6. **Prevenir**
   - Adicionar teste permanente
   - Atualizar documentação
   - Compartilhar aprendizado

## Output Estruturado
```json
{
  "bug_id": "BUG-001",
  "sintomas": ["lista de sintomas"],
  "causa_raiz": "descrição da causa",
  "hipoteses_testadas": [
    {"hipotese": "...", "resultado": "confirmado/rejeitado"}
  ],
  "fix_aplicado": "descrição do fix",
  "teste_regressao": "caminho do teste criado",
  "licao_aprendida": "o que aprendemos"
}
```

## Integração
- Acionado por: `tech-lead`, `qa-tester`, `backend-dev`, `frontend-dev`
- Aciona: `regression-test-generator`, `debug-session-recorder`
- Registra em: `.ai-factory/logs/debug-sessions/`
```

---

## 🔍 SKILL 2: Error Pattern Matcher

### Objetivo
Identificar padrões de erro recorrentes em qualquer código.

### Implementação

```markdown
# Skill: error-pattern-matcher

## Trigger
- Múltiplos erros similares
- Logs de erro acumulados
- Solicitação de análise de padrões

## Capacidades
1. **Coletar Erros**
   - Varre logs de erro
   - Agrupa por similaridade
   - Identifica frequência

2. **Identificar Padrões**
   - Erros de null/undefined
   - Erros de tipo
   - Erros de concorrência
   - Erros de resource leak
   - Erros de timeout

3. **Mapear Causas Comuns**
   - Input não validado
   - Race condition
   - Memory leak
   - Configuração incorreta

4. **Recomendar Fixes Sistemáticos**
   - Fix individual (cada erro)
   - Fix sistêmico (causa raiz)
   - Prevenção futura

## Output Estruturado
```json
{
  "padroes_identificados": [
    {
      "padrao": "NullReferenceException",
      "frequencia": 15,
      "loc_afetados": ["arquivo1:linha10", "arquivo2:linha25"],
      "causa_comum": "Falta de validação de input",
      "fix_sistemico": "Adicionar null checks em todas as APIs públicas"
    }
  ],
  "prioridade_fix": "alta/media/baixa",
  "estimativa_esforco": "4h"
}
```

## Integração
- Acionado por: `tech-lead`, `security`
- Aciona: `systematic-debugging` para cada padrão
- Registra em: `.ai-factory/logs/error-patterns/`
```

---

## 🏗️ SKILL 7: Architecture Analyzer

### Objetivo
Analisar arquitetura de qualquer projeto e identificar gaps.

### Implementação

```markdown
# Skill: architecture-analyzer

## Trigger
- Novo projeto inserido
- Solicitação de auditoria arquitetural
- Antes de grandes refatorações

## Capacidades
1. **Mapear Estrutura Atual**
   - Identificar camadas (presentation, business, data)
   - Mapear dependências entre módulos
   - Identificar padrões usados

2. **Avaliar Princípios SOLID**
   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

3. **Identificar Anti-Patterns**
   - God classes
   - Circular dependencies
   - Tight coupling
   - Spaghetti code
   - Big Ball of Mud

4. **Gerar Diagramas**
   - Component diagram
   - Dependency graph
   - Data flow diagram

5. **Recomendar Melhorias**
   - Priorizadas por impacto
   - Com estimativa de esforço
   - Com exemplos de código

## Output Estruturado
```json
{
  "arquitetura_atual": {
    "padrao_identificado": "MVC / Clean / Hexagonal",
    "camadas": ["presentation", "business", "data"],
    "modulos": 12,
    "acoplamento": "alto/medio/baixo"
  },
  "violacoes_solid": [
    {
      "principio": "Single Responsibility",
      "loc": "UserService.cs:45",
      "descricao": "Classe com 5 responsabilidades"
    }
  ],
  "anti_patterns": [
    {
      "nome": "God Class",
      "loc": "OrderManager.cs",
      "linhas": 850,
      "impacto": "alto"
    }
  ],
  "recomendacoes": [
    {
      "acao": "Extrair PaymentService de OrderManager",
      "impacto": "alto",
      "esforco": "8h",
      "prioridade": "alta"
    }
  ],
  "diagramas_gerados": [
    "diagrama-componentes.md",
    "grafo-dependencias.md"
  ]
}
```

## Integração
- Acionado por: `tech-lead`, `architect`
- Aciona: `adr-generator`, `coupling-detector`
- Registra em: `.ai-factory/logs/architecture-analysis/`
```

---

## 🏗️ SKILL 10: ADR Generator

### Objetivo
Gerar Architecture Decision Records automaticamente.

### Implementação

```markdown
# Skill: adr-generator

## Trigger
- Decisão arquitetural tomada
- Mudança significativa de estrutura
- Nova tecnologia adotada

## Template ADR
```markdown
# ADR-{numero}: {Título}

## Status
✅ Aprovado | 🔄 Em discussão | ❌ Rejeitado

## Contexto
{Qual problema estamos resolvendo?}

## Decisão
{O que decidimos fazer?}

## Alternativas Consideradas

### Alternativa A
**Prós:**
- Pró 1
- Pró 2

**Contras:**
- Contra 1
- Contra 2

### Alternativa B
...

## Consequências

### Positivas
- Benefício 1
- Benefício 2

### Negativas (Trade-offs)
- Custo 1
- Custo 2

## Compliance
- [ ] Alinhado com princípios de arquitetura
- [ ] Revisado por tech lead
- [ ] Documentado em arquitetura.md

## Referências
- Link para discussões
- Link para RFCs
- Link para documentação
```

## Output Estruturado
```json
{
  "adr_numero": "001",
  "titulo": "Adoção de Microservices",
  "status": "aprovado",
  "decisores": ["tech-lead", "architect"],
  "data_decisao": "2026-07-02",
  "alternativas": 3,
  "trade_offs_documentados": true,
  "caminho_arquivo": ".ai-factory/adr/ADR-001.md"
}
```

## Integração
- Acionado por: `architect`, `tech-lead`
- Registra em: `.ai-factory/adr/`
```

---

## 🧹 SKILL 13: Code Smell Detector

### Objetivo
Identificar automaticamente code smells em qualquer linguagem.

### Implementação

```markdown
# Skill: code-smell-detector

## Trigger
- Code review solicitado
- Antes de merge
- Auditoria de qualidade
- Refatoração planejada

## Code Smells Detectados

### Bloaters
- **Long Method**: > 20 linhas
- **Large Class**: > 300 linhas
- **Primitive Obsession**: Uso excessivo de primitivos
- **Long Parameter List**: > 4 parâmetros

### Change Dispatchers
- **Divergent Change**: Classe muda por razões diferentes
- **Shotgun Surgery**: Mudança em muitos arquivos
- **Parallel Inheritance**: Hierarquias espelhadas

### Data Organizers
- **Data Clump**: Dados sempre juntos
- **Data Class**: Só campos, sem comportamento
- **Temporary Field**: Campos usados às vezes

### Conditionals
- **Switch Statements**: Muitos ifs/switches
- **Complex Conditional**: Condições complexas
- **Duplicate Conditionals**: Condições repetidas

### OOP Abusers
- **Refused Bequest**: Subclasse rejeita métodos
- **Alternative Classes**: Interfaces diferentes
- **Lazy Class**: Classe faz pouco

### Couplers
- **Feature Envy**: Método usa dados de outra classe
- **Inappropriate Intimacy**: Classes muito acopladas
- **Message Chains**: a.getB().getC().doSomething()
- **Middle Man**: Só delega

## Métricas Calculadas
- Complexidade Ciclomática
- Acoplamento Aferente/Eferente
- Coesão (LCOM)
- Linhas de Código
- Profundidade de Herança

## Output Estruturado
```json
{
  "smells_identificados": [
    {
      "tipo": "Long Method",
      "loc": "UserService.createUser:15",
      "linhas": 45,
      "severidade": "alta",
      "recomendacao": "Extrair validateUser(), hashPassword(), saveUser()"
    },
    {
      "tipo": "Feature Envy",
      "loc": "Order.getTotal():8",
      "inveja_de": "Money",
      "recomendacao": "Mover lógica para Money.calculateTotal()"
    }
  ],
  "metricas": {
    "complexidade_media": 8.5,
    "acoplamento_medio": 0.65,
    "coesao_media": 0.72
  },
  "prioridade_refatoracao": [
    {"smell": "Long Method", "impacto": "alto", "esforco": "2h"}
  ]
}
```

## Integração
- Acionado por: `tech-lead`, `backend-dev`, `frontend-dev`
- Aciona: `refactoring-advisor`
- Registra em: `.ai-factory/logs/code-smells/`
```

---

## 🧹 SKILL 14: Refactoring Advisor

### Objetivo
Recomendar técnicas de refatoração específicas para cada smell.

### Implementação

```markdown
# Skill: refactoring-advisor

## Trigger
- Code smell detectado
- Solicitação de refatoração
- Dívida técnica identificada

## Catálogo de Refatoração

### Composição de Métodos
- **Extract Method**: Quebrar método grande
- **Extract Class**: Mover parte para nova classe
- **Extract Variable**: Substituir expressão por variável
- **Inline Method**: Método simples em um lugar

### Movimento de Código
- **Move Method**: Método usado em outra classe
- **Move Field**: Campo usado em outra classe
- **Pull Up**: Mover para superclasse
- **Push Down**: Mover para subclasse

### Organização de Dados
- **Replace Primitive with Value Object**
- **Replace Array with Object**
- **Replace Type Code with Class**
- **Replace Conditional with Polymorphism**

### Simplificação de Condicionais
- **Decompose Conditional**
- **Replace Nested Conditional with Guard Clauses**
- **Replace Conditional with Strategy**
- **Introduce Null Object**

### Generalização
- **Pull Up Method**
- **Push Down Method**
- **Replace Inheritance with Delegation**
- **Replace Delegation with Inheritance**

## Output Estruturado
```json
{
  "refatoracoes_recomendadas": [
    {
      "tecnica": "Extract Method",
      "alvo": "UserService.createUser:15-60",
      "novo_metodo": "validateUser()",
      "linhas_extraidas": "15-30",
      "beneficio": "Reduz complexidade de 15 para 5",
      "risco": "baixo",
      "teste_necessario": "unitário de validateUser"
    }
  ],
  "sequencia_sugerida": [
    "1. Extract validateUser()",
    "2. Extract hashPassword()",
    "3. Extract saveUser()",
    "4. Replace Conditional with Strategy"
  ],
  "estimativa_total": "4h"
}
```

## Integração
- Acionado por: `code-smell-detector`, `backend-dev`
- Aciona: `complexity-analyzer` (pós-refatoração)
- Registra em: `.ai-factory/logs/refactoring/`
```

---

## 🔄 FLUXO AUTOMATIZADO COMPLETO

### Quando Usuário Insere Projeto e Aciona Orquestrador

```
1. DETECÇÃO AUTOMÁTICA
   tech-lead detecta novo projeto
   ↓
2. ANÁLISE INICIAL (Paralela)
   ├── architecture-analyzer → mapeia estrutura
   ├── code-smell-detector → identifica smells
   ├── error-pattern-matcher → analisa erros
   └── complexity-analyzer → calcula métricas
   ↓
3. PRIORIZAÇÃO
   tech-lead prioriza por impacto
   ↓
4. ATRIBUIÇÃO AUTOMÁTICA
   ├── Segurança crítica → security + systematic-debugging
   ├── Arquitetura → architect + architecture-analyzer + adr-generator
   ├── Code smells → backend-dev + code-smell-detector + refactoring-advisor
   └── Performance → performance + complexity-analyzer
   ↓
5. EXECUÇÃO COM V&V
   Cada skill executa → V&V obrigatório → registra resultado
   ↓
6. CONSOLIDAÇÃO
   tech-lead consolida todos os resultados
   ↓
7. REGISTRA MEMÓRIA
   ├── .ai-factory/logs/debug-sessions/
   ├── .ai-factory/logs/architecture-analysis/
   ├── .ai-factory/logs/code-smells/
   ├── .ai-factory/logs/refactoring/
   └── .ai-factory/adr/
   ↓
8. ATUALIZA DASHBOARDS
   ├── .ai-factory/MELHORIAS/INDEX.md
   └── .ai-factory/MELHORIAS/LOG-VALIDACOES.md
```

---

## 📊 REGISTRO ESTRUTURADO DE MEMÓRIA

### Formato de Log Universal

```json
{
  "session_id": "SESSAO-20260702-001",
  "projeto": "NOME_DO_PROJETO",
  "data": "2026-07-02T14:30:00Z",
  "skills_executadas": [
    {
      "nome": "systematic-debugging",
      "entrada": {"bug_id": "BUG-001"},
      "saida": {"causa_raiz": "...", "fix": "..."},
      "vv_status": "APROVADO",
      "tempo_execucao": "45min"
    }
  ],
  "agentes_envolvidos": ["tech-lead", "backend-dev"],
  "tarefas_concluidas": 5,
  "bugs_corrigidos": 2,
  "smells_refatorados": 3,
  "adrs_gerados": 1,
  "metricas_antes": {"complexidade": 12.5},
  "metricas_depois": {"complexidade": 8.2},
  "licoes_aprendidas": ["lista de learnings"]
}
```

---

## 🚀 IMPLEMENTAÇÃO PRÁTICA

### Passo 1: Criar Skills como Arquivos Markdown

Cada skill acima vira um arquivo em:
```
.ai-factory/skills/
├── systematic-debugging.md
├── error-pattern-matcher.md
├── architecture-analyzer.md
├── adr-generator.md
├── code-smell-detector.md
└── refactoring-advisor.md
```

### Passo 2: Integrar com Tech Lead

Adicionar em `.ai-factory/agents/tech-lead.md`:

```markdown
## Matriz de Acionamento de Skills

| Problema Detectado | Skill Acionada | Agente Responsável |
|-------------------|----------------|-------------------|
| Bug reportado | systematic-debugging | backend-dev / frontend-dev |
| Múltiplos erros similares | error-pattern-matcher | tech-lead |
| Novo projeto | architecture-analyzer | architect |
| Decisão arquitetural | adr-generator | architect |
| Code review | code-smell-detector | tech-lead |
| Refatoração necessária | refactoring-advisor | backend-dev / frontend-dev |
```

### Passo 3: Automação Completa

Script de inicialização:
```javascript
// .ai-factory/scripts/auto-analyze.js

const skills = [
  'architecture-analyzer',
  'code-smell-detector',
  'error-pattern-matcher',
  'complexity-analyzer'
];

// Executa todas as skills em paralelo
await Promise.all(skills.map(skill => executeSkill(skill)));

// Consolida resultados
const report = await techLead.consolidate();

// Registra memória
await memory.record(report);

// Atualiza dashboards
await dashboard.update(report);
```

---

**Próximo passo:** Quer que eu crie os arquivos completos de cada skill agora? 🚀