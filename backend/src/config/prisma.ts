import { PrismaClient } from '@prisma/client';

// Use um singleton para evitar conexões excessivas no ambiente de desenvolvimento
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
