# 🚀 Guia de Uso Rápido — AI Factory POLYMARKETING

> Como usar o sistema de agentes especializados com orquestração automática

---

## 🎯 Cenários de Uso

### Cenário 1: **Nova Feature do Zero**

Use o **fluxo tradicional** com agentes sequenciais:

```bash
# 1. Comece com Analyst
Leia .ai-factory/agents/analyst.md
Crie requisitos e user stories

# 2. Handoff para Architect
Leia .ai-factory/agents/architect.md
Defina arquitetura e ADRs

# 3. Handoff para Devs
Leia .ai-factory/agents/backend-dev.md
Leia .ai-factory/agents/frontend-dev.md
Implemente em paralelo

# 4. Validação
Leia .ai-factory/agents/security.md
Leia .ai-factory/agents/qa-tester.md
Valide e aprove

# 5. Deploy
Leia .ai-factory/agents/devops.md
Deploy em produção
```

---

### Cenário 2: **Melhorias Contínuas (Automático)**

Use o **Tech Lead** como orquestrador:

```bash
# Comando mágico:
Leia .ai-factory/agents/tech-lead.md
Execute: scan tarefas pendentes
Atribua automaticamente
```

**O Tech Lead faz tudo sozinho:**
1. Varre `MELHORIAS/*/TAREFAS.md`
2. Identifica tarefas 🔴 ou 🟡
3. Consulta matriz de roteamento
4. Atribui ao agente correto com @mention
5. Monitora execução
6. Valida V&V
7. Atualiza INDEX.md e LOG-VALIDACOES.md

---

### Cenário 3: **Auditoria Específica**

Chame o agente especializado diretamente:

```bash
# Exemplo: Auditar segurança
Leia .ai-factory/agents/security.md
Execute auditoria em MELHORIAS/08-SEGURANCA

# Exemplo: Revisar arquitetura
Leia .ai-factory/agents/architect.md
Execute auditoria em MELHORIAS/01-ARQUITETURA
```

---

## 📋 Comandos Prontos por IDE

### Claude Code / Claude Desktop

```bash
# Modo automático (Tech Lead)
Leia .ai-factory/agents/tech-lead.md
Scan tarefas pendentes e atribua automaticamente

# Modo manual (Agente específico)
Leia .ai-factory/agents/{agente}.md
Assuma papel de {agente}
Execute tarefa X da área Y
```

### Cursor

```bash
# Adicione no chat:
@.ai-factory/agents/tech-lead.md
@MELHORIAS/08-SEGURANCA/TAREFAS.md

Atribua e execute tarefas pendentes
```

### GitHub Copilot

```bash
#AI Factory: Leia .ai-factory/agents/tech-lead.md
Varra MELHORIAS em busca de tarefas pendentes
Atribua aos agentes especializados
Execute com V&V obrigatório
```

### VS Code + Extensions

```bash
# 1. Abra o arquivo do agente
code .ai-factory/agents/tech-lead.md

# 2. No chat da IA:
"Assuma papel de Tech Lead. Varra MELHORIAS/*/TAREFAS.md
e atribua tarefas pendentes aos agentes corretos."
```

---

## 🎯 Exemplos Práticos

### Exemplo 1: "Quero auditar segurança do projeto"

**Opção A (Manual):**
```bash
Leia .ai-factory/agents/security.md
Execute auditoria OWASP Top 10
Crie tarefas em MELHORIAS/08-SEGURANCA/TAREFAS.md
```

**Opção B (Automático com Tech Lead):**
```bash
Leia .ai-factory/agents/tech-lead.md
Crie tarefa: "Auditar segurança contra OWASP Top 10"
Atribua automaticamente para security-agent
Execute com V&V
```

---

### Exemplo 2: "Preciso melhorar performance"

**Opção A (Manual):**
```bash
Leia .ai-factory/agents/performance.md
Execute profiling
Crie tarefas em MELHORIAS/04-PERFORMANCE/TAREFAS.md
```

**Opção B (Automático):**
```bash
Leia .ai-factory/agents/tech-lead.md
Crie tarefa: "Otimizar performance do backend"
Atribua para performance-agent
Execute com V&V
```

---

### Exemplo 3: "Vamos começar do zero"

**Fluxo completo:**
```bash
# 1. Primeiro, defina o contexto
Leia .ai-factory/PROJECT_CONTEXT.md
Preencha informações do projeto

# 2. Analyst levanta requisitos
Leia .ai-factory/agents/analyst.md
Crie requirements.md e user-stories.md

# 3. Architect desenha solução
Leia .ai-factory/agents/architect.md
Crie architecture-design.md e ADRs

# 4. Tech Lead assume para execução
Leia .ai-factory/agents/tech-lead.md
Atribua tarefas para backend-dev e frontend-dev
Monitore execução com V&V
```

---

## 🧠 Matriz de Roteamento Rápida

