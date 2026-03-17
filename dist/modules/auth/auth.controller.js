"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.resetPasswordHandler = exports.sendPasswordReset = exports.verifyEmail = exports.refresh = exports.login_controller_google = exports.login_controller_credentials = exports.register_controller_google = exports.register_controller_credentials = void 0;
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const register_schema_1 = require("./schema/register.schema");
const auth_service_1 = require("./auth.service");
const cookies_1 = require("../utils/cookies");
const http_status_1 = require("../constants/http.status");
const auth_schema_1 = require("./schema/auth.schema");
const jwt_1 = require("../utils/jwt");
const session_model_1 = __importDefault(require("../sessions/session.model"));
const AppAssets_1 = __importDefault(require("../utils/AppAssets"));
const env_1 = require("../constants/env");
exports.register_controller_credentials = (0, catchErrors_1.default)(async (req, res) => {
    //validate request
    const request = register_schema_1.registerSchema.parse({
        ...req.body,
        userAgent: req.headers["user-agent"],
    });
    console.log("Provider is " + request.provider);
    // const subscription = SubscriptionSchema.parse({
    //   ...req.body.subscription,
    //   permisions: req.body.subscription.permisions || [],
    // });
    //call service
    if (request.provider === "credentials") {
        const { accessToken, refreshToken, user } = await (0, auth_service_1.createAccount_Credentials)(request);
        //return responce
        return (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken })
            .status(http_status_1.CREATED)
            .json(user);
    }
    else if (request.provider === "google") {
        const { accessToken, refreshToken, user } = await (0, auth_service_1.createAccount_Credentials)(req.body);
        //return responce
        return (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken })
            .status(http_status_1.CREATED)
            .json(user);
    }
});
exports.register_controller_google = (0, catchErrors_1.default)(async (req, res) => {
    // Automatically get user agent from request headers
    const userAgent = req.headers["user-agent"] || "Unknown";
    // Passport sets the verified Google user in req.user
    const googleUser = req.user;
    (0, AppAssets_1.default)(googleUser, http_status_1.UNAUTHORIZED, "Google authentication failed");
    // Call the existing account creation service (adapted for redirect)
    const { accessToken, refreshToken, user } = await (0, auth_service_1.createAccount_Google)({
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.name,
        surname: googleUser.surname,
        userAgent, // automatically passed
    });
    // Set cookies and redirect
    return (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken }).redirect(`${env_1.FRONTEND_URL}/user`);
    ;
});
exports.login_controller_credentials = (0, catchErrors_1.default)(async (req, res) => {
    const { email, password } = req.body;
    // Get user agent automatically
    const userAgent = req.headers["user-agent"] || "Unknown";
    const { user, accessToken, refreshToken } = await (0, auth_service_1.login_service_credentials)({
        email,
        password,
        userAgent,
    });
    return (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken })
        .status(http_status_1.OK)
        .json(user);
});
exports.login_controller_google = (0, catchErrors_1.default)(async (req, res) => {
    console.log(req.user);
    const googleUser = req.user;
    (0, AppAssets_1.default)(googleUser, http_status_1.UNAUTHORIZED, "Google authentication failed");
    const { accessToken, refreshToken, user } = await (0, auth_service_1.login_service_google)({
        googleId: googleUser.googleId,
        email: googleUser.email,
        userAgent: req.headers["user-agent"],
    });
    return (0, cookies_1.setAuthCookies)({ res, accessToken, refreshToken }).redirect(`${env_1.FRONTEND_URL}/user`);
});
exports.refresh = (0, catchErrors_1.default)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return res.status(http_status_1.UNAUTHORIZED).json({ message: "Not logged in" });
    const { accessToken, newRefreshToken } = await (0, auth_service_1.refreshUserAccessToken)(refreshToken || "");
    if (newRefreshToken) {
        res.cookie("accessToken", accessToken, (0, cookies_1.getAccessTokenCookieOptions)());
    }
    return res
        .status(http_status_1.OK)
        .cookie("accessToken", accessToken, (0, cookies_1.getAccessTokenCookieOptions)())
        .json({ message: "Access token refreshed" });
});
exports.verifyEmail = (0, catchErrors_1.default)(async (req, res) => {
    //Verify information
    const verificationCode = auth_schema_1.verificationCodeSchema.parse(req.params.code);
    //call service
    const { user } = await (0, auth_service_1.VerifyEmail)(verificationCode);
    return res.status(http_status_1.OK).json({ message: "Email Verified", user: user });
});
exports.sendPasswordReset = (0, catchErrors_1.default)(async (req, res) => {
    const email = auth_schema_1.emailSchema.parse(req.body.email);
    await (0, auth_service_1.sendPasswordResetEmail)(email);
    return res.status(http_status_1.OK).json({ message: "email reset sent" });
});
exports.resetPasswordHandler = (0, catchErrors_1.default)(async (req, res) => {
    console.log(req.body);
    const request = auth_schema_1.resetPasswordSchema.parse(req.body);
    //service call
    const { user } = await (0, auth_service_1.resetPassword)(request);
    return (0, cookies_1.clearAuthCookies)(res)
        .status(http_status_1.OK)
        .json({ message: "password reset successful" });
});
exports.logout = (0, catchErrors_1.default)(async (req, res) => {
    //TODO : must make is to work with refresh token
    const accessToken = req.cookies.accessToken;
    const { payload } = (0, jwt_1.verifyToken)(accessToken || "");
    //Only deletes to database with both access and refresh token are available
    //TODO
    if (payload) {
        await session_model_1.default.findByIdAndDelete(payload.sessionId);
    }
    return (0, cookies_1.clearAuthCookies)(res)
        .status(http_status_1.OK)
        .json({ message: "Logout successful" });
});
//# sourceMappingURL=auth.controller.js.map