"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const passport_1 = __importDefault(require("passport"));
const auth_route = (0, express_1.Router)();
auth_route.post("/register", auth_controller_1.register_controller_credentials);
auth_route.post("/login", auth_controller_1.login_controller_credentials);
// Registration
auth_route.get("/google/register", passport_1.default.authenticate("google-register", { scope: ["profile", "email"] }));
auth_route.get("/google/register/callback", passport_1.default.authenticate("google-register", { session: false }), auth_controller_1.register_controller_google);
// Login
auth_route.get("/google/login", passport_1.default.authenticate("google-login", { scope: ["profile", "email"] }));
auth_route.get("/google/callback", passport_1.default.authenticate("google-login", { session: false }), auth_controller_1.login_controller_google);
auth_route.get("/logout", auth_controller_1.logout);
auth_route.get("/refresh", auth_controller_1.refresh);
auth_route.get("/email/verify/:code", auth_controller_1.verifyEmail);
auth_route.post("/password/forgot", auth_controller_1.sendPasswordReset);
auth_route.post("/password/reset", auth_controller_1.resetPasswordHandler);
exports.default = auth_route;
//# sourceMappingURL=auth.route.js.map