"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const date_1 = require("../utils/date");
const SessionSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId },
    userAgent: { type: String, ref: "User" },
    createdAt: { type: Date, default: Date.now, required: true },
    expiresAt: { type: Date, default: (0, date_1.thirtyDaysFromNow)() },
});
const SessionModel = mongoose_1.default.model("Session", SessionSchema);
exports.default = SessionModel;
//# sourceMappingURL=session.model.js.map