"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GOOGLE_CALLBACK_LOGIN = exports.GOOGLE_CALLBACK_REGISTER = exports.GOOGLE_CLIENT_SECRET = exports.GOOGLE_CLIENT_ID = exports.EMAIL_SENDER = exports.FRONTEND_URL = exports.RESEND_API_KEY = exports.JWT_REFRESH_SECRET = exports.JWT_SECRET = exports.NODE_ENV = exports.PORT = exports.MONGO_URI = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getEnv = (key, defaultValue) => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Missing inviromental variable ${key}`);
    }
    return value;
};
exports.MONGO_URI = getEnv("MONGO_URI");
exports.PORT = getEnv("PORT");
exports.NODE_ENV = getEnv("NODE_ENV");
exports.JWT_SECRET = getEnv("JWT_SECRET");
exports.JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
exports.RESEND_API_KEY = getEnv("RESEND_API_KEY");
exports.FRONTEND_URL = getEnv("FRONTEND_URL");
exports.EMAIL_SENDER = getEnv("EMAIL_SENDER");
exports.GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID");
exports.GOOGLE_CLIENT_SECRET = getEnv("GOOGLE_CLIENT_SECRET");
exports.GOOGLE_CALLBACK_REGISTER = getEnv("GOOGLE_CALLBACK_REGISTER");
exports.GOOGLE_CALLBACK_LOGIN = getEnv("GOOGLE_CALLBACK_LOGIN");
//# sourceMappingURL=env.js.map