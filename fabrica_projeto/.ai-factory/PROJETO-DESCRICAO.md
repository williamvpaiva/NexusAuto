# 🤖 AI Factory - Sistema Universal de Skills e Agentes de IA

> **Transforme qualquer projeto de software em uma fábrica inteligente de código**
> 
> Automação completa de análise, execução e aprendizado com memória estruturada

---

## 📖 O Que É Este Projeto?

**AI Factory** é um sistema universal e portátil que transforma **qualquer projeto de software** (Node.js, Python, Go, Java, etc.) em uma **fábrica inteligente de código** com:

- 🧠 **18 Skills Universais** de IA para depuração, arquitetura e simplificação
- 👥 **9 Agentes Especializados** que trabalham juntos (Tech Lead, Architect, Devs, Security, QA, etc.)
- 🔄 **Automação Completa** que analisa, executa e registra tudo automaticamente
- 📚 **Memória Estruturada** que nunca perde aprendizados (JSON logs)
- 📊 **Dashboards em Tempo Real** com progresso visível
- ✅ **Protocolo V&V** de 7 passos após cada alteração

---

## 🎯 Problema Que Resolve

### **Antes (Caos Comum):**

```
❌ IAs respondem sem contexto do projeto
❌ Mesmo erro analisado 10 vezes do zero
❌ Ninguém sabe o que já foi feito
❌ Decisões de arquitetura não documentadas
❌ Bugs voltam depois de "corrigidos"
❌ Cada desenvolvedor reinventa a roda
```

### **Depois (AI Factory):**

```
✅ IA lê contexto completo antes de responder
✅ Todo erro registrado e nunca mais esquecido
✅ Dashboard mostra exatamente o que foi feito
✅ ADRs gerados automaticamente
✅ V&V obrigatório impede regressão
✅ Memória estruturada reutilizável em qualquer projeto
```

---

## 🚀 Como Funciona (Fluxo Completo)

### **Quando Você Insere um Projeto:**

```bash
# 1. Copiar AI Factory para seu projeto
xcopy /E /I D:\POLYMARKETING\.ai-factory D:\SeuProjeto\.ai-factory

# 2. Executar automação
cd D:\SeuProjeto
node .ai-factory/scripts/auto-analyze.js
```

### **O Sistema Automaticamente:**

```
📡 DETECTA
   └─→ Stack do projeto (Node, Python, Go, etc.)
   └─→ Estrutura de arquivos
   └─→ Configurações existentes

🔍 ANALISA (7 skills em paralelo)
   ├─→ architecture-analyzer → Mapeia arquitetura
   ├─→ code-smell-detector → Identifica smells
   ├─→ error-pattern-matcher → Analisa erros
   ├─→ complexity-analyzer → Calcula métricas
   ├─→ security-scanner → Verifica vulnerabilidades
   ├─→ test-coverage-analyzer → Analisa testes
   └─→ performance-profiler → Mede performance

🎯 PRIORIZA
   🔴 Crítico: Segurança, Bugs em produção
   🟠 Alto: Arquitetura, Performance
   🟡 Médio: Code smells, Dívida técnica
   🟢 Baixo: Melhorias cosméticas

👥 ATRIBUI
   ├─→ Security issues → security-agent
   ├─→ Arquitetura → architect
   ├─→ Code smells → backend-dev / frontend-dev
   ├─→ Testes → qa-tester
   └─→ Performance → performance-agent

⚙️ EXECUTA (com V&V obrigatório)
   Cada agente executa → V&V de 7 passos → registra

📚 REGISTRA MEMÓRIA
   ├─→ .ai-factory/logs/SESSAO-YYYYMMDD-HHMM.json
   ├─→ .ai-factory/MELHORIAS/LOG-VALIDACOES.md
   └─→ .ai-factory/MELHORIAS/INDEX.md (atualizado)

📊 GERA RELATÓRIO
   └─→ Métricas antes/depois
   └─→ Tarefas concluídas
   └─→ Bugs corrigidos
   └─→ Lições aprendidas
```

