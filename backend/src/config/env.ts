import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

export const env = {
  appName: process.env.APP_NAME || 'nexusauto',
  appEnv: process.env.APP_ENV || 'development',
  port: Number(process.env.APP_PORT || 3000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  
  // Database
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT || 5432),
  dbName: process.env.DB_NAME || 'nexusauto_db',
  dbUser: process.env.DB_USER || 'nexusauto_user',
  dbPassword: process.env.DB_PASSWORD || 'nexusauto_password',
  
  // Redis
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: Number(process.env.REDIS_PORT || 6379),
  
  // Security
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Rate Limiting
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 100),
  
  // Logs
  logLevel: process.env.LOG_LEVEL || 'info',

  // Email (Resend)
  resendApiKey: process.env.RESEND_API_KEY || '',

  // Email (SMTP)
  emailFrom: process.env.EMAIL_FROM || 'noreply@nexusauto.app',
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
};