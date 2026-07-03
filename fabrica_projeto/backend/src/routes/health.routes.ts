import { Router } from 'express';
import { env } from '../config/env';

export const healthRouter = Router();

/**
 * GET /api/v1/health
 * Healthcheck da API
 */
healthRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: env.appName,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: env.appEnv,
      version: '1.0.0'
    }
  });
});