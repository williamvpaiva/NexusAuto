import { Request, Response, NextFunction } from 'express';
import redis from '../config/redis';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[] | ((req: Request) => string[]); // Tags for invalidation
}

export const cacheMiddleware = (options: CacheOptions = {}) => {
  const ttl = options.ttl || 60; // default 60 seconds

  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).user?.id || 'public';
    const key = `cache:${userId}:${req.originalUrl}`;
    
    try {
      if (redis.status !== 'ready') {
        return next(); // Fallback to DB se o Redis não estiver pronto
      }

      const cachedData = await redis.get(key);
      
      if (cachedData) {
        res.setHeader('Cache-Control', `max-age=${ttl}`);
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedData));
      }

      res.setHeader('X-Cache', 'MISS');

      const originalJson = res.json.bind(res);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res.json = (body: any) => {
        if (redis.status === 'ready') {
          redis.setex(key, ttl, JSON.stringify(body)).catch(err => {
            console.error('Redis cache error:', err);
          });

          if (options.tags) {
            const tagsToApply = typeof options.tags === 'function' ? options.tags(req) : options.tags;
            tagsToApply.forEach(tag => {
              redis.sadd(`tag:${tag}`, key).catch(console.error);
              redis.expire(`tag:${tag}`, ttl).catch(console.error);
            });
          }
        }

        res.setHeader('Cache-Control', `max-age=${ttl}`);
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next(); // Fallback to DB
    }
  };
};

export const invalidateCacheByTag = async (tag: string) => {
  try {
    if (redis.status === 'ready') {
      const keys = await redis.smembers(`tag:${tag}`);
      if (keys.length > 0) {
        await redis.del(...keys);
        await redis.del(`tag:${tag}`);
      }
    }
  } catch (error) {
    console.error(`Error invalidating tag ${tag}:`, error);
  }
};
