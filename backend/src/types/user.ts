export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt?: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
};

export type UpdateUserInput = Partial<{
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}>;