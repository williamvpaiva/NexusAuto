import { z } from 'zod';

const fuelTypes = ['gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido'] as const;
const transmissions = ['manual', 'automatico', 'cvt'] as const;

export const createVehicleSchema = z.object({
  brand: z.string({ required_error: 'Marca é obrigatória' }).trim().min(2, 'Marca deve ter pelo menos 2 caracteres').max(50),
  model: z.string({ required_error: 'Modelo é obrigatório' }).trim().min(2, 'Modelo deve ter pelo menos 2 caracteres').max(100),
  year: z.number({ required_error: 'Ano é obrigatório' }).int().min(1900, 'Ano inválido').max(new Date().getFullYear() + 1),
  color: z.string({ required_error: 'Cor é obrigatória' }).trim().min(2, 'Cor deve ter pelo menos 2 caracteres').max(30),
  price: z.number({ required_error: 'Preço é obrigatório' }).positive('Preço deve ser positivo').max(10000000),
  mileage: z.number({ required_error: 'Quilometragem é obrigatória' }).int().nonnegative('Quilometragem não pode ser negativa'),
  fuelType: z.enum(fuelTypes, { required_error: 'Tipo de combustível inválido' }),
  transmission: z.enum(transmissions, { required_error: 'Transmissão inválida' }),
  plate: z.string({ required_error: 'Placa é obrigatória' }).regex(/^[A-Z]{3}\d[A-Z0-9]\d{2}$/, 'Placa inválida (formato Mercosul: ABC1D23)'),
  description: z.string().max(1000).optional(),
  images: z.array(z.string().url()).optional(),
});

export const updateVehicleSchema = z.object({
  brand: z.string().trim().min(2).max(50).optional(),
  model: z.string().trim().min(2).max(100).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  color: z.string().trim().min(2).max(30).optional(),
  price: z.number().positive().max(10000000).optional(),
  mileage: z.number().int().nonnegative().optional(),
  fuelType: z.enum(fuelTypes).optional(),
  transmission: z.enum(transmissions).optional(),
  plate: z.string().regex(/^[A-Z]{3}\d[A-Z0-9]\d{2}$/).optional(),
  description: z.string().max(1000).optional(),
  images: z.array(z.string().url()).optional(),
});

export const vehicleFiltersSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  yearMin: z.coerce.number().int().optional(),
  yearMax: z.coerce.number().int().optional(),
  priceMin: z.coerce.number().nonnegative().optional(),
  priceMax: z.coerce.number().nonnegative().optional(),
  fuelType: z.enum(fuelTypes).optional(),
  transmission: z.enum(transmissions).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  perPage: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'price', 'year', 'mileage']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleFiltersInput = z.infer<typeof vehicleFiltersSchema>;
