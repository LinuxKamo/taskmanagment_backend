import { Sub_Plan } from "./plan.enum";
export type PlanFeatures = {
  tasklimit: number;
  ai_suggestion: boolean;
  emailsupport: boolean;
  recover_deletedtask: boolean;
  ret_reminder: boolean;
};


export const PLAN_PERMISSIONS: Record<Sub_Plan, PlanFeatures> = {
  [Sub_Plan.FREE]: {
    tasklimit: 5,
    ai_suggestion: false,
    emailsupport: false,
    recover_deletedtask: false,
    ret_reminder: false,
  },

  [Sub_Plan.PRO]: {
    tasklimit: 100,
    ai_suggestion: true,
    emailsupport: true,
    recover_deletedtask: true,
    ret_reminder: true,
  },

  [Sub_Plan.PREMIUM]: {
    tasklimit: Infinity,
    ai_suggestion: true,
    emailsupport: true,
    recover_deletedtask: true,
    ret_reminder: true,
  },
}