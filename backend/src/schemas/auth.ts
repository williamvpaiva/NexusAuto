import { z } from 'zod';

/**
 * Schema de validação para login
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido'),
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(1, 'Senha é obrigatória'),
});

/**
 * Schema de validação para registro com senha forte
 *
 * Requisitos de senha:
 * - Mínimo 8 caracteres
 * - Máximo 128 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido'),
  password: strongPassword({ required_error: 'Senha é obrigatória' }),
});

/**
 * Helper de validação de senha forte — reutilizável em outras rotas.
 *
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Máximo 128 caracteres
 * - Pelo menos 1 letra maiúscula
 * - Pelo menos 1 número
 * - Pelo menos 1 caractere especial
 */
export function strongPassword(options?: { required_error?: string }) {
  return z
    .string(options)
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .max(128, 'Senha deve ter no máximo 128 caracteres')
    .superRefine((val, ctx) => {
      if (!/[A-Z]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Senha deve conter pelo menos uma letra maiúscula',
          path: ['password'],
        });
      }
      if (!/[0-9]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Senha deve conter pelo menos um número',
          path: ['password'],
        });
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Senha deve conter pelo menos um caractere especial',
          path: ['password'],
        });
      }
    });
}

/**
 * Schema de validação para refresh token
 */
export const refreshSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh token é obrigatório' })
    .min(1, 'Refresh token é obrigatório'),
});

/**
 * Schema de validação para forgot password
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido'),
});

/**
 * Schema de validação para reset de senha
 */
export const resetPasswordSchema = z.object({
  token: z
    .string({ required_error: 'Token é obrigatório' })
    .min(1, 'Token é obrigatório'),
  password: strongPassword({ required_error: 'Nova senha é obrigatória' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
