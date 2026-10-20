import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
    routines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Routine" }],
  },
  { timestamps: true }
);

export default mongoose.model("Entry", EntrySchema);