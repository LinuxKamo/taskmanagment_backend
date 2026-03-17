"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSession = exports.getSession = void 0;
const http_status_1 = require("../constants/http.status");
const zod_1 = __importDefault(require("zod"));
const session_model_1 = __importDefault(require("./session.model"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const AppAssets_1 = __importDefault(require("../utils/AppAssets"));
exports.getSession = (0, catchErrors_1.default)(async (req, res) => {
    const sessions = await session_model_1.default.find();
    return res.status(http_status_1.OK).json(sessions);
});
exports.deleteSession = (0, catchErrors_1.default)(async (req, res) => {
    const sessionId = zod_1.default.string().parse(req.params.id);
    const deleted = await session_model_1.default.findOneAndDelete({
        _id: sessionId,
        userId: req.userId,
    });
    (0, AppAssets_1.default)(deleted, http_status_1.NOT_FOUND, "Session not found");
    return res.status(http_status_1.OK).json({ message: "session removed" });
});
//# sourceMappingURL=session.controller.js.map