import mongoose from "mongoose";
import "dotenv/config";

export const startDB = async () => {
  try {
    //conectar a la bd
    await mongoose.connect(process.env.MONGODB_URI || 3005);

    //await mongoose.connection.dropDatabase();

    // Mostrar qué base está utilizando Mongoose.
    console.log("Conectado a MongoDB:", mongoose.connection.name);

  } catch (error) {
    
    console.error("Error de conexion a la bd:", error.message);
    throw error;
  }
};
