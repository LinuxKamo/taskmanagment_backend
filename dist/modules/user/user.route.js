"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const authorise_middleware_1 = require("../middleware/authorise.middleware");
const userRoute = (0, express_1.Router)();
userRoute.get("/", authenticate_1.default, user_controller_1.getUser);
userRoute.get("/all", authenticate_1.default, (0, authorise_middleware_1.Authorise)(["admin" /* RoleType.Admin */]), user_controller_1.getAllUsers);
userRoute.post("/create", authenticate_1.default, (0, authorise_middleware_1.Authorise)(["admin" /* RoleType.Admin */]), user_controller_1.create_user);
exports.default = userRoute;
//# sourceMappingURL=user.route.js.map