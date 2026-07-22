import { z } from 'zod';

export const CleanupTestUsersSchema = z.object({
  query: z.object({
    dry_run: z.enum(['true', 'false', '1', '0', 'yes', 'no']).optional().default('false'),
    limit: z.coerce.number().min(1).max(500).optional().default(100),
  }),
});

export const CleanupHistorySchema = z.object({
  query: z.object({
    limit: z.coerce.number().min(1).max(200).optional().default(50),
  }),
});
