import mongoose, { model, Types } from "mongoose";
import { SuggestionTypes } from "../types/ai.enum";
import { Schema } from "mongoose";

interface AI_Suggestion extends mongoose.Document {
    user_id:Types.ObjectId;
  task_id: Types.ObjectId;
  suggestion: string;
  type: SuggestionTypes;
  promp: string;
}
const ai_schema = new mongoose.Schema<AI_Suggestion>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    task_id: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    suggestion: { type: String, required: true },
    type: { type: String, required: true, default: SuggestionTypes.INIT },
    promp: { type: String, required: true },
  },
  { timestamps: true }
);
export const AI_SuggestionModel = model<AI_Suggestion>("AI_Suggestions",ai_schema)