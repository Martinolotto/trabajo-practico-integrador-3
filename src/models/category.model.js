import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      minlength: 2,
      maxlength: 30,
    },

    description: {
      type: String,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Relación N:M inversa: eventos que tienen la categoria en su array categories
categorySchema.virtual("Event", {
   ref: "Event",
   localField: "_id",       // category._id
   foreignField: "categories", // Event.categories[]
   justOne: false,
 });

categorySchema.set("toJSON", { virtuals: true });

export const CategoryModel = model("Category", categorySchema);