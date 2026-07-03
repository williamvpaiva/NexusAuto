/**
 * Rate Limiter para Frontend
 * 
 * Previne abuso de APIs limitando requisições por minuto do lado do cliente.
 * Complementa o rate limiting do backend.
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RequestLog {
  timestamps: number[];
}

const requestLogs = new Map<string, RequestLog>();

/**
 * Verifica se uma requisição pode ser feita
 * 
 * @param key - Identificador único (ex: endpoint + IP)
 * @param config - Configuração do rate limit
 * @returns true se permitido, false se excedeu limite
 */
export function checkRateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Obtém ou cria log para esta chave
  let log = requestLogs.get(key);
  if (!log) {
    log = { timestamps: [] };
    requestLogs.set(key, log);
  }

  // Remove timestamps antigos (fora da janela)
  log.timestamps = log.timestamps.filter((ts) => ts > windowStart);

  // Verifica se excedeu limite
  if (log.timestamps.length >= config.maxRequests) {
    const oldestTimestamp = log.timestamps[0];
    const retryAfter = Math.ceil((oldestTimestamp + config.windowMs - now) / 1000);
    
    console.warn(`[Rate Limit] Excedido para ${key}. Tente em ${retryAfter}s`);
    return false;
  }

  // Adiciona timestamp atual
  log.timestamps.push(now);
  return true;
}

/**
 * Limpa logs antigos para evitar memory leak
 * Executa a cada 5 minutos
 */
setInterval(() => {
  const now = Date.now();
  const maxWindow = 15 * 60 * 1000; // 15 minutos

  for (const [key, log] of requestLogs.entries()) {
    log.timestamps = log.timestamps.filter((ts) => ts > now - maxWindow);
    
    // Remove log vazio
    if (log.timestamps.length === 0) {
      requestLogs.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Hooks para usar em componentes React
 */
export function useRateLimit(key: string, config: RateLimitConfig) {
  const checkLimit = () => checkRateLimit(key, config);

  const getRetryAfter = () => {
    const log = requestLogs.get(key);
    if (!log || log.timestamps.length === 0) return 0;

    const now = Date.now();
    const oldestTimestamp = log.timestamps[0];
    return Math.ceil((oldestTimestamp + config.windowMs - now) / 1000);
  };

  return {
    canRequest: checkLimit,
    retryAfter: getRetryAfter(),
    remaining: config.maxRequests - (requestLogs.get(key)?.timestamps.length || 0)
  };
}

/**
 * Configurações pré-definidas
 */
export const rateLimitConfigs = {
  // Para APIs gerais (complementar ao backend)
  api: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 req / 15 min
  
  // Para operações sensíveis (login, delete, etc)
  sensitive: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 req / 15 min
  
  // Para buscas e filtros
  search: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 req / 1 min
  
  // Para uploads
  upload: { maxRequests: 5, windowMs: 60 * 1000 } // 5 uploads / 1 min
};