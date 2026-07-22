import crypto from 'crypto';
import { db } from '../config/database';
import {
  Conversation,
  Message,
  ErrorLog,
  TokenOptimization,
  CreateConversationDTO,
  CreateMessageDTO,
  CreateErrorLogDTO,
  UpdateErrorLogDTO,
  PaginationParams,
} from '../types/memory';
import type { IMemoryRepository } from './interfaces/IMemoryRepository';

export class MemoryRepository implements IMemoryRepository {
  // ==================== CONVERSATIONS ====================

  async createConversation(data: CreateConversationDTO): Promise<Conversation> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO conversations (id, title, agent_id, session_id, created_at, updated_at, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, data.title, data.agent_id, data.session_id || id, now, now, JSON.stringify(data.metadata || {})]
    );

    return (await this.getConversationById(id))!;
  }

  async getConversationById(id: string): Promise<Conversation | undefined> {
    const row = await db.get<Conversation & { metadata: string }>(
      'SELECT * FROM conversations WHERE id = ?',
      [id]
    );

    if (!row) return undefined;

    return {
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  async getConversations(params: PaginationParams & { agent_id?: string; session_id?: string }) {
    const {
      page = 1,
      perPage = 20,
      sortBy = 'updated_at',
      order = 'desc',
      search,
      agent_id,
      session_id,
    } = params;

    const offset = (page - 1) * perPage;
    const whereClauses: string[] = [];
    const queryParams: unknown[] = [];

    if (agent_id) {
      whereClauses.push('agent_id = ?');
      queryParams.push(agent_id);
    }

    if (session_id) {
      whereClauses.push('session_id = ?');
      queryParams.push(session_id);
    }

    if (search) {
      whereClauses.push('title LIKE ?');
      queryParams.push(`%${search}%`);
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const [rows, countResult] = await Promise.all([
      db.all<Conversation & { metadata: string }>(
        `SELECT * FROM conversations ${whereClause}
         ORDER BY ${sortBy} ${order}
         LIMIT ? OFFSET ?`,
        [...queryParams, perPage, offset]
      ),
      db.get<{ total: number }>(
        `SELECT COUNT(*) as total FROM conversations ${whereClause}`,
        queryParams
      ),
    ]);

    const total = countResult?.total || 0;

    return {
      data: rows.map((row) => ({
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
      })),
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async updateConversationTokenCount(id: string, tokenCount: number): Promise<void> {
    await db.run(
      `UPDATE conversations 
       SET token_count = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [tokenCount, id]
    );
  }

  async updateConversationMessageCount(id: string, messageCount: number): Promise<void> {
    await db.run(
      `UPDATE conversations 
       SET message_count = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [messageCount, id]
    );
  }

  async deleteConversation(id: string): Promise<void> {
    await db.run('DELETE FROM conversations WHERE id = ?', [id]);
  }

  // ==================== MESSAGES ====================

  async createMessage(data: CreateMessageDTO): Promise<Message> {
    const id = crypto.randomUUID();
    const tokenCount = this.estimateTokens(data.content);

    await db.run(
      `INSERT INTO messages (id, conversation_id, role, content, token_count, created_at, metadata)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [id, data.conversation_id, data.role, data.content, tokenCount, JSON.stringify(data.metadata || {})]
    );

    // Atualizar contadores da conversa
    const conversation = await this.getConversationById(data.conversation_id);
    if (conversation) {
      await this.updateConversationMessageCount(
        data.conversation_id,
        conversation.message_count + 1
      );
    }

    return {
      id,
      conversation_id: data.conversation_id,
      role: data.role,
      content: data.content,
      token_count: tokenCount,
      created_at: new Date(),
      metadata: data.metadata,
    };
  }

  async getMessagesByConversation(
    conversationId: string,
    params?: PaginationParams
  ): Promise<{ data: Message[]; meta: { page: number; perPage: number; total: number; totalPages: number } }> {
    const { page = 1, perPage = 100 } = params || {};
    const offset = (page - 1) * perPage;

    const [rows, countResult] = await Promise.all([
      db.all<Message & { metadata: string }>(
        `SELECT * FROM messages 
         WHERE conversation_id = ?
         ORDER BY created_at ASC
         LIMIT ? OFFSET ?`,
        [conversationId, perPage, offset]
      ),
      db.get<{ total: number }>(
        `SELECT COUNT(*) as total FROM messages WHERE conversation_id = ?`,
        [conversationId]
      ),
    ]);

    const total = countResult?.total || 0;

    return {
      data: rows.map((row) => ({
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
        created_at: new Date(row.created_at),
      })),
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async getMessageById(id: string): Promise<Message | undefined> {
    const row = await db.get<Message & { metadata: string }>(
      'SELECT * FROM messages WHERE id = ?',
      [id]
    );

    if (!row) return undefined;

    return {
      ...row,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      created_at: new Date(row.created_at),
    };
  }

  async deleteMessage(id: string): Promise<void> {
    await db.run('DELETE FROM messages WHERE id = ?', [id]);
  }

  // ==================== ERROR LOGS ====================

  async createErrorLog(data: CreateErrorLogDTO): Promise<ErrorLog> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await db.run(
      `INSERT INTO error_logs 
       (id, conversation_id, error_code, error_message, error_stack, context, resolution_steps, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, ?)`,
      [
        id,
        data.conversation_id || null,
        data.error_code,
        data.error_message,
        data.error_stack || null,
        JSON.stringify(data.context || {}),
        JSON.stringify(data.resolution_steps || []),
        now,
        now,
      ]
    );

    return (await this.getErrorLogById(id))!;
  }

  async getErrorLogById(id: string): Promise<ErrorLog | undefined> {
    const row = await db.get<ErrorLog & { context: string; resolution_steps: string }>(
      'SELECT * FROM error_logs WHERE id = ?',
      [id]
    );

    if (!row) return undefined;

    return {
      ...row,
      context: row.context ? JSON.parse(row.context) : undefined,
      resolution_steps: row.resolution_steps ? JSON.parse(row.resolution_steps) : undefined,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
      resolved_at: row.resolved_at ? new Date(row.resolved_at) : undefined,
    };
  }

  async getErrorLogs(params: PaginationParams & { status?: string; conversation_id?: string }) {
    const {
      page = 1,
      perPage = 20,
      sortBy = 'created_at',
      order = 'desc',
      status,
      conversation_id,
    } = params;

    const offset = (page - 1) * perPage;
    const whereClauses: string[] = [];
    const queryParams: unknown[] = [];

    if (status) {
      whereClauses.push('status = ?');
      queryParams.push(status);
    }

    if (conversation_id) {
      whereClauses.push('conversation_id = ?');
      queryParams.push(conversation_id);
    }

    const whereClause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const [rows, countResult] = await Promise.all([
      db.all<ErrorLog & { context: string; resolution_steps: string }>(
        `SELECT * FROM error_logs ${whereClause}
         ORDER BY ${sortBy} ${order}
         LIMIT ? OFFSET ?`,
        [...queryParams, perPage, offset]
      ),
      db.get<{ total: number }>(
        `SELECT COUNT(*) as total FROM error_logs ${whereClause}`,
        queryParams
      ),
    ]);

    const total = countResult?.total || 0;

    return {
      data: rows.map((row) => ({
        ...row,
        context: row.context ? JSON.parse(row.context) : undefined,
        resolution_steps: row.resolution_steps ? JSON.parse(row.resolution_steps) : undefined,
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
        resolved_at: row.resolved_at ? new Date(row.resolved_at) : undefined,
      })),
      meta: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  async updateErrorLog(id: string, data: UpdateErrorLogDTO): Promise<ErrorLog> {
    const updates: string[] = [];
    const values: unknown[] = [];

    if (data.resolution_steps) {
      updates.push('resolution_steps = ?');
      values.push(JSON.stringify(data.resolution_steps));
    }

    if (data.resolution_summary) {
      updates.push('resolution_summary = ?');
      values.push(data.resolution_summary);
    }

    if (data.status) {
      updates.push('status = ?');
      values.push(data.status);
      if (data.status === 'resolved' || data.status === 'closed') {
        updates.push('resolved_at = CURRENT_TIMESTAMP');
      }
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');

    await db.run(
      `UPDATE error_logs SET ${updates.join(', ')} WHERE id = ?`,
      [...values, id]
    );

    return (await this.getErrorLogById(id))!;
  }

  async deleteErrorLog(id: string): Promise<void> {
    await db.run('DELETE FROM error_logs WHERE id = ?', [id]);
  }

  // ==================== TOKEN OPTIMIZATIONS ====================

  async createTokenOptimization(data: {
    conversation_id: string;
    original_token_count: number;
    optimized_token_count: number;
    strategy: 'summary' | 'truncate' | 'compress' | 'cache';
    metadata?: Record<string, unknown>;
  }): Promise<TokenOptimization> {
    const id = crypto.randomUUID();
    const compressionRatio = data.optimized_token_count / data.original_token_count;

    await db.run(
      `INSERT INTO token_optimizations 
       (id, conversation_id, original_token_count, optimized_token_count, compression_ratio, strategy, created_at, metadata)
       VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
      [
        id,
        data.conversation_id,
        data.original_token_count,
        data.optimized_token_count,
        compressionRatio,
        data.strategy,
        JSON.stringify(data.metadata || {}),
      ]
    );

    const row = await db.get<TokenOptimization & { metadata: string }>(
      'SELECT * FROM token_optimizations WHERE id = ?',
      [id]
    );

    return {
      ...row!,
      compression_ratio: parseFloat(row!.compression_ratio.toString()),
      metadata: row!.metadata ? JSON.parse(row!.metadata) : undefined,
      created_at: new Date(row!.created_at),
    };
  }

  async getTokenOptimizationsByConversation(conversationId: string): Promise<TokenOptimization[]> {
    const rows = await db.all<TokenOptimization & { metadata: string }>(
      'SELECT * FROM token_optimizations WHERE conversation_id = ? ORDER BY created_at DESC',
      [conversationId]
    );

    return rows.map((row) => ({
      ...row,
      compression_ratio: parseFloat(row.compression_ratio.toString()),
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      created_at: new Date(row.created_at),
    }));
  }

  // ==================== STATS ====================

  async getStats(): Promise<{
    totalConversations: number;
    totalMessages: number;
    totalTokens: number;
    totalErrors: number;
    openErrors: number;
    avgTokensPerConversation: number;
    cacheHitRate: number;
    lastOptimization?: Date;
  }> {
    const [
      convResult,
      msgResult,
      tokenResult,
      errResult,
      openErrResult,
      optResult,
      cacheResult,
    ] = await Promise.all([
      db.get<{ total: number }>('SELECT COUNT(*) as total FROM conversations'),
      db.get<{ total: number }>('SELECT COUNT(*) as total FROM messages'),
      db.get<{ total: number }>('SELECT COALESCE(SUM(token_count), 0) as total FROM conversations'),
      db.get<{ total: number }>('SELECT COUNT(*) as total FROM error_logs'),
      db.get<{ total: number }>("SELECT COUNT(*) as total FROM error_logs WHERE status = 'open'"),
      db.get<{ max_date: string }>('SELECT MAX(created_at) as max_date FROM token_optimizations'),
      db.get<{ total_hits: number; total_queries: number }>(
        'SELECT COALESCE(SUM(hits), 0) as total_hits, COUNT(*) as total_queries FROM query_cache'
      ),
    ]);

    const totalConversations = convResult?.total || 0;
    const totalTokens = tokenResult?.total || 0;

    return {
      totalConversations,
      totalMessages: msgResult?.total || 0,
      totalTokens,
      totalErrors: errResult?.total || 0,
      openErrors: openErrResult?.total || 0,
      avgTokensPerConversation: totalConversations > 0 ? totalTokens / totalConversations : 0,
      cacheHitRate: cacheResult?.total_queries
        ? cacheResult.total_hits / cacheResult.total_queries
        : 0,
      lastOptimization: optResult?.max_date ? new Date(optResult.max_date) : undefined,
    };
  }

  // ==================== UTILS ====================

  private estimateTokens(text: string): number {
    // Estimativa simples: ~4 caracteres por token em média
    return Math.ceil(text.length / 4);
  }

  async cacheQuery(queryHash: string, result: unknown, ttlSeconds: number = 3600): Promise<void> {
    const id = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);

    await db.run(
      `INSERT OR REPLACE INTO query_cache (id, query_hash, result, hits, created_at, expires_at)
       VALUES (?, ?, ?, COALESCE((SELECT hits FROM query_cache WHERE query_hash = ?), 0) + 1, CURRENT_TIMESTAMP, ?)`,
      [id, queryHash, JSON.stringify(result), queryHash, expiresAt.toISOString()]
    );

    // Limpar cache expirado
    await db.run('DELETE FROM query_cache WHERE expires_at < CURRENT_TIMESTAMP');
  }

  async getCachedQuery<T>(queryHash: string): Promise<T | undefined> {
    const row = await db.get<{ result: string }>(
      'SELECT result FROM query_cache WHERE query_hash = ? AND expires_at > CURRENT_TIMESTAMP',
      [queryHash]
    );

    if (!row) return undefined;

    return JSON.parse(row.result) as T;
  }

  async clearExpiredCache(): Promise<void> {
    await db.run('DELETE FROM query_cache WHERE expires_at < CURRENT_TIMESTAMP');
  }
}

export const memoryRepository = new MemoryRepository();