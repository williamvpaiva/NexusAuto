import { useEffect } from 'react';

/**
 * Hook de Proteção CSRF
 * 
 * Gerencia tokens CSRF para prevenir ataques Cross-Site Request Forgery.
 * 
 * Funcionamento:
 * 1. Ao montar, solicita token CSRF do backend
 * 2. Armazena token em memória (não localStorage!)
 * 3. Inclui token em headers de todas as mutations (POST, PUT, DELETE)
 * 4. Renova token periodicamente
 * 
 * Uso:
 * useCsrfProtection(); // No App.tsx ou main.tsx
 * 
 * // Nas requisições:
 * const { getCsrfToken } = useCsrfToken();
 * fetch('/api/endpoint', {
 *   method: 'POST',
 *   headers: {
 *     'X-CSRF-Token': getCsrfToken()
 *   }
 * });
 */

interface CsrfTokenData {
  token: string;
  expiresAt: number;
}

let csrfToken: CsrfTokenData | null = null;
let refreshInterval: NodeJS.Timeout | null = null;
const TOKEN_REFRESH_MS = 15 * 60 * 1000; // 15 minutos
const TOKEN_EXPIRY_MS = 30 * 60 * 1000; // 30 minutos

/**
 * Obtém token CSRF atual
 */
export function getCsrfToken(): string | null {
  if (!csrfToken) return null;
  
  // Verifica se expirou
  if (Date.now() > csrfToken.expiresAt) {
    console.warn('[CSRF] Token expirado, solicitando renovação');
    csrfToken = null;
    return null;
  }
  
  return csrfToken.token;
}

/**
 * Solicita novo token do backend
 */
async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/v1/auth/csrf-token', {
      method: 'GET',
      credentials: 'include' // Inclui cookies para autenticação
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.data?.token) {
      throw new Error('Token CSRF inválido');
    }

    // Armazena token com expiry
    csrfToken = {
      token: data.data.token,
      expiresAt: Date.now() + TOKEN_EXPIRY_MS
    };

    console.log('[CSRF] Token renovado com sucesso');
    return csrfToken.token;
  } catch (error) {
    console.error('[CSRF] Falha ao obter token:', error);
    csrfToken = null;
    return null;
  }
}

/**
 * Hook principal de proteção CSRF
 */
export function useCsrfProtection() {
  useEffect(() => {
    // Solicita token inicial
    fetchCsrfToken();

    // Configura refresh periódico
    refreshInterval = setInterval(() => {
      if (csrfToken) {
        fetchCsrfToken();
      }
    }, TOKEN_REFRESH_MS);

    // Cleanup
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  return {
    getToken: getCsrfToken,
    isReady: !!csrfToken
  };
}

/**
 * Hook para obter token em componentes
 */
export function useCsrfToken() {
  return {
    getCsrfToken,
    isReady: !!csrfToken
  };
}

/**
 * Interceptor para adicionar token CSRF em requisições
 * 
 * Uso com fetch:
 * const csrfInterceptor = createCsrfInterceptor();
 * fetch('/api/endpoint', csrfInterceptor({ method: 'POST' }));
 */
export function createCsrfInterceptor() {
  return function interceptCsrf(init: RequestInit = {}): RequestInit {
    const method = (init.method || 'GET').toUpperCase();
    
    // Apenas mutations precisam de CSRF
    const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);
    
    if (!isMutation) {
      return init;
    }

    const token = getCsrfToken();
    
    if (!token) {
      console.error('[CSRF] Token não disponível para mutation');
      throw new Error('Token CSRF não disponível. Tente recarregar a página.');
    }

    return {
      ...init,
      headers: {
        ...init.headers,
        'X-CSRF-Token': token,
        'Content-Type': (init.headers as Record<string, string>)?.['Content-Type'] || 'application/json'
      } as Record<string, string>
    };
  };
}

/**
 * Wrapper seguro para fetch com CSRF automático
 * 
 * Uso:
 * const safeFetch = createCsrfFetch();
 * await safeFetch('/api/endpoint', { method: 'POST', body: JSON.stringify(data) });
 */
export function createCsrfFetch() {
  const interceptor = createCsrfInterceptor();
  
  return async function csrfFetch(url: string, init: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const interceptedInit = interceptor(init);
    try {
      return await fetch(url, { ...interceptedInit, signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  };
}

/**
 * Middleware de backend para validar CSRF (Exemplo Express)
 * 
 * No backend (backend/src/middleware/csrf.ts):
 * 
 * import { CSURF_TOKEN_SECRET } from '../config/env';
 * import csrf from 'csurf';
 * 
 * const csrfProtection = csrf({ cookie: { httpOnly: true, secure: true, sameSite: 'strict' } });
 * 
 * export function validateCsrf(req: Request, res: Response, next: NextFunction) {
 *   const token = req.headers['x-csrf-token'];
 *   
 *   if (!token) {
 *     return res.status(403).json({
 *       success: false,
 *       error: { code: 'CSRF_MISSING', message: 'Token CSRF ausente' }
 *     });
 *   }
 *   
 *   // Validar token com biblioteca csurf ou implementação customizada
 *   csrfProtection(req, res, next);
 * }
 */