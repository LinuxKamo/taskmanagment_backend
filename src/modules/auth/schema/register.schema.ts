import { z } from "zod";

// Base schema for shared fields
const baseRegisterSchema = z.object({
  name: z.string().min(2),
  surname: z.string().min(2),
  email: z.string().email().min(3).max(255),
  provider: z.enum(["credentials", "google"]).default("credentials"),
  userAgent: z.string().optional(),
});

// Local / credentials registration
export const registerSchemaCredentials = baseRegisterSchema.extend({
  provider: z.literal("credentials"),
  password: z.string().min(6).max(255),
  confirmPassword: z.string().min(6).max(255),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // corrected
});

// Google registration
export const registerSchemaGoogle = baseRegisterSchema.extend({
  provider: z.literal("google"),
  googleId: z.string().min(1),
  avatar: z.string().url().optional(),
});

// Safe discriminated union
export const registerSchema = z.discriminatedUnion("provider", [
  registerSchemaCredentials,
  registerSchemaGoogle,
]);