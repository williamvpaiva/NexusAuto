import { memoryRepository } from '../repositories/memory.repository';
import {
  CreateConversationDTO,
  CreateMessageDTO,
  CreateErrorLogDTO,
  UpdateErrorLogDTO,
  PaginationParams,
  Conversation,
  Message,
  ErrorLog,
  TokenOptimization,
  MemoryStats,
} from '../types/memory';

export class MemoryService {
  // ==================== CONVERSATIONS ====================

  async createConversation(data: CreateConversationDTO): Promise<Conversation> {
    return memoryRepository.createConversation(data);
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return memoryRepository.getConversationById(id);
  }

  async getConversations(
    params: PaginationParams & { agent_id?: string; session_id?: string }
  ) {
    return memoryRepository.getConversations(params);
  }

  async deleteConversation(id: string): Promise<void> {
    await memoryRepository.deleteConversation(id);
  }

  // ==================== MESSAGES ====================

  async createMessage(data: CreateMessageDTO): Promise<Message> {
    const message = await memoryRepository.createMessage(data);

    // Atualizar token count da conversa
    const messages = await memoryRepository.getMessagesByConversation(data.conversation_id);
    const totalTokens = messages.data.reduce((sum, msg) => sum + msg.token_count, 0);
    await memoryRepository.updateConversationTokenCount(data.conversation_id, totalTokens);

    return message;
  }

  async getMessages(conversationId: string, params?: PaginationParams) {
    return memoryRepository.getMessagesByConversation(conversationId, params);
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return memoryRepository.getMessageById(id);
  }

  async deleteMessage(id: string): Promise<void> {
    await memoryRepository.deleteMessage(id);
  }

  // ==================== ERROR LOGS ====================

  async createErrorLog(data: CreateErrorLogDTO): Promise<ErrorLog> {
    return memoryRepository.createErrorLog(data);
  }

  async getErrorLog(id: string): Promise<ErrorLog | undefined> {
    return memoryRepository.getErrorLogById(id);
  }

  async getErrorLogs(params: PaginationParams & { status?: string; conversation_id?: string }) {
    return memoryRepository.getErrorLogs(params);
  }

  async updateErrorLog(id: string, data: UpdateErrorLogDTO): Promise<ErrorLog> {
    return memoryRepository.updateErrorLog(id, data);
  }

  async resolveError(id: string, resolutionSummary: string, resolutionSteps: string[]): Promise<ErrorLog> {
    return memoryRepository.updateErrorLog(id, {
      resolution_summary: resolutionSummary,
      resolution_steps: resolutionSteps,
      status: 'resolved',
    });
  }

  async deleteErrorLog(id: string): Promise<void> {
    await memoryRepository.deleteErrorLog(id);
  }

  // ==================== TOKEN OPTIMIZATION ====================

  async optimizeConversationTokens(
    conversationId: string,
    strategy: 'summary' | 'truncate' | 'compress' | 'cache'
  ): Promise<{
    optimization: TokenOptimization;
    originalTokens: number;
    optimizedTokens: number;
    savedTokens: number;
  }> {
    const messages = await memoryRepository.getMessagesByConversation(conversationId);
    const originalTokens = messages.data.reduce((sum, msg) => sum + msg.token_count, 0);

    let optimizedTokens = originalTokens;

    // Aplicar estratégia de otimização
    switch (strategy) {
      case 'summary':
        // Simulação: resumo reduz para 30% do original
        optimizedTokens = Math.ceil(originalTokens * 0.3);
        break;
      case 'truncate':
        // Manter apenas últimas 10 mensagens
        const recentMessages = messages.data.slice(-10);
        optimizedTokens = recentMessages.reduce((sum, msg) => sum + msg.token_count, 0);
        break;
      case 'compress':
        // Compressão remove 40%
        optimizedTokens = Math.ceil(originalTokens * 0.6);
        break;
      case 'cache':
        // Cache não reduz tokens, mas melhora performance
        optimizedTokens = originalTokens;
        break;
    }

    const optimization = await memoryRepository.createTokenOptimization({
      conversation_id: conversationId,
      original_token_count: originalTokens,
      optimized_token_count: optimizedTokens,
      strategy,
      metadata: {
        message_count: messages.data.length,
        optimized_message_count: strategy === 'truncate' ? Math.min(10, messages.data.length) : messages.data.length,
      },
    });

    return {
      optimization,
      originalTokens,
      optimizedTokens,
      savedTokens: originalTokens - optimizedTokens,
    };
  }

