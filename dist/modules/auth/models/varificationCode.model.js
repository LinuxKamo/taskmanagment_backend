"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VerificationCodeSchema = new mongoose_1.default.Schema({
    userId: { required: true, unique: true, type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", index: true },
    type: { type: String, required: true },
    createAt: { type: Date, required: true, default: Date.now },
    expireAt: { type: Date, required: true }
});
const VerificationModel = mongoose_1.default.model("VerificationCode", VerificationCodeSchema, "verification_code");
exports.default = VerificationModel;
//# sourceMappingURL=varificationCode.model.js.map