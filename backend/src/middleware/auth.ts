import type { NextFunction, Request, Response } from 'express';
import { tokenService } from '../services/token.service';
import type { TokenPayload } from '../services/token.service';

export type AuthPayload = TokenPayload;

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token não fornecido', requestId: req.requestId },
    });
  }

  const token = header.split(' ')[1];

  tokenService.verifyAccessToken(token).then(payload => {
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Token inválido ou expirado', requestId: req.requestId },
      });
    }
    req.user = payload;
    next();
  }).catch(() => {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token inválido ou expirado', requestId: req.requestId },
    });
  });
}
