import { z } from 'zod';

export const GenerateDesignSchema = z.object({
  body: z.object({
    description: z.string({ required_error: 'Descrição é obrigatória' }).min(1, 'Descrição é obrigatória'),
  }),
});

export const SaveDesignSchema = z.object({
  body: z.object({
    description: z.string({ required_error: 'Descrição é obrigatória' }).min(1, 'Descrição é obrigatória'),
    featureName: z.string({ required_error: 'Nome da feature é obrigatório' })
      .min(1, 'Nome da feature é obrigatório')
      .regex(/^[a-zA-Z0-9-]+$/, 'O nome da feature deve conter apenas letras, números e hifens (sem espaços ou caracteres especiais) para evitar vulnerabilidades no sistema de arquivos.'),
  }),
});
