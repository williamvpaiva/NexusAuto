import type { Request, Response } from 'express';
import { z } from 'zod';
import { LeadService } from '../services/lead.service';

const webhookSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  source: z.string().min(1, 'Fonte é obrigatória'),
  interest: z.string().optional(),
});

export const leadController = {
  async handleWebhook(req: Request, res: Response) {
    try {
      // API Key check (dummy security measure)
      const apiKey = req.headers['x-api-key'];
      const expectedKey = process.env.LEAD_WEBHOOK_SECRET || 'nexus_default_webhook_key';
      if (apiKey !== expectedKey) {
        return res.status(401).json({ success: false, error: 'Unauthorized webhook' });
      }

      const payload = webhookSchema.parse(req.body);
      const result = await LeadService.ingestWebhook(payload);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }
};
