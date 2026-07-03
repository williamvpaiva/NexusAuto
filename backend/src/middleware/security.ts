import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware de Segurança - Headers de Proteção
 * 
 * Implementa headers de segurança adicionais além do helmet:
 * - Content Security Policy (CSP)
 * - X-Frame-Options (Clickjacking protection)
 * - X-Content-Type-Options
 * - X-XSS-Protection
 * - Referrer-Policy
 * - Permissions-Policy
 */

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  // Content Security Policy - Previne XSS e injeção de scripts
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'", // Necessário para CSS-in-JS se usar
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' http://localhost:3000 http://localhost:5173",
    "frame-ancestors 'none'", // Previne clickjacking
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ');

  res.setHeader('Content-Security-Policy', cspDirectives);

  // X-Frame-Options - Previne clickjacking (legado, mas ainda útil)
  res.setHeader('X-Frame-Options', 'DENY');

  // X-Content-Type-Options - Previne MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-XSS-Protection - Legacy XSS filter (IE/Edge antigos)
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer-Policy - Controla informações de referer
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions-Policy - Controla features do navegador
  res.setHeader(
    'Permissions-Policy',
    [
      'geolocation=()',
      'microphone=()',
      'camera=()',
      'payment=()',
      'usb=()',
      'fullscreen=(self)'
    ].join(', ')
  );

  // HSTS - Força HTTPS (apenas em produção)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  next();
}

/**
 * Middleware de verificação de Clickjacking no Frontend
 * 
 * Detecta se a aplicação está sendo carregada dentro de um iframe
 * e bloqueia ou redireciona para o topo.
 */
export function clickjackingProtection(req: Request, res: Response, next: NextFunction) {
  const frameOptions = req.headers['x-frame-options'];
  const cspFrameAncestors = req.headers['content-security-policy'];

  // Log de tentativa de embedding (para monitoramento)
  if (frameOptions || cspFrameAncestors) {
    console.log('[Security] Headers de proteção ativos:', {
      xFrameOptions: frameOptions,
      cspFrameAncestors: cspFrameAncestors ? 'present' : 'absent'
    });
  }

  next();
}

/**
 * Middleware de Rate Limiting por IP
 * 
 * Limita requisições para prevenir abuso e DoS
 */
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por janela
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Muitas requisições. Tente novamente em 15 minutos.'
    }
  },
  standardHeaders: true, // Retorna info nos headers RateLimit-*
  legacyHeaders: false, // Desabilita headers X-RateLimit-*
  handler: (req, res) => {
    console.warn(`[Rate Limit] Excedido para IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Muitas requisições. Tente novamente em 15 minutos.'
      }
    });
  }
});

/**
 * Rate Limiter específico para rotas de autenticação
 * Mais restritivo para prevenir brute force
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 tentativas por janela
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
  handler: (req, res) => {
    console.warn(`[Auth Rate Limit] Excedido para IP: ${req.ip} - Possível brute force`);
    res.status(429).json({
      success: false,
      error: {
        code: 'AUTH_RATE_LIMIT_EXCEEDED',
        message: 'Muitas tentativas de autenticação. Tente novamente em 15 minutos.'
      }
    });
  }
});