import { Router } from 'express';
import { healthRouter } from './health.routes';
import { usersRouter } from './users.routes';
import { vehiclesRouter } from './vehicles.routes';
import { authRoutes } from './auth.routes';
import { leadRoutes } from './lead.routes';
import { tarefasRouter } from './tarefas.routes';
import memoryRouter from '../controllers/memory.controller';
import tencentMemoryRouter from './memory-tencent-routes';
import designRouter from './design-routes';
import { apiLimiter, memoryLimiter, usersLimiter, authLimiter } from '../middleware/rate-limiter';
import { authenticate } from '../middleware/auth';
import { adminOnly } from '../middleware/admin-only';
import { validateCsrf } from '../middleware/csrf';
import { cacheMiddleware } from '../middleware/cache';
import { adminRouter } from './admin.routes';

export const apiRouter = Router();

// Rate limiting em todas as rotas
apiRouter.use(apiLimiter);

// Cache global para rotas GET (Fallback para DB caso não ache no Redis)
apiRouter.use(cacheMiddleware({ ttl: 60, tags: ['api'] }));

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
apiRouter.use('/leads', leadRoutes);

// Rotas do CRUD (Públicas para teste)
apiRouter.use('/crud-tarefas-test', tarefasRouter);

// Rotas protegidas (authLimiter usa user.id como chave = 1000 req/min)
const protectedRoutes = [authLimiter, authenticate, validateCsrf];
apiRouter.use('/users', ...protectedRoutes, usersLimiter, usersRouter);
apiRouter.use('/memory', ...protectedRoutes, memoryLimiter, memoryRouter);
apiRouter.use('/memory/tencent', ...protectedRoutes, memoryLimiter, tencentMemoryRouter);
apiRouter.use('/veiculos', ...protectedRoutes, vehiclesRouter);
apiRouter.use('/admin', ...protectedRoutes, adminOnly, adminRouter);