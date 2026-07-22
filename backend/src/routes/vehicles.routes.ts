import { Router } from 'express';
import {
  createVehicle,
  deleteVehicle,
  getVehicleById,
  listVehicles,
  updateVehicle,
} from '../controllers/vehicles.controller';
import { createVehicleDto, updateVehicleDto, vehicleFiltersDto } from '../dtos/vehicle.dto';
import { validate } from '../middleware/validate.middleware';

export const vehiclesRouter = Router();

vehiclesRouter.get('/', validate({ query: vehicleFiltersDto }), listVehicles);
vehiclesRouter.post('/', validate({ body: createVehicleDto }), createVehicle);
vehiclesRouter.get('/:id', getVehicleById);
vehiclesRouter.put('/:id', validate({ body: updateVehicleDto }), updateVehicle);
vehiclesRouter.delete('/:id', deleteVehicle);
