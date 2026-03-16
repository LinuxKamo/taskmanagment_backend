import { userStatus } from "../constants/status.enum"

export type User = {
    role:string,
    name:string,
    surname:string,
    email:string,
    password:string,
    userAgent:string,
    status:userStatus,
}