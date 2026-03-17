"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI_SuggestionSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const ai_enum_1 = require("../types/ai.enum");
exports.AI_SuggestionSchema = zod_1.default.object({
    user_id: zod_1.default.string(),
    suggestion: zod_1.default.string().min(10),
    type: zod_1.default.enum(ai_enum_1.SuggestionTypes).default(ai_enum_1.SuggestionTypes.INIT),
    promp: zod_1.default.string().min(3)
});
//# sourceMappingURL=task.ai.schema.js.map