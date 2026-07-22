# Skills - NexusAuto

## Visão Geral
Skills são habilidades padronizadas que os agentes do NexusAuto podem executar. Cada skill é um arquivo `SKILL.md` com frontmatter YAML que permite descoberta automática, carregamento progressivo e rastreabilidade de uso.

## Estrutura de Diretórios
```
.ai-factory/skills/
├── development/      # Habilidades de desenvolvimento
│   ├── criar-componente-react/
│   │   └── SKILL.md
│   └── integrar-api-rest/
│       └── SKILL.md
├── security/         # Habilidades de segurança
│   ├── auditar-cors/
│   │   └── SKILL.md
│   └── escanear-dependencias/
│       └── SKILL.md
├── documentation/    # Habilidades de documentação
│   └── gerar-changelog/
│       └── SKILL.md
└── automation/       # Habilidades de automação
    ├── github-create-issue/
    │   └── SKILL.md
    └── slack-notify/
        └── SKILL.md
```

## Formato SKILL.md
```markdown
---
name: nome-da-skill
description: "Descrição curta e clara da habilidade"
agent: agente-alvo (ex: frontend-dev, backend-dev, security)
tags: [tag1, tag2, tag3]
version: 1.0.0
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Propósito
Descrição detalhada do que esta skill faz e quando deve ser usada.

# Trigger
Quando esta skill deve ser ativada:
- Palavra-chave 1
- Palavra-chave 2
- Contexto específico

# Instruções
Passo a passo detalhado:
1. Passo 1
2. Passo 2
3. Passo 3

# Inputs
- `param1` (tipo): Descrição do parâmetro
- `param2` (tipo): Descrição do parâmetro

# Outputs
- O que esta skill produz
- Formato do output

# Exemplos
## Exemplo 1
**Entrada:** ...
**Saída:** ...

## Exemplo 2
**Entrada:** ...
**Saída:** ...

# Dependências
- Ferramentas externas
- Variáveis de ambiente
- Permissões necessárias

# Links Relacionados
- [Patterns](Patterns.md) - Padrões relacionados
- [Key Decisions](Key%20Decisions.md) - Decisões relevantes
```

## Skills Disponíveis

### Development
| Skill | Descrição | Agente | Tags |
|-------|-----------|--------|------|
| [criar-componente-react](../skills/development/criar-componente-react.md) | Cria componente React com TypeScript e Tailwind | frontend-dev | frontend, react, typescript |
| [integrar-api-rest](../skills/development/integrar-api-rest.md) | Integra API REST com backend | backend-dev | backend, api, rest |

### Security
| Skill | Descrição | Agente | Tags |
|-------|-----------|--------|------|
| [auditar-cors](../skills/security/auditar-cors.md) | Audita configuração CORS | security | security, cors, web |
| [escanear-dependencias](../skills/security/escanear-dependencias.md) | Escaneia dependências por vulnerabilidades | security | security, dependencies, audit |

### Documentation
| Skill | Descrição | Agente | Tags |
|-------|-----------|--------|------|
| [gerar-changelog](../skills/documentation/gerar-changelog.md) | Gera changelog a partir de commits | qa-tester | documentation, changelog, git |

### Automation
| Skill | Descrição | Agente | Tags |
|-------|-----------|--------|------|
| [github-create-issue](../skills/automation/github-create-issue.md) | Cria issue no GitHub | qa-tester | automation, github, issues |
| [slack-notify](../skills/automation/slack-notify.md) | Envia notificação no Slack | devops | automation, slack, notifications |

## Como Usar Skills

### 1. Listar Skills Disponíveis
```bash
# Via Tech Lead
/nl-skills --list

# Via script
node scripts/skill-manager.js list
```

### 2. Carregar Skill Específica
```bash
# Via Tech Lead
/nl-skill load criar-componente-react

# Via script
node scripts/skill-manager.js load criar-componente-react
```

### 3. Executar Skill
```bash
# Via Tech Lead (com argumentos)
/nl-skill run criar-componente-react --name=Button --props=variant,children

# Via script
node scripts/skill-manager.js run criar-componente-react --name=Button --props=variant,children
```

### 4. Registrar Uso de Skill
```javascript
await memoryManager.saveMemory({
  type: 'skill_usage',
  skill: 'criar-componente-react',
  agent: 'frontend-dev',
  session: '2026-01-04-001',
  result: 'success'
});
```

## Como Criar Nova Skill

1. **Criar diretório** em `.ai-factory/skills/{categoria}/{nome-da-skill}/`
2. **Criar SKILL.md** com frontmatter YAML e instruções
3. **Adicionar entrada** neste arquivo (brain/Skills.md)
4. **Testar** com `/nl-skill test {nome}`
5. **Documentar** exemplos de uso

## Matriz de Agentes e Skills

| Agente | Skills Primárias | Skills Secundárias |
|--------|------------------|-------------------|
| tech-lead | Todas (leitura) | Nenhuma (execução) |
| frontend-dev | criar-componente-react, integrar-api-rest | auditar-cors |
| backend-dev | integrar-api-rest, escanear-dependencias | github-create-issue |
| security | auditar-cors, escanear-dependencias | github-create-issue |
| qa-tester | gerar-changelog | github-create-issue |
| devops | slack-notify | github-create-issue |

## Versionamento de Skills
- **Major (1.0.0 → 2.0.0):** Mudança breaking no input/output
- **Minor (1.0.0 → 1.1.0):** Nova funcionalidade, backward compatible
- **Patch (1.0.0 → 1.0.1):** Bug fix, sem mudança de comportamento

## Links Relacionados
- [North Star](North%20Star.md) - Visão e missão
- [Patterns](Patterns.md) - Padrões de implementação
- [ORCHESTRATOR.md](../../ORCHESTRATOR.md) - Orquestração de agentes
- [SOUL.md](../../SOUL.md) - Filosofia do NexusAuto