
import { model, Schema, Types } from "mongoose";

// ubicacion embebida
const locationSchema = new Schema(
  {
    venue: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },

    address: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 150,
    },

    city: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },
  },
  { _id: false }
);

//evento
const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      minlength: 20,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
      //entero
      validate: {
        validator: Number.isInteger,
        message: "La capacidad debe ser un número entero",
      },
    },

    price: {
      type: Number,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ["scheduled", "cancelled", "finished"],
      default: "scheduled",
    },

    // 1:1 embebida.
    location: {
      type: locationSchema,
      required: true,
    },

    // 1:N  Referenciada, cada evento guarda el id de su organizador
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //N:M Referenciada un evento puede tener varias categorías
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const EventModel = model("Event", eventSchema);
