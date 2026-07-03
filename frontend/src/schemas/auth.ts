import { z } from 'zod';

/**
 * Schemas de Autenticação com Zod
 * 
 * Validação de login, registro e recuperação de senha
 */

/**
 * Schema de Login
 */
export const LoginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
});

export type LoginData = z.infer<typeof LoginSchema>;

/**
 * Schema de Registro
 */
export const RegisterSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome contém caracteres inválidos'),
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email muito longo'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

export type RegisterData = z.infer<typeof RegisterSchema>;

/**
 * Schema de Recuperação de Senha
 */
export const ForgotPasswordSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .max(255, 'Email muito longo')
});

export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;

/**
 * Schema de Redefinição de Senha
 */
export const ResetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Token é obrigatório'),
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

/**
 * Schema de Token de Acesso
 */
export const TokenSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  tokenType: z.literal('Bearer')
});

export type TokenData = z.infer<typeof TokenSchema>;

/**
 * Schema de Usuário Autenticado
 */
export const AuthUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional()
});

export type AuthUser = z.infer<typeof AuthUserSchema>;

/**
 * Schema de Resposta de Autenticação
 */
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: AuthUserSchema,
    token: TokenSchema
  })
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;