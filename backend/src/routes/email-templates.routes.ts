import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';
import * as controller from '../controllers/email-templates.controller';

export const emailTemplatesRouter = Router();

// ---------------------------------------------------------------------------
// Schemas de validação
// ---------------------------------------------------------------------------

const createSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório').max(100),
  subject: z.string().trim().min(1, 'Assunto é obrigatório').max(200),
  htmlBody: z.string().trim().min(1, 'HTML é obrigatório'),
});

const updateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  subject: z.string().trim().min(1).max(200).optional(),
  htmlBody: z.string().trim().min(1).optional(),
});

// ---------------------------------------------------------------------------
// Rotas
// ---------------------------------------------------------------------------

/**
 * @route GET /api/v1/email-templates
 */
emailTemplatesRouter.get('/', controller.list);

/**
 * @route GET /api/v1/email-templates/:id
 */
emailTemplatesRouter.get('/:id', controller.getById);

/**
 * @route POST /api/v1/email-templates
 */
emailTemplatesRouter.post('/', validate(createSchema), controller.create);

/**
 * @route PUT /api/v1/email-templates/:id
 */
emailTemplatesRouter.put('/:id', validate(updateSchema), controller.update);

/**
 * @route DELETE /api/v1/email-templates/:id
 */
emailTemplatesRouter.delete('/:id', controller.remove);

/**
 * @route POST /api/v1/email-templates/:id/preview
 */
emailTemplatesRouter.post('/:id/preview', controller.preview);
