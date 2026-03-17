"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.sendPasswordResetEmail = exports.VerifyEmail = exports.refreshUserAccessToken = exports.login_service_credentials = exports.createAccount_Google = exports.createAccount_Credentials = void 0;
exports.login_service_google = login_service_google;
const env_1 = require("../constants/env");
const http_status_1 = require("../constants/http.status");
const status_enum_1 = require("../constants/status.enum");
const session_model_1 = __importDefault(require("../sessions/session.model"));
const AppAssets_1 = __importDefault(require("../utils/AppAssets"));
const bcrypt_1 = require("../utils/bcrypt");
const date_1 = require("../utils/date");
const emalTemplates_1 = require("../utils/emalTemplates");
const jwt_1 = require("../utils/jwt");
const sendMail_1 = require("../utils/sendMail");
const provider_model_1 = __importDefault(require("./models/provider.model"));
const user_model_1 = __importDefault(require("./models/user.model"));
const varificationCode_model_1 = __importDefault(require("./models/varificationCode.model"));
const createAccount_Credentials = async (data) => {
    //verify user doesnt exist
    const existuser = await user_model_1.default.exists({
        email: data.email,
    });
    (0, AppAssets_1.default)(!existuser, http_status_1.CONFLICT, "Email already in use");
    //Add the use
    const user = await user_model_1.default.create({
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: data.password,
        verified: false,
        role: "user" /* RoleType.User */,
        status: status_enum_1.userStatus.ACTIVE,
    });
    const provider = await provider_model_1.default.create({
        email: user.email,
        user_id: user._id,
        provider: data.provider,
    });
    // Create varifcation code
    const verificationCode = await varificationCode_model_1.default.create({
        userId: user.id,
        type: "email_verification" /* VerifcationCodeType.EmailVerification */,
        expireAt: (0, date_1.oneYearFromNow)(),
    });
    //url
    const url = `${env_1.FRONTEND_URL}/email/verify/${verificationCode._id}`;
    // Send varification email
    const { error } = await (0, sendMail_1.sendMail)({
        to: user.email,
        ...(0, emalTemplates_1.getVerifyEmailTemplate)(url),
    });
    if (error) {
        console.error(error.message);
    }
    //create session
    const session = await session_model_1.default.create({
        userId: user.id,
        userAgent: data.userAgent,
    });
    // sign access token and refresh token
    const refreshToken = (0, jwt_1.signToken)({ sessionId: session._id }, jwt_1.refreshTokenSignOptions);
    const accessToken = (0, jwt_1.signToken)({ sessionId: session._id, user_id: user._id });
    // return use and tokens
    return { user: user.omitPassword(), accessToken, refreshToken };
    // return user
};
exports.createAccount_Credentials = createAccount_Credentials;
const createAccount_Google = async ({ googleId, userAgent, email, name, surname, }) => {
    (0, AppAssets_1.default)(email, http_status_1.UNAUTHORIZED, "Google account has no email");
    // Find existing provider
    let provider = await provider_model_1.default.findOne({
        provider: "google",
        provider_id: googleId,
    });
    let user;
    if (provider) {
        // Existing user
        user = await user_model_1.default.findById(provider.user_id);
        (0, AppAssets_1.default)(!user, http_status_1.CONFLICT, "Email already in use");
    }
    else {
        // Check if email exists
        user = await user_model_1.default.findOne({ email });
        if (user) {
            // Link Google provider to existing account
            provider = await provider_model_1.default.create({
                user_id: user._id,
                provider: "google",
                provider_id: googleId,
                email,
            });
        }
        else {
            // New user
            user = await user_model_1.default.create({
                name: name || "",
                surname: surname || "",
                email,
                verified: true,
                role: "user" /* RoleType.User */,
                status: status_enum_1.userStatus.ACTIVE,
            });
            console.log(user);
            provider = await provider_model_1.default.create({
                user_id: user._id,
                provider: "google",
                provider_id: googleId,
                email,
            });
        }
    }
    // Create session
    const session = await session_model_1.default.create({
        userId: user._id,
        userAgent,
    });
    // Sign tokens
    const refreshToken = (0, jwt_1.signToken)({ sessionId: session._id }, jwt_1.refreshTokenSignOptions);
    const accessToken = (0, jwt_1.signToken)({
        sessionId: session._id,
        user_id: user._id,
    });
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};
exports.createAccount_Google = createAccount_Google;
const login_service_credentials = async ({ email, password, userAgent, }) => {
    // 1️⃣ Find user
    const user = await user_model_1.default.findOne({ email });
    (0, AppAssets_1.default)(user, http_status_1.NOT_FOUND, "Invalid email or password");
    // 2️⃣ Verify account status
    (0, AppAssets_1.default)(user.status === status_enum_1.userStatus.ACTIVE, http_status_1.FORBIDDEN, "Account is : " + user.status);
    // 3️⃣ Ensure credentials login is allowed
    (0, AppAssets_1.default)(user.password, http_status_1.UNAUTHORIZED, "This account does not support password login");
    // 4️⃣ Compare password
    const isValid = await user.comparePassword(password);
    (0, AppAssets_1.default)(isValid, http_status_1.UNAUTHORIZED, "Invalid email or password");
    // 5️⃣ Create session
    const session = await session_model_1.default.create({
        userId: user._id,
        userAgent,
    });
    // 6️⃣ Sign tokens
    const refreshToken = (0, jwt_1.signToken)({ sessionId: session._id }, jwt_1.refreshTokenSignOptions);
    const accessToken = (0, jwt_1.signToken)({
        sessionId: session._id,
        user_id: user._id,
    });
    // 7️⃣ Return
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
};
exports.login_service_credentials = login_service_credentials;
async function login_service_google({ googleId, email, userAgent, }) {
    (0, AppAssets_1.default)(email, http_status_1.UNAUTHORIZED, "Google account has no email");
    // 1️⃣ Find provider
    const provider = await provider_model_1.default.findOne({
        provider: "google",
        provider_id: googleId,
    });
    (0, AppAssets_1.default)(provider, http_status_1.NOT_FOUND, "Account not registered with Google");
    // 2️⃣ Find user
    const user = await user_model_1.default.findById(provider.user_id);
    (0, AppAssets_1.default)(user, http_status_1.NOT_FOUND, "User not found");
    // 3️⃣ Check user status
    (0, AppAssets_1.default)(user.status === status_enum_1.userStatus.ACTIVE, http_status_1.FORBIDDEN, "Account is disabled");
    // 4️⃣ Create session
    const session = await session_model_1.default.create({
        userId: user._id,
        userAgent,
    });
    // 5️⃣ Sign tokens
    const refreshToken = (0, jwt_1.signToken)({ sessionId: session._id }, jwt_1.refreshTokenSignOptions);
    const accessToken = (0, jwt_1.signToken)({
        sessionId: session._id,
        user_id: user._id,
    });
    return {
        user: user.omitPassword(),
        accessToken,
        refreshToken,
    };
}
const refreshUserAccessToken = async (refreshToken) => {
    const { payload } = (0, jwt_1.verifyToken)(refreshToken, {
        secret: jwt_1.refreshTokenSignOptions.secret,
    });
    (0, AppAssets_1.default)(payload, http_status_1.UNAUTHORIZED, "Invalid refresh Token");
    const session = await session_model_1.default.findById(payload.sessionId);
    const now = Date.now();
    (0, AppAssets_1.default)(session && session.expiresAt.getTime() > now, http_status_1.UNAUTHORIZED, "Session expired");
    // refresh session if expire in 24h
    const sessionNeedsRefresh = session.expiresAt.getTime() - now <= date_1.One_Day_MS;
    if (sessionNeedsRefresh) {
        session.expiresAt = (0, date_1.thirtyDaysFromNow)();
        await session.save();
    }
    const newRefreshToken = sessionNeedsRefresh
        ? (0, jwt_1.signToken)({ sessionId: session._id }, jwt_1.refreshTokenSignOptions)
        : undefined;
    const accessToken = (0, jwt_1.signToken)({
        user_id: session.userId,
        sessionId: session._id,
    });
    return { accessToken, newRefreshToken };
};
exports.refreshUserAccessToken = refreshUserAccessToken;
const VerifyEmail = async (code) => {
    //get verification code
    const validCode = await varificationCode_model_1.default.findOne({
        _id: code,
        type: "email_verification" /* VerifcationCodeType.EmailVerification */,
        expireAt: { $gt: new Date() },
    });
    (0, AppAssets_1.default)(validCode, http_status_1.NOT_FOUND, "Invalid or expired verificationcode");
    //Update user
    const user = await user_model_1.default.findByIdAndUpdate(validCode.userId, { verified: true }, { new: true });
    // Delete verification code after successful verification
    await validCode.deleteOne();
    //Return updated user
    return { user: user?.omitPassword() };
    // retuen user
};
exports.VerifyEmail = VerifyEmail;
const sendPasswordResetEmail = async (email) => {
    //get user by email
    const user = await user_model_1.default.findOne({ email });
    (0, AppAssets_1.default)(user, http_status_1.NOT_FOUND, "user not found");
    //check email rate limit
    const fiverMintesAgo = (0, date_1.fiverMinutesAgo)();
    const count = await varificationCode_model_1.default.countDocuments({
        userId: user._id,
        type: "password_reset" /* VerifcationCodeType.PasswordReset */,
        createAt: { $gt: fiverMintesAgo },
    });
    (0, AppAssets_1.default)(count <= 1, http_status_1.TOO_MANY_REQUESTS, "too many request please try again later");
    //create verification code
    const expireAt = (0, date_1.oneHourFromNow)();
    const verificationCode = await varificationCode_model_1.default.create({
        userId: user._id,
        type: "password_reset" /* VerifcationCodeType.PasswordReset */,
        expireAt,
    });
    //send email verification
    const url = `${env_1.FRONTEND_URL}/password/reset?code=${verificationCode._id}&exp=${expireAt.getTime()}`;
    const { data, error } = await (0, sendMail_1.sendMail)({
        to: user.email,
        ...(0, emalTemplates_1.getPasswordResetTemplate)(url),
    });
    (0, AppAssets_1.default)(data?.id, http_status_1.INTERNAL_SERVER_ERROR, `${error?.name} - ${error?.message}`);
    //return success
    return { url, email_Id: data?.id };
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const resetPassword = async ({ password, verificationCode, }) => {
    //get verificationCode
    const validCode = await varificationCode_model_1.default.findOne({
        _id: verificationCode,
        type: "password_reset" /* VerifcationCodeType.PasswordReset */,
        expireAt: { $gt: new Date() },
    });
    (0, AppAssets_1.default)(validCode, http_status_1.NOT_FOUND, "Invalid or expired verifiation code");
    //update the users password
    const update_user = await user_model_1.default.findByIdAndUpdate(validCode.userId, {
        password: await (0, bcrypt_1.hashValue)(password),
    });
    (0, AppAssets_1.default)(update_user, http_status_1.INTERNAL_SERVER_ERROR, "Failed to update password");
    // delete the verification code
    await validCode.deleteOne();
    //delete all sessions
    await session_model_1.default.deleteMany({
        userId: update_user._id,
    });
    return {
        user: update_user.omitPassword(),
    };
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.service.js.map