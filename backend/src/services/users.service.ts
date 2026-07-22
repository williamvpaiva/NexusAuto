import { AppError } from '../utils/app-error';
import type { CreateUserInput, UpdateUserInput, User } from '../types/user';
import type { IUsersRepository } from '../repositories/interfaces/IUsersRepository';
import { usersRepository } from '../repositories/users.repository';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export class UsersService {
  constructor(private usersRepository: IUsersRepository) {}

  async list(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email);
  }

  async create(input: CreateUserInput): Promise<User> {
    const email = normalizeEmail(input.email);
    const exists = await this.usersRepository.findByEmail(email);
    if (exists) {
      throw new AppError('Email já cadastrado', 409, 'EMAIL_ALREADY_EXISTS');
    }
    return this.usersRepository.create({ ...input, email });
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    if (input.email) {
      const newEmail = normalizeEmail(input.email);
      const existing = await this.usersRepository.findByEmail(newEmail);
      if (existing && existing.id !== id) {
        throw new AppError('Email já cadastrado', 409, 'EMAIL_ALREADY_EXISTS');
      }
    }
    const updated = await this.usersRepository.update(id, input);
    if (!updated) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND');
    }
    await this.usersRepository.delete(id);
  }
}

export const usersService = new UsersService(usersRepository);
