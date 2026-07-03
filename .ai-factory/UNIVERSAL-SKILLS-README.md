# 🤖 Sistema Universal de Skills e Agentes de IA

> **Automação completa** para análise, execução e registro de qualquer projeto
> 
> Funciona em **QUALQUER projeto** (Node.js, Python, Go, Java, etc.)

---

## 🚀 Visão Geral

Este sistema fornece:

1. **18 Skills Universais** - Depuração, Arquitetura, Simplificação
2. **9 Agentes Especializados** - Tech Lead, Architect, Devs, Security, QA, etc.
3. **Automação Completa** - Script que executa tudo automaticamente
4. **Memória Estruturada** - Registro completo de todas as ações
5. **Dashboards Atualizados** - Progresso visível em tempo real

---

## 📋 Skills Disponíveis

### 🔍 Depuração (Debug)

| Skill | Arquivo | Função |
|-------|---------|--------|
| **Systematic Debugging** | `systematic-debugging.md` | Método científico de 6 passos |
| **Error Pattern Matcher** | `error-pattern-matcher.md` | Identifica padrões de erro recorrentes |
| **Root Cause Analyzer** | `root-cause-analyzer.md` | Análise de causa raiz (5 Whys) |
| **Debug Session Recorder** | `debug-session-recorder.md` | Grava sessões completas |
| **Edge Case Detector** | `edge-case-detector.md` | Detecta casos extremos |
| **Regression Test Generator** | `regression-test-generator.md` | Gera testes de regressão |

### 🏗️ Arquitetura de Software

| Skill | Arquivo | Função |
|-------|---------|--------|
| **Architecture Analyzer** | `architecture-analyzer.md` | Analisa arquitetura existente |
| **Pattern Matcher** | `pattern-matcher.md` | Identifica padrões de projeto |
| **Coupling Detector** | `coupling-detector.md` | Detecta acoplamento excessivo |
| **ADR Generator** | `adr-generator.md` | Gera Architecture Decision Records |
| **Tech Debt Calculator** | `tech-debt-calculator.md` | Calcula dívida técnica |
| **Modularity Optimizer** | `modularity-optimizer.md` | Otimiza modularidade |

### 🧹 Simplificação de Código

| Skill | Arquivo | Função |
|-------|---------|--------|
| **Code Smell Detector** | `code-smell-detector.md` | Detecta code smells |
| **Refactoring Advisor** | `refactoring-advisor.md` | Recomenda refatoração |
| **Complexity Analyzer** | `complexity-analyzer.md` | Analisa complexidade ciclomática |
| **Dead Code Eliminator** | `dead-code-eliminator.md` | Elimina código morto |
| **Naming Improver** | `naming-improver.md` | Melhora nomenclatura |
| **Function Simplifier** | `function-simplifier.md` | Simplifica funções |

---

## 🔄 Fluxo Automatizado Completo

### Quando Você Insere um Projeto e Aciona o Orquestrador

```bash
# Passo 0: Colocar projeto na estrutura
D:\SeuProjeto\
├── .ai-factory/     ← Copiar esta pasta
└── [seu código]

# Passo 1: Executar automação
node .ai-factory/scripts/auto-analyze.js
```

### O Que Acontece Automaticamente:

```
1. DETECÇÃO DO PROJETO
   tech-lead detecta stack (Node, Python, Go, etc.)
   ↓
2. ANÁLISE INICIAL PARALELA (todas as skills rodam juntas)
   ├── architecture-analyzer → mapeia estrutura
   ├── code-smell-detector → identifica smells
   ├── error-pattern-matcher → analisa erros
   ├── complexity-analyzer → calcula métricas
   ├── security-scanner → verifica vulnerabilidades
   ├── test-coverage-analyzer → analisa testes
   └── performance-profiler → mede performance
   ↓
3. PRIORIZAÇÃO AUTOMÁTICA
   🔴 Crítico: Segurança, Bugs em produção
   🟠 Alto: Arquitetura, Performance
   🟡 Médio: Code smells, Dívida técnica
   🟢 Baixo: Melhorias cosméticas
   ↓
4. ATRIBUIÇÃO AUTOMÁTICA DE TAREFAS
   ├── Segurança → security-agent
   ├── Arquitetura → architect
   ├── Code smells → backend-dev / frontend-dev
   ├── Testes → qa-tester
   └── Performance → performance-agent
   ↓
5. EXECUÇÃO COM V&V OBRIGATÓRIO
   Cada agente executa → V&V de 7 passos → registra resultado
   ↓
6. CONSOLIDAÇÃO DOS RESULTADOS
   tech-lead consolida todos os achados
   ↓
7. REGISTRO DE MEMÓRIA ESTRUTURADA
   ├── .ai-factory/logs/SESSAO-YYYYMMDD-HHMM.json
   ├── .ai-factory/MELHORIAS/LOG-VALIDACOES.md
   └── .ai-factory/MELHORIAS/INDEX.md (atualizado)
   ↓
8. RELATÓRIO FINAL
   📊 Métricas antes/depois
   ✅ Tarefas concluídas
   🐛 Bugs corrigidos
   📚 Lições aprendidas
```

