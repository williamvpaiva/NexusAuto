import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routes';
import { authRoutes } from './routes/auth.routes';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { securityHeaders, clickjackingProtection, apiLimiter } from './middleware/security';
import { validateCsrf } from './middleware/csrf';

export const app = express();

// Security headers - Helmet com configuração customizada
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Necessário para CSS-in-JS
        imgSrc: ["'self'", 'data:', 'https:'],
        fontSrc: ["'self'"],
        connectSrc: ["'self'", 'http://localhost:3000', 'http://localhost:5173'],
        frameAncestors: ["'none'"], // Previne clickjacking
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: []
      }
    },
    frameguard: { action: 'deny' }, // X-Frame-Options: DENY
    noSniff: true, // X-Content-Type-Options: nosniff
    xssFilter: true, // X-XSS-Protection
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

// Request logging (development)
if (env.appEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

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

// API routes
app.use('/api/v1/auth', authRoutes);

// CSRF protection para todas as mutations da API
app.use('/api/v1', validateCsrf);

// API routes
app.use('/api/v1', apiRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);