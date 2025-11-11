// backend/models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  taskId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  assignedBy: { type: String, required: true }, // Doctor ID
  assignedTo: { type: String, required: true }, // Nurse ID
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  reassigned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
