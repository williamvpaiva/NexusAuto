import axios from 'axios';

class OpenWAClient {
  constructor(baseURL = 'http://localhost:2785/api', apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': Bearer ,
        'Content-Type': 'application/json'
      }
    });
  }

  // ========== SESSÕES ==========
  async createSession(name) {
    const response = await this.client.post('/sessions', { name });
    return response.data;
  }

  async getSessions() {
    const response = await this.client.get('/sessions');
    return response.data;
  }

  async getSessionStatus(sessionId) {
    const response = await this.client.get(/sessions//status);
    return response.data;
  }

  async getSessionQR(sessionId) {
    const response = await this.client.get(/sessions//qr);
    return response.data;
  }

  async deleteSession(sessionId) {
    const response = await this.client.delete(/sessions/);
    return response.data;
  }

  // ========== MENSAGENS ==========
  async sendText(sessionId, chatId, text) {
    const response = await this.client.post(/sessions//messages/send-text, {
      chatId,
      text
    });
    return response.data;
  }

  async sendFile(sessionId, chatId, url, filename, caption = '') {
    const response = await this.client.post(/sessions//messages/send-file, {
      chatId,
      url,
      filename,
      caption
    });
    return response.data;
  }

  async sendImage(sessionId, chatId, url, caption = '') {
    const response = await this.client.post(/sessions//messages/send-image, {
      chatId,
      url,
      caption
    });
    return response.data;
  }

  async sendAudio(sessionId, chatId, url) {
    const response = await this.client.post(/sessions//messages/send-audio, {
      chatId,
      url
    });
    return response.data;
  }

  async sendVideo(sessionId, chatId, url, caption = '') {
    const response = await this.client.post(/sessions//messages/send-video, {
      chatId,
      url,
      caption
    });
    return response.data;
  }

  async sendDocument(sessionId, chatId, url, filename, caption = '') {
    const response = await this.client.post(/sessions//messages/send-document, {
      chatId,
      url,
      filename,
      caption
    });
    return response.data;
  }

  async sendReaction(sessionId, chatId, messageId, emoji) {
    const response = await this.client.post(/sessions//messages/send-reaction, {
      chatId,
      messageId,
      emoji
    });
    return response.data;
  }

  async sendBulk(sessionId, messages) {
    const response = await this.client.post(/sessions//messages/send-bulk, {
      messages
    });
    return response.data;
  }

  // ========== MENSAGENS (leitura) ==========
  async getMessages(sessionId, chatId, limit = 50) {
    const response = await this.client.get(/sessions//chats//messages, {
      params: { limit }
    });
    return response.data;
  }

  async getMessageStatus(sessionId, messageId) {
    const response = await this.client.get(/sessions//messages//status);
    return response.data;
  }

  // ========== WEBHOOKS ==========
  async registerWebhook(sessionId, url, events = ['*']) {
    const response = await this.client.post(/sessions//webhooks, {
      url,
      events
    });
    return response.data;
  }

  async getWebhooks(sessionId) {
    const response = await this.client.get(/sessions//webhooks);
    return response.data;
  }

  async deleteWebhook(sessionId, webhookId) {
    const response = await this.client.delete(/sessions//webhooks/);
    return response.data;
  }

  // ========== GRUPOS ==========
  async createGroup(sessionId, name, participants) {
    const response = await this.client.post(/sessions//groups, {
      name,
      participants
    });
    return response.data;
  }

  async getGroups(sessionId) {
    const response = await this.client.get(/sessions//groups);
    return response.data;
  }

  async addParticipant(sessionId, groupId, contactId) {
    const response = await this.client.post(/sessions//groups//participants, {
      contactId
    });
    return response.data;
  }

  async removeParticipant(sessionId, groupId, contactId) {
    const response = await this.client.delete(/sessions//groups//participants/);
    return response.data;
  }

  // ========== CONTATOS ==========
  async getContacts(sessionId) {
    const response = await this.client.get(/sessions//contacts);
    return response.data;
  }

  async getContact(sessionId, contactId) {
    const response = await this.client.get(/sessions//contacts/);
    return response.data;
  }

  async blockContact(sessionId, contactId) {
    const response = await this.client.post(/sessions//contacts//block);
    return response.data;
  }

  async unblockContact(sessionId, contactId) {
    const response = await this.client.post(/sessions//contacts//unblock);
    return response.data;
  }
}

export default OpenWAClient;
