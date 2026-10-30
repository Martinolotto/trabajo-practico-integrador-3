
import { Router } from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import {
  getUserByIdValidations,
  updateUserValidations,
  deleteUserValidations,
} from "../middlewares/user.validation.js";

import { validate } from "../middlewares/validate.js";

export const userRouter = Router();

// Listar usuarios
userRouter.get("/users", getUsers);

// Obtener usuario por id
userRouter.get("/users/:id", getUserByIdValidations, validate, getUserById);

// Actualizar usuario
userRouter.put("/users/:id", updateUserValidations, validate, updateUser);

// Eliminar usuario
userRouter.delete("/users/:id", deleteUserValidations, validate, deleteUser);
