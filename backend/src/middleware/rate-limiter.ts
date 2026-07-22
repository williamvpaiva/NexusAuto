import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../config/redis';
import { env } from '../config/env';

let redisStore: RedisStore | undefined;

function getStore(): RedisStore | undefined {
  if (process.env.NODE_ENV === 'test') return undefined;
  if (redisStore) return redisStore;
  if (redisClient.status === 'ready' || redisClient.status === 'connecting') {
    redisStore = new RedisStore({
      sendCommand: (...args: string[]) => redisClient.call(args[0], ...args.slice(1)) as any,
    });
  }
  return redisStore;
}

const defaultMessage = {
  success: false,
  error: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Muitas requisições. Tente novamente mais tarde.',
  },
};

export const apiLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
  message: defaultMessage,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
  keyGenerator: (req) => {
    const userId = (req as any).user?.id;
    if (userId) return String(userId);
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    return String(ipAddress || 'unknown');
  },
  message: defaultMessage,
});

export const memoryLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
  message: {
    ...defaultMessage,
    error: { ...defaultMessage.error, message: 'Muitas requisições para a rota de memória. Tente novamente mais tarde.' },
  },
});

export const usersLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  store: getStore(),
  message: {
    ...defaultMessage,
    error: { ...defaultMessage.error, message: 'Muitas requisições para a rota de usuários. Tente novamente mais tarde.' },
  },
});

export { getStore as ensureRedisStore };