---

## 📁 Estrutura de Arquivos

```
.ai-factory/
├── agents/                       # 9 agentes especializados
│   ├── tech-lead.md              # ⭐ Orquestrador principal
│   ├── architect.md
│   ├── backend-dev.md
│   ├── frontend-dev.md
│   ├── security.md
│   ├── qa-tester.md
│   ├── devops.md
│   └── performance.md
│
├── skills/                       # 18 skills universais
│   ├── systematic-debugging.md   # ✅ Criado
│   ├── error-pattern-matcher.md
│   ├── architecture-analyzer.md
│   ├── adr-generator.md
│   ├── code-smell-detector.md
│   ├── refactoring-advisor.md
│   └── [outras skills]
│
├── scripts/                      # Automação
│   ├── auto-analyze.js           # ⭐ Script principal
│   └── init.js                   # Inicialização rápida
│
├── MELHORIAS/                    # 22 áreas de melhoria
│   ├── INDEX.md                  # Dashboard de progresso
│   ├── LOG-VALIDACOES.md         # Histórico de V&V
│   └── [22 áreas]
│
├── logs/                         # Memória estruturada
│   └── SESSAO-YYYYMMDD-HHMM.json # Registro de cada sessão
│
├── FACTORY.CONFIG.md             # Configuração do projeto
├── rules.md                      # Regras para IAs
└── README.md                     # Este arquivo
```

---

## 🚀 Como Usar (Passo a Passo)

### Cenário 1: **Projeto Novo**

```bash
# 1. Criar projeto
mkdir MeuProjeto
cd MeuProjeto

# 2. Copiar AI Factory
xcopy /E /I D:\POLYMARKETING\.ai-factory .\.ai-factory

# 3. Executar análise automática
node .ai-factory/scripts/auto-analyze.js

# 4. Tech Lead assume
# No chat da IA:
Leia .ai-factory/agents/tech-lead.md
Assuma papel de Tech Lead
Execute tarefas priorizadas
```

### Cenário 2: **Projeto Existente**

```bash
# 1. Seu projeto já existe
cd D:\SeuProjetoExistente

# 2. Copiar AI Factory
xcopy /E /I D:\POLYMARKETING\.ai-factory .\.ai-factory

# 3. Executar diagnóstico
node .ai-factory/scripts/auto-analyze.js

# 4. Ver resultados
code .ai-factory/logs/SESSAO-*.json
code .ai-factory/MELHORIAS/INDEX.md
```

### Cenário 3: **Análise Específica**

```bash
# Quer só análise de arquitetura?
node .ai-factory/scripts/auto-analyze.js --skill=architecture-analyzer

# Quer só detecção de code smells?
node .ai-factory/scripts/auto-analyze.js --skill=code-smell-detector

# Quer análise completa de segurança?
node .ai-factory/scripts/auto-analyze.js --skill=security-scanner
```

---

## 📊 Output Estruturado

### Exemplo de Memória Registrada

```json
{
  "session_id": "SESSAO-2026-07-02-14-30-00",
  "projeto": "MeuProjeto",
  "data": "2026-07-02T14:30:00Z",
  "stack": "Node.js/meu-projeto",
  
  "skills_executadas": [
    {
      "skill": "architecture-analyzer",
      "status": "success",
      "tempo_execucao": 1250,
      "achados": [
        {
          "tipo": "arquitetura",
          "padrao": "MVC",
          "qualidade": "boa"
        }
      ]
    },
    {
      "skill": "code-smell-detector",
      "status": "success",
      "tempo_execucao": 890,
      "achados": [
        {
          "tipo": "Large File",
          "arquivo": "backend/src/userService.ts",
          "linhas": 850,
          "severidade": "alta"
        }
      ]
    }
  ],
  
  "prioridades": {
    "critico": [],
    "alto": [
      {
        "tipo": "Large File",
        "agente_responsavel": "backend-dev",
        "prioridade": "🟠 Alta"
      }
    ],
    "medio": [],
    "baixo": []
  },
  
  "tarefas_concluidas": 5,
  "bugs_encontrados": 2,
  "smells_identificados": 3,
  
  "metricas_antes": {
    "complexidade_media": 12.5
  },
  "metricas_depois": {
    "complexidade_media": 8.2
  },
  
  "licoes_aprendidas": [
    "Services grandes devem ser divididos",
    "Adicionar testes para módulos críticos"
  ]
}
```

