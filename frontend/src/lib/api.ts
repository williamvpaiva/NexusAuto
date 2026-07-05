export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const isApiError = (error: unknown): error is ApiError =>
  error instanceof ApiError;

export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const REQUEST_TIMEOUT = 30000;
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

import { getCsrfToken } from '../hooks/useCsrfProtection';

function getBackoffDelay(attempt: number): number {
  return BASE_DELAY * Math.pow(2, attempt) + Math.random() * 500;
}

interface RequestOptions extends RequestInit {
  _skipRetry?: boolean;
}

async function request<T>(path: string, init?: RequestOptions): Promise<T> {
  const lastError: ApiError[] = [];

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {

      const method = (init?.method || 'GET').toUpperCase();
      const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(init?.headers as Record<string, string> || {})
      };

      if (isMutation) {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          headers['X-CSRF-Token'] = csrfToken;
        }
      }

      const response = await fetch(`${API_BASE}${path}`, {
        ...init,
        signal: controller.signal,
        headers
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const code = body?.error?.code || 'UNKNOWN_ERROR';
        const message = body?.error?.message || `Erro HTTP ${response.status}`;

        if (isMutation) {
          console.warn('[API Error]', { status: response.status, path, code, message });
        }

        const apiError = new ApiError(response.status, code, message);

        if (response.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          throw apiError;
        }

        if (response.status === 403) {
          throw new ApiError(403, 'FORBIDDEN', 'Você não tem permissão para realizar esta ação.');
        }

        if (response.status === 429) {
          if (attempt < MAX_RETRIES - 1 && !init?._skipRetry) {
            lastError.push(apiError);
            const delay = getBackoffDelay(attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw new ApiError(429, 'RATE_LIMITED', 'Muitas requisições. Aguarde um momento e tente novamente.');
        }

        if (response.status >= 500) {
          if (attempt < MAX_RETRIES - 1 && !init?._skipRetry) {
            lastError.push(apiError);
            const delay = getBackoffDelay(attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw new ApiError(response.status, 'SERVER_ERROR', 'Erro no servidor. Tente novamente em alguns instantes.');
        }

        throw apiError;
      }

      const body = await response.json();
      return body.data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        if (error.statusCode === 401) throw error;
        if (error.statusCode >= 500 || error.statusCode === 429) {
          if (attempt < MAX_RETRIES - 1 && !init?._skipRetry) {
            lastError.push(error);
            const delay = getBackoffDelay(attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw error;
        }
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiError(0, 'TIMEOUT', 'A requisição demorou muito. Tente novamente.');
        }

        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
          if (attempt < MAX_RETRIES - 1 && !init?._skipRetry) {
            const delay = getBackoffDelay(attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw new ApiError(0, 'NETWORK_ERROR', 'Sem conexão com o servidor. Verifique sua internet.');
        }
      }

      throw error;
    }
  }

  throw lastError[lastError.length - 1] || new ApiError(0, 'UNKNOWN', 'Erro desconhecido');
}

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
};

export type Health = {
  status: string;
  service: string;
  uptime: number;
  timestamp: string;
  environment: string;
  version: string;
};

function validateUser(data: unknown): User {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Dados de usuário inválidos');
  }

  const user = data as Record<string, unknown>;

  if (typeof user.id !== 'string' || !user.id) {
    throw new Error('ID de usuário inválido');
  }
  if (typeof user.name !== 'string' || user.name.length < 2) {
    throw new Error('Nome de usuário inválido');
  }
  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    throw new Error('Email inválido');
  }
  if (typeof user.createdAt !== 'string') {
    throw new Error('Data de criação inválida');
  }

  return user as User;
}

function validateUsers(data: unknown): User[] {
  if (!Array.isArray(data)) {
    throw new Error('Resposta da API deve ser um array');
  }
  return data.map((item) => validateUser(item));
}

export function getHealth() {
  return request<Health>('/health');
}

export function listUsers() {
  return request<User[]>('/users').then(validateUsers);
}

export function createUser(payload: { name: string; email: string }) {
  if (!payload.name || payload.name.length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres');
  }
  if (!payload.email || !payload.email.includes('@')) {
    throw new Error('Email inválido');
  }

  return request<User>('/users', {
    method: 'POST',
    body: JSON.stringify(payload)
  }).then(validateUser);
}

export function updateUser(id: string, payload: { name?: string; email?: string }) {
  if (!id) {
    throw new Error('ID é obrigatório');
  }
  if (payload.name && payload.name.length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres');
  }
  if (payload.email && !payload.email.includes('@')) {
    throw new Error('Email inválido');
  }

  return request<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }).then(validateUser);
}

export function deleteUser(id: string) {
  if (!id) {
    throw new Error('ID é obrigatório');
  }
  return request<void>(`/users/${id}`, {
    method: 'DELETE'
  });
}

export async function withFallback<T>(
  fn: () => Promise<T>,
  fallback: T,
  onError?: (error: unknown) => void
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (onError) onError(error);
    return fallback;
  }
}
