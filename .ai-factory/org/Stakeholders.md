# Stakeholders - NexusAuto

## Quem Usa o Software

### 1. Desenvolvedores (Primary Users)
**Perfil:** Engenheiros de software full-stack  
**Dores:**
- Perder contexto entre sessões
- Retrabalho por falta de memória
- Tokens desperdiçados com contexto repetido
- Dificuldade em encontrar decisões passadas

**Expectativas:**
- Começar sessões com contexto carregado
- Encontrar decisões arquiteturais rapidamente
- Economizar tokens com cache e busca semântica
- Habilidades padronizadas e reutilizáveis

**Como o NexusAuto ajuda:**
- Memória persistente com busca semântica
- Key Decisions documentadas e linkadas
- Cache de respostas e embeddings
- Skills descobríveis automaticamente

---

### 2. Tech Leads / Architects
**Perfil:** Líderes técnicos, arquitetos de software  
**Dores:**
- Decisões não documentadas
- Padrões não seguidos
- Dificuldade em escalar conhecimento
- Onboarding demorado

**Expectativas:**
- Decisões arquiteturais registradas
- Padrões de código seguidos automaticamente
- Conhecimento escalável via skills
- Onboarding rápido de novos agentes

**Como o NexusAuto ajuda:**
- Key Decisions em formato ADR
- Patterns documentados e linkados
- Skills padronizadas (SKILL.md)
- Grafo de conhecimento navegável (Obsidian)

---

### 3. QA / Security
**Perfil:** Engenheiros de qualidade e segurança  
**Dores:**
- Bugs recorrentes
- Vulnerabilidades não detectadas
- Dificuldade em auditar código
- Falta de automatização

**Expectativas:**
- Bugs reportados automaticamente
- Vulnerabilidades detectadas precocemente
- Auditoria de código automatizada
- Integração com GitHub Issues

**Como o NexusAuto ajuda:**
- Skills de auditoria (auditar-cors, escanear-dependencias)
- Integração com GitHub (github-create-issue)
- Checklists de qualidade em standards/
- Validação automática em handoffs

---

### 4. DevOps / SRE
**Perfil:** Engenheiros de infraestrutura e confiabilidade  
**Dores:**
- Deploys manuais
- Falta de monitoramento
- Incidentes não documentados
- Comunicação falha

**Expectativas:**
- Deploys automatizados
- Monitoramento contínuo
- Postmortems documentados
- Notificações automáticas

**Como o NexusAuto ajuda:**
- Skills de automação (slack-notify)
- Integração com pipelines CI/CD
- Memories.md para registro de incidentes
- Brag Doc para reconhecimento

---

### 5. Product Owners / Managers
**Perfil:** Gestores de produto e projeto  
**Dores:**
- Falta de visibilidade do progresso
- Dificuldade em medir velocidade
- Conquistas não documentadas
- Retrospectivas sem dados

**Expectativas:**
- Progresso visível em tempo real
- Métricas de velocidade claras
- Conquistas registradas
- Retrospectivas baseadas em dados

**Como o NexusAuto ajuda:**
- PROGRESS.md atualizado automaticamente
- Memórias por sessão ( Memories.md)
- Brag Doc com wins registrados
- `/nl-retrospective` para análise de sprint

---

## Mapa de Stakeholders

```
Desenvolvedores (Primary)
    ↓
Tech Leads / Architects
    ↓
QA / Security ←→ DevOps / SRE
    ↓
Product Owners / Managers
```

## Como Atualizar

1. **Identificar novo stakeholder**
2. **Adicionar seção** com Perfil, Dores, Expectativas, Como o NexusAuto ajuda
3. **Atualizar mapa** de stakeholders
4. **Linkar** em [North Star](../brain/North%20Star.md) se relevante

## Links Relacionados
- [North Star](../brain/North%20Star.md) - Visão e missão
- [Agents](Agents.md) - Agentes do NexusAuto
- [Memories](../brain/Memories.md) - Log de sessões