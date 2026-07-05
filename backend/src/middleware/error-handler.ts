import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';

const env = process.env.APP_ENV || 'development';
const isDev = env === 'development';

export function notFoundHandler(req: Request, res: Response) {
  return res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
      requestId: req.requestId
    }
  });
}

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = req.requestId;

  if (error instanceof ZodError) {
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dados inválidos',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          code: err.code,
          message: err.message
        })),
        requestId
      }
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        requestId
      }
    });
  }

  const message = error instanceof Error ? error.message : 'Erro interno do servidor';
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(JSON.stringify({
    level: 'error',
    timestamp: new Date().toISOString(),
    requestId,
    method: req.method,
    url: req.originalUrl,
    message,
    stack: isDev ? stack : undefined
  }));

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDev ? message : 'Erro interno do servidor',
      ...(isDev && stack ? { stack } : {}),
      requestId
    }
  });
}
