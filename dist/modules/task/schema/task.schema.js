"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const taskStatus_enum_1 = require("../types/taskStatus.enum");
const taskImportance_enum_1 = require("../types/taskImportance.enum");
exports.TaskSchema = zod_1.default.object({
    image_url: zod_1.default.string(),
    user_id: zod_1.default.string(),
    title: zod_1.default.string().min(1).max(255),
    importance: zod_1.default.enum(taskImportance_enum_1.taskImpotance).default(taskImportance_enum_1.taskImpotance.LOW),
    status: zod_1.default.enum(taskStatus_enum_1.taskStatus).default(taskStatus_enum_1.taskStatus.PENDING),
    setReminder: zod_1.default.boolean().default(false),
    duration: zod_1.default.number().min(1),
    notes: zod_1.default.array(zod_1.default.string()),
});
//# sourceMappingURL=task.schema.js.map