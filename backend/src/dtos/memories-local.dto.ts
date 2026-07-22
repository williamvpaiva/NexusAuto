import { z } from 'zod';

export const SearchLocalMemoriesSchema = z.object({
  query: z.object({
    query: z.string().optional().default(''),
  }),
});

export const SaveLocalMemorySchema = z.object({
  body: z.object({
    content: z.string({ required_error: 'content is required' }).min(1, 'content is required'),
    agent: z.string().optional().default('api'),
    type: z.string().optional().default('general'),
    tags: z.array(z.string()).optional().default([]),
  }),
});

export const TogglePrivateLocalMemorySchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'id is required' }),
  }),
});
