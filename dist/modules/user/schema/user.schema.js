"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const status_enum_1 = require("../../constants/status.enum");
exports.UserSchema = zod_1.default.object({
    name: zod_1.default.string(),
    surname: zod_1.default.string(),
    email: zod_1.default.string(),
    role: zod_1.default.string(),
    password: zod_1.default.string(),
    confirmPassword: zod_1.default.string(),
    verified: zod_1.default.boolean().default(false),
    userAgent: zod_1.default.string(),
    status: zod_1.default.enum(status_enum_1.userStatus).default(status_enum_1.userStatus.ACTIVE)
});
//# sourceMappingURL=user.schema.js.map