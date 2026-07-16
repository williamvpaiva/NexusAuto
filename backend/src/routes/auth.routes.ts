import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { usersService } from '../services/users.service';
import { authLimiter } from '../middleware/security';
import { env } from '../config/env';
import { authenticate } from '../middleware/auth';
import { registerCsrfToken } from '../middleware/csrf';
import { tokenService } from '../services/token.service';

const router = Router();

// In-memory reset token store
const resetTokens = new Map<string, { email: string; expiresAt: number }>();

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

    // Verifica senha com bcrypt
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        error: { 
          code: 'INVALID_CREDENTIALS', 
          message: 'Email ou senha inválidos',
          requestId: req.requestId
        }
      });
    }

    // Gera par de tokens via tokenService (registra JTI para validação)
    const tokenPair = await tokenService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    console.log(`[AUTH] Login realizado: ${email}`);

    res.json({
      success: true,
      data: {
        accessToken: tokenPair.accessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
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
 * POST /api/v1/auth/register
 * Registro de novo usuário
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'name, email e password são obrigatórios', requestId: req.requestId }
      });
    }

    const users = await usersService.list();
    if (users.find(u => u.email === email)) {
      return res.status(409).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'Email já cadastrado', requestId: req.requestId }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await usersService.create({ name, email, password: hashedPassword });

    const tokenPair = await tokenService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        accessToken: tokenPair.accessToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    console.error('[AUTH] Erro no registro:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erro ao registrar usuário', requestId: req.requestId }
    });
  }
});

/**
 * POST /api/v1/auth/forgot-password
 * Solicita redefinição de senha (público, sem CSRF)
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Email é obrigatório', requestId: req.requestId }
      });
    }

    const user = await usersService.findByEmail(email);
    if (!user) {
      return res.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    resetTokens.set(resetToken, { email, expiresAt: Date.now() + 60 * 60 * 1000 });

    console.log(`[RESET] Modo dev - link de reset: /reset-password?token=${resetToken}`);

    res.json({
      success: true,
      message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
    });
  } catch (error) {
    console.error('[AUTH] Erro ao solicitar redefinição:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erro ao processar solicitação', requestId: req.requestId }
    });
  }
});

/**
 * GET /api/v1/auth/forgot-password/validate/:token
 * Valida token de redefinição de senha (público, sem CSRF)
 */
router.get('/forgot-password/validate/:token', async (req: Request, res: Response) => {
  const entry = resetTokens.get(req.params.token);
  const valid = !!entry && entry.expiresAt > Date.now();

  res.json({
    success: true,
    data: { valid }
  });
});

/**
 * POST /api/v1/auth/reset-password
 * Redefine a senha usando um token válido (público, sem CSRF)
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'token e password são obrigatórios', requestId: req.requestId }
      });
    }

    const entry = resetTokens.get(token);
    if (!entry || entry.expiresAt <= Date.now()) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_RESET_TOKEN', message: 'Token inválido ou expirado', requestId: req.requestId }
      });
    }

    const user = await usersService.findByEmail(entry.email);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_RESET_TOKEN', message: 'Usuário não encontrado', requestId: req.requestId }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await usersService.update(user.id, { password: hashedPassword });

    resetTokens.delete(token);

    res.json({
      success: true,
      message: 'Senha redefinida com sucesso.'
    });
  } catch (error) {
    console.error('[AUTH] Erro ao redefinir senha:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Erro ao redefinir senha', requestId: req.requestId }
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