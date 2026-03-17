"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const env_1 = require("./modules/constants/env");
const db_1 = __importDefault(require("./modules/config/db"));
const errorHandler_1 = __importDefault(require("./modules/middleware/errorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const task_route_1 = __importDefault(require("./modules/task/task.route"));
const passport_1 = __importDefault(require("passport"));
require("./modules/config/passport");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.FRONTEND_URL,
    credentials: true,
}));
app.use(passport_1.default.initialize());
//Routes
app.use("/auth", auth_route_1.default);
app.use("/task", task_route_1.default);
app.use(errorHandler_1.default);
app.listen(env_1.PORT, async () => {
    (0, db_1.default)();
    console.log("✅ MongoDB connected");
    console.log(`✅ Server running on port ${env_1.PORT}`);
    console.log("✅ we are on ", env_1.NODE_ENV);
});
//# sourceMappingURL=index.js.map