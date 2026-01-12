import type { NextFunction,Response, Request } from "express";
import catchError from "../utils/catchErrors.js";
import { FORBIDDEN, NOT_FOUND } from "../constants/http.status";
import UserModel from "../auth/models/user.model.js";


export const Authorise = (roles:Array<string>) => {
  return catchError(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findById(req.userId);

    if(!user){
        return res.status(NOT_FOUND).json({message:"user not found"});
    }
    if (!roles.includes(user.role)) {
      return res
        .status(FORBIDDEN)
        .json({ message: "User not allowed, Access denied" });
    }
    next();
  });
};
