import { Router } from 'express';
import { env } from '../config/env';
import { db } from '../config/database';
import { getRedisClient } from '../config/redis';
import { getQueueMetrics } from '../services/queue.service';
import { getMcpPoolStatus } from '../services/mcp-worker-pool.service';
import { logger } from '../utils/logger';
import os from 'os';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  const checks: Record<string, string> = {};

  try {
    await db.get<unknown>('SELECT 1');
    checks.sqlite = 'ok';
  } catch {
    checks.sqlite = 'error';
  }

  try {
    const redis = await getRedisClient();
    if (redis) {
      await redis.ping();
      checks.redis = 'ok';
    } else {
      checks.redis = 'unavailable';
    }
  } catch {
    checks.redis = 'error';
  }

  const mem = process.memoryUsage();
  const cpus = os.cpus();
  const allOk = Object.values(checks).every((s) => s === 'ok' || s === 'unavailable');

  // Adicionando status dos workers MCP ao healthcheck principal
  const mcpStatus = getMcpPoolStatus();

  res.status(allOk ? 200 : 503).json({
    success: allOk,
    data: {
      status: allOk ? 'ok' : 'degraded',
      service: env.appName,
      version: '1.0.0', // Idealmente vindo do package.json ou env
      environment: env.appEnv,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      dependencies: checks,
      workers: {
        mcp: mcpStatus,
      },
      system: {
        memory: {
          heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + 'MB',
          heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + 'MB',
          rss: Math.round(mem.rss / 1024 / 1024) + 'MB',
        },
        cpu: {
          model: cpus.length > 0 ? cpus[0].model : 'Unknown',
          cores: cpus.length,
          loadAvg: os.loadavg(),
        }
      }
    },
  });
});

healthRouter.get('/mcp-pool', (_req, res) => {
  res.json({ success: true, data: getMcpPoolStatus() });
});

healthRouter.get('/queues', async (_req, res) => {
  try {
    const [defaultMetrics, mcpMetrics] = await Promise.all([
      getQueueMetrics('default'),
      getQueueMetrics('mcp'),
    ]);
    res.json({
      success: true,
      data: {
        default: defaultMetrics,
        mcp: mcpMetrics,
      },
    });
  } catch (err) {
    res.status(503).json({
      success: false,
      error: { code: 'QUEUE_UNAVAILABLE', message: 'Queue metrics unavailable' },
    });
  }
});

healthRouter.get('/debug/env', (_req, res) => {
  if (env.appEnv === 'production') {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Not available in production' } });
  }

  const safeKeys = [
    'APP_NAME', 'APP_ENV', 'APP_PORT',
    'DB_HOST', 'DB_PORT', 'DB_NAME',
    'REDIS_HOST', 'REDIS_PORT',
    'FRONTEND_ORIGIN',
    'LOG_LEVEL',
    'NODE_ENV',
    'JWT_EXPIRES_IN',
    'RATE_LIMIT_WINDOW_MS', 'RATE_LIMIT_MAX_REQUESTS',
    'EMAIL_FROM', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE',
  ];

  const sanitized: Record<string, string> = {};
  for (const key of safeKeys) {
    const val = process.env[key];
    if (val !== undefined) {
      sanitized[key] = val;
    }
  }

  const redactedKeys = Object.keys(process.env)
    .filter((k) => !safeKeys.includes(k) && k !== 'PATH' && k !== 'OS' && k !== 'COMSPEC')
    .sort();

  logger.info({ count: redactedKeys.length }, 'Debug env accessed');

  res.json({
    success: true,
    data: {
      environment: env.appEnv,
      runtime: process.version,
      platform: process.platform,
      arch: process.arch,
      vars: sanitized,
      redactedCount: redactedKeys.length,
    },
  });
});
