import dotenv from "dotenv";
dotenv.config()
const getEnv = (key:string,defaultValue?:string):string=>{
    const value = process.env[key] || defaultValue;
    if(value===undefined){
        throw new Error(`Missing inviromental variable ${key}`);
    }
    return value;
}
export const MONGO_URI=getEnv("MONGO_URI");
export const PORT = getEnv("PORT");
export const NODE_ENV=getEnv("NODE_ENV")
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const RESEND_API_KEY = getEnv("RESEND_API_KEY");
export const FRONTEND_URL = getEnv("FRONTEND_URL");
export const EMAIL_SENDER = getEnv("EMAIL_SENDER");
export const GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = getEnv("GOOGLE_CLIENT_SECRET");
export const GOOGLE_CALLBACK_REGISTER = getEnv("GOOGLE_CALLBACK_REGISTER")
export const GOOGLE_CALLBACK_LOGIN = getEnv("GOOGLE_CALLBACK_LOGIN")



