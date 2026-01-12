import { taskImpotance } from "./taskImportance.enum";
import { taskStatus } from "./taskStatus.enum";

export type Task = {
  _id: string;
  image_url: string;
  user_id: string;
  title: string;
  description: string;
  duration: number;
  notes: string[];
  ai_suggestion: boolean;
  setReminder: boolean;
  impotance: taskImpotance;
  status: taskStatus;
};
