import pino from 'pino';
import { env } from '../config/env';

const isDev = env.appEnv === 'development';

export const logger = pino({
  level: env.logLevel,
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
  serializers: {
    req: (req: { method?: string; url?: string; requestId?: string }) => ({
      method: req.method,
      url: req.url,
      requestId: req.requestId,
    }),
    res: (res: { statusCode?: number }) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
  redact: {
    paths: ['password', 'token', 'authorization', 'cookie', 'secret', 'apiKey', 'Authorization'],
    censor: '[REDACTED]',
  },
});
