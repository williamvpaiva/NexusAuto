import type { Request, Response, NextFunction } from 'express';
import { getRedisClient } from '../config/redis';

// ---------------------------------------------------------------------------
// Configuração
// ---------------------------------------------------------------------------

const MAX_ATTEMPTS = 5;            // tentativas máximas antes do bloqueio
const WINDOW_MS = 15 * 60 * 1000;  // janela de 15 minutos
const WINDOW_SEC = 15 * 60;        // mesma janela em segundos (para Redis TTL)

// ---------------------------------------------------------------------------
// Fallback em memória
// ---------------------------------------------------------------------------

interface AttemptRecord {
  count: number;
  firstAttempt: number; // timestamp
  blockedUntil: number; // timestamp, 0 se não bloqueado
}

const memoryStore = new Map<string, AttemptRecord>();

// Limpeza periódica de registros expirados
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of memoryStore.entries()) {
    if (now > record.firstAttempt + WINDOW_MS) {
      memoryStore.delete(key);
    }
  }
}, 60 * 1000);

// ---------------------------------------------------------------------------
// Helpers de chave Redis
// ---------------------------------------------------------------------------

const key = {
  attempts: (email: string, ip: string) => `bf:attempts:${email}:${ip}`,
  blocked: (email: string, ip: string) => `bf:blocked:${email}:${ip}`,
};

// ---------------------------------------------------------------------------
// Brute Force Service
// ---------------------------------------------------------------------------

export const bruteForce = {
  /**
   * Registra uma tentativa falha de login.
   * Se exceder o limite, marca o bloqueio.
   */
  async recordFailedAttempt(email: string, ip: string): Promise<void> {
    const redis = await getRedisClient();

    if (redis) {
      const attemptsKey = key.attempts(email, ip);
      const blockedKey = key.blocked(email, ip);

      // Incrementa contador com TTL (cria se não existir)
      const count = await redis.incr(attemptsKey);
      if (count === 1) {
        await redis.expire(attemptsKey, WINDOW_SEC);
      }

      // Se excedeu o limite, marca bloqueio
      if (count >= MAX_ATTEMPTS) {
        await redis.setex(blockedKey, WINDOW_SEC, '1');
        console.warn(`[BRUTE_FORCE] IP ${ip} bloqueado por excesso de tentativas (email: ${email})`);
      }
      return;
    }

    // ---- Fallback em memória ----
    const now = Date.now();
    const record = memoryStore.get(email) || { count: 0, firstAttempt: now, blockedUntil: 0 };

    // Se a janela expirou, reinicia o contador
    if (now > record.firstAttempt + WINDOW_MS) {
      record.count = 0;
      record.firstAttempt = now;
    }

    record.count += 1;

    if (record.count >= MAX_ATTEMPTS) {
      record.blockedUntil = now + WINDOW_MS;
      console.warn(`[BRUTE_FORCE] IP ${ip} bloqueado (memória) por excesso de tentativas (email: ${email})`);
    }

    memoryStore.set(email, record);
  },

  /**
   * Verifica se o email+IP está bloqueado por excesso de tentativas.
   */
  async isBlocked(email: string, ip: string): Promise<boolean> {
    const redis = await getRedisClient();

    if (redis) {
      const blocked = await redis.get(key.blocked(email, ip));
      return blocked !== null;
    }

    // ---- Fallback em memória ----
    const record = memoryStore.get(email);
    if (!record) return false;

    const now = Date.now();
    if (now > record.blockedUntil) return false; // bloqueio expirou
    if (now > record.firstAttempt + WINDOW_MS) return false; // janela expirou

    return record.count >= MAX_ATTEMPTS;
  },

  /**
   * Reseta o contador de tentativas (após login bem-sucedido).
   */
  async resetAttempts(email: string, ip: string): Promise<void> {
    const redis = await getRedisClient();

    if (redis) {
      await redis.del(key.attempts(email, ip));
      await redis.del(key.blocked(email, ip));
      return;
    }

    // ---- Fallback em memória ----
    memoryStore.delete(email);
  },
};

// ---------------------------------------------------------------------------
// Middleware Express
// ---------------------------------------------------------------------------

/**
 * Middleware de proteção contra brute force.
 * Aplica-se antes do validate/login em rotas de autenticação.
 *
 * Uso: router.post('/login', bruteForceProtection, validate(loginSchema), loginController);
 */
export async function bruteForceProtection(req: Request, res: Response, next: NextFunction) {
  const email = (req.body?.email || '').toLowerCase().trim();
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!email) return next(); // sem email, deixa o validate tratar

  const blocked = await bruteForce.isBlocked(email, ip);

  if (blocked) {
    console.warn(`[BRUTE_FORCE] Tentativa bloqueada para ${email} (IP: ${ip})`);

    return res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_ATTEMPTS',
        message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
        requestId: req.requestId,
      },
    });
  }

  next();
}
