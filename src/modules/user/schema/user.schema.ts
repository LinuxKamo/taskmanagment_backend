import z from "zod";
import { userStatus } from "../../constants/status.enum";

export const UserSchema = z.object({
    name:z.string(),
    surname:z.string(),
    email:z.string(),
    role: z.string(),
    password:z.string(),
    confirmPassword:z.string(),
    verified:z.boolean().default(false),
    userAgent:z.string(),
    status:z.enum(userStatus).default(userStatus.ACTIVE)
})