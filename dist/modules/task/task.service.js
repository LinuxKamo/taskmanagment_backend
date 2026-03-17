"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_details_service = exports.delete_task_service = exports.update_task_service = exports.mytask_service = exports.add_task_service = void 0;
const ai_model_1 = require("./models/ai.model");
const task_model_1 = require("./models/task.model");
const add_task_service = async (data) => {
    //create book document
    const task = await task_model_1.TaskModel.create(data);
    //check if IA suggestion is On
    const suggestion = await ai_model_1.AI_SuggestionModel.create({
        user_id: task.user_id,
        suggestion: data.suggestion,
        task_id: task._id,
        type: data.type,
        promp: data.promp
    });
    //If on create a suggestion document
    //return saved task
    return { savedTask: task, aisuggestion: suggestion };
};
exports.add_task_service = add_task_service;
const mytask_service = async (user_id) => {
    //get user task
    const tasks = await task_model_1.TaskModel.find({ user_id: user_id });
    //get user task suggestions
    const suggestion = await ai_model_1.AI_SuggestionModel.find({ user_id: user_id });
    //return task and suggestions
    return { tasks, suggestion };
};
exports.mytask_service = mytask_service;
const update_task_service = async (data) => {
    //verify task exist and update it
    const updated_task = await task_model_1.TaskModel.findByIdAndUpdate(data._id, data, {
        new: true,
    });
    //return updated tas and new suggestion
    return { updated_task };
};
exports.update_task_service = update_task_service;
const delete_task_service = async (task_id) => {
    //delete task
    const isDeleted = await task_model_1.TaskModel.findByIdAndDelete(task_id).then(() => true);
    //delete suggestion
    if (isDeleted)
        await ai_model_1.AI_SuggestionModel.findOneAndDelete({ task_id: task_id });
    //return
    return { isDeleted };
};
exports.delete_task_service = delete_task_service;
const get_details_service = async (task_id) => {
    //get task
    const task = await task_model_1.TaskModel.findById(task_id);
    //get task suggestions
    const ai_suggestion = await ai_model_1.AI_SuggestionModel.findOne({ task_id: task?._id });
    //return task and suggestion
    return { task, ai_suggestion };
};
exports.get_details_service = get_details_service;
//# sourceMappingURL=task.service.js.map