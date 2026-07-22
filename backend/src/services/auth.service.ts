import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_nexus_auto_2026';

export class AuthService {
  static async register(data: any) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role || 'CLIENT'
      }
    });
    return this.generateTokens(user);
  }

  static async login(data: any) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Invalid credentials');
    
    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) throw new Error('Invalid credentials');
    
    return this.generateTokens(user);
  }

  static async generateTokens(user: any) {
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
  }
}
