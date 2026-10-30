import { body, param } from "express-validator";
import { EventModel } from "../models/event.model.js";
import { CategoryModel } from "../models/category.model.js";

// CREAR EVENTO
export const createEventValidations = [

  // title:
  // - Obligatorio y no vacío.
  // - String de 3 a 150 caracteres.
  // - custom(): comprobar con EventModel que no exista otro título igual.
  body("title")
     .notEmpty()
     .withMessage("El titulo es obligatorio")
     .bail()
     .isString()
     .withMessage("El titulo debe ser String")
     .bail()
     .isLength({ min: 3, max: 150 })
     .withMessage("El titulo debe tener entre 3 y 150 caracteres")
     .bail()
     .custom(async (title) => {
       // Buscar un evento con el mismo titulo.
        const event = await EventModel.findOne({ title });
 
        if (event) {
          throw new Error("El titulo debe ser único");
        }
 
        return true;
      }),

  
  // description:
  // - Obligatorio y no vacío.
  // - String de mínimo 20 caracteres.
  body("description")
    .notEmpty()
    .withMessage("La descripcion es obligatoria")
    .bail()
    .isString()
    .withMessage("La descripcion debe ser String")
    .bail()
    .isLength({ min: 20 })
    .withMessage("La descripcion debe tener al menos 20 caracteres"),

  
  // startDate:
  // - Obligatoria.
  body("startDate")
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .bail()
    .isISO8601({ strict: true })
    .withMessage("La fecha de inicio no es válida"), // - Fecha válida (isISO8601).
  

  // endDate:
  // - Obligatoria.
  // - Fecha válida (isISO8601).
  // - custom(): comprobar que sea posterior a startDate.
  body("endDate")
    .notEmpty()
    .withMessage("La fecha final es obligatoria")
    .bail()
    .isISO8601({ strict: true })
    .withMessage("La fecha final no es válida")
    .bail()
    //tomamos el valor endatate que nos pasaron y la request completa
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) { //se convierten los valores en fecha y comparamos
        throw new Error("La fecha final debe ser posterior a la inicial");
      }
  
      return true;
    }),

  // capacity:
  // - Obligatorio.
  // - Número entero, mínimo 1 (isInt).
  body("capacity")
    .notEmpty()
    .withMessage("La capacidad es obligatoria")
    .bail()
    .isInt({ min: 1 }) //comprueba que sea entero al menos 1
    .withMessage("La capacidad debe ser un entero mayor o igual a 1"),
  
  // price:
  // - Opcional, porque el Schema tiene default: 0.
  // - Número igual o mayor a 0 (isFloat).
  body("price")
    .optional()
    .isFloat({ min: 0 }) //acepta decimelaes desde 0
    .withMessage("El precio debe ser mayor o igual a 0"),
  
  // status:
  // - Opcional, porque el Schema tiene default: "scheduled".
  // - Solo "scheduled", "cancelled" o "finished" (isIn).
  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"]) // valor entre los permitidos
    .withMessage("El estado no es válido"),

  // location.venue:
  // - Obligatorio, String de 3 a 100 caracteres.
  body("location.venue")
    .notEmpty()
    .withMessage("El lugar es obligatorio")
    .bail()
    .isString()
    .withMessage("El lugar debe ser String")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),
  
  // location.address:
  // - Obligatorio, String de 5 a 150 caracteres.
  body("location.address")
    .notEmpty()
    .withMessage("La direccion es obligatoria")
    .bail()
    .isString()
    .withMessage("La direccion debe ser String")
    .bail()
    .isLength({ min: 5, max: 150 })
    .withMessage("La direccion debe tener entre 5 y 150 caracteres"),
  
  // location.city:
  // - Obligatorio, String de 2 a 50 caracteres.
  body("location.city")
    .notEmpty()
    .withMessage("La ciudad es obligatoria")
    .bail()
    .isString()
    .withMessage("La ciudad debe ser String")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

  // categories: // valida el arreglo completo 
  // - Opcional.
  // - Si se envía, debe ser un arreglo (isArray).
  body("categories")
    .optional()
    .isArray()
    .withMessage("Las categorias deben ser un arreglo"),
  
  // categories.*: //valida cada id individualmente
  // - Cada elemento debe ser un ObjectId válido (isMongoId).
  // - custom(): comprobar que cada categoría exista en MongoDB.
  body("categories.*")
    .isMongoId()
    .withMessage("El ID de categoria no es válido")
    .bail()
    .custom(async (categoryId) => {
      const category = await CategoryModel.findById(categoryId);
  
      if (!category) {
        throw new Error("La categoria no existe");
      }
  
      return true;
    }),
  
  // organizer:
  // - NO se recibe del body.
  // - Se obtiene del usuario autenticado mediante JWT.
];


