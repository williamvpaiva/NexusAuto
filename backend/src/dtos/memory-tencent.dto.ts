import { z } from 'zod';

export const OffloadMemorySchema = z.object({
  body: z.object({
    taskId: z.string({ required_error: 'taskId é obrigatório' }),
    logs: z.union([z.string(), z.record(z.unknown()), z.array(z.unknown())], { required_error: 'logs é obrigatório' }),
    metadata: z.record(z.unknown()).optional(),
  }),
});

export const StoreConversationSchema = z.object({
  body: z.object({
    conversation: z.union([z.string(), z.array(z.unknown()), z.record(z.unknown())], { required_error: 'conversation é obrigatório' }),
    metadata: z.record(z.unknown()).optional(),
  }),
});

export const SearchTencentMemorySchema = z.object({
  query: z.object({
    query: z.string({ required_error: 'query é obrigatório' }),
    topK: z.coerce.number().optional().default(5),
  }),
});

export const GetCanvasSchema = z.object({
  params: z.object({
    taskId: z.string({ required_error: 'taskId é obrigatório' }),
  }),
});

export const DrillDownSchema = z.object({
  params: z.object({
    nodeId: z.string({ required_error: 'nodeId é obrigatório' }),
  }),
});
