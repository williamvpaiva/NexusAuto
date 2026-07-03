import { z } from 'zod';
import { usersService } from '../services/users.service';
import { asyncHandler } from '../utils/async-handler';

const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().trim().email('Email inválido')
});

const updateUserSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional()
});

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await usersService.list();
  res.json({ success: true, data: users, meta: { total: users.length } });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await usersService.findById(req.params.id);
  res.json({ success: true, data: user });
});

export const createUser = asyncHandler(async (req, res) => {
  const payload = createUserSchema.parse(req.body);
  const user = await usersService.create(payload);
  res.status(201).json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const payload = updateUserSchema.parse(req.body);
  const user = await usersService.update(req.params.id, payload);
  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await usersService.delete(req.params.id);
  res.status(204).send();
});
