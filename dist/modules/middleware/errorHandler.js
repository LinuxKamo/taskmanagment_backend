"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const zod_1 = __importDefault(require("zod"));
const cookies_1 = require("../utils/cookies");
const AppError_1 = __importDefault(require("../utils/AppError"));
const http_status_1 = require("../constants/http.status");
const errorHandler = (err, req, res, next) => {
    console.log(`Path : ${req.path}`, console_1.error);
    if (req.path == cookies_1.REFRESH_PATH) {
        (0, cookies_1.clearAuthCookies)(res);
    }
    if (console_1.error instanceof zod_1.default.ZodError) {
        return handleZodErorr(res, console_1.error);
    }
    const handleAppError = (res, err) => {
        return res.status(err.statusCode).json({
            message: err.message, errorCCode: err.errorCode,
        });
    };
    if (console_1.error instanceof AppError_1.default) {
        return handleAppError(res, console_1.error);
    }
    return res.status(http_status_1.INTERNAL_SERVER_ERROR).json({ error: err.message });
};
exports.default = errorHandler;
const handleZodErorr = (res, error) => {
    const errors = error.issues.map((err) => {
        path: err.path.join(",");
    });
    return res.status(http_status_1.BAD_REQUEST).json({
        message: error.message, errors
    });
};
//# sourceMappingURL=errorHandler.js.map