---

## 🏗️ Estrutura do Projeto

```
.ai-factory/
│
├── 📁 agents/                    # 9 agentes especializados
│   ├── tech-lead.md              # ⭐ Orquestrador principal
│   ├── architect.md              # Arquitetura de software
│   ├── backend-dev.md            # Desenvolvimento backend
│   ├── frontend-dev.md           # Desenvolvimento frontend
│   ├── security.md               # Segurança e OWASP
│   ├── qa-tester.md              # Quality Assurance
│   ├── devops.md                 # CI/CD e infraestrutura
│   └── performance.md            # Otimização de performance
│
├── 📁 skills/                    # 18 skills universais
│   ├── systematic-debugging.md   # ✅ Método científico de debug
│   ├── error-pattern-matcher.md  # Padrões de erro
│   ├── architecture-analyzer.md  # Análise arquitetural
│   ├── adr-generator.md          # Architecture Decision Records
│   ├── code-smell-detector.md    # Detecção de code smells
│   ├── refactoring-advisor.md    # Recomendações de refatoração
│   └── [outras 12 skills]
│
├── 📁 scripts/                   # Automação
│   ├── auto-analyze.js           # ⭐ Script de automação completa
│   └── init.js                   # Inicialização rápida
│
├── 📁 MELHORIAS/                 # 22 áreas de melhoria
│   ├── INDEX.md                  # Dashboard de progresso
│   ├── LOG-VALIDACOES.md         # Histórico de validações V&V
│   ├── 01-Arquitetura/
│   ├── 02-Performance/
│   ├── 03-Testes/
│   ├── 04-Segurança/
│   └── [outras 18 áreas]
│
├── 📁 logs/                      # Memória estruturada
│   └── SESSAO-YYYYMMDD-HHMM.json # Registro de cada sessão
│
├── 📄 FACTORY.CONFIG.md          # Configuração do projeto
├── 📄 rules.md                   # Regras para IAs
├── 📄 README.md                  # Este arquivo
└── 📄 UNIVERSAL-SKILLS-README.md # Documentação completa
```

---

## 🎯 Casos de Uso

### **Cenário 1: Projeto Novo**
```bash
# Criar projeto do zero
mkdir MeuSaaS
cd MeuSaaS

# Copiar AI Factory
xcopy /E /I D:\POLYMARKETING\.ai-factory .\.ai-factory

# Executar análise automática
node .ai-factory/scripts/auto-analyze.js

# Resultado:
# ✅ Arquitetura definida (MVC, Clean Architecture, etc.)
# ✅ Padrões estabelecidos
# ✅ Segurança configurada
# ✅ Testes planejados
# ✅ Tudo documentado automaticamente
```

### **Cenário 2: Projeto Existente (Legado)**
```bash
# Projeto já existe
cd D:\ProjetoLegado

# Copiar AI Factory
xcopy /E /I D:\POLYMARKETING\.ai-factory .\.ai-factory

# Executar diagnóstico
node .ai-factory/scripts/auto-analyze.js

# Resultado:
# ✅ 12 code smells identificados
# ✅ 3 vulnerabilidades de segurança
# ✅ 5 funções com complexidade alta
# ✅ Tarefas priorizadas automaticamente
# ✅ Memória registrada para evolução
```

### **Cenário 3: Debug de Bug Crítico**
```bash
# Bug em produção
node .ai-factory/scripts/auto-analyze.js --skill=systematic-debugging

# Resultado:
# ✅ 6 passos do método científico executados
# ✅ Causa raiz identificada (5 Whys)
# ✅ Correção aplicada com V&V
# ✅ Teste de regressão gerado
# ✅ Sessão completa registrada em logs/
```

