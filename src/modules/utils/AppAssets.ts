import assert from "node:assert";
import AppError from "./AppError";
import { HttpStatusCode } from "../constants/http.status";
import AppErrorCode from "../constants/AppErrorCode";
type appAssets=(
    condition:any,
    httpStatusCode:HttpStatusCode,
    message:string,
    appErrorCode?:AppErrorCode

)=>asserts condition
const AppAssets:appAssets=(
    condition:any,HttpStatusCode,message,appErrorCode
)=>assert(condition,new AppError(HttpStatusCode,message,appErrorCode))

export default AppAssets