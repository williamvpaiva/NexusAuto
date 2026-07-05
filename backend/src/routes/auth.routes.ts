import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { usersService } from '../services/users.service';
import { authLimiter } from '../middleware/security';
import { env } from '../config/env';
import { authenticate } from '../middleware/auth';
import { registerCsrfToken } from '../middleware/csrf';

const router = Router();

/**
 * POST /api/v1/auth/login
 * Login de usuário com email e senha (público, sem CSRF)
 */
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { 
          code: 'INVALID_INPUT', 
          message: 'Email e senha são obrigatórios',
          requestId: req.requestId
        }
      });
    }

    // Busca usuário
    const users = await usersService.list();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { 
          code: 'INVALID_CREDENTIALS', 
          message: 'Email ou senha inválidos',
          requestId: req.requestId
        }
      });
    }

    // Verifica senha (em produção usar bcrypt)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        error: { 
          code: 'INVALID_CREDENTIALS', 
          message: 'Email ou senha inválidos',
          requestId: req.requestId
        }
      });
    }

    // Gera JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
    );

    console.log(`[AUTH] Login realizado: ${email}`);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('[AUTH] Erro no login:', error);
    
    res.status(500).json({
      success: false,
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Erro ao realizar login',
        requestId: req.requestId
      }
    });
  }
});

/**
 * GET /api/v1/auth/csrf-token
 * Gera token CSRF para usuário autenticado
 */
router.get('/csrf-token', authenticate, async (req: Request, res: Response) => {
  try {
    if (!req.user?.userId) {
      return res.status(401).json({
        success: false,
        error: { 
          code: 'UNAUTHORIZED', 
          message: 'Usuário não autenticado. Faça login novamente.',
          requestId: req.requestId
        }
      });
    }

    // Gera token único criptograficamente seguro
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutos

    // Registra token no middleware
    registerCsrfToken(token, req.user.userId, expiresAt);

    console.log('[CSRF] Token gerado para usuário:', req.user.userId);

    res.json({
      success: true,
      data: { 
        token,
        expiresAt,
        expiresIn: 30 * 60 // segundos
      }
    });
  } catch (error) {
    console.error('[CSRF] Erro ao gerar token:', error);
    
    res.status(500).json({
      success: false,
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Erro ao gerar token CSRF. Tente recarregar a página.',
        requestId: req.requestId
      }
    });
  }
});

/**
 * POST /api/v1/auth/csrf-test
 * Rota de teste para validar CSRF
 * Apenas para desenvolvimento/testing
 */
router.post('/csrf-test', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'CSRF validado com sucesso!',
    data: req.body
  });
});

export { router as authRoutes };