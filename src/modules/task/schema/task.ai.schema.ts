import z from "zod";
import { SuggestionTypes } from "../types/ai.enum";

export const AI_SuggestionSchema = z.object({
    user_id:z.string(),
    suggestion:z.string().min(10),
    type:z.enum(SuggestionTypes).default(SuggestionTypes.INIT),
    promp:z.string().min(3)
});