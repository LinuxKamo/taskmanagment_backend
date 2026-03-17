"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProviderSchema = new mongoose_1.default.Schema({
    email: { type: String, unique: true, required: true },
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, unique: true },
    provider: { type: String, required: true },
    provider_id: { type: String, required: true, default: "N/A" },
}, {
    timestamps: true,
});
const ProviderModel = mongoose_1.default.model("AuthProvider", ProviderSchema);
exports.default = ProviderModel;
//# sourceMappingURL=provider.model.js.map