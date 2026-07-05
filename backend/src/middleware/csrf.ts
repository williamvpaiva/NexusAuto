import { Request, Response, NextFunction } from 'express';

/**
 * Armazenamento de tokens CSRF (em memória)
 * 
 * EM PRODUÇÃO: Substituir por Redis com TTL automático
 * Exemplo: 
 * await redis.setex(`csrf:${token}`, 1800, userId); // 30 min
 */
interface CsrfTokenData {
  userId: string;
  expiresAt: number;
}

const csrfTokens = new Map<string, CsrfTokenData>();

/**
 * Limpa tokens expirados periodicamente
 */
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of csrfTokens.entries()) {
    if (now > data.expiresAt) {
      csrfTokens.delete(token);
    }
  }
}, 5 * 60 * 1000); // A cada 5 minutos

/**
 * Registra novo token CSRF
 */
export function registerCsrfToken(token: string, userId: string, expiresAt: number) {
  csrfTokens.set(token, { userId, expiresAt });
}

/**
 * Middleware para validar token CSRF
 * 
 * Uso:
 * app.use('/api/v1', validateCsrf); // Todas as rotas
 * router.post('/vehicles', validateCsrf, createVehicle); // Rota específica
 */
export function validateCsrf(req: Request, res: Response, next: NextFunction) {
  // Apenas valida mutations (POST, PUT, DELETE, PATCH)
  const method = req.method.toUpperCase();
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
  
  if (!isMutation) {
    return next();
  }

  // Extrai token do header
  const token = req.headers['x-csrf-token'] as string;

  if (!token) {
    console.warn('[CSRF] Token ausente em requisição:', req.method, req.path);
    return res.status(403).json({
      success: false,
      error: { 
        code: 'CSRF_MISSING', 
        message: 'Token CSRF ausente. Recarregue a página e tente novamente.' 
      }
    });
  }

  // Verifica se token existe
  const tokenData = csrfTokens.get(token);
  
  if (!tokenData) {
    console.warn('[CSRF] Token inválido:', token.substring(0, 8) + '...');
    return res.status(403).json({
      success: false,
      error: { 
        code: 'CSRF_INVALID', 
        message: 'Token CSRF inválido. Recarregue a página e tente novamente.' 
      }
    });
  }

  // Verifica expiração
  if (Date.now() > tokenData.expiresAt) {
    csrfTokens.delete(token);
    console.warn('[CSRF] Token expirado:', token.substring(0, 8) + '...');
    return res.status(403).json({
      success: false,
      error: { 
        code: 'CSRF_EXPIRED', 
        message: 'Token CSRF expirado. Recarregue a página e tente novamente.' 
      }
    });
  }

  // Verifica se token pertence ao usuário atual
  if (req.user?.userId !== tokenData.userId) {
    console.warn('[CSRF] Token não corresponde ao usuário atual');
    return res.status(403).json({
      success: false,
      error: { 
        code: 'CSRF_MISMATCH', 
        message: 'Token CSRF não corresponde ao usuário atual. Faça login novamente.' 
      }
    });
  }

  // Token válido - prossegue
  console.log('[CSRF] Token validado com sucesso para usuário:', tokenData.userId);
  next();
}

/**
 * Invalida token CSRF (logout, troca de senha, etc)
 */
export function invalidateCsrfToken(token: string) {
  csrfTokens.delete(token);
}

/**
 * Invalida todos os tokens de um usuário (logout global)
 */
export function invalidateAllUserTokens(userId: string) {
  for (const [token, data] of csrfTokens.entries()) {
    if (data.userId === userId) {
      csrfTokens.delete(token);
    }
  }
}