### **Cenário 4: Análise de Segurança**
```bash
# Scan de segurança
node .ai-factory/scripts/auto-analyze.js --skill=security-scanner

# Resultado:
# ✅ OWASP Top 10 verificado
# ✅ Dependências vulneráveis detectadas
# ✅ Configurações inseguras identificadas
# ✅ Correções priorizadas
# ✅ Relatório para compliance
```

---

## 📊 Exemplo de Memória Registrada

```json
{
  "session_id": "SESSAO-2026-07-02-14-30-00",
  "projeto": "MeuSaaS",
  "data": "2026-07-02T14:30:00Z",
  "stack": "Node.js/Express/PostgreSQL",
  
  "skills_executadas": [
    {
      "skill": "architecture-analyzer",
      "status": "success",
      "tempo_execucao": 1250,
      "achados": [
        {
          "tipo": "arquitetura",
          "padrao": "MVC",
          "qualidade": "boa",
          "recomendacao": "Adicionar camada de serviço"
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
          "severidade": "alta",
          "recomendacao": "Dividir em 3 services menores"
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
    "complexidade_media": 12.5,
    "cobertura_testes": "45%",
    "vulnerabilidades": 3
  },
  "metricas_depois": {
    "complexidade_media": 8.2,
    "cobertura_testes": "67%",
    "vulnerabilidades": 0
  },
  
  "licoes_aprendidas": [
    "Services > 500 linhas devem ser divididos",
    "Adicionar testes para módulos críticos",
    "Usar ADR para decisões de arquitetura"
  ],
  
  "validacoes_vv": [
    {
      "tarefa": "Refatorar userService.ts",
      "passos": [
        "✅ Integridade",
        "✅ Integração",
        "✅ Regressão",
        "✅ Edge Cases",
        "✅ Ambientes",
        "✅ Performance",
        "✅ Validação Final"
      ],
      "resultado": "APROVADO"
    }
  ]
}
```

---

## 🛡️ Protocolo V&V (Verificação & Validação)

Após **CADA** alteração, 7 passos obrigatórios:

| Passo | Verificação | Status |
|-------|-------------|--------|
| 1️⃣ **Integridade** | Código compila/transpila? | ✅ |
| 2️⃣ **Integração** | Módulos dependentes funcionam? | ✅ |
| 3️⃣ **Regressão** | Funcionalidades mantidas? | ✅ |
| 4️⃣ **Edge Cases** | Cenários extremos testados? | ✅ |
| 5️⃣ **Ambientes** | Compatível dev/staging/prod? | ✅ |
| 6️⃣ **Performance** | Sem degradação? | ✅ |
| 7️⃣ **Validação Final** | Tudo documentado? | ✅ |

**Regra de Ouro:** Tarefa SÓ vira 🟢 **Concluída** se **V&V = ✅ APROVADO**

---

## 📈 Dashboards em Tempo Real

### **INDEX.md - Progresso Geral**

```markdown
# 📊 Painel de Melhorias

████████░░░░░░░░░░░░ 40% Concluído

| Área | Tarefas | Concluídas | V&V ✅ | % | Status |
|------|---------|------------|--------|---|--------|
| 08-Segurança | 5 | 5 | 5/5 | 100% | 🟢 |
| 09-Testes | 8 | 3 | 3/3 | 37% | 🟡 |
| 01-Arquitetura | 6 | 2 | 2/2 | 33% | 🟡 |
| 02-Performance | 4 | 1 | 1/1 | 25% | 🟡 |
```

### **LOG-VALIDACOES.md - Histórico**

```markdown
| # | Data | Área | Tarefa | Resultado | Ciclos | Erros |
|---|------|------|--------|-----------|--------|-------|
| 1 | 02/07 | 08-Segurança | Scan OWASP | ✅ | 1 | 0 |
| 2 | 02/07 | 01-Arquitetura | ADR-001 | ✅ | 1 | 0 |
| 3 | 02/07 | 09-Testes | Testes userService | ✅ | 2 | 1 |
```

