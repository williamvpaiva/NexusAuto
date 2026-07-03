import { Router } from 'express';
import { healthRouter } from './health.routes';
import { usersRouter } from './users.routes';
import { authRoutes } from './auth.routes';
import memoryRouter from '../controllers/memory.controller';
import { apiLimiter } from '../middleware/rate-limiter';
import { authenticate } from '../middleware/auth';

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

// Rotas protegidas
apiRouter.use('/users', authenticate, usersRouter);
apiRouter.use('/memory', authenticate, memoryRouter);