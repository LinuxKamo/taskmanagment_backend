import { error } from 'console';
import z from 'zod';
import { ErrorRequestHandler } from 'express-serve-static-core';
import { clearAuthCookies, REFRESH_PATH } from '../utils/cookies';
import AppError from '../utils/AppError';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/http.status';
import { Request, Response } from 'express';

const errorHandler: ErrorRequestHandler = (err, req:Request, res:Response, next) => {
  console.log(`Path : ${req.path}`,error);

  if(req.path == REFRESH_PATH){
    clearAuthCookies(res)
  }

  if(error instanceof z.ZodError)
  {
    return handleZodErorr(res,error)
  }
  const handleAppError = (res:Response,err:AppError)=>{
    return res.status(err.statusCode).json({
      message:err.message,errorCCode:err.errorCode,
    });
  }
  if(error instanceof AppError)
  {
    return handleAppError(res,error)
  }
  return res.status(INTERNAL_SERVER_ERROR).json({ error: err.message });
};
export default errorHandler

const handleZodErorr = (res: Response,error:z.ZodError)=> {
    const errors=error.issues.map((err)=>{
        path:err.path.join(",")
    })
    return res.status(BAD_REQUEST).json({
        message:error.message,errors
    })
}
