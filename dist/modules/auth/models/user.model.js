"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = require("../../utils/bcrypt");
const status_enum_1 = require("../../constants/status.enum");
const plan_enum_1 = require("../constants/plan.enum");
const planpermission_record_1 = require("../constants/planpermission.record");
const featuresSchema = new mongoose_1.default.Schema({
    tasklimit: { type: Number, default: 5 },
    ai_suggestion: { type: Boolean, default: false },
    emailsupport: { type: Boolean, default: false },
    recover_deletedtask: { type: Boolean, default: false },
    ret_reminder: { type: Boolean, default: false },
}, { _id: false });
exports.subscriptionSchema = new mongoose_1.default.Schema({
    plan: {
        type: String,
        enum: Object.values(plan_enum_1.Sub_Plan),
        default: plan_enum_1.Sub_Plan.FREE,
    },
    price: {
        type: Number,
        default: 0,
    },
    permisions: {
        type: featuresSchema,
        default: function () {
            // dynamically assign default features based on the plan
            return planpermission_record_1.PLAN_PERMISSIONS[plan_enum_1.Sub_Plan.FREE];
        },
    },
    sub_ends: {
        type: Date,
        default: () => new Date(0), // epoch = no expiry (free plan)
    },
}, { _id: false });
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, default: "Name not provided" },
    surname: { type: String, default: "Surname not provided" },
    role: { type: String, default: "user" /* RoleType.User */ },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    verified: { type: Boolean, required: true },
    status: { type: String, default: status_enum_1.userStatus.ACTIVE },
    subscription: {
        type: exports.subscriptionSchema,
        default: () => ({}),
    },
}, {
    timestamps: true,
});
/**
 * ✅ HASH PASSWORD SAFELY
 */
userSchema.pre("save", async function (next) {
    // If no password (Google user), skip
    if (!this.password)
        return next;
    // If password not modified, skip
    if (!this.isModified("password"))
        return next;
    this.password = await (0, bcrypt_1.hashValue)(this.password, 10);
    next;
});
/**
 * ✅ PASSWORD COMPARISON (Credentials login only)
 */
userSchema.methods.comparePassword = async function (val) {
    if (!this.password) {
        throw new Error("This account does not use password login");
    }
    return (0, bcrypt_1.compareValue)(val, this.password);
};
/**
 * ✅ REMOVE PASSWORD FROM RESPONSE
 */
userSchema.methods.omitPassword = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};
const UserModel = mongoose_1.default.model("user", userSchema);
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map