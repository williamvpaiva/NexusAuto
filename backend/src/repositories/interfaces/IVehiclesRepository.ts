import type { CreateVehicleInput, UpdateVehicleInput, Vehicle, VehicleFilters } from '../../types/vehicle';

export interface IVehiclesRepository {
  findAll(
    filters: VehicleFilters,
    page: number,
    perPage: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
  ): Promise<{ data: Vehicle[]; meta: { page: number; perPage: number; total: number; totalPages: number } }>;
  findById(id: string): Promise<Vehicle | undefined>;
  findByPlate(plate: string): Promise<Vehicle | undefined>;
  create(data: CreateVehicleInput): Promise<Vehicle>;
  update(id: string, data: UpdateVehicleInput): Promise<Vehicle | undefined>;
  delete(id: string): Promise<void>;
}
