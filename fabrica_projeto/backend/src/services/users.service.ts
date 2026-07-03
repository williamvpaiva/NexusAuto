import { AppError } from '../utils/app-error';
import type { CreateUserInput, UpdateUserInput, User } from '../types/user';

// Mock database em memória (substituir por PostgreSQL real)
const users: User[] = [
  {
    id: crypto.randomUUID(),
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    createdAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    name: 'Grace Hopper',
    email: 'grace@example.com',
    createdAt: new Date().toISOString()
  }
];

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const usersService = {
  /**
   * Lista todos os usuários ordenados por nome
   */
  list(): User[] {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Busca usuário por ID
   */
  findById(id: string): User {
    const user = users.find((item) => item.id === id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    return user;
  },

  /**
   * Busca usuário por email
   */
  findByEmail(email: string): User | undefined {
    const normalizedEmail = normalizeEmail(email);
    return users.find((item) => normalizeEmail(item.email) === normalizedEmail);
  },

  /**
   * Cria novo usuário
   */
  create(input: CreateUserInput): User {
    const email = normalizeEmail(input.email);

    // Verifica duplicidade
    const exists = users.some((item) => normalizeEmail(item.email) === email);

    if (exists) {
      throw new AppError('Email já cadastrado', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const user: User = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      email,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    return user;
  },

  /**
   * Atualiza usuário existente
   */
  update(id: string, input: UpdateUserInput): User {
    const userIndex = users.findIndex((item) => item.id === id);

    if (userIndex === -1) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    // Verifica email duplicado se estiver sendo alterado
    if (input.email) {
      const newEmail = normalizeEmail(input.email);
      const exists = users.some(
        (item, idx) => idx !== userIndex && normalizeEmail(item.email) === newEmail
      );

      if (exists) {
        throw new AppError('Email já cadastrado', 409, 'EMAIL_ALREADY_EXISTS');
      }
    }

    const updatedUser: User = {
      ...users[userIndex],
      ...input,
      email: input.email ? normalizeEmail(input.email) : users[userIndex].email,
      name: input.name?.trim() || users[userIndex].name,
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    return updatedUser;
  },

  /**
   * Remove usuário
   */
  delete(id: string): void {
    const userIndex = users.findIndex((item) => item.id === id);

    if (userIndex === -1) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }

    users.splice(userIndex, 1);
  }
};