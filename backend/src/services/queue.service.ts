import { Queue, Job, type JobsOptions } from 'bullmq';
import redis from '../config/redis';
import { logger } from '../utils/logger';

export type JobType = 'webhook' | 'mcp' | 'email' | 'notification';

export interface JobPayload {
  type: JobType;
  data: Record<string, unknown>;
}

const defaultOptions: JobsOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
  removeOnComplete: { age: 3600, count: 100 },
  removeOnFail: { age: 86400, count: 50 },
};

const queues = new Map<string, Queue>();

export function getQueue(name: string): Queue {
  if (!queues.has(name)) {
    const queue = new Queue(name, {
      connection: {
        host: redis.options.host,
        port: redis.options.port,
      },
      defaultJobOptions: defaultOptions,
    });

    queue.on('error', (err) => {
      logger.error({ err, queue: name }, 'Queue error');
    });

    queues.set(name, queue);
  }
  return queues.get(name)!;
}

export async function enqueue(type: JobType, data: Record<string, unknown>, opts?: Partial<JobsOptions>): Promise<Job> {
  const queueName = type === 'mcp' ? 'mcp' : 'default';
  const queue = getQueue(queueName);
  const job = await queue.add(type, { type, data } satisfies JobPayload, opts);
  logger.info({ jobId: job.id, type, queue: queueName }, 'Job enqueued');
  return job;
}

export async function getJobStatus(jobId: string, queueName: string = 'default'): Promise<Job | undefined> {
  const queue = getQueue(queueName);
  return queue.getJob(jobId);
}

export async function getQueueMetrics(queueName: string = 'default') {
  const queue = getQueue(queueName);
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);
  return { waiting, active, completed, failed, delayed };
}

export async function drainQueue(queueName: string = 'default'): Promise<void> {
  const queue = getQueue(queueName);
  await queue.drain();
  logger.info({ queue: queueName }, 'Queue drained');
}

export async function closeAllQueues(): Promise<void> {
  await Promise.all(
    Array.from(queues.values()).map(async (q) => {
      await q.close();
    })
  );
  queues.clear();
  logger.info('All queues closed');
}
