---
name: github-create-issue
description: "Cria issue no GitHub com template padronizado"
agent: qa-tester
tags: [automation, github, issues, tracking]
version: 1.0.0
created: 2026-01-04
updated: 2026-01-04
---

# Propósito
Criar issues no GitHub de forma automatizada com templates padronizados, garantindo que todas as informações necessárias estejam presentes para triagem e resolução.

# Trigger
Esta skill deve ser ativada quando:
- Solicitado para "criar issue", "abrir chamado"
- Bug encontrado durante testes
- Feature solicitada precisa ser trackeada
- Palavras-chave: "GitHub issue", "bug report", "feature request"

# Instruções

## Passo 1: Coletar Informações
Reunir dados para a issue:
- Tipo: bug, feature, improvement, task
- Título descritivo (máx 100 caracteres)
- Descrição detalhada
- Severidade/Prioridade
- Labels apropriados
- Assignees (se aplicável)
- Milestone (se aplicável)

## Passo 2: Selecionar Template
Escolher template baseado no tipo:

### Bug Report
```markdown
## Descrição
Descrição clara do bug

## Passos para Reproduzir
1. Passo 1
2. Passo 2
3. Comportamento observado

## Comportamento Esperado
O que deveria acontecer

## Screenshots/Logs
Se aplicável

## Environment
- OS: [ex: Windows 11]
- Browser: [ex: Chrome 120]
- Version: [ex: v1.2.0]

## Severity
[ ] Critical - Sistema indisponível
[ ] High - Funcionalidade crítica quebrada
[ ] Medium - Funcionalidade não crítica quebrada
[ ] Low - Cosmetic/Minor issue
```

### Feature Request
```markdown
## Problema
Qual problema esta feature resolve?

## Solução Proposta
Descreva a solução desejada

## Alternativas Consideradas
Outras soluções pensadas

## Contexto Adicional
Screenshots, mockups, referências
```

## Passo 3: Criar Issue via GitHub CLI
```bash
gh issue create \
  --title "Título da Issue" \
  --body-file "corpo-da-issue.md" \
  --label "bug,priority-high" \
  --assignee "username" \
  --project "Project Name" \
  --milestone "v1.3.0"
```

## Passo 4: Registrar Issue Criada
Salvar informações da issue:
- Número da issue
- URL
- Tipo e labels
- Data de criação

## Passo 5: Notificar Stakeholders (Opcional)
Se configurado, notificar via Slack:
```bash
/slack-notify --channel "#dev-team" --message "Nova issue criada: #123 - Título"
```

# Inputs
- `type` (string): bug | feature | improvement | task
- `title` (string): Título da issue
- `description` (string): Descrição detalhada
- `severity` (string): critical | high | medium | low
- `labels` (array): Labels para aplicar
- `assignees` (array): Usuários para assignar
- `milestone` (string, opcional): Milestone relacionada
- `project` (string, opcional): Project board

# Outputs
- Issue criada no GitHub
- URL da issue
- Número da issue
- Confirmação de notificação (se aplicável)

# Exemplos

## Exemplo 1: Bug Report
**Entrada:**
```
type: bug
title: "Erro 500 ao fazer upload de arquivo > 10MB"
description: "API retorna erro 500 quando usuário tenta fazer upload de arquivos maiores que 10MB"
severity: high
labels: [bug, api, uploads]
assignees: [backend-dev]
milestone: v1.2.1
```

**Comando:**
```bash
gh issue create \
  --title "Erro 500 ao fazer upload de arquivo > 10MB" \
  --body-file "bug-report-123.md" \
  --label "bug,api,uploads,priority-high" \
  --assignee "backend-dev" \
  --milestone "v1.2.1"
```

**Saída:**
```
Issue criada: #123
URL: https://github.com/org/repo/issues/123
Notificação enviada para #dev-team
```

## Exemplo 2: Feature Request
**Entrada:**
```
type: feature
title: "Adicionar busca semântica em memórias"
description: "Implementar busca por similaridade usando embeddings"
labels: [feature, memory, ai]
milestone: v2.0.0
```

# Dependências
- GitHub CLI (`gh`) instalado e autenticado
- Permissões no repositório para criar issues
- Variáveis de ambiente configuradas:
  - `GITHUB_TOKEN`
  - `GITHUB_REPO` (org/repo)

# Links Relacionados
- [Patterns](../../brain/Patterns.md) - Padrões de documentação
- [slack-notify](../slack-notify/SKILL.md) - Notificar equipe
- [workflows](../../standards/workflows.md) - Fluxo de issues