// Types para o sistema de memória persistente de IA

export interface Conversation {
  id: string;
  title: string;
  agent_id: string;
  session_id: string;
  created_at: Date;
  updated_at: Date;
  token_count: number;
  message_count: number;
  metadata?: Record<string, unknown>;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  token_count: number;
  created_at: Date;
  metadata?: Record<string, unknown>;
}

export interface ErrorLog {
  id: string;
  conversation_id?: string;
  error_code: string;
  error_message: string;
  error_stack?: string;
  context?: Record<string, unknown>;
  resolution_steps?: string[];
  resolution_summary?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
}

export interface TokenOptimization {
  id: string;
  conversation_id: string;
  original_token_count: number;
  optimized_token_count: number;
  compression_ratio: number;
  strategy: 'summary' | 'truncate' | 'compress' | 'cache';
  created_at: Date;
  metadata?: Record<string, unknown>;
}

export interface MemoryStats {
  totalConversations: number;
  totalMessages: number;
  totalTokens: number;
  totalErrors: number;
  openErrors: number;
  avgTokensPerConversation: number;
  cacheHitRate: number;
  lastOptimization?: Date;
}

export interface CreateConversationDTO {
  title: string;
  agent_id: string;
  session_id?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateMessageDTO {
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface CreateErrorLogDTO {
  conversation_id?: string;
  error_code: string;
  error_message: string;
  error_stack?: string;
  context?: Record<string, unknown>;
  resolution_steps?: string[];
}

export interface UpdateErrorLogDTO {
  resolution_steps?: string[];
  resolution_summary?: string;
  status?: 'open' | 'investigating' | 'resolved' | 'closed';
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown[];
  };
}