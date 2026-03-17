"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const resend_1 = __importDefault(require("../config/resend"));
const env_1 = require("../constants/env");
const getFromEmail = () => env_1.NODE_ENV === "development" ? "Development@resend.dev" : env_1.EMAIL_SENDER;
const getToEmail = (recipiant) => env_1.NODE_ENV === "development" ? "delivered@resend.dev" : recipiant;
const sendMail = async ({ to, subject, text, html }) => resend_1.default.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject, text, html
});
exports.sendMail = sendMail;
//# sourceMappingURL=sendMail.js.map