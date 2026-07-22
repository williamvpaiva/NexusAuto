# Orquestrador da AI Factory

## Como usar em qualquer IDE

**Comando universal:** Leia `.ai-factory/ORCHESTRATOR.md` e `.ai-factory/PROJECT_CONTEXT.md`

Identifique a fase atual do projeto e assuma o agente apropriado.

## 🧠 Nova Arquitetura: Cognição Evolutiva + Spec-Kit + UI/UX Pro Max

O NexusAuto agora possui **memória persistente**, **busca semântica**, **otimização de tokens**, **especificações vivas via Spec-Kit** e **design system automatizado via UI/UX Pro Max**.

### Componentes Principais

1. **Spec-Kit (Especificação Primeiro)** (../.specify/constitution.md)
   - Specs vivas e versionadas para cada feature
   - Geração de spec.md, plan.md, tasks.md
   - Rastreabilidade total: spec → tasks → código
   - Economia de 75% de tokens vs. prompts soltos

2. **Memória Persistente** ([Memories](brain/Memories.md))
   - SQLite + sqlite-vec para busca semântica
   - Embeddings locais (@xenova/transformers)
   - Cache de respostas e embeddings
   - Especificações salvas como memórias
   - Nenhuma sessão começa do zero

2. **Slash Commands** (via Tech Lead)
   - `/nl-specify "descrição"` → Gera especificação completa com Spec-Kit
   - `/nl-plan "tecnologia"` → Gera plano técnico
   - `/nl-clarify` → Executa fase de clarificação
   - `/nl-tasks` → Gera lista de tarefas
   - `/nl-implement` → Dispara orquestração dos agentes
   - `/nl-import-tasks` → Importa tasks para MELHORIAS/
   - `/nl-standup` - Resumo do status (≤200 tokens)
   - `/nl-session-start` - Carrega contexto essencial
   - `/nl-log-decision "texto"` - Registra decisão
   - `/nl-search "termo"` - Busca semântica
   - `/nl-brag "conquista"` - Registra win
   - `/nl-retrospective` - Análise de sprint

3. **Skills Padronizadas** ([Skills](brain/Skills.md))
   - Formato SKILL.md com frontmatter YAML
   - Descobrimento automático
   - Carregamento progressivo (apenas relevantes)

4. **Token Budget** ([Patterns](brain/Patterns.md))
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
5. Se for tarefa de frontend/UI, verificar se há design-spec.md
```

**Total estimado:** 300-500 tokens de contexto inicial (vs 10k+ antes)

---

## Etapa 0.5: Design System (UI/UX Pro Max)

Após a especificação funcional (Spec-Kit) e antes da implementação, o Tech Lead deve:

### Quando Acionar
- ✅ Novas landing pages
- ✅ Novas telas/features de frontend
- ✅ Redesign de interfaces existentes
- ✅ Dashboards e painéis administrativos
- ❌ APIs puramente backend (opcional)
- ❌ Scripts e automações internas

### Fluxo de Design
```
Spec-Kit gera specs/[feature]/spec.md
    v
Tech Lead: /design save "descrição" "feature-name"
    v
UI/UX Pro Max gera specs/[feature]/design-spec.md
    v
Conteúdo:
  - Layout pattern (estrutura HTML)
  - Paleta de cores (hex codes)
  - Tipografia (Google Fonts)
  - Efeitos CSS (animações, transições)
  - Antipadrões (o que evitar)
  - Checklist (acessibilidade, performance)
    v
Tech Lead atribui frontend-dev com design-spec.md
    v
frontend-dev implementa seguindo especificação
```

### Exemplo de Uso
```bash
# Usuário solicita landing page
"Quero uma landing page para um spa de bem-estar chamado 'Serenidade'"

# Tech Lead gera especificação funcional
/nl-specify "Sistema de landing page para spa com seções: hero, sobre, serviços, depoimentos, contato"

# Tech Lead gera design system
/design save "Landing page para spa de bem-estar 'Serenidade', com foco em relaxamento, natureza e cores terrosas" "serenidade-landing"

# Output do UI/UX Pro Max:
✅ Design gerado e salvo
📄 Arquivo: specs/serenidade-landing/design-spec.md
🎨 Layout: Hero + 4 seções
🌈 Cores: #2C3E50, #8E8E8E, #E8D5C4, #FFFFFF
🔤 Tipografia: Playfair Display (títulos), Lato (corpo)
✨ Efeitos: Sombra suave, transições 300ms, overlays gradiente
✅ Checklist: WCAG 2.1 AA, Mobile-first, LCP < 2.5s

# Tech Lead atribui implementação
"frontend-dev, construa a landing page seguindo specs/serenidade-landing/design-spec.md"
```

### Integração com Spec-Kit
```
specs/[feature]/
├── spec.md           # Especificação funcional (Spec-Kit)
├── design-spec.md    # Especificação visual (UI/UX Pro Max)
├── plan.md           # Plano de implementação
└── tasks.md          # Lista de tarefas
```

### Comandos Disponíveis
| Comando | Propósito |
|---------|-----------|
| `/design generate "descrição"` | Gera design system completo (JSON) |
| `/design save "descrição" "feature"` | Gera e salva em `specs/[feature]/design-spec.md` |
| `/design palette "descrição"` | Apenas paleta de cores |
| `/design typography "descrição"` | Apenas tipografia |
| `/design checklist "descrição"` | Apenas checklist de qualidade |
| `/design status` | Verifica disponibilidade do módulo |

---

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

0. **Spec-Kit:** Gera especificação funcional (`spec.md`, `plan.md`, `tasks.md`)
0.5. **UI/UX Pro Max:** Gera especificação visual (`design-spec.md`) ← NOVO
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
| Especificação Funcional | spec-kit | demanda | spec.md, plan.md, tasks.md |
| **Design System** | **ui-ux-pro-max** | **spec.md** | **design-spec.md** |
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