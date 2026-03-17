"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_User_Service = void 0;
const user_model_1 = __importDefault(require("../auth/models/user.model"));
const varificationCode_model_1 = __importDefault(require("../auth/models/varificationCode.model"));
const env_1 = require("../constants/env");
const session_model_1 = __importDefault(require("../sessions/session.model"));
const date_1 = require("../utils/date");
const emalTemplates_1 = require("../utils/emalTemplates");
const jwt_1 = require("../utils/jwt");
const sendMail_1 = require("../utils/sendMail");
const create_User_Service = async (data) => {
    const user = await user_model_1.default.create({
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: data.password,
        verified: false,
        role: data.role,
    });
    // Create varifcation code
    const verificationCode = await varificationCode_model_1.default.create({
        userId: user._id,
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
};
exports.create_User_Service = create_User_Service;
//# sourceMappingURL=user.service.js.map