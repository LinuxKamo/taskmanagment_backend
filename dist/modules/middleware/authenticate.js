"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("../constants/http.status");
const jwt_1 = require("../utils/jwt");
const AppAssets_1 = __importDefault(require("../utils/AppAssets"));
const authenticate = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
        return res.status(http_status_1.UNAUTHORIZED).json({ message: "AccessToken not found" });
    const { payload, error } = (0, jwt_1.verifyToken)(accessToken);
    if (error === "jwt expired") {
        return res.status(http_status_1.UNAUTHORIZED).json({ message: "Token Expired" });
    }
    else if (error) {
        return res.status(http_status_1.INTERNAL_SERVER_ERROR).json({ message: "Invalid token" });
    }
    (0, AppAssets_1.default)(payload, http_status_1.UNAUTHORIZED, error === "jwt expired" ? "Token expired" : "Invalid token", "InvalideAccessToken" /* AppErrorCode.InvalideAccessToken */);
    req.userId =
        typeof payload.user_id === "string" ? payload.user_id : undefined;
    (0, AppAssets_1.default)(req.userId, http_status_1.NOT_FOUND, "user not found");
    req.sessionId =
        typeof payload.sessionId === "string" ? payload.sessionId : undefined;
    (0, AppAssets_1.default)(req.sessionId, http_status_1.NOT_FOUND, "session not found");
    next();
};
exports.default = authenticate;
//# sourceMappingURL=authenticate.js.map