---

## 🎁 Benefícios

### **Para Desenvolvedores:**
- ✅ Nunca mais analisar o mesmo erro duas vezes
- ✅ Contexto completo antes de cada tarefa
- ✅ Aprendizados registrados para sempre
- ✅ V&V automático impede bugs em produção

### **Para Tech Leads:**
- ✅ Visibilidade total do progresso
- ✅ Decisões de arquitetura documentadas (ADRs)
- ✅ Métricas objetivas de evolução
- ✅ Onboarding de novos devs acelerado

### **Para Empresas:**
- ✅ Código evolui com memória institucional
- ✅ Redução de bugs em produção
- ✅ Compliance de segurança automatizado
- ✅ ROI mensurável (métricas antes/depois)

---

## 🚀 Começando Agora

### **Pré-requisitos:**
- Node.js instalado (para scripts de automação)
- Qualquer projeto de software (Node, Python, Go, Java, etc.)

### **Instalação (30 segundos):**

```bash
# 1. Copiar AI Factory para seu projeto
xcopy /E /I D:\POLYMARKETING\.ai-factory D:\SeuProjeto\.ai-factory

# 2. Executar análise inicial
cd D:\SeuProjeto
node .ai-factory/scripts/auto-analyze.js

# 3. Ver resultados
code .ai-factory/logs/SESSAO-*.json
code .ai-factory/MELHORIAS/INDEX.md
```

### **Próximos Passos:**

1. **Leia** `.ai-factory/agents/tech-lead.md` para entender orquestração
2. **Execute** `node .ai-factory/scripts/auto-analyze.js` no seu projeto
3. **Acompanhe** dashboards em `.ai-factory/MELHORIAS/INDEX.md`
4. **Itere** com base nas tarefas priorizadas

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| [UNIVERSAL-SKILLS-README.md](UNIVERSAL-SKILLS-README.md) | Guia completo de uso |
| [skills/SKILLS-UNIVERSAIS.md](skills/SKILLS-UNIVERSAIS.md) | Catálogo das 18 skills |
| [agents/tech-lead.md](agents/tech-lead.md) | Orquestrador principal |
| [standards/vv-protocol.md](standards/vv-protocol.md) | Protocolo V&V de 7 passos |
| [scripts/auto-analyze.js](scripts/auto-analyze.js) | Script de automação |

---

## 🌟 Visão de Futuro

### **Roadmap:**

- [ ] Implementar todas as 18 skills individualmente
- [ ] Integrar com APIs de IA (Claude, GPT, etc.)
- [ ] Template público para npm/pip
- [ ] UI web para dashboards
- [ ] Integração com GitHub/GitLab
- [ ] Plugin para VS Code/Cursor/Windsurf

### **Meta:**
> **Tornar toda fábrica de software do mundo inteligente, com memória e aprendizado contínuo**

---

## 🤝 Contribuindo

Este projeto é **universal** e **portátil**. Use em qualquer projeto, adapte às suas necessidades, contribua com melhorias.

**Princípios:**
- ✅ Funciona em qualquer linguagem
- ✅ Memória estruturada > Respostas efêmeras
- ✅ Automação total > Intervenção manual
- ✅ V&V obrigatório > "Funciona na minha máquina"

---

## 📄 Licença

MIT License - Use livremente em qualquer projeto.

---

**Versão:** 1.0.0  
**Criado:** Julho 2026  
**Universal:** Sim (qualquer linguagem)  
**Portátil:** Sim (copiar e colar)  
**Automação:** Completa  

---

## 🎯 **Uma Linha:**

> **AI Factory transforma qualquer projeto em uma fábrica inteligente de código com 18 skills de IA, 9 agentes especializados, automação completa e memória estruturada que nunca esquece.**

🚀 **Comece agora:** `xcopy /E /I D:\POLYMARKETING\.ai-factory D:\SeuProjeto\.ai-factory`