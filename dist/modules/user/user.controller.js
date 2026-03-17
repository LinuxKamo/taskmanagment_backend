"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_user = exports.getAllUsers = exports.getUser = void 0;
const http_status_1 = require("../constants/http.status");
const user_schema_1 = require("./schema/user.schema");
const user_service_1 = require("./user.service");
const user_model_1 = __importDefault(require("../auth/models/user.model"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const AppAssets_1 = __importDefault(require("../utils/AppAssets"));
exports.getUser = (0, catchErrors_1.default)(async (req, res) => {
    const user = await user_model_1.default.findById(req.userId);
    (0, AppAssets_1.default)(user, http_status_1.NOT_FOUND, "User not found");
    return res.status(http_status_1.OK).json(user.omitPassword());
});
exports.getAllUsers = (0, catchErrors_1.default)(async (req, res) => {
    // Get page and limit from query params, default to page 1 and limit 10
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Find all non-admin users with pagination
    const users = await user_model_1.default.find({ role: { $ne: "admin" /* RoleType.Admin */ } })
        .skip(skip)
        .limit(limit);
    // Remove passwords
    const sanitizedUsers = users
        .map((user) => user.omitPassword())
        .filter((user) => user.role !== "admin" /* RoleType.Admin */);
    // Get total count for pagination info
    const totalUsers = await user_model_1.default.countDocuments({
        role: { $ne: "admin" /* RoleType.Admin */ },
    });
    const totalPages = Math.ceil(totalUsers / limit);
    return res.status(http_status_1.OK).json({
        page,
        limit,
        totalPages,
        totalUsers,
        users: sanitizedUsers,
    });
});
exports.create_user = (0, catchErrors_1.default)(async (req, res) => {
    //check the request
    const data = req.body;
    const data_mordified = {
        ...data,
        userAgent: req.headers["user-agent"],
        verified: false,
    };
    const request = await user_schema_1.UserSchema.safeParse(data_mordified);
    //If there was an error from zod
    if (request.error) {
        //Extrating error messages
        let message = JSON.parse(request.error.message);
        const errorsmessages = message.map((mes) => mes.message);
        return res.status(http_status_1.BAD_REQUEST).json({ message: errorsmessages });
    }
    //check if user already exist
    const isExist = await user_model_1.default.findOne({ email: request.data?.email });
    (0, AppAssets_1.default)(!isExist, http_status_1.CONFLICT, "user already exist");
    //call service
    const { user } = await (0, user_service_1.create_User_Service)(request.data);
    //return response
    return res
        .status(http_status_1.OK)
        .json({ message: "User created succesfully", data: user });
});
//# sourceMappingURL=user.controller.js.map