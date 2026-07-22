import { vehiclesService } from '../services/vehicles.service';
import { asyncHandler } from '../utils/async-handler';
import { toVehicleResponse, toVehicleListResponse } from '../dtos/vehicle.dto';

export const listVehicles = asyncHandler(async (req, res) => {
  const filters: any = req.query; // Validado pelo middleware
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
  res.json({ success: true, data: toVehicleListResponse(result.data), meta: result.meta });
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.findById(req.params.id);
  res.json({ success: true, data: toVehicleResponse(vehicle) });
});

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.create(req.body);
  res.status(201).json({ success: true, data: toVehicleResponse(vehicle) });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.update(req.params.id, req.body);
  res.json({ success: true, data: toVehicleResponse(vehicle) });
});

export const deleteVehicle = asyncHandler(async (req, res) => {
  await vehiclesService.delete(req.params.id);
  res.status(204).send();
});
