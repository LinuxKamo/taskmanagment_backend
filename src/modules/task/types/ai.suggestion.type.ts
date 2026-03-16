import { SuggestionTypes } from "./ai.enum";

export type AI_Suggestion = {
  _id: string;
  user_id:string;
  task_id: string;
  suggestion: string;
  type: SuggestionTypes;
  promp: string;
};
