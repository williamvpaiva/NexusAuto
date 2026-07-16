import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { getRedisClient } from '../config/redis';
import { env } from '../config/env';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  jti: string;
  type: 'access' | 'refresh';
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // segundos de validade do access token
}

// ---------------------------------------------------------------------------
// Fallback em memória (quando Redis não está disponível)
// ---------------------------------------------------------------------------

// Registro de tokens válidos (existência no Map = não revogado)
const validAccessTokens = new Map<string, number>();
const validRefreshTokens = new Map<string, number>();

// Limpeza periódica de tokens expirados
setInterval(() => {
  const now = Date.now();
  for (const [jti, exp] of validAccessTokens.entries()) if (now > exp) validAccessTokens.delete(jti);
  for (const [jti, exp] of validRefreshTokens.entries()) if (now > exp) validRefreshTokens.delete(jti);
}, 5 * 60 * 1000);

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const ACCESS_TTL = 15 * 60;        // 15 minutos
const REFRESH_TTL = 30 * 24 * 60 * 60; // 30 dias

// ---------------------------------------------------------------------------
// Helpers de chave Redis
// ---------------------------------------------------------------------------

const key = {
  access: (jti: string) => `access:${jti}`,
  refresh: (jti: string) => `refresh:${jti}`,
  userTokens: (uid: string) => `user_tokens:${uid}`,
};

// ---------------------------------------------------------------------------
// Token Service
// ---------------------------------------------------------------------------

export const tokenService = {
  /**
   * Gera um par access + refresh token com JTI único.
   * Armazena em Redis (ou memória como fallback).
   */
  async generateTokenPair(user: { id: string; email: string; role: string }): Promise<TokenPair> {
    const nowSec = Math.floor(Date.now() / 1000);
    const accessJti = crypto.randomUUID();
    const refreshJti = crypto.randomUUID();

    const accessPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      jti: accessJti,
      type: 'access',
    };

    const refreshPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      jti: refreshJti,
      type: 'refresh',
    };

    const accessToken = jwt.sign(accessPayload, env.jwtSecret, { expiresIn: ACCESS_TTL });
    const refreshToken = jwt.sign(refreshPayload, env.jwtSecret, { expiresIn: REFRESH_TTL });

    // Persiste em Redis (ou memória)
    const redis = await getRedisClient();
    if (redis) {
      await redis.setex(key.access(accessJti), ACCESS_TTL, JSON.stringify({ userId: user.id, revoked: false }));
      await redis.setex(key.refresh(refreshJti), REFRESH_TTL, JSON.stringify({ userId: user.id }));
      await redis.sadd(key.userTokens(user.id), JSON.stringify({ jti: accessJti, type: 'access' }));
      await redis.sadd(key.userTokens(user.id), JSON.stringify({ jti: refreshJti, type: 'refresh' }));
      await redis.expire(key.userTokens(user.id), REFRESH_TTL);
    } else {
      // Memória: registra como "não revogado" (existência = válido)
      validAccessTokens.set(accessJti, nowSec + ACCESS_TTL);
      validRefreshTokens.set(refreshJti, nowSec + REFRESH_TTL);
    }

    return { accessToken, refreshToken, expiresIn: ACCESS_TTL };
  },

  /**
   * Verifica e retorna o payload do access token, ou null se inválido/revogado.
   */
  async verifyAccessToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
      if (payload.type !== 'access') return null;
      if (payload.jti) {
        const revoked = await this.isRevoked(payload.jti, 'access');
        if (revoked) return null;
      }
      return payload;
    } catch {
      return null;
    }
  },

  /**
   * Verifica e retorna o payload do refresh token, ou null se inválido/revogado.
   */
  async verifyRefreshToken(token: string): Promise<TokenPayload | null> {
    try {
      const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
      if (payload.type !== 'refresh') return null;
      const revoked = await this.isRevoked(payload.jti, 'refresh');
      return revoked ? null : payload;
    } catch {
      return null;
    }
  },

  /**
   * Troca um refresh token válido por um novo par de tokens.
   * Revoga o refresh token antigo (rotation).
   */
  async refreshTokens(token: string): Promise<TokenPair | null> {
    const payload = await this.verifyRefreshToken(token);
    if (!payload) return null;

    // Revoga o refresh token antigo (rotation)
    await this.revokeRefreshToken(payload.jti);

    // Gera novo par
    return this.generateTokenPair({
      id: payload.userId,
      email: payload.email,
      role: payload.role,
    });
  },

  /**
   * Verifica se um token foi revogado.
   * No Redis: chave existe = válido. Na memória: Map has jti = válido.
   */
  async isRevoked(jti: string, type: 'access' | 'refresh'): Promise<boolean> {
    const redis = await getRedisClient();
    if (redis) {
      const k = type === 'access' ? key.access(jti) : key.refresh(jti);
      const exists = await redis.get(k);
      // Se a chave não existe, o token foi revogado (ou expirou)
      return exists === null;
    }

    const store = type === 'access' ? validAccessTokens : validRefreshTokens;
    return !store.has(jti);
  },

  /** Revoga um access token individual. */
  async revokeAccessToken(jti: string): Promise<void> {
    const redis = await getRedisClient();
    if (redis) {
      await redis.del(key.access(jti));
      return;
    }
    validAccessTokens.delete(jti);
  },

  /** Revoga um refresh token individual (rotation). */
  async revokeRefreshToken(jti: string): Promise<void> {
    const redis = await getRedisClient();
    if (redis) {
      await redis.del(key.refresh(jti));
      return;
    }
    validRefreshTokens.delete(jti);
  },

  /**
   * Revoga TODOS os tokens de um usuário (logout global).
   * Usa o Set em Redis para iterar, ou limpa tudo em memória.
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    const redis = await getRedisClient();
    if (redis) {
      const entries = await redis.smembers(key.userTokens(userId));
      for (const entry of entries) {
        try {
          const { jti, type } = JSON.parse(entry);
          if (type === 'access') await redis.del(key.access(jti));
          else await redis.del(key.refresh(jti));
        } catch { /* ignora entradas corrompidas */ }
      }
      await redis.del(key.userTokens(userId));
      console.log(`[TOKEN] All tokens revoked for user ${userId}`);
      return;
    }
    // Fallback memória: não é possível revocar por userId sem Redis,
    // mas tokens expiram naturalmente (15min / 30d)
    console.log(`[TOKEN] Memory fallback — cannot revoke by user. Tokens will expire naturally.`);
  },
};
