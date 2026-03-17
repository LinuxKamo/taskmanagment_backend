"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fiverMinutesAgo = exports.oneHourFromNow = exports.One_Day_MS = exports.fifteenMinutesFromNow = exports.thirtyDaysFromNow = exports.oneYearFromNow = void 0;
exports.removeTimeFromDate = removeTimeFromDate;
const oneYearFromNow = () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
exports.oneYearFromNow = oneYearFromNow;
const thirtyDaysFromNow = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
exports.thirtyDaysFromNow = thirtyDaysFromNow;
const fifteenMinutesFromNow = () => new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);
exports.fifteenMinutesFromNow = fifteenMinutesFromNow;
exports.One_Day_MS = 24 * 60 * 60 * 1000;
const oneHourFromNow = () => new Date(Date.now() + 60 * 60 * 10000);
exports.oneHourFromNow = oneHourFromNow;
const fiverMinutesAgo = () => new Date(Date.now() - 5 * 60 * 10000);
exports.fiverMinutesAgo = fiverMinutesAgo;
function removeTimeFromDate(date) {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
//# sourceMappingURL=date.js.map