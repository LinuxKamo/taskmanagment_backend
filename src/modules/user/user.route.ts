import { Router } from "express";
import { create_user, getAllUsers, getUser } from "./user.controller";
import RoleType from "../constants/role.types";
import authenticate from "../middleware/authenticate";
import { Authorise } from "../middleware/authorise.middleware";


const userRoute = Router();
userRoute.get("/",authenticate,getUser)
userRoute.get("/all",authenticate,Authorise([RoleType.Admin]),getAllUsers)
userRoute.post("/create",authenticate,Authorise([RoleType.Admin]),create_user);

export default userRoute