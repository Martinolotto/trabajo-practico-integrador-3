
import { body, param } from "express-validator";
import { UserModel } from "../models/user.model.js";

// REGISTRAR USUARIO
export const registerUserValidations = [

  // username:
  // - Obligatorio y no vacío.
  // - Alfanumérico, entre 3 y 20 caracteres.
  // - custom(): comprobar que sea único.
  body("username")
    .notEmpty()
    .withMessage("El username es obligatorio")
    .bail()
    .isString()
    .withMessage("El username debe ser String")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .bail()
    .isAlphanumeric()
    .withMessage("El username debe ser alfanumérico")
    .bail()
    .custom(async (username) => {
      const user = await UserModel.findOne({ username });

      if (user) {
        throw new Error("El username ya está registrado");
      }

      return true;
    }),

  // email:
  // - Obligatorio y no vacío.
  // - Formato de correo válido (isEmail).
  // - custom(): comprobar que sea único.
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("El email no es válido")
    .bail()
    .custom(async (email) => {
      const user = await UserModel.findOne({ email });

      if (user) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  // password:
  // - Obligatoria.
  // - Mínimo 8 caracteres.
  // - Al menos una mayúscula, una minúscula y un número.
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número"),

  // role:
  // - No se recibe durante el registro.
  // - Mongoose asigna "user" por defecto.

  // profile.firstName:
  // - Obligatorio.
  // - Solo letras, entre 2 y 50 caracteres.
  body("profile.firstName")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .bail()
    .isString()
    .withMessage("El nombre debe ser String")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .bail()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El nombre debe contener solo letras"),

  // profile.lastName:
  // - Obligatorio.
  // - Solo letras, entre 2 y 50 caracteres.
  body("profile.lastName")
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .bail()
    .isString()
    .withMessage("El apellido debe ser String")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .bail()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El apellido debe contener solo letras"),

  // profile.birthDate:
  // - Opcional.
  // - Fecha válida (isISO8601).
  // - custom(): comprobar que no sea futura.
  body("profile.birthDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("La fecha de nacimiento no es válida")
    .bail()
    .custom((birthDate) => {
      if (new Date(birthDate) > new Date()) {
        throw new Error("La fecha de nacimiento no puede ser futura");
      }

      return true;
    }),

  // profile.phone:
  // - Opcional.
  // - Solo números, entre 8 y 15 dígitos.
  body("profile.phone")
    .optional()
    .isString()
    .withMessage("El teléfono debe ser String")
    .bail()
    .matches(/^[0-9]{8,15}$/)
    .withMessage("El teléfono debe contener entre 8 y 15 dígitos numéricos"),

  // deletedAt:
  // - No se recibe del body.
  // - Mongoose utiliza null por defecto.
];


// LOGIN DE USUARIO
export const loginUserValidations = [

  // email:
  // - Obligatorio.
  // - Formato de correo válido.
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .bail()
    .isEmail()
    .withMessage("El email no es válido"),

  // password:
  // - Obligatoria y no vacía.
  // - La contraseña se comprueba con bcrypt en el controlador.
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),
];


// ACTUALIZAR PERFIL DEL USUARIO AUTENTICADO
export const updateProfileValidations = [

  // profile.firstName:
  // - Opcional, pero si llega debe tener 2-50 caracteres.
  // - Solo letras.
  body("profile.firstName")
    .optional()
    .isString()
    .withMessage("El nombre debe ser String")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .bail()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El nombre debe contener solo letras"),

  // profile.lastName:
  // - Opcional, pero si llega debe tener 2-50 caracteres.
  // - Solo letras.
  body("profile.lastName")
    .optional()
    .isString()
    .withMessage("El apellido debe ser String")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .bail()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El apellido debe contener solo letras"),

  // profile.birthDate:
  // - Opcional.
  // - Fecha válida, no futura.
  body("profile.birthDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("La fecha de nacimiento no es válida")
    .bail()
    .custom((birthDate) => {
      if (new Date(birthDate) > new Date()) {
        throw new Error("La fecha de nacimiento no puede ser futura");
      }

      return true;
    }),

  // profile.phone:
  // - Opcional.
  // - Solo números, entre 8 y 15 dígitos.
  body("profile.phone")
    .optional()
    .isString()
    .withMessage("El teléfono debe ser String")
    .bail()
    .matches(/^[0-9]{8,15}$/)
    .withMessage("El teléfono debe contener entre 8 y 15 dígitos numéricos"),
];


// OBTENER USUARIO POR ID
export const getUserByIdValidations = [

  // id:
  // - Validar el parámetro de la URL con isMongoId().
  // - La existencia del usuario se comprueba en el controlador.
  param("id")
    .isMongoId()
    .withMessage("El ID del usuario no es válido"),
];


// ACTUALIZAR USUARIO
export const updateUserValidations = [

  // id:
  // - Validar que sea un ObjectId válido.
  param("id")
    .isMongoId()
    .withMessage("El ID del usuario no es válido"),

  // username:
  // - Opcional, alfanumérico de 3-20 caracteres.
  // - custom(): comprobar unicidad excluyendo el usuario actual.
  body("username")
    .optional()
    .isString()
    .withMessage("El username debe ser String")
    .bail()
    .isLength({ min: 3, max: 20 })
    .withMessage("El username debe tener entre 3 y 20 caracteres")
    .bail()
    .isAlphanumeric()
    .withMessage("El username debe ser alfanumérico")
    .bail()
    .custom(async (username, { req }) => {
      const user = await UserModel.findOne({
        username,
        _id: { $ne: req.params.id },
      });

      if (user) {
        throw new Error("El username ya está registrado");
      }

      return true;
    }),

  // email:
  // - Opcional, formato válido.
  // - custom(): comprobar unicidad excluyendo el usuario actual.
  body("email")
    .optional()
    .isEmail()
    .withMessage("El email no es válido")
    .bail()
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({
        email,
        _id: { $ne: req.params.id },
      });

      if (user) {
        throw new Error("El email ya está registrado");
      }

      return true;
    }),

  // password:
  // - Opcional, pero si llega debe cumplir las restricciones.
  // - Debe hashearse antes de guardar.
  body("password")
    .optional()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número"),

  // role:
  // - Opcional.
  // - Solo "user" o "admin".
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("El rol no es válido"),

  // profile.firstName:
  // - Opcional, de 2-50 caracteres.
  // - Solo letras.
  body("profile.firstName")
    .optional()
    .isString()
    .withMessage("El nombre debe ser String")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .bail()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El nombre debe contener solo letras"),

  // profile.lastName:
  // - Opcional, de 2-50 caracteres.
  // - Solo letras.
  body("profile.lastName")
    .optional()
    .isString()
    .withMessage("El apellido debe ser String")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres")
    .bail()
    .isAlpha("es-ES", { ignore: " " })
    .withMessage("El apellido debe contener solo letras"),

  // profile.birthDate:
  // - Opcional, fecha válida y no futura.
  body("profile.birthDate")
    .optional()
    .isISO8601({ strict: true })
    .withMessage("La fecha de nacimiento no es válida")
    .bail()
    .custom((birthDate) => {
      if (new Date(birthDate) > new Date()) {
        throw new Error("La fecha de nacimiento no puede ser futura");
      }

      return true;
    }),

  // profile.phone:
  // - Opcional, solo números de 8-15 dígitos.
  body("profile.phone")
    .optional()
    .isString()
    .withMessage("El teléfono debe ser String")
    .bail()
    .matches(/^[0-9]{8,15}$/)
    .withMessage("El teléfono debe contener entre 8 y 15 dígitos numéricos"),

  // deletedAt:
  // - No se recibe del body.
  // - Se utiliza para la eliminación lógica.
];


// ELIMINAR USUARIO
export const deleteUserValidations = [

  // id:
  // - Validar que sea un ObjectId válido.
  // - La eliminación es lógica mediante deletedAt.
  param("id")
    .isMongoId()
    .withMessage("El ID del usuario no es válido"),
];
