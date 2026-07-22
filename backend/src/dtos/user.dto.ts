import { z } from 'zod';
import type { User } from '../types/user';

export const createUserDto = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().trim().email('Email inválido'),
  password: z.string().trim().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['user', 'admin']).optional()
});

export const updateUserDto = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(),
  password: z.string().trim().min(6).optional(),
  role: z.enum(['user', 'admin']).optional()
});

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt?: string;
}

export function toUserResponse(user: any): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function toUserListResponse(users: any[]): UserResponse[] {
  return users.map(toUserResponse);
}
