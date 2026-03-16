import { Router } from "express";
import authenticate from "../middleware/authenticate";
import { add_task_controller, delete_task_controller, mytask_controller, task_details_controller, update_task_controller } from "./task.controller";

const task_route = Router();

task_route.post("/addtask",authenticate,add_task_controller);
task_route.get("/mytasks",authenticate,mytask_controller);
task_route.post("/updatetask",authenticate,update_task_controller);
task_route.get("/details/:_id",authenticate,task_details_controller);
task_route.get("/delete/:_id",authenticate,delete_task_controller);


export default task_route;