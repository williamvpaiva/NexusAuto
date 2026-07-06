import { z } from 'zod';
import { vehiclesService } from '../services/vehicles.service';
import { asyncHandler } from '../utils/async-handler';

const fuelTypes = ['gasolina', 'etanol', 'flex', 'diesel', 'eletrico', 'hibrido'] as const;
const transmissions = ['manual', 'automatico', 'cvt'] as const;

export const createVehicleSchema = z.object({
  brand: z.string().trim().min(2, 'Marca deve ter pelo menos 2 caracteres').max(50),
  model: z.string().trim().min(2, 'Modelo deve ter pelo menos 2 caracteres').max(100),
  year: z.number().int().min(1900, 'Ano inválido').max(new Date().getFullYear() + 1),
  color: z.string().trim().min(2, 'Cor deve ter pelo menos 2 caracteres').max(30),
  price: z.number().positive('Preço deve ser positivo').max(10000000),
  mileage: z.number().int().nonnegative('Quilometragem não pode ser negativa'),
  fuelType: z.enum(fuelTypes),
  transmission: z.enum(transmissions),
  plate: z.string().regex(/^[A-Z]{3}\d[A-Z0-9]\d{2}$/, 'Placa inválida (formato Mercosul: ABC1D23)'),
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

export const listVehicles = asyncHandler(async (req, res) => {
  const filters = vehicleFiltersSchema.parse(req.query);
  const result = await vehiclesService.list(
    {
      brand: filters.brand,
      model: filters.model,
      yearMin: filters.yearMin,
      yearMax: filters.yearMax,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      fuelType: filters.fuelType,
      transmission: filters.transmission,
      search: filters.search,
    },
    filters.page,
    filters.perPage,
    filters.sortBy,
    filters.sortOrder
  );
  res.json({ success: true, ...result });
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.findById(req.params.id);
  res.json({ success: true, data: vehicle });
});

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.create(req.body);
  res.status(201).json({ success: true, data: vehicle });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.update(req.params.id, req.body);
  res.json({ success: true, data: vehicle });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  await vehiclesService.delete(req.params.id);
  res.status(204).send();
});
