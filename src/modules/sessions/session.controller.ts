import { Request, Response } from "express";
import { NOT_FOUND, OK } from "../constants/http.status";
import z from "zod";
import SessionModel from "./session.model";
import catchError from "../utils/catchErrors";
import AppAssets from "../utils/AppAssets";

export const getSession= catchError (async (req:Request,res:Response)=>{
    const sessions = await SessionModel.find();
    return res.status(OK).json(sessions);
});

export const deleteSession = catchError( async (req:Request,res:Response)=>{
    const sessionId = z.string().parse(req.params.id);

    const deleted = await SessionModel.findOneAndDelete({
        _id:sessionId,
        userId: req.userId,
    });
    AppAssets(deleted, NOT_FOUND,"Session not found");

    return res.status(OK).json({message:"session removed"});
})