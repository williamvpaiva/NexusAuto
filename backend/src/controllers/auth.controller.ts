import type { Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export function login(req: Request, res: Response) {
  const payload = loginSchema.parse(req.body);
  const result = authService.login(payload.email, payload.password);

  return res.status(200).json({
    success: true,
    data: result,
  });
}

export function me(req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
}
