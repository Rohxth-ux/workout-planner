import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    isAdmin: { type: Boolean, default: false },
    routines: [{ type: mongoose.Schema.Types.ObjectId, ref: "Routine" }],
    meals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }],
    entries: [{ type: mongoose.Schema.Types.ObjectId, ref: "Entry" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);