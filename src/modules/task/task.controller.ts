import UserModel from "../auth/models/user.model";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from "../constants/http.status";
import AppAssets from "../utils/AppAssets";
import catchError from "../utils/catchErrors";
import { TaskModel } from "./models/task.model";
import { AI_SuggestionSchema } from "./schema/task.ai.schema";
import { TaskSchema } from "./schema/task.schema";
import {
  add_task_service,
  delete_task_service,
  get_details_service,
  mytask_service,
  update_task_service,
} from "./task.service";

//Is authenticated before it gets here there for req.user_id will always be available
export const add_task_controller = catchError(async (req, res) => {
  const data = req.body;
  //   if (req.files) {
  //     data.image_url = (req.files as any).image_url
  //       ? `/uploads/${(req.files as any).image_url[0].filename}`
  //       : undefined;
  //   }
  data.image_url = "/test_url.com";
  data.user_id = req.userId;
  //Verify information
  const request = await TaskSchema.parse(data);
  const suggestion_request = await AI_SuggestionSchema.parse(data);

  //Call service
  const { savedTask, aisuggestion } = await add_task_service(data);

  //return res
  return res.status(OK).json({
    message: "task created successfully",
    task: savedTask,
    ai_suggestion: aisuggestion,
  });
});
export const mytask_controller = catchError(async (req, res) => {
  //get user_id
  const user_id = req.userId;
  AppAssets(user_id, NOT_FOUND, "User does not Exist");
  //call service
  const { tasks, suggestion } = await mytask_service(user_id as string);
  //return res
  res
    .status(OK)
    .json({ tasks: tasks, aisuggestions: suggestion, message: "success" });
});

export const update_task_controller = catchError(async (req, res) => {
  //get req data
  const data = req.body;
  data.user_id = req.userId;
  //check if book exists
  const isExist = await TaskModel.exists({ _id: data._id });
  AppAssets(isExist, BAD_REQUEST, "Book not found");
  //verify task request
  const request = await TaskSchema.parse(data);
  //call service
  const { updated_task } = await update_task_service(data);
  //return res
  return res
    .status(OK)
    .json({ message: "Task updated successfully", task: updated_task });
});

//Get task detail using task _id
export const task_details_controller = catchError(async (req, res) => {
  const _id = req.params._id;
  //Check if book exists
  const isExist = await TaskModel.findById({ _id });
  AppAssets(isExist, BAD_REQUEST, "Task not found");

  //call service
  const { task, ai_suggestion } = await get_details_service(_id as string);

  return res
    .status(OK)
    .json({ message: "success", task: task, aisuggestion: ai_suggestion });
});
//Delete task
export const delete_task_controller = catchError(async (req, res) => {
  const task_id = req.params._id;
  //Check if task exists
  const isExist = await TaskModel.exists({ _id: task_id });
  AppAssets(isExist, BAD_REQUEST, "Book not found");
  //call service to delete book
  const { isDeleted } = await delete_task_service(task_id as string);
  //return response
  if (isDeleted)
    return res.status(OK).json({ message: "Task deleted successfully: " });
  else
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
});
//search and filter tasks
export const searchAndFilter = catchError(async (req, res) => {
  const { query } = req.query;
  //call service to filter books
  //return response
  return res.status(OK).json({ message: "Filtered books" });
});
