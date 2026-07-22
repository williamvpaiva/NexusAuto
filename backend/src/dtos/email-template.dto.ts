import { z } from 'zod';

export const createEmailTemplateDto = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100),
  subject: z.string().trim().min(1, 'Assunto é obrigatório').max(200),
  htmlBody: z.string().trim().min(1, 'HTML é obrigatório'),
});

export const updateEmailTemplateDto = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  subject: z.string().trim().min(1).max(200).optional(),
  htmlBody: z.string().trim().min(1).optional(),
});

export const emailTemplateIdSchema = z.object({
  id: z.string().uuid('ID inválido'),
});

export function toEmailTemplateResponse(template: any) {
  return {
    id: template.id,
    name: template.name,
    subject: template.subject,
    htmlBody: template.htmlBody,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
  };
}
