import { AppError } from '../utils/app-error';
import type { CreateUserInput, UpdateUserInput, User } from '../types/user';
import { usersRepository } from '../repositories/users.repository';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const usersService = {
  async list(): Promise<User[]> {
    return usersRepository.findAll();
  },

  async findById(id: string): Promise<User> {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }
    return user;
  },

  async findByEmail(email: string): Promise<User | undefined> {
    return usersRepository.findByEmail(email);
  },

  async create(input: CreateUserInput): Promise<User> {
    const email = normalizeEmail(input.email);
    const exists = await usersRepository.findByEmail(email);
    if (exists) {
      throw new AppError('Email já cadastrado', 409, 'EMAIL_ALREADY_EXISTS');
    }
    return usersRepository.create({ ...input, email });
  },

  async update(id: string, input: UpdateUserInput): Promise<User> {
    if (input.email) {
      const newEmail = normalizeEmail(input.email);
      const existing = await usersRepository.findByEmail(newEmail);
      if (existing && existing.id !== id) {
        throw new AppError('Email já cadastrado', 409, 'EMAIL_ALREADY_EXISTS');
      }
    }
    const updated = await usersRepository.update(id, input);
    if (!updated) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }
    return updated;
  },

  async delete(id: string): Promise<void> {
    const user = await usersRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }
    await usersRepository.delete(id);
  },
};
