# 🏭 AI Factory POLYMARKETING

> Sistema de desenvolvimento de software com agentes especializados e orquestração automática

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](.)
[![V&V](https://img.shields.io/badge/V%26V-obrigat%C3%B3rio-green)](.ai-factory/standards/vv-protocol.md)
[![Agentes](https://img.shields.io/badge/agentes-10%2B-blue)](.ai-factory/agents/)

---

## 🎯 O Que É

Sistema de desenvolvimento que usa **agentes especializados** (Analyst, Architect, Devs, QA, DevOps, Security) coordenados por um **Tech Lead automatizado** para profissionalizar projetos de software com:

- ✅ **22 áreas de melhoria** cobertas (Arquitetura a Pentest)
- ✅ **V&V obrigatório** (7 passos de verificação)
- ✅ **Rastreabilidade completa** (LOG-VALIDACOES.md)
- ✅ **Orquestração automática** (Tech Lead dispatcher)

---

## 🚀 Começar Agora

### Opção 1: Modo Automático (Recomendado)

```bash
# No chat da sua IA:
Leia .ai-factory/agents/tech-lead.md
Execute: scan tarefas pendentes
Atribua automaticamente aos agentes especializados
```

**O Tech Lead faz tudo:**
- Varre `MELHORIAS/*/TAREFAS.md`
- Identifica tarefas pendentes
- Atribui ao agente correto
- Monitora execução
- Valida V&V
- Atualiza progresso

### Opção 2: Modo Manual

```bash
# Escolha um agente e execute
Leia .ai-factory/agents/{agente}.md
Assuma papel de {agente}
Execute tarefa X da área Y
```

---

## 📊 Estrutura

```
POLYMARKETING/
├── .ai-factory/                # Cérebro da fábrica
│   ├── ORCHESTRATOR.md         # Mapa de fluxo
│   ├── COMO-USAR.md            # Guia rápido (LEIA ESTE)
│   ├── PROJECT_CONTEXT.md      # Contexto atual
│   ├── PROGRESS.md             # Progresso geral
│   ├── agents/                 # Definições de agentes
│   │   ├── analyst.md
│   │   ├── architect.md
│   │   ├── backend-dev.md
│   │   ├── frontend-dev.md
│   │   ├── security.md
│   │   ├── qa-tester.md
│   │   ├── devops.md
│   │   ├── performance.md
│   │   └── tech-lead.md        # ⭐ Orquestrador
│   ├── standards/              # Padrões obrigatórios
│   │   ├── code-style.md
│   │   ├── backend-patterns.md
│   │   ├── frontend-patterns.md
│   │   └── vv-protocol.md      # ⭐ V&V de 7 passos
│   └── workflows/              # Fluxos de trabalho
│       ├── bugfix.md
│       └── new-feature.md
│
├── MELHORIAS/                  # 22 áreas de melhoria
│   ├── INDEX.md                # Painel de progresso
│   ├── LOG-VALIDACOES.md       # Histórico V&V
│   ├── 01-ARQUITETURA/
│   ├── 02-DEBUGGING/
│   ├── 03-SISTEMAS/
│   ├── 04-PERFORMANCE/
│   ├── 05-CLEAN-ARCHITECTURE/
│   ├── 06-MULTIAGENTE/
│   ├── 07-UI-COMPONENTS/
│   ├── 08-SEGURANCA/           # 🔴 Prioridade
│   ├── 09-TESTES/              # 🔴 Prioridade
│   ├── 10-CI-CD/               # 🔴 Prioridade
│   ├── 11-DOCUMENTACAO/
│   ├── 12-BANCO-DE-DADOS/
│   ├── 13-MONITORAMENTO/
│   ├── 14-ACESSIBILIDADE/
│   ├── 15-SEO-E-ANALYTICS/
│   ├── 16-GESTAO-DE-ERROS/
│   ├── 17-GESTAO-DE-ESTADO/
│   ├── 18-API-E-INTEGRACOES/
│   ├── 19-ONBOARDING-E-DX/
│   ├── 20-COMPLIANCE-E-LGPD/
│   ├── 21-LIMPEZA-E-HOUSEKEEPING/
│   └── 22-PENTEST-E-SEGURANCA-AVANCADA/
│
├── backend/                    # Código backend
├── frontend/                   # Código frontend
└── README.md                   # Este arquivo
```

---

## 🧠 Agentes Disponíveis

| Agente | Responsabilidades | Quando Chamar |
|--------|------------------|---------------|
| **analyst** | Requisitos, user stories, regras de negócio | Início de feature |
| **architect** | Arquitetura, ADRs, diagramas C4, stack | Após requisitos |
| **backend-dev** | APIs, controllers, services, banco | Implementação |
| **frontend-dev** | UI, componentes, React, estado | Implementação |
| **security** | AppSec, OWASP, LGPD, pentest | Auditoria de segurança |
| **qa-tester** | Testes, validação, go/no-go | Antes de release |
| **devops** | CI/CD, Docker, deploy, infra | Pipeline e deploy |
| **performance** | Otimização, profiling, benchmarks | Gargalos de performance |
| **tech-lead** | ⭐ Orquestrador automático | **Sempre que possível** |

---

## 🛡️ Protocolo V&V (Verificação & Validação)

**Obrigatório após CADA alteração:**

```
1. 🧪 Teste de Integridade    → Compila sem erros?
2. 🔗 Teste de Integração     → Módulos dependentes OK?
3. 🔄 Teste de Regressão      → Funcionalidades mantidas?
4. 🧨 Edge Cases              → Cenários extremos testados?
5. 📱 Ambientes               → Compatibilidade dev/staging/prod?
6. ⚡ Performance             → Sem degradação?
7. ✅ Validação Final          → Tudo documentado?
```

**Regra de Ouro:** Tarefa SÓ pode ser 🟢 se V&V = ✅ APROVADO

---

## 📋 Matriz de Roteamento

| Área | Agente | Prioridade |
|------|--------|------------|
| 08-SEGURANCA | `security` | 🔴 Crítica |
| 09-TESTES | `qa-tester` | 🔴 Crítica |
| 10-CI-CD | `devops` | 🔴 Crítica |
| 02-DEBUGGING | `backend-dev` / `frontend-dev` | 🔴 Crítica |
| 22-PENTEST | `security` | 🔴 Crítica |
| 01-ARQUITETURA | `architect` | 🟠 Alta |
| 12-BANCO-DE-DADOS | `architect` + `backend-dev` | 🟠 Alta |
| 04-PERFORMANCE | `performance` | 🟠 Alta |
| 07-UI-COMPONENTS | `frontend-dev` | 🟡 Média |
| 11-DOCUMENTACAO | `tech-lead` | 🟢 Planejado |

*[Ver matriz completa em `.ai-factory/agents/tech-lead.md`](.ai-factory/agents/tech-lead.md)*

---

## 🎯 Exemplos de Uso

### Exemplo 1: "Auditar segurança"

```bash
# Automático (recomendado)
Leia .ai-factory/agents/tech-lead.md
Crie tarefa: "Auditar OWASP Top 10"
Atribua para security-agent
Execute com V&V
```

### Exemplo 2: "Corrigir bugs"

```bash
# Automático
Leia .ai-factory/agents/tech-lead.md
Crie tarefa: "Corrigir bugs críticos"
Atribua para backend-dev
Execute com V&V
```

### Exemplo 3: "Nova feature"

```bash
# Fluxo tradicional
1. Leia .ai-factory/agents/analyst.md
2. Crie requisitos
3. Leia .ai-factory/agents/architect.md
4. Defina arquitetura
5. Leia .ai-factory/agents/tech-lead.md
6. Atribua para devs
7. Monitore com V&V
```

---

## 📊 Progresso Atual

```
████████░░░░░░░░░░░░ 0% Concluído
```

| Área | Status | Tarefas | V&V ✅ |
|------|--------|---------|--------|
| 01-ARQUITETURA | 🔴 | 0/0 | 0/0 |
| 08-SEGURANCA | 🔴 | 0/0 | 0/0 |
| 09-TESTES | 🔴 | 0/0 | 0/0 |
| ... | 🔴 | 0/0 | 0/0 |

*[Ver painel completo em `MELHORIAS/INDEX.md`](MELHORIAS/INDEX.md)*

---

## 🔗 Links Úteis

| Arquivo | Descrição |
|---------|-----------|
| [`.ai-factory/COMO-USAR.md`](.ai-factory/COMO-USAR.md) | 📘 Guia completo de uso |
| [`.ai-factory/agents/tech-lead.md`](.ai-factory/agents/tech-lead.md) | 🤖 Orquestrador automático |
| [`.ai-factory/standards/vv-protocol.md`](.ai-factory/standards/vv-protocol.md) | 🛡️ Protocolo V&V de 7 passos |
| [`MELHORIAS/INDEX.md`](MELHORIAS/INDEX.md) | 📊 Painel de progresso |
| [`MELHORIAS/LOG-VALIDACOES.md`](MELHORIAS/LOG-VALIDACOES.md) | 📝 Histórico de validações |

---

## 🚀 Prompt Copia-e-Cola

Para usar em qualquer IDE com IA:

```markdown
Leia .ai-factory/agents/tech-lead.md
Leia .ai-factory/standards/vv-protocol.md

Assuma papel de Tech Lead do projeto POLYMARKETING.

Tarefas:
1. Varra MELHORIAS/*/TAREFAS.md em busca de tarefas 🔴 ou 🟡
2. Para cada tarefa, identifique agente responsável
3. Atribua tarefas com @mention e contexto completo
4. Monitore execução e valide V&V antes de marcar 🟢
5. Atualize INDEX.md e LOG-VALIDACOES.md

Comece agora com "scan tarefas pendentes"

Regras:
- V&V obrigatório após cada alteração
- Priorize 🔴 Críticas primeiro
- Comunicação curta e direta
```

---

## 📐 Licença

Uso interno — POLYMARKETING AI Factory

---

**Próxima ação:** Copie o prompt acima e execute! 🚀