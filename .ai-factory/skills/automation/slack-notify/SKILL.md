---
name: slack-notify
description: "Envia notificações formatadas no Slack"
agent: devops
tags: [automation, slack, notifications, communication]
version: 1.0.0
created: 2026-01-04
updated: 2026-01-04
---

# Propósito
Enviar notificações automatizadas e formatadas no Slack para canais específicos, mantendo a equipe informada sobre deploys, incidentes, conquistas e atualizações importantes.

# Trigger
Esta skill deve ser ativada quando:
- Solicitado para "notificar no Slack", "avisar equipe"
- Deploy em produção realizado
- Incidente detectado
- Conquista registrada (Brag Doc)
- Palavras-chave: "Slack", "notificação", "aviso", "team"

# Instruções

## Passo 1: Definir Tipo de Notificação
Selecionar template baseado no tipo:

### Deploy Notification
```
🚀 **Deploy em Produção**
- *Versão:* v1.2.0
- *Ambiente:* production
- *Deployed by:* @username
- *Changes:* 5 features, 3 bug fixes
- *Status:* ✅ Success
```

### Incident Alert
```
🚨 **Incidente Detectado**
- *Severidade:* High
- *Serviço:* API Gateway
- *Sintoma:* Error rate > 5%
- *Detectado em:* 2026-01-04 14:30 UTC
- *Status Page:* link
- *War Room:* #incident-response
```

### Feature Announcement
```
✨ **Nova Feature Lançada**
- *Nome:* Busca Semântica
- *Descrição:* Busca por similaridade com embeddings
- *Docs:* link
- *Demo:* link
```

### Brag Doc Update
```
🏆 **Conquista Registrada**
- *Agente:* @tech-lead
- *Conquista:* Estrutura de memória completa implementada
- *Impacto:* High
- *Detalhes:* link-to-brag-doc
```

### Daily Standup Reminder
```
📋 **Daily Standup**
- *Data:* 2026-01-04
- *Horário:* 09:00 BRT
- *Link:* meet-link
- *Template:* O que fiz ontem? O que farei hoje? Bloqueios?
```

## Passo 2: Formatar Mensagem
Usar Slack Block Kit para formatação:
```json
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚀 Deploy em Produção",
        "emoji": true
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "*Versão:*\nv1.2.0"
        },
        {
          "type": "mrkdwn",
          "text": "*Status:*\n✅ Success"
        }
      ]
    }
  ]
}
```

## Passo 3: Enviar via Slack API
```bash
curl -X POST https://slack.com/api/chat.postMessage \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "#dev-team",
    "blocks": [...],
    "username": "NexusAuto Bot",
    "icon_emoji": ":robot_face:"
  }'
```

## Passo 4: Registrar Notificação
Salvar log da notificação:
- Canal
- Tipo
- Timestamp
- Status (success/failure)

# Inputs
- `channel` (string): Canal do Slack (ex: `#dev-team`, `#incidents`)
- `type` (string): deploy | incident | feature | brag | standup | custom
- `message` (string): Mensagem principal
- `blocks` (array, opcional): Blocks customizados do Slack
- `threadTs` (string, opcional): Thread timestamp para responder em thread
- `mentions` (array, opcional): Usuários para mencionar (@username)

# Outputs
- Mensagem enviada no Slack
- Timestamp da mensagem
- URL da mensagem (se channel público)
- Confirmação de entrega

# Exemplos

## Exemplo 1: Notificação de Deploy
**Entrada:**
```
channel: "#dev-team"
type: deploy
message: "v1.2.0 deployado em produção com sucesso"
mentions: ["@tech-lead", "@devops"]
```

**Saída:**
```
✅ Mensagem enviada em #dev-team
Timestamp: 1704376800.123456
URL: https://workspace.slack.com/archives/C123ABC/p1704376800123456
```

## Exemplo 2: Alerta de Incidente
**Entrada:**
```
channel: "#incidents"
type: incident
message: "Error rate > 5% na API Gateway"
mentions: ["@oncall", "@backend-team"]
```

## Exemplo 3: Brag Doc Update
**Entrada:**
```
channel: "#wins"
type: brag
message: "Estrutura de memória implementada - Economia de 60% em tokens estimada"
```

# Dependências
- Slack Bot Token (`SLACK_BOT_TOKEN`)
- Slack App instalado no workspace
- Permissões: `chat:write`, `channels:read`
- Variáveis de ambiente configuradas

# Links Relacionados
- [[brain/Brag Doc]] - Conquistas registradas
- [[ORCHESTRATOR]] - Orquestração de agentes
- [[skills/automation/github-create-issue]] - Criar issues