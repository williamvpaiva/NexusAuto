export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  mileage: number;
  fuelType: 'gasolina' | 'etanol' | 'flex' | 'diesel' | 'eletrico' | 'hibrido';
  transmission: 'manual' | 'automatico' | 'cvt';
  plate: string;
  description?: string;
  images?: string[];
  createdAt: string;
  updatedAt?: string;
};

export type CreateVehicleInput = {
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  mileage: number;
  fuelType: 'gasolina' | 'etanol' | 'flex' | 'diesel' | 'eletrico' | 'hibrido';
  transmission: 'manual' | 'automatico' | 'cvt';
  plate: string;
  description?: string;
  images?: string[];
};

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

export type VehicleFilters = {
  brand?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  fuelType?: string;
  transmission?: string;
  search?: string;
};
