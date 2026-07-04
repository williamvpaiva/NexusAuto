# Orquestrador da AI Factory

## Como usar em qualquer IDE

**Comando universal:** Leia `.ai-factory/ORCHESTRATOR.md` e `.ai-factory/PROJECT_CONTEXT.md`

Identifique a fase atual do projeto e assuma o agente apropriado.

## 🧠 Nova Arquitetura: Cognição Evolutiva

O NexusAuto agora possui **memória persistente**, **busca semântica** e **otimização de tokens**.

### Componentes Principais

1. **Memória Persistente** ([[brain/Memories]])
   - SQLite + sqlite-vec para busca semântica
   - Embeddings locais (@xenova/transformers)
   - Cache de respostas e embeddings
   - Nenhuma sessão começa do zero

2. **Slash Commands** (via Tech Lead)
   - `/nl-standup` - Resumo do status (≤200 tokens)
   - `/nl-session-start` - Carrega contexto essencial
   - `/nl-log-decision "texto"` - Registra decisão
   - `/nl-search "termo"` - Busca semântica
   - `/nl-brag "conquista"` - Registra win
   - `/nl-retrospective` - Análise de sprint

3. **Skills Padronizadas** ([[brain/Skills]])
   - Formato SKILL.md com frontmatter YAML
   - Descobrimento automático
   - Carregamento progressivo (apenas relevantes)

