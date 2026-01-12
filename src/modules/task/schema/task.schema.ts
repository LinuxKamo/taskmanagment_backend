import z from "zod";
import { taskStatus } from "../types/taskStatus.enum";
import { taskImpotance } from "../types/taskImportance.enum";

export const TaskSchema = z.object({
    image_url:z.string(),
    user_id: z.string(),
    title: z.string().min(1).max(255),
    description: z.string().min(2),
    importance: z.enum(taskImpotance).default(taskImpotance.LOW),
    status:  z.enum(taskStatus).default(taskStatus.PENDING),
    setReminder: z.boolean(),
    duration: z.number().min(1),
    ai_tracking: z.boolean(),
    notes: z.array(z.string()),
})