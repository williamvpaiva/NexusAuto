import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { validateCsrf, registerCsrfToken } from '../middleware/csrf';

interface SessionRequest extends Request {
  session?: { userId: string };
}

const router = Router();

/**
 * Gera token CSRF para usuário autenticado
 * 
 * @route GET /api/v1/auth/csrf-token
 * @returns {string} token - Token CSRF válido por 30 minutos
 */
router.get('/csrf-token', async (req: Request, res: Response) => {
  try {
    const sessionReq = req as SessionRequest;
    
    // Verifica se usuário está autenticado
    if (!sessionReq.session?.userId) {
      return res.status(401).json({
        success: false,
        error: { 
          code: 'UNAUTHORIZED', 
          message: 'Usuário não autenticado. Faça login novamente.' 
        }
      });
    }

    // Gera token único criptograficamente seguro
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutos

    // Registra token no middleware
    registerCsrfToken(token, sessionReq.session.userId, expiresAt);

    console.log('[CSRF] Token gerado para usuário:', sessionReq.session.userId);

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
        message: 'Erro ao gerar token CSRF. Tente recarregar a página.' 
      }
    });
  }
});

/**
 * Rota de teste para validar CSRF
 * Apenas para desenvolvimento/testing
 */
router.post('/csrf-test', validateCsrf, async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'CSRF validado com sucesso!',
    data: req.body
  });
});

export { router as authRoutes };