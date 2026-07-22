import { Worker, Job } from 'bullmq';
import { logger } from '../utils/logger';
import redis from '../config/redis';
import type { JobPayload } from './queue.service';

const workers: Worker[] = [];

export async function startWorkers(): Promise<void> {
  const defaultWorker = new Worker<JobPayload>(
    'default',
    async (job: Job<JobPayload>) => {
      logger.info({ jobId: job.id, type: job.data.type }, 'Processing job');
      switch (job.data.type) {
        case 'webhook':
          await processWebhook(job);
          break;
        case 'email':
          await processEmail(job);
          break;
        case 'notification':
          await processNotification(job);
          break;
        default:
          logger.warn({ type: job.data.type }, 'Unknown job type');
      }
    },
    {
      connection: {
        host: redis.options.host,
        port: redis.options.port,
      },
      concurrency: 5,
      lockDuration: 30000,
      maxStalledCount: 3,
    }
  );

  defaultWorker.on('completed', (job: Job) => {
    logger.info({ jobId: job.id, type: job.data.type }, 'Job completed');
  });

  defaultWorker.on('failed', (job: Job | undefined, err: Error) => {
    logger.error({ jobId: job?.id, type: job?.data.type, err }, 'Job failed');
  });

  defaultWorker.on('error', (err: Error) => {
    logger.error({ err }, 'Worker error');
  });

  workers.push(defaultWorker);

  const mcpWorker = new Worker<JobPayload>(
    'mcp',
    async (job: Job<JobPayload>) => {
      logger.info({ jobId: job.id, type: 'mcp' }, 'Processing MCP job');
      await processMcp(job);
    },
    {
      connection: {
        host: redis.options.host,
        port: redis.options.port,
      },
      concurrency: 3,
      lockDuration: 60000,
      maxStalledCount: 2,
    }
  );

  mcpWorker.on('completed', (job: Job) => {
    logger.info({ jobId: job.id }, 'MCP job completed');
  });

  mcpWorker.on('failed', (job: Job | undefined, err: Error) => {
    logger.error({ jobId: job?.id, err }, 'MCP job failed');
  });

  workers.push(mcpWorker);

  logger.info('Queue workers started');
}

async function processWebhook(job: Job<JobPayload>): Promise<void> {
  const { url, payload } = job.data.data as Record<string, unknown>;
  logger.info({ url, jobId: job.id }, 'Processing webhook');
  const response = await fetch(url as string, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Webhook failed with status ${response.status}`);
  }
}

async function processEmail(job: Job<JobPayload>): Promise<void> {
  const { to, subject } = job.data.data as Record<string, unknown>;
  logger.info({ to, subject, jobId: job.id }, 'Processing email job');
}

async function processNotification(job: Job<JobPayload>): Promise<void> {
  const { channel, message } = job.data.data as Record<string, unknown>;
  logger.info({ channel, jobId: job.id }, 'Processing notification');
}

async function processMcp(job: Job<JobPayload>): Promise<void> {
  const { skill, command } = job.data.data as Record<string, unknown>;
  logger.info({ skill, command, jobId: job.id }, 'Processing MCP command');
}

export async function stopWorkers(): Promise<void> {
  await Promise.all(
    workers.map(async (w) => {
      await w.close();
    })
  );
  logger.info('All workers stopped');
}
