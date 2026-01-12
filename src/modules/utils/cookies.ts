import type { CookieOptions, Response } from "express";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";


const secured = true;
export const REFRESH_PATH = "/auth/refresh"
const defaults: CookieOptions = {
  sameSite: "none",
  httpOnly: true,
  secure: secured,
};
export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookiesoptions = (): CookieOptions => ({
  ...defaults,
  expires: thirtyDaysFromNow(),
  path: REFRESH_PATH,
});
type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
  res.cookie("accessToken", accessToken, getAccessTokenCookieOptions()).cookie("refreshToken", refreshToken, getRefreshTokenCookiesoptions());

export const clearAuthCookies = (res:Response)=>res.clearCookie("accessToken").clearCookie("refreshToken",{path:REFRESH_PATH,});