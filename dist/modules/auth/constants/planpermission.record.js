"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLAN_PERMISSIONS = void 0;
const plan_enum_1 = require("./plan.enum");
exports.PLAN_PERMISSIONS = {
    [plan_enum_1.Sub_Plan.FREE]: {
        tasklimit: 5,
        ai_suggestion: false,
        emailsupport: false,
        recover_deletedtask: false,
        ret_reminder: false,
    },
    [plan_enum_1.Sub_Plan.PRO]: {
        tasklimit: 100,
        ai_suggestion: true,
        emailsupport: true,
        recover_deletedtask: true,
        ret_reminder: true,
    },
    [plan_enum_1.Sub_Plan.PREMIUM]: {
        tasklimit: Infinity,
        ai_suggestion: true,
        emailsupport: true,
        recover_deletedtask: true,
        ret_reminder: true,
    },
};
//# sourceMappingURL=planpermission.record.js.map