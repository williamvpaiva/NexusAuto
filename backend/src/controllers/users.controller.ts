import { usersService } from '../services/users.service';
import { asyncHandler } from '../utils/async-handler';
import { toUserResponse, toUserListResponse } from '../dtos/user.dto';

export const listUsers = asyncHandler(async (_req, res) => {
  const users = await usersService.list();
  res.json({ success: true, data: toUserListResponse(users), meta: { total: users.length } });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await usersService.findById(req.params.id);
  res.json({ success: true, data: toUserResponse(user) });
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await usersService.create(req.body);
  res.status(201).json({ success: true, data: toUserResponse(user) });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await usersService.update(req.params.id, req.body);
  res.json({ success: true, data: toUserResponse(user) });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await usersService.delete(req.params.id);
  res.status(204).send();
});
