import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { AppError } from '../utils/app-error';
import { usersService } from './users.service';
import { tokenService } from './token.service';

export interface AuthResponse {
  user: { id: string; name: string; email: string; role: string };
  tokens: { accessToken: string; refreshToken: string; expiresIn: number };
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await usersService.create({ name, email, password: hashedPassword });
    const tokens = await tokenService.generateTokenPair(user);
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tokens,
    };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await usersService.findByEmail(email);
    if (!user) {
      throw new AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError('Email ou senha inválidos', 401, 'INVALID_CREDENTIALS');
    }

    const tokens = await tokenService.generateTokenPair(user);
    return {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      tokens,
    };
  },
};
