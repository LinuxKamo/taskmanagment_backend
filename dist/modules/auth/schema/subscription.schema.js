"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionSchema = void 0;
const zod_1 = require("zod");
const plan_enum_1 = require("../constants/plan.enum");
exports.SubscriptionSchema = zod_1.z
    .object({
    plan: zod_1.z.nativeEnum(plan_enum_1.Sub_Plan).default(plan_enum_1.Sub_Plan.FREE),
    price: zod_1.z.number().nonnegative().default(0),
    sub_ends: zod_1.z.coerce.date().default(new Date(0)),
    permisions: zod_1.z
        .array(zod_1.z.enum([
        "basic_tasks",
        "ai_access",
        "unlimited_tasks",
        "reminders",
        "team_access",
        "analytics",
    ]))
        .default([]),
})
    .transform((sub) => {
    // 🔐 Auto-assign default permissions based on plan
    if (sub.permisions.length === 0) {
        switch (sub.plan) {
            case plan_enum_1.Sub_Plan.PRO:
                sub.permisions = [
                    "basic_tasks",
                    "ai_access",
                    "unlimited_tasks",
                    "reminders",
                ];
                break;
            case plan_enum_1.Sub_Plan.PREMIUM:
                sub.permisions = [
                    "basic_tasks",
                    "ai_access",
                    "unlimited_tasks",
                    "reminders",
                    "team_access",
                    "analytics",
                ];
                break;
            case plan_enum_1.Sub_Plan.FREE:
            default:
                sub.permisions = ["basic_tasks"];
        }
    }
    return sub;
});
//# sourceMappingURL=subscription.schema.js.map