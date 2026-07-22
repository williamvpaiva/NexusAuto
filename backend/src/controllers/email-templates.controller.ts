import { asyncHandler } from '../utils/async-handler';
import { emailTemplatesService } from '../services/email-templates.service';
import { toEmailTemplateResponse } from '../dtos/email-template.dto';
import type { Request, Response } from 'express';

// ---------------------------------------------------------------------------
// GET /api/v1/email-templates
// ---------------------------------------------------------------------------
export const list = asyncHandler(async (_req: Request, res: Response) => {
  const templates = await emailTemplatesService.list();
  res.json({ success: true, data: templates.map(toEmailTemplateResponse), meta: { total: templates.length } });
});

// ---------------------------------------------------------------------------
// GET /api/v1/email-templates/:id
// ---------------------------------------------------------------------------
export const getById = asyncHandler(async (req: Request, res: Response) => {
  const template = await emailTemplatesService.findById(req.params.id);
  res.json({ success: true, data: toEmailTemplateResponse(template) });
});

// ---------------------------------------------------------------------------
// POST /api/v1/email-templates
// ---------------------------------------------------------------------------
export const create = asyncHandler(async (req: Request, res: Response) => {
  const template = await emailTemplatesService.create(req.body);
  res.status(201).json({ success: true, data: toEmailTemplateResponse(template) });
});

// ---------------------------------------------------------------------------
// PUT /api/v1/email-templates/:id
// ---------------------------------------------------------------------------
export const update = asyncHandler(async (req: Request, res: Response) => {
  const template = await emailTemplatesService.update(req.params.id, req.body);
  res.json({ success: true, data: toEmailTemplateResponse(template) });
});

// ---------------------------------------------------------------------------
// DELETE /api/v1/email-templates/:id
// ---------------------------------------------------------------------------
export const remove = asyncHandler(async (req: Request, res: Response) => {
  await emailTemplatesService.delete(req.params.id);
  res.status(204).send();
});

// ---------------------------------------------------------------------------
// POST /api/v1/email-templates/:id/preview
// Renderiza o template com variáveis de exemplo para preview
// ---------------------------------------------------------------------------
export const preview = asyncHandler(async (req: Request, res: Response) => {
  const template = await emailTemplatesService.findById(req.params.id);
  const exampleVars: Record<string, string> = {
    RESET_LINK: `${req.protocol}://${req.get('host')}/reset-password?token=exemplo-token-123`,
  };
  const rendered = await emailTemplatesService.render(template.name, exampleVars);
  res.json({ success: true, data: rendered });
});
