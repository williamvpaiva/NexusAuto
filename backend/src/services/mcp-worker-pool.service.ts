import { Worker, Job, UnrecoverableError } from 'bullmq';
import redis from '../config/redis';
import { logger } from '../utils/logger';
import { enqueue, type JobPayload } from './queue.service';

const SKILL_CONCURRENCY = 3;
const GLOBAL_TIMEOUT_MS = 60000;

interface McpCommand {
  skill: string;
  command: string;
  args?: Record<string, unknown>;
}

const activeJobs = new Map<string, AbortController[]>();

let worker: Worker<JobPayload> | null = null;

export function startMcpWorkerPool(): void {
  if (worker) return;

  worker = new Worker<JobPayload>(
    'mcp',
    async (job: Job<JobPayload>) => {
      const { skill, command } = job.data.data as Record<string, unknown>;
      const skillName = (skill as string) || 'unknown';
      const skillKey = `mcp:${skillName}`;

      const controllers = activeJobs.get(skillKey) || [];
      if (controllers.length >= SKILL_CONCURRENCY) {
        logger.warn({ skill: skillName, active: controllers.length }, 'Skill concurrency limit reached, requeueing');
        await enqueue('mcp', job.data.data, { delay: 1000 });
        return;
      }

      const ac = new AbortController();
      controllers.push(ac);
      activeJobs.set(skillKey, controllers);

      try {
        const timeout = setTimeout(() => {
          ac.abort();
          logger.error({ skill: skillName, command }, 'MCP command timed out');
        }, GLOBAL_TIMEOUT_MS);

        await executeMcpCommand({ skill: skillName, command: command as string, args: job.data.data.args as Record<string, unknown> | undefined }, ac.signal);

        clearTimeout(timeout);
      } finally {
        const remaining = (activeJobs.get(skillKey) || []).filter((c) => c !== ac);
        if (remaining.length > 0) {
          activeJobs.set(skillKey, remaining);
        } else {
          activeJobs.delete(skillKey);
        }
      }
    },
    {
      connection: {
        host: redis.options.host,
        port: redis.options.port,
      },
      concurrency: 3,
      lockDuration: GLOBAL_TIMEOUT_MS,
      maxStalledCount: 2,
    }
  );

  worker.on('completed', (job: Job) => {
    logger.info({ jobId: job.id }, 'MCP worker pool: job completed');
  });

  worker.on('failed', (job: Job | undefined, err: Error) => {
    if (err.name === 'AbortError' || err.message?.includes('timed out')) {
      logger.error({ jobId: job?.id }, 'MCP worker pool: job timed out');
    } else {
      logger.error({ jobId: job?.id, err }, 'MCP worker pool: job failed');
    }
  });

  logger.info('MCP worker pool started');
}

async function executeMcpCommand(cmd: McpCommand, signal: AbortSignal): Promise<void> {
  logger.info({ skill: cmd.skill, command: cmd.command }, 'Executing MCP command');
  if (signal.aborted) {
    throw new UnrecoverableError('MCP command aborted before execution');
  }
}

export function getMcpPoolStatus() {
  const skills: Record<string, { active: number; max: number }> = {};
  for (const [key, controllers] of activeJobs.entries()) {
    skills[key.replace('mcp:', '')] = { active: controllers.length, max: SKILL_CONCURRENCY };
  }
  return {
    skills,
    globalTimeoutMs: GLOBAL_TIMEOUT_MS,
  };
}

export async function stopMcpWorkerPool(): Promise<void> {
  if (worker) {
    await worker.close();
    worker = null;
  }
  for (const controllers of activeJobs.values()) {
    for (const ac of controllers) {
      ac.abort();
    }
  }
  activeJobs.clear();
  logger.info('MCP worker pool stopped');
}
