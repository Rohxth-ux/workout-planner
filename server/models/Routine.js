import mongoose from "mongoose";

const RoutineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, default: "" },
    time: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Routine", RoutineSchema);