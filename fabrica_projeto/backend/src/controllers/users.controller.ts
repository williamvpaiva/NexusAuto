import type { Request, Response } from 'express';
import { z } from 'zod';
import { usersService } from '../services/users.service';

const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().trim().email('Email inválido')
});

const updateUserSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional()
});

/**
 * GET /api/v1/users
 * Lista todos os usuários
 */
export function listUsers(_req: Request, res: Response) {
  const users = usersService.list();

  return res.status(200).json({
    success: true,
    data: users,
    meta: {
      total: users.length
    }
  });
}

/**
 * GET /api/v1/users/:id
 * Busca usuário por ID
 */
export function getUserById(req: Request, res: Response) {
  const user = usersService.findById(req.params.id);

  return res.status(200).json({
    success: true,
    data: user
  });
}

/**
 * POST /api/v1/users
 * Cria novo usuário
 */
export function createUser(req: Request, res: Response) {
  const payload = createUserSchema.parse(req.body);

  const user = usersService.create(payload);

  return res.status(201).json({
    success: true,
    data: user
  });
}

/**
 * PUT /api/v1/users/:id
 * Atualiza usuário (completo)
 */
export function updateUser(req: Request, res: Response) {
  const payload = updateUserSchema.parse(req.body);

  const user = usersService.update(req.params.id, payload);

  return res.status(200).json({
    success: true,
    data: user
  });
}

/**
 * DELETE /api/v1/users/:id
 * Remove usuário
 */
export function deleteUser(req: Request, res: Response) {
  usersService.delete(req.params.id);

  return res.status(204).send();
}