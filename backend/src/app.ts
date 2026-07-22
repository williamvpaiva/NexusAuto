import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routes';
import { authRoutes } from './routes/auth.routes';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { securityHeaders, clickjackingProtection, apiLimiter } from './middleware/security';
import { requestId } from './middleware/request-id';
import { prettyError } from './middleware/pretty-error';
import { logger } from './utils/logger';
import { errorTracker } from './services/error-tracking.service';
import { metricsMiddleware, getMetrics } from './utils/metrics';

export const app = express();

// Request ID tracking
app.use(requestId);

// Security headers - Helmet com configuração customizada
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'", 'http://localhost:3000', 'http://localhost:5173'],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: []
      }
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
);

// Security headers adicionais e rate limiting
app.use(securityHeaders);
app.use(clickjackingProtection);
app.use('/api', apiLimiter);

// CORS
app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Prometheus metrics middleware
app.use(metricsMiddleware);

// Request logging (structured)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      req: { 
        method: req.method, 
        url: req.originalUrl, 
        requestId: req.requestId,
        ip: req.ip || req.socket?.remoteAddress,
        userAgent: req.get('user-agent') || 'unknown'
      },
      res: { statusCode: res.statusCode },
      durationMs: Date.now() - start,
    }, 'request completed');
  });
  next();
});

// Root endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      name: env.appName,
      status: 'running',
      environment: env.appEnv
    }
  });
});

// Prometheus Metrics endpoint
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(await getMetrics());
});

// API routes
app.use('/api/v1/auth', authRoutes);

// API routes
app.use('/api/v1', apiRouter);

// 404 handler
app.use(notFoundHandler);

// Pretty error stack (dev only, passes through to errorHandler)
app.use(prettyError);

// Global error handler
app.use(errorHandler);