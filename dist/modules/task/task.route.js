"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const task_controller_1 = require("./task.controller");
const task_route = (0, express_1.Router)();
task_route.post("/addtask", authenticate_1.default, task_controller_1.add_task_controller);
task_route.get("/mytasks", authenticate_1.default, task_controller_1.mytask_controller);
task_route.post("/updatetask", authenticate_1.default, task_controller_1.update_task_controller);
task_route.get("/details/:_id", authenticate_1.default, task_controller_1.task_details_controller);
task_route.get("/delete/:_id", authenticate_1.default, task_controller_1.delete_task_controller);
exports.default = task_route;
//# sourceMappingURL=task.route.js.map