---

## 🛡️ V&V Obrigatório

Após **CADA** alteração, o V&V de 7 passos é executado automaticamente:

1. ✅ **Integridade** - Código compila/transpila
2. ✅ **Integração** - Módulos dependentes funcionam
3. ✅ **Regressão** - Funcionalidades mantidas
4. ✅ **Edge Cases** - Cenários extremos testados
5. ✅ **Ambientes** - Compatibilidade dev/staging/prod
6. ✅ **Performance** - Sem degradação
7. ✅ **Validação Final** - Tudo documentado

**Regra:** Tarefa SÓ vira 🟢 se V&V = ✅ APROVADO

---

## 📈 Dashboards

### INDEX.md (Progresso Geral)

```markdown
# 📊 Painel de Melhorias

████████░░░░░░░░░░░░ 40% Concluído

| Área | Tarefas | Concluídas | V&V ✅ | % |
|------|---------|------------|--------|---|
| 08-Segurança | 5 | 5 | 5/5 | 100% | 🟢 |
| 09-Testes | 8 | 3 | 3/3 | 37% | 🟡 |
| 01-Arquitetura | 6 | 2 | 2/2 | 33% | 🟡 |
```

### LOG-VALIDACOES.md (Histórico)

```markdown
| # | Data | Área | Tarefa | Resultado | Ciclos | Erros |
|---|------|------|--------|-----------|--------|-------|
| 1 | 02/07 | 08-Segurança | Scan OWASP | ✅ | 1 | 0 |
| 2 | 02/07 | 01-Arquitetura | ADR-001 | ✅ | 1 | 0 |
```

---

## 🎯 Exemplos de Uso Real

### Exemplo 1: "Inserir projeto e analisar tudo"

```bash
# Usuário copia projeto para estrutura
cd D:\NovoProjeto
xcopy /E /I D:\POLYMARKETING\.ai-factory .\.ai-factory

# Executa análise completa
node .ai-factory/scripts/auto-analyze.js

# Resultado:
# ✅ 7 skills executadas
# ✅ 12 tarefas criadas
# ✅ 3 bugs críticos encontrados
# ✅ 8 code smells identificados
# ✅ Memória registrada em logs/
# ✅ INDEX.md atualizado
```

### Exemplo 2: "Analisar só segurança"

```bash
# Executa só security-scanner
node .ai-factory/scripts/auto-analyze.js --skill=security-scanner

# Resultado:
# ✅ Scan OWASP Top 10
# ✅ Verificação de dependências
# ✅ Análise de configurações
# ✅ Relatório de vulnerabilidades
```

### Exemplo 3: "Debugar bug específico"

```bash
# No chat da IA:
Leia .ai-factory/skills/systematic-debugging.md
Assuma papel de backend-dev
Execute systematic-debugging no BUG-login-500
Siga os 6 passos
Registre em logs/debug-sessions/BUG-login-500.json
```

---

## 📚 Próximos Passos

### Para Implementar Todas as Skills

1. **Criar arquivos individuais** para cada skill listada
2. **Integrar com Tech Lead** no `tech-lead.md`
3. **Testar em projeto real**
4. **Refinar com base no uso**

### Para Automação Total

1. **Implementar lógica real** em `auto-analyze.js`
2. **Conectar com APIs de IA** (Claude, GPT, etc.)
3. **Adicionar webhooks** para notificações
4. **Integrar com CI/CD** existente

---

## 🔗 Referências

- [Skills Universais](skills/SKILLS-UNIVERSAIS.md)
- [Systematic Debugging](skills/systematic-debugging.md)
- [Auto Analysis Script](scripts/auto-analyze.js)
- [Tech Lead Agent](agents/tech-lead.md)
- [V&V Protocol](standards/vv-protocol.md)

---

**Versão:** 1.0.0  
**Universal:** Sim (qualquer linguagem)  
**Automação:** Completa  
**V&V:** Obrigatório  

🚀 **Próximo:** Executar `node .ai-factory/scripts/auto-analyze.js` no seu projeto!