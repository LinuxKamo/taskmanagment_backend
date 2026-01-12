 import { Router } from "express"
import { deleteSession, getSession } from "./session.controller";

const sessionRoute = Router();
//prefix session
sessionRoute.get("/",getSession)
sessionRoute.delete("/:id",deleteSession)
export default sessionRoute