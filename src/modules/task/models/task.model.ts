import mongoose, { Schema, model, Types } from "mongoose";
import { taskStatus } from "../types/taskStatus.enum";
import { taskImpotance } from "../types/taskImportance.enum";

interface Task extends mongoose.Document {
  image_url: string;
  user_id: Types.ObjectId;
  title: string;
  description: string;
  importance: taskImpotance;
  status: taskStatus;
  setReminder: boolean;
  duration: number;
  ai_tracking: boolean;
  completed_at?: Date;
  notes: string[];
}

const taskSchema = new mongoose.Schema<Task>(
  {
    image_url: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    importance: { type: String, required: true },
    status: { type: String, default: taskStatus.PENDING },
    setReminder: { type: Boolean, default: false },
    duration: { type: Number, default: 0 },
    ai_tracking: { type: Boolean, default: false },
    completed_at: { type: Date },
    notes: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const TaskModel = model<Task>("Task", taskSchema);