| Você quer... | Agente | Área em MELHORIAS/ |
|--------------|--------|-------------------|
| Auditar arquitetura | `architect` | 01-ARQUITETURA |
| Corrigir bugs | `backend-dev` ou `frontend-dev` | 02-DEBUGGING |
| Melhorar performance | `performance` | 04-PERFORMANCE |
| Refatorar para Clean Code | `architect` + devs | 05-CLEAN-ARCHITECTURE |
| Criar componentes UI | `frontend-dev` | 07-UI-COMPONENTS |
| Auditar segurança | `security` | 08-SEGURANCA, 22-PENTEST |
| Criar testes | `qa-tester` | 09-TESTES |
| Configurar CI/CD | `devops` | 10-CI-CD |
| Documentar | `tech-lead` | 11-DOCUMENTACAO |
| Otimizar banco | `architect` + `backend-dev` | 12-BANCO-DE-DADOS |
| Configurar monitoramento | `devops` | 13-MONITORAMENTO |
| Melhorar acessibilidade | `frontend-dev` | 14-ACESSIBILIDADE |
| SEO e Analytics | `frontend-dev` | 15-SEO-E-ANALYTICS |
| Gestão de erros | `backend-dev` | 16-GESTAO-DE-ERROS |
| Gestão de estado | `frontend-dev` | 17-GESTAO-DE-ESTADO |
| Revisar APIs | `backend-dev` | 18-API-E-INTEGRACOES |
| Onboarding de devs | `devops` | 19-ONBOARDING-E-DX |
| LGPD e compliance | `security` | 20-COMPLIANCE-E-LGPD |
| Limpar código morto | `backend-dev` ou `frontend-dev` | 21-LIMPEZA |
| Pentest avançado | `security` | 22-PENTEST |

---

## 🛡️ Regras de Ouro (Sempre Seguir)

1. **Nunca pule o V&V** — 7 passos obrigatórios após CADA alteração
2. **Sempre registre no LOG-VALIDACOES.md** — Rastreabilidade completa
3. **Nunca marque 🟢 sem V&V ✅** — Qualidade primeiro
4. **Use Conventional Commits** — Padrão em todos os commits
5. **Commits pequenos** — Uma mudança lógica por commit
6. **Code review obrigatório** — Mínimo 1 aprovação
7. **CI verde antes de merge** — Tests passing always
8. **Atualize INDEX.md** — Progresso visível para todos

---

## 📊 Comandos do Tech Lead

### Scan e Atribuição

```bash
# Varre todas as áreas
scan tarefas pendentes

# Atribui tarefa específica
atribuir tarefa 3 da área 08-SEGURANCA para security

# Lista tarefas por agente
quem está fazendo o quê
```

### Monitoramento

```bash
# Status de uma área
status da área 08-SEGURANCA

# Bloqueios ativos
bloqueios ativos

# Relatório diário
relatório diário
```

### Execução

```bash
# Iniciar todas as tarefas de uma etapa
iniciar etapa 08

# Priorizar área
priorizar área 08-SEGURANCA

# Escalar tarefa bloqueada
escalar tarefa 2 da área 08
```

---

## 🎯 Primeiros Passos (Comece Agora)

### Passo 1: Entenda a Estrutura

```bash
# Liste todas as áreas disponíveis
ls MELHORIAS/

# Veja o progresso atual
code MELHORIAS/INDEX.md

# Veja o log de validações
code MELHORIAS/LOG-VALIDACOES.md
```

### Passo 2: Escolha uma Área Prioritária

Comece por **Segurança** (🔴 Crítico):

```bash
code MELHORIAS/08-SEGURANCA/TAREFAS.md
```

### Passo 3: Use o Tech Lead

```bash
# No chat da IA:
Leia .ai-factory/agents/tech-lead.md

Crie a seguinte tarefa em MELHORIAS/08-SEGURANCA/TAREFAS.md:
"Auditar endpoints contra OWASP Top 10"

Atribua automaticamente para security-agent
Monitore execução com V&V
```

### Passo 4: Acompanhe

O Tech Lead vai:
1. Criar a tarefa
2. Atribuir para `security`
3. Security executa
4. Preenche V&V
5. Tech Lead valida
6. Atualiza INDEX.md

---

## 🔗 Referências Rápidas

| Arquivo | O Que É | Quando Usar |
|---------|---------|-------------|
| [`ORCHESTRATOR.md`](./ORCHESTRATOR.md) | Mapa de fluxo | Início de sessão |
| [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md) | Contexto do projeto | Início de sessão |
| [`tech-lead.md`](./agents/tech-lead.md) | Orquestrador automático | Execução de tarefas |
| [`vv-protocol.md`](./standards/vv-protocol.md) | Protocolo V&V | Após cada alteração |
| [`INDEX.md`](../MELHORIAS/INDEX.md) | Painel de progresso | Ver status geral |
| [`LOG-VALIDACOES.md`](../MELHORIAS/LOG-VALIDACOES.md) | Log de validações | Registrar V&V |

---

## 🚀 Prompt Copia-e-Cola

Para usar em qualquer IDE com IA:

```
Leia .ai-factory/agents/tech-lead.md
Leia .ai-factory/standards/vv-protocol.md

Assuma papel de Tech Lead do projeto POLYMARKETING.

Tarefas:
1. Varra MELHORIAS/*/TAREFAS.md em busca de tarefas 🔴 ou 🟡
2. Para cada tarefa, identifique agente responsável pela matriz de roteamento
3. Atribua tarefas com @mention e contexto completo
4. Monitore execução e valide V&V antes de marcar 🟢
5. Atualize MELHORIAS/INDEX.md e MELHORIAS/LOG-VALIDACOES.md

Comece agora com:
- scan tarefas pendentes
- liste tarefas encontradas
- atribua automaticamente

Regras:
- V&V obrigatório após cada alteração
- Comunicação curta e direta
- Priorize 🔴 Críticas primeiro
```

---

**Próxima ação:** Copie o prompt acima e cole na sua IA! 🚀