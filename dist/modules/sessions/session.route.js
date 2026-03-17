"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const session_controller_1 = require("./session.controller");
const sessionRoute = (0, express_1.Router)();
//prefix session
sessionRoute.get("/", session_controller_1.getSession);
sessionRoute.delete("/:id", session_controller_1.deleteSession);
exports.default = sessionRoute;
//# sourceMappingURL=session.route.js.map