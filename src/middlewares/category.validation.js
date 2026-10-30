
import { body, param } from "express-validator";
import { CategoryModel } from "../models/category.model.js";

// CREAR CATEGORIA
export const createCategoryValidations = [

  // name:
  // - Obligatorio y no vacío.
  // - String de 2 a 30 caracteres.
  // - custom(): comprobar que el nombre sea único.
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString()
    .withMessage("El nombre debe ser String")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .bail()
    .custom(async (name) => {
      const category = await CategoryModel.findOne({ name });

      if (category) {
        throw new Error("La categoria ya existe");
      }

      return true;
    }),

  // description:
  // - Opcional.
  // - String de máximo 200 caracteres.
  body("description")
    .optional()
    .isString()
    .withMessage("La descripcion debe ser String")
    .bail()
    .isLength({ max: 200 })
    .withMessage("La descripcion debe tener máximo 200 caracteres"),
];


// OBTENER CATEGORIA POR ID
export const getCategoryByIdValidations = [

  // id:
  // - Validar el parámetro de la URL con isMongoId().
  // - La existencia se comprueba en el controlador.
  param("id")
    .isMongoId()
    .withMessage("El ID de la categoria no es válido"),
];


// ACTUALIZAR CATEGORIA
export const updateCategoryValidations = [

  // id:
  // - Validar que sea un ObjectId válido.
  param("id")
    .isMongoId()
    .withMessage("El ID de la categoria no es válido"),

  // name:
  // - Opcional, pero si llega debe cumplir sus restricciones.
  // - custom(): comprobar unicidad excluyendo la categoría actual.
  body("name")
    .optional()
    .notEmpty()
    .withMessage("El nombre no puede estar vacío")
    .bail()
    .isString()
    .withMessage("El nombre debe ser String")
    .bail()
    .isLength({ min: 2, max: 30 })
    .withMessage("El nombre debe tener entre 2 y 30 caracteres")
    .bail()
    .custom(async (name, { req }) => {
      const category = await CategoryModel.findOne({
        name,
        _id: { $ne: req.params.id },
      });

      if (category) {
        throw new Error("El nombre ya está registrado");
      }

      return true;
    }),

  // description:
  // - Opcional, String de máximo 200 caracteres.
  body("description")
    .optional()
    .isString()
    .withMessage("La descripcion debe ser String")
    .bail()
    .isLength({ max: 200 })
    .withMessage("La descripcion debe tener máximo 200 caracteres"),
];


// ELIMINAR CATEGORIA
export const deleteCategoryValidations = [

  // id:
  // - Validar que sea un ObjectId válido.
  param("id")
    .isMongoId()
    .withMessage("El ID de la categoria no es válido"),
];
