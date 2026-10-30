
import { model, Schema, Types } from "mongoose";

// perfil embebido
const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
    },

    birthDate: {
      type: Date, 
    },

    phone: {
      type: String,
    },
  },
  { _id: false } //sin id porque es embebido 
);

//user
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      //formato de email
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // relación 1:1 embbida
    profile: {
      type: profileSchema,
      required: true,
    },

    // eliminación logica
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



// // Relación 1:N: inversa, acceder a los eventos desde user.
userSchema.virtual("events", {
   ref: "Event",
   localField: "_id",      // user._id
   foreignField: "organizer", // Event.organizer
   justOne: false, // esperamos varios en el arreglo
}); 

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export const UserModel = model("User", userSchema);


