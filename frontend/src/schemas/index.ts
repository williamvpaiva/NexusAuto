import { z } from 'zod';

/**
 * Schemas de Validação com Zod
 * 
 * Valida dados em runtime para garantir type-safety e prevenir injeção de dados maliciosos.
 */

/**
 * Schema de Usuário
 */
export const UserSchema = z.object({
  id: z.string().uuid('ID inválido'),
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome contém caracteres inválidos'),
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  createdAt: z.string().datetime('Data de criação inválida'),
  updatedAt: z.string().datetime('Data de atualização inválida').optional()
});

export type User = z.infer<typeof UserSchema>;

/**
 * Schema de Health Check
 */
export const HealthSchema = z.object({
  status: z.string(),
  service: z.string(),
  uptime: z.number().positive(),
  timestamp: z.string().datetime(),
  environment: z.string(),
  version: z.string()
});

export type Health = z.infer<typeof HealthSchema>;

/**
 * Schema de Conversa (Memory)
 */
export const ConversationSchema = z.object({
  id: z.string().uuid(),
  title: z.string()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título muito longo'),
  agent_id: z.string(),
  session_id: z.string(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  token_count: z.number().int().positive(),
  message_count: z.number().int().positive()
});

export type Conversation = z.infer<typeof ConversationSchema>;

/**
 * Valida e sanitiza dados de resposta da API
 */
export function validateApiResponse<T>(data: unknown, schema: z.ZodSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = (error as any).issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join('; ');
      console.error('[Validation Error]', messages);
      throw new Error(`Dados inválidos da API: ${messages}`);
    }
    throw error;
  }
}

/**
 * Valida array de respostas
 */
export function validateApiArray<T>(data: unknown, schema: z.ZodSchema<T>): T[] {
  if (!Array.isArray(data)) {
    throw new Error('Resposta da API deve ser um array');
  }
  
  return data.map((item) => validateApiResponse(item, schema));
}