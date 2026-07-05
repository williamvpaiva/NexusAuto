import { spawn } from 'child_process';
import axios from 'axios';
import OpenWAClient from './openwa-client.js';

class OpenWAMCPBridge {
  constructor(openwaUrl = 'http://localhost:2785', apiKey) {
    this.openwaUrl = openwaUrl;
    this.apiKey = apiKey;
    this.mcpUrl = ${openwaUrl}/mcp;
    this.client = new OpenWAClient(${openwaUrl}/api, apiKey);
  }

  // ========== FERRAMENTAS MCP ==========
  // O MCP Server do OpenWA expõe ~39 ferramentas.
  // Esta ponte fornece uma interface simplificada para os agentes do NexusAuto.

  async mcpCall(tool, params) {
    const response = await axios.post(
      this.mcpUrl,
      {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          name: tool,
          arguments: params
        },
        id: Date.now()
      },
      {
        headers: {
          'Authorization': Bearer ${this.apiKey},
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  }

  // Ferramentas específicas (wrapper para facilitar o uso)

  async createSession(name) {
    return this.mcpCall('create_session', { name });
  }

  async getSessions() {
    return this.mcpCall('get_sessions', {});
  }

  async getQR(sessionId) {
    return this.mcpCall('get_qr', { sessionId });
  }

  async sendText(sessionId, chatId, text) {
    return this.mcpCall('send_text', { sessionId, chatId, text });
  }

  async sendFile(sessionId, chatId, url, filename, caption) {
    return this.mcpCall('send_file', { sessionId, chatId, url, filename, caption });
  }

  async sendImage(sessionId, chatId, url, caption) {
    return this.mcpCall('send_image', { sessionId, chatId, url, caption });
  }

  async sendAudio(sessionId, chatId, url) {
    return this.mcpCall('send_audio', { sessionId, chatId, url });
  }

  async sendVideo(sessionId, chatId, url, caption) {
    return this.mcpCall('send_video', { sessionId, chatId, url, caption });
  }

  async sendDocument(sessionId, chatId, url, filename, caption) {
    return this.mcpCall('send_document', { sessionId, chatId, url, filename, caption });
  }

  async sendReaction(sessionId, chatId, messageId, emoji) {
    return this.mcpCall('send_reaction', { sessionId, chatId, messageId, emoji });
  }

  async getMessages(sessionId, chatId, limit) {
    return this.mcpCall('get_messages', { sessionId, chatId, limit });
  }

  async getSessionStatus(sessionId) {
    return this.mcpCall('get_session_status', { sessionId });
  }

  async deleteSession(sessionId) {
    return this.mcpCall('delete_session', { sessionId });
  }

  async blockContact(sessionId, contactId) {
    return this.mcpCall('block_contact', { sessionId, contactId });
  }

  async unblockContact(sessionId, contactId) {
    return this.mcpCall('unblock_contact', { sessionId, contactId });
  }

  async addLabel(sessionId, chatId, labelId) {
    return this.mcpCall('add_label_to_chat', { sessionId, chatId, labelId });
  }

  // ========== MÉTODOS UTILITÁRIOS ==========

  // Verifica se o MCP Server está ativo
  async healthCheck() {
    try {
      const response = await axios.get(${this.openwaUrl}/health);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  // Registra webhooks para eventos do WhatsApp
  async registerWebhooks(sessionId, baseUrl) {
    const webhookUrl = ${baseUrl}/api/webhooks/openwa/${sessionId};
    return this.client.registerWebhook(sessionId, webhookUrl, [
      'message',
      'message.ack',
      'message.reaction',
      'presence',
      'group.join',
      'group.leave'
    ]);
  }
}

export default OpenWAMCPBridge;
