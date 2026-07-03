export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';
const REQUEST_TIMEOUT = 30000; // 30 segundos

/**
 * Importa função de CSRF do hook
 */
import { getCsrfToken } from '../hooks/useCsrfProtection';

/**
 * Faz requisição HTTP com timeout, CSRF e tratamento de erro
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const method = (init?.method || 'GET').toUpperCase();
  const isMutation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method);

  // Adiciona token CSRF para mutations
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> || {})
  };

  if (isMutation) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    } else {
      console.warn('[API] CSRF token não disponível para mutation');
    }
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      const message = body?.error?.message || `Erro HTTP ${response.status}`;
      
      // Log seguro (mascara dados sensíveis)
      if (isMutation) {
        console.warn('[API Error]', { status: response.status, path, message });
      }
      
      throw new Error(message);
    }

    const body = await response.json();
    return body.data as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Timeout: A requisição demorou muito. Tente novamente.');
      }
      throw error;
    }
    throw new Error('Erro desconhecido na requisição');
  }
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

/**
 * Valida dados de usuário antes de retornar
 */
function validateUser(data: unknown): User {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Dados de usuário inválidos');
  }
  
  const user = data as Record<string, unknown>;
  
  // Validações básicas de schema
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

/**
 * Valida array de usuários
 */
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
  // Valida input antes de enviar
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