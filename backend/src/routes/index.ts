import { Router } from 'express';
import { healthRouter } from './health.routes';
import { usersRouter } from './users.routes';
import { authRoutes } from './auth.routes';
import memoryRouter from '../controllers/memory.controller';
import designRouter from './design-routes';
import { apiLimiter, memoryLimiter, usersLimiter } from '../middleware/rate-limiter';
import { authenticate } from '../middleware/auth';
import { validateCsrf } from '../middleware/csrf';

export const apiRouter = Router();

// Rate limiting em todas as rotas
apiRouter.use(apiLimiter);

// Root endpoint
apiRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'NexusAuto API online',
      version: '1.0.0',
      docs: '/api/v1/health'
    }
  });
});

// Health check
apiRouter.use('/health', healthRouter);

// Design System (UI/UX Pro Max) - Pública
apiRouter.use('/design', designRouter);

// Rotas públicas
apiRouter.use('/auth', authRoutes);

// Rotas protegidas
apiRouter.use('/users', authenticate, validateCsrf, usersLimiter, usersRouter);
apiRouter.use('/memory', authenticate, validateCsrf, memoryLimiter, memoryRouter);