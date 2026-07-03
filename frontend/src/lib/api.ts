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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {})
    },
    ...init
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body?.error?.message || `Erro HTTP ${response.status}`;

    throw new Error(message);
  }

  return body.data as T;
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

export function getHealth() {
  return request<Health>('/health');
}

export function listUsers() {
  return request<User[]>('/users');
}

export function createUser(payload: { name: string; email: string }) {
  return request<User>('/users', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function updateUser(id: string, payload: { name?: string; email?: string }) {
  return request<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function deleteUser(id: string) {
  return request<void>(`/users/${id}`, {
    method: 'DELETE'
  });
}