"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.passwordSchema = exports.emailSchema = exports.verificationCodeSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.verificationCodeSchema = zod_1.default.string().min(1).max(24);
exports.emailSchema = zod_1.default.string().email().min(1).max(255);
exports.passwordSchema = zod_1.default.string().min(6).max(255);
exports.resetPasswordSchema = zod_1.default.object({
    password: exports.passwordSchema, verificationCode: exports.verificationCodeSchema
});
//# sourceMappingURL=auth.schema.js.map