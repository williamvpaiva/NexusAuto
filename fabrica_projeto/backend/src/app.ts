import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routes';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error-handler';

export const app = express();

// Security headers
app.use(helmet());

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
app.use('/api/v1', apiRouter);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);