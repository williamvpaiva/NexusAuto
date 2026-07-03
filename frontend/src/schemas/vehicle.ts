import { z } from 'zod';

/**
 * Schemas de Veículos com Zod
 * 
 * Validação de criação, atualização e listagem de veículos
 */

/**
 * Schema de Veículo
 */
export const VehicleSchema = z.object({
  id: z.string().uuid('ID inválido'),
  brand: z.string()
    .min(2, 'Marca deve ter pelo menos 2 caracteres')
    .max(50, 'Marca muito longa'),
  model: z.string()
    .min(2, 'Modelo deve ter pelo menos 2 caracteres')
    .max(100, 'Modelo muito longo'),
  year: z.number()
    .int('Ano deve ser um número inteiro')
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear() + 1, 'Ano futuro inválido'),
  color: z.string()
    .min(2, 'Cor deve ter pelo menos 2 caracteres')
    .max(30, 'Cor muito longa'),
  price: z.number()
    .positive('Preço deve ser positivo')
    .max(10000000, 'Preço muito alto'),
  mileage: z.number()
    .int('Quilometragem deve ser inteira')
    .nonnegative('Quilometragem não pode ser negativa'),
  fuelType: z.enum(['gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido']),
  transmission: z.enum(['manual', 'automatico', 'cvt']),
  plate: z.string()
    .regex(/^[A-Z]{3}\d[A-Z0-9]\d{2}$/, 'Placa inválida (formato Mercosul: ABC1D23)'),
  description: z.string().max(1000, 'Descrição muito longa (máx 1000 caracteres)').optional(),
  images: z.array(z.string().url('URL de imagem inválida')).optional(),
  createdAt: z.string().datetime('Data de criação inválida'),
  updatedAt: z.string().datetime('Data de atualização inválida').optional()
});

export type Vehicle = z.infer<typeof VehicleSchema>;

/**
 * Schema de Criação de Veículo
 */
export const CreateVehicleSchema = VehicleSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
}).extend({
  brand: VehicleSchema.shape.brand.refine((val) => val.trim().length > 0, 'Marca é obrigatória'),
  model: VehicleSchema.shape.model.refine((val) => val.trim().length > 0, 'Modelo é obrigatório'),
  plate: VehicleSchema.shape.plate.refine((val) => val.trim().length > 0, 'Placa é obrigatória')
});

export type CreateVehicleData = z.infer<typeof CreateVehicleSchema>;

/**
 * Schema de Atualização de Veículo
 */
export const UpdateVehicleSchema = CreateVehicleSchema.partial();

export type UpdateVehicleData = z.infer<typeof UpdateVehicleSchema>;

/**
 * Schema de Filtros de Veículos
 */
export const VehicleFiltersSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  yearMin: z.number().int().min(1900).optional(),
  yearMax: z.number().int().optional(),
  priceMin: z.number().nonnegative().optional(),
  priceMax: z.number().nonnegative().optional(),
  fuelType: z.enum(['gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido']).optional(),
  transmission: z.enum(['manual', 'automatico', 'cvt']).optional(),
  search: z.string().optional()
});

export type VehicleFilters = z.infer<typeof VehicleFiltersSchema>;

/**
 * Schema de Paginação
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive('Página deve ser positiva').default(1),
  perPage: z.number().int().positive('Itens por página deve ser positivo').min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'price', 'year', 'mileage']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

export type PaginationParams = z.infer<typeof PaginationSchema>;

/**
 * Schema de Resposta Paginada
 */
export const PaginatedResponseSchema = <T extends z.ZodType>(schema: T) => 
  z.object({
    data: z.array(schema),
    meta: z.object({
      total: z.number().int().nonnegative(),
      page: z.number().int().positive(),
      perPage: z.number().int().positive(),
      totalPages: z.number().int().nonnegative(),
      hasMore: z.boolean()
    })
  });

export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<z.ZodType<T>>>>;