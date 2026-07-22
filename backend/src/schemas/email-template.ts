import { z } from 'zod';

export const createEmailTemplateSchema = z.object({
  name: z.string({ required_error: 'Nome é obrigatório' }).trim().min(1, 'Nome é obrigatório').max(100),
  subject: z.string({ required_error: 'Assunto é obrigatório' }).trim().min(1, 'Assunto é obrigatório').max(200),
  htmlBody: z.string({ required_error: 'HTML é obrigatório' }).trim().min(1, 'HTML é obrigatório'),
});

export const updateEmailTemplateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  subject: z.string().trim().min(1).max(200).optional(),
  htmlBody: z.string().trim().min(1).optional(),
});

export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateSchema>;
export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateSchema>;
