"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authorise = void 0;
const catchErrors_js_1 = __importDefault(require("../utils/catchErrors.js"));
const http_status_1 = require("../constants/http.status");
const user_model_js_1 = __importDefault(require("../auth/models/user.model.js"));
const Authorise = (roles) => {
    return (0, catchErrors_js_1.default)(async (req, res, next) => {
        const user = await user_model_js_1.default.findById(req.userId);
        if (!user) {
            return res.status(http_status_1.NOT_FOUND).json({ message: "user not found" });
        }
        if (!roles.includes(user.role)) {
            return res
                .status(http_status_1.FORBIDDEN)
                .json({ message: "User not allowed, Access denied" });
        }
        next();
    });
};
exports.Authorise = Authorise;
//# sourceMappingURL=authorise.middleware.js.map