import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from '../controllers/users.controller';
import { createUserDto, updateUserDto } from '../dtos/user.dto';
import { validate } from '../middleware/validate.middleware';

export const usersRouter = Router();

/**
 * @route GET /api/v1/users
 * @description Lista todos os usuários
 */
usersRouter.get('/', listUsers);

/**
 * @route POST /api/v1/users
 * @description Cria novo usuário
 */
usersRouter.post('/', validate({ body: createUserDto }), createUser);

/**
 * @route GET /api/v1/users/:id
 * @description Busca usuário por ID
 */
usersRouter.get('/:id', getUserById);

/**
 * @route PUT /api/v1/users/:id
 * @description Atualiza usuário
 */
usersRouter.put('/:id', validate({ body: updateUserDto }), updateUser);

/**
 * @route DELETE /api/v1/users/:id
 * @description Remove usuário
 */
usersRouter.delete('/:id', deleteUser);