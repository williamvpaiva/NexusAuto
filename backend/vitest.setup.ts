import 'dotenv/config';
import { vi } from 'vitest';

process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
process.env.NODE_ENV = 'test';

vi.mock('./src/config/prisma', () => ({
  prisma: {
    user: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    vehicle: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    tarefa: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() }
  }
}));

vi.mock('./src/config/redis', () => {
  const mockRedis = {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    setex: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
    sadd: vi.fn().mockResolvedValue(1),
    smembers: vi.fn().mockResolvedValue([]),
    keys: vi.fn().mockResolvedValue([]),
    expire: vi.fn().mockResolvedValue(1),
    on: vi.fn(),
    status: 'ready',
    call: vi.fn().mockResolvedValue('OK'),
  };
  return {
    default: mockRedis,
    getRedisClient: vi.fn().mockResolvedValue(mockRedis),
  };
});
