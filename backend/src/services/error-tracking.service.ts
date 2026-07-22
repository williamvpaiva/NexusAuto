import { logger } from '../utils/logger';

export interface ErrorTrackingAdapter {
  captureException(error: unknown, context?: Record<string, unknown>): void;
  captureMessage(message: string, level?: 'info' | 'warn' | 'error', context?: Record<string, unknown>): void;
  flush?(): Promise<void>;
}

class ConsoleErrorTrackingAdapter implements ErrorTrackingAdapter {
  captureException(error: unknown, context?: Record<string, unknown>): void {
    logger.error({ err: error, ...context }, 'Error tracked');
  }

  captureMessage(message: string, level: 'info' | 'warn' | 'error' = 'info', context?: Record<string, unknown>): void {
    logger[level]({ ...context }, message);
  }
}

class CompositeErrorTrackingAdapter implements ErrorTrackingAdapter {
  constructor(private readonly adapters: ErrorTrackingAdapter[]) {}

  captureException(error: unknown, context?: Record<string, unknown>): void {
    for (const adapter of this.adapters) {
      try {
        adapter.captureException(error, context);
      } catch (e) {
        logger.error({ err: e }, 'Error tracking adapter failed');
      }
    }
  }

  captureMessage(message: string, level: 'info' | 'warn' | 'error' = 'info', context?: Record<string, unknown>): void {
    for (const adapter of this.adapters) {
      try {
        adapter.captureMessage(message, level, context);
      } catch (e) {
        logger.error({ err: e }, 'Error tracking adapter failed');
      }
    }
  }

  async flush(): Promise<void> {
    await Promise.all(
      this.adapters.map(async (adapter) => {
        try {
          await adapter.flush?.();
        } catch (e) {
          logger.error({ err: e }, 'Error tracking adapter flush failed');
        }
      })
    );
  }
}

let instance: ErrorTrackingAdapter = new ConsoleErrorTrackingAdapter();

export const errorTracker = {
  getAdapter: () => instance,

  setAdapter(adapter: ErrorTrackingAdapter): void {
    instance = adapter;
    logger.info('Error tracking adapter changed');
  },

  addAdapter(adapter: ErrorTrackingAdapter): void {
    if (instance instanceof CompositeErrorTrackingAdapter) {
      instance = new CompositeErrorTrackingAdapter([...adaptersFromInstance(instance), adapter]);
    } else {
      instance = new CompositeErrorTrackingAdapter([instance, adapter]);
    }
    logger.info('Error tracking adapter added');
  },

  captureException(error: unknown, context?: Record<string, unknown>): void {
    instance.captureException(error, context);
  },

  captureMessage(message: string, level?: 'info' | 'warn' | 'error', context?: Record<string, unknown>): void {
    instance.captureMessage(message, level, context);
  },

  async flush(): Promise<void> {
    await instance.flush?.();
  },
};

function adaptersFromInstance(composite: CompositeErrorTrackingAdapter): ErrorTrackingAdapter[] {
  return [];
}

process.on('uncaughtException', (error) => {
  errorTracker.captureException(error, { type: 'uncaughtException' });
});

process.on('unhandledRejection', (reason) => {
  errorTracker.captureException(reason, { type: 'unhandledRejection' });
});
