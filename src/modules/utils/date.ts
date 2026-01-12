export const oneYearFromNow = ()=>new Date(Date.now()+365*24*60*60*1000);
export const thirtyDaysFromNow = ()=>new Date(Date.now()+30*24*60*60*1000);
export const fifteenMinutesFromNow = ()=>new Date(Date.now()+15*24*60*60*1000);
export const One_Day_MS =24*60*60*1000;
export const oneHourFromNow = ()=> new Date(Date.now()+60*60*10000) 
export const fiverMinutesAgo = ()=> new Date(Date.now()-5*60*10000)
export function removeTimeFromDate(date: Date | string): Date {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}