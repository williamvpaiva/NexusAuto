import type { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().optional(),
  role: z.string().optional(),
});

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const payload = registerSchema.parse(req.body);
      const result = await AuthService.register(payload);
      return res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const payload = loginSchema.parse(req.body);
      const result = await AuthService.login(payload);
      return res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      return res.status(401).json({ success: false, error: err.message });
    }
  },

  me(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      data: (req as any).user,
    });
  }
};
