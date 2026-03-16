import { AI_SuggestionModel } from "./models/ai.model";
import { TaskModel } from "./models/task.model";
import { SuggestionTypes } from "./types/ai.enum";
import { Task } from "./types/task.type";
import { taskImpotance } from "./types/taskImportance.enum";
import { taskStatus } from "./types/taskStatus.enum";

type task_param = {
  image_url: string;
  user_id: string;
  title: string;
  duration: number;
  notes: string[];
  ai_suggestion: boolean;
  setReminder: boolean;
  impotance: taskImpotance;
  status: taskStatus;
  suggestion: string;
  type: SuggestionTypes;
  promp: string;
};
export const add_task_service = async (data: task_param) => {
  //create book document
  const task = await TaskModel.create(data);
  //check if IA suggestion is On
  const suggestion = await AI_SuggestionModel.create({
    user_id:task.user_id,
    suggestion:data.suggestion,
    task_id:task._id,
    type:data.type,
    promp:data.promp
  });
  //If on create a suggestion document
  //return saved task
  return { savedTask: task,aisuggestion:suggestion };
};

export const mytask_service = async (user_id: string) => {
  //get user task
  const tasks = await TaskModel.find({ user_id: user_id });
  //get user task suggestions
  const suggestion = await AI_SuggestionModel.find({user_id:user_id})
  //return task and suggestions
  return { tasks,suggestion };
};
export const update_task_service = async (data: Task) => {
  //verify task exist and update it
  const updated_task = await TaskModel.findByIdAndUpdate(data._id, data, {
    new: true,
  });
  //return updated tas and new suggestion
  return { updated_task };
};
export const delete_task_service = async (task_id: string) => {
  //delete task
  const isDeleted = await TaskModel.findByIdAndDelete(task_id).then(() => true);
  //delete suggestion
  if(isDeleted)
    await AI_SuggestionModel.findOneAndDelete({task_id:task_id})
  //return
  return { isDeleted };
};
export const get_details_service = async (task_id: string) => {
  //get task
  const task = await TaskModel.findById(task_id);
  //get task suggestions
  const ai_suggestion = await AI_SuggestionModel.findOne({task_id:task?._id})
  //return task and suggestion
  return { task, ai_suggestion };
};
