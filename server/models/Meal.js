import mongoose from "mongoose";

const MealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipe: { type: String, default: "" },
    time: { type: Number },
    category: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Meal", MealSchema);