4. **Token Budget** ([[brain/Patterns#token-budget]])
   - Limite de 50k tokens por tarefa
   - Divisão automática de tarefas grandes
   - Cache e sumarização obrigatórios

### SessionStart Hook

No início de CADA sessão, o Tech Lead deve:

```
1. Carregar brain/North Star.md (essencial, ~100 tokens)
2. Buscar últimas 3 memórias relevantes (busca semântica)
3. Verificar cache de respostas para a tarefa atual
4. Carregar apenas skills necessárias para a tarefa
```

**Total estimado:** 300-500 tokens de contexto inicial (vs 10k+ antes)

## 🤖 Modo Automático com Tech Lead

Para execução automática de tarefas em `MELHORIAS/`, use o **Tech Lead** como orquestrador:

```
Leia .ai-factory/agents/tech-lead.md
Execute: scan tarefas pendentes
Atribua automaticamente aos agentes especializados
```

## Mapa de Fluxo

### Fluxo Tradicional (Feature Development)
```
Ideia ou Demanda
    v
analyst --- requirements.md, user-stories.md
    v
architect --- architecture-design.md, api-design.md, ADRs
    v
frontend-dev + backend-dev EM PARALELO
    v
security + performance EM PARALELO
    v
qa-tester --- go/no-go
    v
devops --- producao
```

### Fluxo Automático (Melhorias Contínuas)
```
tech-lead (scan MELHORIAS/*)
    v
Identifica tarefa 🔴/🟡
    v
Consulta matriz de roteamento
    v
@atribui agente especializado
    v
Agente executa + V&V
    v
tech-lead valida V&V
    v
Atualiza INDEX.md + LOG-VALIDACOES.md
```

## Regras do Orquestrador

1. **Um agente por vez por conversa** - contexto limpo
2. **Sempre ler o arquivo do agente** em `.ai-factory/agents/` antes de atuar
3. **Nunca pular etapas.** Handoff só com checklist completo
4. **Registrar progresso** em `PROGRESS.md` após cada etapa
5. **Devoluções:** security, performance e qa podem devolver para devs
6. **Dúvidas?** Consulte `.ai-factory/standards/` e `.ai-factory/skills/`

## Comandos por IDE

### Claude Code / Claude Desktop
```
Leia .ai-factory/PROJECT_CONTEXT.md
Qual a fase atual? Assuma o agente correspondente.
```

### Cursor
```
@.ai-factory/ORCHESTRATOR.md
@.ai-factory/PROJECT_CONTEXT.md
```

### GitHub Copilot
```
#AI Factory: Leia .ai-factory/PROJECT_CONTEXT.md e atue como o agente da fase atual
```

### VS Code + Extensions
```
Abra .ai-factory/PROJECT_CONTEXT.md
Verifique "agente atual"
Leia .ai-factory/agents/{agente}.md
```

## Estrutura de Arquivos

```
.ai-factory/
├── ORCHESTRATOR.md         # Este arquivo
├── SOUL.md                 # ← NOVO: Filosofia do NexusAuto
├── PROJECT_CONTEXT.md      # Contexto atual do projeto
├── PROGRESS.md             # Registro de progresso
├── factory.config.yml      # Configurações
├── brain/                  # ← NOVO: Memória e conhecimento
│   ├── North Star.md       # Visão, missão, objetivos
│   ├── Key Decisions.md    # ADRs consolidados
│   ├── Patterns.md         # Padrões de implementação
│   ├── Skills.md           # Catálogo de habilidades
│   ├── Memories.md         # Log de sessões e lições
│   └── Brag Doc.md         # Conquistas e wins
├── org/                    # ← NOVO: Pessoas e agentes
│   ├── Agents.md           # Catálogo de agentes
│   └── Stakeholders.md     # Quem usa o software
├── bases/                  # ← NOVO: Templates
│   ├── agent-template.md   # Template para novos agentes
│   ├── task-template.md    # Template para novas tarefas
│   └── decision-template.md# Template para decisões (ADR)
├── skills/                 # ← NOVO: Habilidades padronizadas
│   ├── development/        # Skills de desenvolvimento
│   ├── security/           # Skills de segurança
│   ├── documentation/      # Skills de documentação
│   └── automation/         # Skills de automação
├── agents/                 # Definições de agentes
├── scripts/                # Scripts utilitários
│   ├── memory-manager.js   # ← NOVO: Gerencia memória SQLite
│   └── token-budget.js     # ← NOVO: Controla tokens
├── standards/              # Padrões obrigatórios
├── workflows/              # Fluxos de trabalho
├── handoffs/               # Regras de transição
├── prompts/                # Prompts reutilizáveis
├── checklists/             # Checklists de qualidade
└── templates/              # Templates de artefatos
```

## Ciclo de Vida de uma Feature

1. **Analyst** levanta requisitos
2. **Architect** desenha solução
3. **Devs** implementam em paralelo
4. **Security + Performance** auditam
5. **QA** valida e emite parecer
6. **DevOps** libera em produção

## Handoff Template

Todo handoff DEVE conter:

```markdown
# Handoff: {origem} -> {destino}

## O que foi feito
- resumo em 3-5 bullets

## Artefatos entregues
- caminho/arquivo: descrição

## Decisões tomadas
- decisão + motivo

## Pontos de atenção
- riscos, limitações, known issues

## O que se espera de você
- tarefas do próximo agente
```

## Matriz de Responsabilidades

| Etapa | Agente | Entrada | Saída |
|-------|--------|---------|-------|
| Análise | analyst | demanda | requirements.md, user-stories.md |
| Arquitetura | architect | requirements | architecture-design.md, ADRs |
| Frontend | frontend-dev | design + api | src/frontend/**, testes |
| Backend | backend-dev | api-design | src/backend/**, openapi.yaml |
| Segurança | security | código | security-report.md |
| Performance | performance | código | performance-report.md |
| QA | qa-tester | aplicação + critérios | qa-report.md (go/no-go) |
| DevOps | devops | qa-report GO | deploy em produção |

## Regras de Devolução

1. Devolução **SEMPRE** com artefato (remediation-plan, bug-report)
2. Devolução **NÃO** é falha. É o processo funcionando
3. Máximo **2 ciclos** de devolução na mesma etapa
4. Registrar devoluções no `PROGRESS.md`

## Resolução de Conflitos

- **Requisito ambíguo:** Analyst decide consultando stakeholder
- **Decisão técnica:** Architect decide
- **Contrato de API:** Architect com input de front e back
- **Prioridade de bugs:** QA + PO
- **Go/No-go de release:** QA (qualidade) + DevOps (operação)
- **Trade-off segurança vs prazo:** Security tem veto em críticos e altos