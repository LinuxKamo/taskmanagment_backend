"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAndFilter = exports.delete_task_controller = exports.task_details_controller = exports.update_task_controller = exports.mytask_controller = exports.add_task_controller = void 0;
const http_status_1 = require("../constants/http.status");
const AppAssets_1 = __importDefault(require("../utils/AppAssets"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const task_model_1 = require("./models/task.model");
const task_ai_schema_1 = require("./schema/task.ai.schema");
const task_schema_1 = require("./schema/task.schema");
const task_service_1 = require("./task.service");
//Is authenticated before it gets here there for req.user_id will always be available
exports.add_task_controller = (0, catchErrors_1.default)(async (req, res) => {
    const data = req.body;
    //   if (req.files) {
    //     data.image_url = (req.files as any).image_url
    //       ? `/uploads/${(req.files as any).image_url[0].filename}`
    //       : undefined;
    //   }
    data.image_url = "/test_url.com";
    data.user_id = req.userId;
    //Verify information
    const request = await task_schema_1.TaskSchema.parse(data);
    const suggestion_request = await task_ai_schema_1.AI_SuggestionSchema.parse(data);
    //Call service
    const { savedTask, aisuggestion } = await (0, task_service_1.add_task_service)(data);
    //return res
    return res.status(http_status_1.OK).json({
        message: "task created successfully",
        task: savedTask,
        ai_suggestion: aisuggestion,
    });
});
exports.mytask_controller = (0, catchErrors_1.default)(async (req, res) => {
    //get user_id
    const user_id = req.userId;
    (0, AppAssets_1.default)(user_id, http_status_1.NOT_FOUND, "User does not Exist");
    //call service
    const { tasks, suggestion } = await (0, task_service_1.mytask_service)(user_id);
    //return res
    res
        .status(http_status_1.OK)
        .json({ tasks: tasks, aisuggestions: suggestion, message: "success" });
});
exports.update_task_controller = (0, catchErrors_1.default)(async (req, res) => {
    //get req data
    const data = req.body;
    data.user_id = req.userId;
    //check if book exists
    const isExist = await task_model_1.TaskModel.exists({ _id: data._id });
    (0, AppAssets_1.default)(isExist, http_status_1.BAD_REQUEST, "Book not found");
    //verify task request
    const request = await task_schema_1.TaskSchema.parse(data);
    //call service
    const { updated_task } = await (0, task_service_1.update_task_service)(data);
    //return res
    return res
        .status(http_status_1.OK)
        .json({ message: "Task updated successfully", task: updated_task });
});
//Get task detail using task _id
exports.task_details_controller = (0, catchErrors_1.default)(async (req, res) => {
    const _id = req.params._id;
    //Check if book exists
    const isExist = await task_model_1.TaskModel.findById({ _id });
    (0, AppAssets_1.default)(isExist, http_status_1.BAD_REQUEST, "Task not found");
    //call service
    const { task, ai_suggestion } = await (0, task_service_1.get_details_service)(_id);
    return res
        .status(http_status_1.OK)
        .json({ message: "success", task: task, aisuggestion: ai_suggestion });
});
//Delete task
exports.delete_task_controller = (0, catchErrors_1.default)(async (req, res) => {
    const task_id = req.params._id;
    //Check if task exists
    const isExist = await task_model_1.TaskModel.exists({ _id: task_id });
    (0, AppAssets_1.default)(isExist, http_status_1.BAD_REQUEST, "Book not found");
    //call service to delete book
    const { isDeleted } = await (0, task_service_1.delete_task_service)(task_id);
    //return response
    if (isDeleted)
        return res.status(http_status_1.OK).json({ message: "Task deleted successfully: " });
    else
        return res
            .status(http_status_1.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong" });
});
//search and filter tasks
exports.searchAndFilter = (0, catchErrors_1.default)(async (req, res) => {
    const { query } = req.query;
    //call service to filter books
    //return response
    return res.status(http_status_1.OK).json({ message: "Filtered books" });
});
//# sourceMappingURL=task.controller.js.map