import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';
import * as controller from '../controllers/email-templates.controller';

export const emailTemplatesRouter = Router();

import { createEmailTemplateDto, updateEmailTemplateDto, emailTemplateIdSchema } from '../dtos/email-template.dto';

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
emailTemplatesRouter.get('/:id', validate({ params: emailTemplateIdSchema }), controller.getById);

/**
 * @route POST /api/v1/email-templates
 */
emailTemplatesRouter.post('/', validate({ body: createEmailTemplateDto }), controller.create);

/**
 * @route PUT /api/v1/email-templates/:id
 */
emailTemplatesRouter.put('/:id', validate({ params: emailTemplateIdSchema, body: updateEmailTemplateDto }), controller.update);

/**
 * @route DELETE /api/v1/email-templates/:id
 */
emailTemplatesRouter.delete('/:id', validate({ params: emailTemplateIdSchema }), controller.remove);

/**
 * @route POST /api/v1/email-templates/:id/preview
 */
emailTemplatesRouter.post('/:id/preview', validate({ params: emailTemplateIdSchema }), controller.preview);
