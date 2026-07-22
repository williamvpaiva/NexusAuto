import type {
  Conversation,
  Message,
  ErrorLog,
  TokenOptimization,
  CreateConversationDTO,
  CreateMessageDTO,
  CreateErrorLogDTO,
  UpdateErrorLogDTO,
  MemoryStats,
  PaginationParams,
} from '../../types/memory';

export interface IMemoryRepository {
  createConversation(data: CreateConversationDTO): Promise<Conversation>;
  getConversationById(id: string): Promise<Conversation | undefined>;
  getConversations(params: PaginationParams & { agent_id?: string; session_id?: string }): Promise<{
    data: Conversation[];
    meta: { page: number; perPage: number; total: number; totalPages: number };
  }>;
  updateConversationTokenCount(id: string, tokenCount: number): Promise<void>;
  updateConversationMessageCount(id: string, messageCount: number): Promise<void>;
  deleteConversation(id: string): Promise<void>;

  createMessage(data: CreateMessageDTO): Promise<Message>;
  getMessagesByConversation(conversationId: string, params?: PaginationParams): Promise<{
    data: Message[];
    meta: { page: number; perPage: number; total: number; totalPages: number };
  }>;
  getMessageById(id: string): Promise<Message | undefined>;
  deleteMessage(id: string): Promise<void>;

  createErrorLog(data: CreateErrorLogDTO): Promise<ErrorLog>;
  getErrorLogById(id: string): Promise<ErrorLog | undefined>;
  getErrorLogs(params: PaginationParams & { status?: string; conversation_id?: string }): Promise<{
    data: ErrorLog[];
    meta: { page: number; perPage: number; total: number; totalPages: number };
  }>;
  updateErrorLog(id: string, data: UpdateErrorLogDTO): Promise<ErrorLog>;
  deleteErrorLog(id: string): Promise<void>;

  createTokenOptimization(data: {
    conversation_id: string;
    original_token_count: number;
    optimized_token_count: number;
    strategy: 'summary' | 'truncate' | 'compress' | 'cache';
    metadata?: Record<string, unknown>;
  }): Promise<TokenOptimization>;
  getTokenOptimizationsByConversation(conversationId: string): Promise<TokenOptimization[]>;

  getStats(): Promise<MemoryStats>;
  cacheQuery(queryHash: string, result: unknown, ttlSeconds?: number): Promise<void>;
  getCachedQuery<T>(queryHash: string): Promise<T | undefined>;
  clearExpiredCache(): Promise<void>;
}
