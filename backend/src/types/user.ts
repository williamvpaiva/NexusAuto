export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
};

export type CreateUserInput = {
  name: string;
  email: string;
};

export type UpdateUserInput = Partial<{
  name: string;
  email: string;
}>;