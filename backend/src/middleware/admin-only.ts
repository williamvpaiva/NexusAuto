import type { NextFunction, Request, Response } from 'express';

/**
 * Middleware de autorização — permite apenas usuários com role 'admin'.
 *
 * Deve ser usado APÓS o middleware `authenticate`,
 * que é responsável por preencher `req.user`.
 */
export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Acesso restrito a administradores',
        requestId: req.requestId,
      },
    });
  }

  next();
}
