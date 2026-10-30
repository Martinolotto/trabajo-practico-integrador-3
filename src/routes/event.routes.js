
import { Router } from "express";

import {
  createEvent,
  getEvents,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

import {
  createEventValidations,
  getEventByIdValidations,
  updateEventValidations,
  deleteEventValidations,
} from "../middlewares/event.validation.js";

import { validate } from "../middlewares/validate.js";

export const eventRouter = Router();

// Crear evento
eventRouter.post("/events", createEventValidations, validate, createEvent);

// Listar eventos
eventRouter.get("/events", getEvents);

// Listar mis eventos
eventRouter.get("/events/my", getMyEvents);

// Obtener evento por id
eventRouter.get("/events/:id", getEventByIdValidations, validate, getEventById);

// Actualizar evento
eventRouter.put("/events/:id", updateEventValidations, validate, updateEvent);

// Eliminar evento
eventRouter.delete("/events/:id", deleteEventValidations, validate, deleteEvent);
