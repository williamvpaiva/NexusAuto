import { Router } from 'express';
import { healthRouter } from './health.routes';
import { usersRouter } from './users.routes';

export const apiRouter = Router();

// Health check
apiRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Polymarketing API online',
      version: '1.0.0',
      docs: '/api/v1/health'
    }
  });
});

// Routes
apiRouter.use('/health', healthRouter);
apiRouter.use('/users', usersRouter);