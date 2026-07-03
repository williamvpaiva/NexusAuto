import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  agent_id: z.string().min(1, 'agent_id is required'),
  session_id: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const createMessageSchema = z.object({
  conversation_id: z.string().min(1, 'conversation_id is required'),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'content is required'),
  metadata: z.record(z.unknown()).optional(),
});

export const createErrorLogSchema = z.object({
  conversation_id: z.string().optional(),
  error_code: z.string().min(1, 'error_code is required'),
  error_message: z.string().min(1, 'error_message is required'),
  error_stack: z.string().optional(),
  context: z.record(z.unknown()).optional(),
  resolution_steps: z.array(z.string()).optional(),
});

export const updateErrorLogSchema = z.object({
  resolution_steps: z.array(z.string()).optional(),
  resolution_summary: z.string().optional(),
  status: z.enum(['open', 'investigating', 'resolved', 'closed']).optional(),
});

export const resolveErrorSchema = z.object({
  resolution_summary: z.string().min(1, 'resolution_summary is required'),
  resolution_steps: z.array(z.string()).min(1, 'resolution_steps must be a non-empty array'),
});

export const optimizeTokensSchema = z.object({
  strategy: z.enum(['summary', 'truncate', 'compress', 'cache']),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(1000).optional(),
  sortBy: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  search: z.string().optional(),
});
