import { Request, Response } from "express";
import { BAD_REQUEST, CONFLICT, NOT_FOUND, OK } from "../constants/http.status";
import RoleType from "../constants/role.types";
import { UserSchema } from "./schema/user.schema";
import { create_User_Service } from "./user.service";
import UserModel from "../auth/models/user.model";
import catchError from "../utils/catchErrors";
import AppAssets from "../utils/AppAssets";

export const getUser = catchError(async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.userId);
  AppAssets(user, NOT_FOUND, "User not found");
  return res.status(OK).json(user!.omitPassword());
});

export const getAllUsers = catchError(async (req: Request, res: Response) => {
  // Get page and limit from query params, default to page 1 and limit 10
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Find all non-admin users with pagination
  const users = await UserModel.find({ role: { $ne: RoleType.Admin } })
    .skip(skip)
    .limit(limit);

  // Remove passwords
  const sanitizedUsers = users
    .map((user: any) => user.omitPassword())
    .filter((user: any) => user.role !== RoleType.Admin);

  // Get total count for pagination info
  const totalUsers = await UserModel.countDocuments({
    role: { $ne: RoleType.Admin },
  });
  const totalPages = Math.ceil(totalUsers / limit);

  return res.status(OK).json({
    page,
    limit,
    totalPages,
    totalUsers,
    users: sanitizedUsers,
  });
});

export const create_user = catchError(async (req: Request, res: Response) => {
  //check the request

  const data = req.body;
  const data_mordified = {
    ...data,
    userAgent: req.headers["user-agent"],
    verified: false,
  };
  const request = await UserSchema.safeParse(data_mordified);
  //If there was an error from zod
  if (request.error) {
    //Extrating error messages
    let message: Array<any> = JSON.parse(request.error.message);
    const errorsmessages = message.map((mes) => mes.message);

    return res.status(BAD_REQUEST).json({ message: errorsmessages });
  }
  //check if user already exist
  const isExist = await UserModel.findOne({ email: request.data?.email });
  AppAssets(!isExist, CONFLICT, "user already exist");
  //call service
  const { user } = await create_User_Service(request.data);
  //return response
  return res
    .status(OK)
    .json({ message: "User created succesfully", data: user });
});
