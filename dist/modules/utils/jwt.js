"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = exports.refreshTokenSignOptions = exports.googleClient = void 0;
exports.verifyGoogleToken = verifyGoogleToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../constants/env");
const google_auth_library_1 = require("google-auth-library");
const http_status_1 = require("../constants/http.status");
exports.googleClient = new google_auth_library_1.OAuth2Client(env_1.GOOGLE_CLIENT_ID);
async function verifyGoogleToken(idToken) {
    try {
        const ticket = await exports.googleClient.verifyIdToken({
            idToken,
            audience: env_1.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload)
            throw new Error("Invalid Google token");
        return payload;
    }
    catch {
        throw {
            status: http_status_1.BAD_REQUEST,
            message: "Invalid Google token",
        };
    }
}
const defaults = {
    audience: ["user"],
};
const accessTokenSignOptions = {
    expiresIn: "58m",
    secret: env_1.JWT_SECRET,
};
exports.refreshTokenSignOptions = {
    expiresIn: "30d",
    secret: env_1.JWT_REFRESH_SECRET,
};
const signToken = (payload, options) => {
    const { secret, ...signOpts } = options || accessTokenSignOptions;
    return jsonwebtoken_1.default.sign(payload, secret, { ...defaults, ...signOpts });
};
exports.signToken = signToken;
const verifyToken = (token, options) => {
    const { secret = env_1.JWT_SECRET, ...verifyOpts } = options || {};
    try {
        //need looking into
        const payload = jsonwebtoken_1.default.verify(token, secret, verifyOpts);
        return { payload };
    }
    catch (error) {
        return { error: error.message };
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map