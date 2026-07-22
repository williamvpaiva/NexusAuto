import { AppError } from '../utils/app-error';
import type { CreateVehicleInput, UpdateVehicleInput, Vehicle, VehicleFilters } from '../types/vehicle';
import type { IVehiclesRepository } from '../repositories/interfaces/IVehiclesRepository';
import { vehiclesRepository } from '../repositories/vehicles.repository';

export class VehiclesService {
  constructor(private vehiclesRepository: IVehiclesRepository) {}

  async list(
    filters: VehicleFilters = {},
    page = 1,
    perPage = 20,
    sortBy = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    return this.vehiclesRepository.findAll(filters, page, perPage, sortBy, sortOrder);
  }

  async findById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Veículo não encontrado', 404, 'VEHICLE_NOT_FOUND');
    }
    return vehicle;
  }

  async create(input: CreateVehicleInput): Promise<Vehicle> {
    const existing = await this.vehiclesRepository.findByPlate(input.plate);
    if (existing) {
      throw new AppError('Placa já cadastrada', 409, 'PLATE_ALREADY_EXISTS');
    }
    return this.vehiclesRepository.create(input);
  }

  async update(id: string, input: UpdateVehicleInput): Promise<Vehicle> {
    if (input.plate) {
      const existing = await this.vehiclesRepository.findByPlate(input.plate);
      if (existing && existing.id !== id) {
        throw new AppError('Placa já cadastrada', 409, 'PLATE_ALREADY_EXISTS');
      }
    }
    const updated = await this.vehiclesRepository.update(id, input);
    if (!updated) {
      throw new AppError('Veículo não encontrado', 404, 'VEHICLE_NOT_FOUND');
    }
    return updated;
  }

  async delete(id: string): Promise<void> {
    const vehicle = await this.vehiclesRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Veículo não encontrado', 404, 'VEHICLE_NOT_FOUND');
    }
    await this.vehiclesRepository.delete(id);
  }
}

export const vehiclesService = new VehiclesService(vehiclesRepository);
