
import { Router } from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import {
  createCategoryValidations,
  getCategoryByIdValidations,
  updateCategoryValidations,
  deleteCategoryValidations,
} from "../middlewares/category.validation.js";

import { validate } from "../middlewares/validate.js";

export const categoryRouter = Router();

// Crear categoria
categoryRouter.post("/categories", createCategoryValidations, validate, createCategory);

// Listar categorias
categoryRouter.get("/categories", getCategories);

// Obtener categoria por id
categoryRouter.get("/categories/:id", getCategoryByIdValidations, validate, getCategoryById);

// Actualizar categoria
categoryRouter.put("/categories/:id", updateCategoryValidations, validate, updateCategory);

// Eliminar categoria
categoryRouter.delete("/categories/:id", deleteCategoryValidations, validate, deleteCategory);
