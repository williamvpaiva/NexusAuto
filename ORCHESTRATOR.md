## Fluxo de Comunicação WhatsApp

### 1. Inicialização
- O Tech Lead verifica se o OpenWA está rodando (/wa-mcp status)
- Se não estiver, inicia via Docker Compose
- Carrega as sessões existentes

### 2. Envio de Mensagens
- O Tech Lead recebe uma solicitação de envio (ex: notificação de deploy)
- Verifica se a sessão está ativa (/wa-session status)
- Envia a mensagem via /wa-send ou /wa-send-bulk
- Registra o envio no memory-manager.js

### 3. Recebimento de Mensagens (Webhooks)
- O OpenWA envia eventos para o webhook configurado
- O backend processa o evento e registra no memory-manager.js
- Se for um comando (ex: "status"), o Tech Lead é notificado

### 4. Integração com IA Agents (MCP)
- O OpenWA expõe o MCP Server em /mcp
- Agentes do NexusAuto podem chamar ferramentas MCP diretamente
- Exemplo: rontend-dev pode enviar uma mensagem via MCP
