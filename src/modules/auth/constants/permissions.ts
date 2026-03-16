export const PERMISSIONS = [
  "basic_tasks",
  "ai_access",
  "unlimited_tasks",
  "reminders",
  "team_access",
  "analytics",
] as const;

export type Permission = typeof PERMISSIONS[number];
