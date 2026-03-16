import { z } from "zod";
import { Sub_Plan } from "../constants/plan.enum";

export const SubscriptionSchema = z
  .object({
    plan: z.nativeEnum(Sub_Plan).default(Sub_Plan.FREE),

    price: z.number().nonnegative().default(0),

    sub_ends: z.coerce.date().default(new Date(0)),

    permisions: z
      .array(
        z.enum([
          "basic_tasks",
          "ai_access",
          "unlimited_tasks",
          "reminders",
          "team_access",
          "analytics",
        ])
      )
      .default([]),
  })
  .transform((sub) => {
    // 🔐 Auto-assign default permissions based on plan
    if (sub.permisions.length === 0) {
      switch (sub.plan) {
        case Sub_Plan.PRO:
          sub.permisions = [
            "basic_tasks",
            "ai_access",
            "unlimited_tasks",
            "reminders",
          ];
          break;

        case Sub_Plan.PREMIUM:
          sub.permisions = [
            "basic_tasks",
            "ai_access",
            "unlimited_tasks",
            "reminders",
            "team_access",
            "analytics",
          ];
          break;

        case Sub_Plan.FREE:
        default:
          sub.permisions = ["basic_tasks"];
      }
    }

    return sub;
  });