// OBTENER EVENTO POR ID
export const getEventByIdValidations = [

  // id:
  // - Validar el parámetro de la URL con isMongoId().
  // - La existencia del evento se puede comprobar en el controlador.
  param("id")
    .isMongoId()
    .withMessage("El ID del evento no es válido"),

  //controlador 
  // const event = await EventModel.findById(req.params.id);
  
  // if (!event) {
  //   return res.status(404).json({
  //     message: "Evento no encontrado",
  //   });
  // }
];


// ACTUALIZAR EVENTO
export const updateEventValidations = [

  // id:
  // - Validar que sea un ObjectId válido.
  param("id")
    .isMongoId()
    .withMessage("El ID del evento no es válido"),

  // title:
  // - Opcional, pero si llega debe cumplir sus restricciones.
  // - custom(): comprobar unicidad excluyendo el evento actual.
  body("title")
    .optional()
    .isString()
    .withMessage("El título debe ser String")
    .bail()
    .isLength({ min: 3, max: 150 })
    .withMessage("El título debe tener entre 3 y 150 caracteres")
    .bail()
    .custom(async (title, { req }) => {
      const event = await EventModel.findOne({ 
        title,//un evento con el titulo
        _id: { $ne: req.params.id }, //con id diferente al que estamos modificando
      });

      if (event) {
        throw new Error("El título ya está registrado");
      }

      return true;
    }),

  // description, capacity, price y status:
  // - Opcionales, pero validar sus restricciones si llegan.
  body("description")
    .optional()
    .isString()
    .withMessage("La descripción debe ser String")
    .bail()
    .isLength({ min: 20 })
    .withMessage("La descripción debe tener al menos 20 caracteres"),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La capacidad debe ser un entero mayor o igual a 1"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser mayor o igual a 0"),

  body("status")
    .optional()
    .isIn(["scheduled", "cancelled", "finished"])
    .withMessage("El estado no es válido"),

  // startDate y endDate:
  // - Opcionales, pero deben ser fechas válidas.
  // - custom(): comprobar el orden de las fechas.
  // - Si solo llega una fecha, consultar la otra en MongoDB.
  body("startDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("La fecha de inicio no es válida")
    .bail()
    .custom(async (startDate, { req }) => {
      if (req.body.endDate !== undefined) { //si end date esta definido
        return true;
      }

      const event = await EventModel.findById(req.params.id);

      if (event && new Date(startDate) >= new Date(event.endDate)) {
        throw new Error("La fecha inicial debe ser anterior a la final");
      }

      return true;
    }),

  body("endDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("La fecha final no es válida")
    .bail()
    .custom(async (endDate, { req }) => {
      let startDate = req.body.startDate;

      if (startDate === undefined) { //si el inicio no esta definido
        const event = await EventModel.findById(req.params.id);
        startDate = event?.startDate;
      }

      if (startDate && new Date(endDate) <= new Date(startDate)) {
        throw new Error("La fecha final debe ser posterior a la inicial");
      }

      return true;
    }),

  // location:
  // - Validar los campos embebidos que se envíen.
  body("location.venue")
    .optional()
    .isString()
    .withMessage("El lugar debe ser String")
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage("El lugar debe tener entre 3 y 100 caracteres"),

  body("location.address")
    .optional()
    .isString()
    .withMessage("La dirección debe ser String")
    .bail()
    .isLength({ min: 5, max: 150 })
    .withMessage("La dirección debe tener entre 5 y 150 caracteres"),

  body("location.city")
    .optional()
    .isString()
    .withMessage("La ciudad debe ser String")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("La ciudad debe tener entre 2 y 50 caracteres"),

  // categories:
  // - Opcional, debe ser un arreglo de ObjectIds válidos.
  // - custom(): comprobar que existan las categorías.
  body("categories")
    .optional()
    .isArray()
    .withMessage("Las categorías deben ser un arreglo"),

  body("categories.*")
    .isMongoId()
    .withMessage("El ID de la categoría no es válido")
    .bail()
    .custom(async (categoryId) => {
      const category = await CategoryModel.findById(categoryId);

      if (!category) {
        throw new Error("La categoría no existe");
      }

      return true;
    }),
];


// ELIMINAR EVENTO
export const deleteEventValidations = [

  // id:
  // - Validar que sea un ObjectId válido.
  param("id")
     .isMongoId()
     .withMessage("El ID del evento no es válido"),
];