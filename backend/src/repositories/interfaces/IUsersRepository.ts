import type { CreateUserInput, UpdateUserInput, User } from '../../types/user';

export interface IUsersRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: CreateUserInput): Promise<User>;
  update(id: string, data: UpdateUserInput): Promise<User | undefined>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
