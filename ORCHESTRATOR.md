## Etapa 0: Carregamento de Contexto (Memória Hierárquica)

Antes de qualquer tarefa, o Tech Lead deve:

1. **Carregar a Persona** (L3): Use `/memory-persona` para injetar o perfil do usuário.
2. **Buscar Cenários Relevantes** (L2): Use `/memory-scenarios` com base na descrição da tarefa.
3. **Buscar Átomos Relevantes** (L1): Use `/memory-atoms` para fatos específicos.
4. **Carregar Canvas da Tarefa Anterior** (se houver): Use `/memory-canvas` para recuperar símbolos.
5. **Consolidar**: Monte um bloco de contexto com esses elementos (≤500 tokens) usando a representação simbólica.

### Durante a tarefa:

- Quando logs ou outputs de ferramentas forem grandes (>10k tokens), use `/memory-offload` para criar um canvas e manter apenas o símbolo Mermaid no contexto.
- Ao final de cada interação significativa, execute `/memory-conversation` para atualizar a memória hierárquica.

### Drilling Down:

- Se o agente precisar de mais detalhes de um símbolo, use `/memory-drill "node-id"` para recuperar o raw text.

---

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
