import { Router } from 'express';
import {
  createVehicle,
  deleteVehicle,
  getVehicleById,
  listVehicles,
  updateVehicle,
  createVehicleSchema,
  updateVehicleSchema,
} from '../controllers/vehicles.controller';
import { validate } from '../middleware/validate.middleware';

export const vehiclesRouter = Router();

vehiclesRouter.get('/', listVehicles);
vehiclesRouter.post('/', validate(createVehicleSchema), createVehicle);
vehiclesRouter.get('/:id', getVehicleById);
vehiclesRouter.put('/:id', validate(updateVehicleSchema), updateVehicle);
vehiclesRouter.delete('/:id', deleteVehicle);
