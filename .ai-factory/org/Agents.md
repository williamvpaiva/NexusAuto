# Agents - NexusAuto

## Agentes Ativos

### Tech Lead
**Especialidade:** Orquestração, arquitetura, tomada de decisão  
**Status:** Ativo  
**Sessões:** 1  
**Skills:** Todas (leitura), Nenhuma (execução)

**Responsabilidades:**
- Orquestrar fluxo de desenvolvimento
- Tomar decisões arquiteturais
- Atribuir tarefas a agentes especializados
- Validar handoffs entre agentes
- Manter memória e contexto do projeto

**Histórico:**
- 2026-01-04: Implementou estrutura de memória persistente
- 2026-01-04: Criou padrões SKILL.md
- 2026-01-04: Implementou slash commands

**Memórias Recentes:**
- [[brain/Memories#2026-01-04 - Evolução para Memória Persistente]]
- [[brain/Key Decisions#ADR-001]]

---

### Frontend Dev
**Especialidade:** React, TypeScript, Tailwind CSS, Next.js  
**Status:** Ativo  
**Sessões:** 0  
**Skills:** [[skills/development/criar-componente-react]], [[skills/development/integrar-api-rest]]

**Responsabilidades:**
- Implementar componentes frontend
- Integrar com APIs backend
- Seguir padrões de UI/UX
- Escrever testes unitários

**Histórico:**
- Aguardando primeira atribuição

---

### Backend Dev
**Especialidade:** Node.js, TypeScript, APIs REST, Bancos de Dados  
**Status:** Ativo  
**Sessões:** 0  
**Skills:** [[skills/development/integrar-api-rest]], [[skills/security/escanear-dependencias]]

**Responsabilidades:**
- Implementar APIs REST
- Modelar dados
- Otimizar queries
- Escrever testes de integração

**Histórico:**
- Aguardando primeira atribuição

---

### Security
**Especialidade:** Segurança de aplicações, OWASP, Auditoria de Código  
**Status:** Ativo  
**Sessões:** 0  
**Skills:** [[skills/security/auditar-cors]], [[skills/security/escanear-dependencias]]

**Responsabilidades:**
- Auditar código por vulnerabilidades
- Validar configurações de segurança (CORS, CSP, etc.)
- Escanear dependências
- Emitir security reports

**Histórico:**
- Aguardando primeira atribuição

---

### QA Tester
**Especialidade:** Testes E2E, Validação de Features, Automação  
**Status:** Ativo  
**Sessões:** 0  
**Skills:** [[skills/documentation/gerar-changelog]], [[skills/automation/github-create-issue]]

**Responsabilidades:**
- Validar features implementadas
- Escrever testes E2E
- Reportar bugs
- Emitir parecer go/no-go

**Histórico:**
- Aguardando primeira atribuição

---

### DevOps
**Especialidade:** CI/CD, Deploy, Monitoramento, Infraestrutura  
**Status:** Ativo  
**Sessões:** 0  
**Skills:** [[skills/automation/slack-notify]], [[skills/automation/github-create-issue]]

**Responsabilidades:**
- Configurar pipelines CI/CD
- Deploy em produção
- Monitorar saúde do sistema
- Notificar equipe (Slack)

**Histórico:**
- Aguardando primeira atribuição

---

## Matriz de Habilidades

| Agente | Skills Primárias | Skills Secundárias |
|--------|------------------|-------------------|
| Tech Lead | Todas (leitura) | Nenhuma (execução) |
| Frontend Dev | criar-componente-react | integrar-api-rest, auditar-cors |
| Backend Dev | integrar-api-rest | escanear-dependencias, github-create-issue |
| Security | auditar-cors, escanear-dependencias | github-create-issue |
| QA Tester | gerar-changelog | github-create-issue |
| DevOps | slack-notify | github-create-issue |

## Como Adicionar Novo Agente

1. **Criar arquivo** em `.ai-factory/agents/{nome}.md`
2. **Adicionar entrada** neste arquivo (org/Agents.md)
3. **Definir skills** no diretório `.ai-factory/skills/`
4. **Documentar** responsabilidades e histórico

## Ciclo de Vida do Agente

```
Inativo → Atribuído → Em Progresso → Em Revisão → Concluído
   ↑          ↓           ↓              ↓           ↓
   └──────────┴───────────┴──────────────┴───────────┘
                    (próxima atribuição)
```

## Links Relacionados
- [[brain/North Star]] - Visão e missão
- [[ORCHESTRATOR]] - Orquestração de agentes
- [[brain/Skills]] - Catálogo de skills
- [[org/Stakeholders]] - Stakeholders do projeto