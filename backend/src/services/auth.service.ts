import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';
import type { AuthPayload } from '../middleware/auth';

const ADMIN_EMAIL = 'admin@polymarketing.com';
const ADMIN_PASSWORD = 'admin123';

export const authService = {
  login(email: string, password: string): { token: string; user: { id: string; email: string; name: string } } {
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      throw new AppError('Credenciais inválidas', 401, 'INVALID_CREDENTIALS');
    }

    const payload: AuthPayload = { userId: 'admin-001', email: ADMIN_EMAIL };
    const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as jwt.SignOptions);

    return {
      token,
      user: { id: 'admin-001', email: ADMIN_EMAIL, name: 'Administrador' },
    };
  },
};
