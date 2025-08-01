import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export const Todo = mongoose.model("Todo", todoSchema);
