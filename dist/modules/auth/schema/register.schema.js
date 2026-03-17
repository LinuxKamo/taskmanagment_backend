"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = exports.registerSchemaGoogle = exports.registerSchemaCredentials = void 0;
const zod_1 = require("zod");
// Base schema for shared fields
const baseRegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    surname: zod_1.z.string().min(2),
    email: zod_1.z.string().email().min(3).max(255),
    provider: zod_1.z.enum(["credentials", "google"]).default("credentials"),
    userAgent: zod_1.z.string().optional(),
});
// Local / credentials registration
exports.registerSchemaCredentials = baseRegisterSchema.extend({
    provider: zod_1.z.literal("credentials"),
    password: zod_1.z.string().min(6).max(255),
    confirmPassword: zod_1.z.string().min(6).max(255),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // corrected
});
// Google registration
exports.registerSchemaGoogle = baseRegisterSchema.extend({
    provider: zod_1.z.literal("google"),
    googleId: zod_1.z.string().min(1),
    avatar: zod_1.z.string().url().optional(),
});
// Safe discriminated union
exports.registerSchema = zod_1.z.discriminatedUnion("provider", [
    exports.registerSchemaCredentials,
    exports.registerSchemaGoogle,
]);
//# sourceMappingURL=register.schema.js.map