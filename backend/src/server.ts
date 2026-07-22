import http from 'node:http';
import { app } from './app';
import { env } from './config/env';
import redis from './config/redis';
import { logger } from './utils/logger';
import { startWorkers, stopWorkers } from './services/queue-worker.service';
import { startMcpWorkerPool, stopMcpWorkerPool } from './services/mcp-worker-pool.service';
import { closeAllQueues } from './services/queue.service';

const PORT = env.port;

const server: http.Server = app.listen(PORT, async () => {
  logger.info({ port: PORT, env: env.appEnv }, 'NexusAuto Backend started');
  await startWorkers();
  startMcpWorkerPool();
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   NexusAuto Backend                                      ║
║                                                           ║
║   Environment: ${env.appEnv.padEnd(41)}║
║   Port: ${String(PORT).padEnd(50)}║
║   Origin: ${env.frontendOrigin.padEnd(46)}║
║                                                           ║
║   Health: http://localhost:${String(PORT).padEnd(31)}║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

async function gracefulShutdown(signal: string): Promise<void> {
  logger.info({ signal }, 'Shutting down gracefully...');

  server.close((err) => {
    if (err) {
      logger.error({ err }, 'Error closing HTTP server');
      process.exit(1);
    }
  });

  try {
    await Promise.race([
      Promise.all([
        stopWorkers(),
        stopMcpWorkerPool(),
        closeAllQueues(),
        redis.quit(),
      ]),
      new Promise((_, reject) => setTimeout(() => reject(new Error('shutdown timeout')), 30000)),
    ]);
    logger.info('Graceful shutdown completed');
    process.exit(0);
  } catch (err) {
    logger.error({ err }, 'Graceful shutdown failed, forcing exit');
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));