  async getTokenOptimizations(conversationId: string): Promise<TokenOptimization[]> {
    return memoryRepository.getTokenOptimizationsByConversation(conversationId);
  }

  // ==================== STATS ====================

  async getStats(): Promise<MemoryStats> {
    return memoryRepository.getStats();
  }

  // ==================== CONTEXT MANAGEMENT ====================

  async getConversationContext(conversationId: string, maxTokens?: number): Promise<{
    conversation: Conversation;
    messages: Message[];
    totalTokens: number;
    truncated: boolean;
  }> {
    const conversation = await memoryRepository.getConversationById(conversationId);
    if (!conversation) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    const messagesResult = await memoryRepository.getMessagesByConversation(conversationId, {
      perPage: 1000,
    });

    let messages = messagesResult.data;
    let totalTokens = messages.reduce((sum, msg) => sum + msg.token_count, 0);
    let truncated = false;

    if (maxTokens && totalTokens > maxTokens) {
      // Truncar mensagens mantendo o contexto mais recente
      let runningTotal = 0;
      const truncatedMessages: Message[] = [];

      for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (runningTotal + msg.token_count <= maxTokens) {
          truncatedMessages.unshift(msg);
          runningTotal += msg.token_count;
        } else {
          break;
        }
      }

      messages = truncatedMessages;
      totalTokens = runningTotal;
      truncated = true;
    }

    return {
      conversation,
      messages,
      totalTokens,
      truncated,
    };
  }

  async clearConversationHistory(conversationId: string, keepLastN?: number): Promise<number> {
    const messages = await memoryRepository.getMessagesByConversation(conversationId);
    const toDelete = keepLastN ? messages.data.slice(0, -keepLastN) : messages.data;

    for (const message of toDelete) {
      await memoryRepository.deleteMessage(message.id);
    }

    // Atualizar contadores
    const remainingMessages = await memoryRepository.getMessagesByConversation(conversationId);
    const totalTokens = remainingMessages.data.reduce((sum, msg) => sum + msg.token_count, 0);

    await memoryRepository.updateConversationMessageCount(
      conversationId,
      remainingMessages.data.length
    );
    await memoryRepository.updateConversationTokenCount(conversationId, totalTokens);

    return toDelete.length;
  }

  // ==================== SEARCH ====================

  async searchMessages(query: string, options?: { agent_id?: string; limit?: number }) {
    const { agent_id, limit = 50 } = options || {};

    // Busca simples por conteúdo
    const allConversations = await memoryRepository.getConversations({
      agent_id,
      perPage: 1000,
    });

    const results: Array<{
      message: Message;
      conversation: Conversation;
      relevance: number;
    }> = [];

    for (const conv of allConversations.data) {
      const messages = await memoryRepository.getMessagesByConversation(conv.id, {
        perPage: 1000,
      });

      for (const msg of messages.data) {
        const lowerContent = msg.content.toLowerCase();
        const lowerQuery = query.toLowerCase();

        if (lowerContent.includes(lowerQuery)) {
          // Calcular relevância simples baseada na frequência
          const occurrences = (lowerContent.match(new RegExp(lowerQuery, 'g')) || []).length;
          const relevance = occurrences / msg.content.length;

          results.push({
            message: msg,
            conversation: conv,
            relevance,
          });
        }
      }
    }

    // Ordenar por relevância e limitar
    results.sort((a, b) => b.relevance - a.relevance);
    return results.slice(0, limit);
  }
}

export const memoryService = new MemoryService();