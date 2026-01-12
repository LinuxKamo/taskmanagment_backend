import type { NextFunction, Request, RequestHandler, Response } from "express";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } from "../constants/http.status";
import { verifyToken } from "../utils/jwt";
import AppAssets from "../utils/AppAssets";
import AppErrorCode from "../constants/AppErrorCode";

declare global {
  namespace Express {
    interface Request {
      userId?: string | undefined;
      sessionId?: string | undefined;
    }
  }
}

const authenticate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  if (!accessToken)
    return res.status(UNAUTHORIZED).json({ message: "AccessToken not found" });
  const { payload, error } = verifyToken(accessToken);
  if (error === "jwt expired") {
    return res.status(UNAUTHORIZED).json({ message: "Token Expired" });
  } else if (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Invalid token" });
  }
  AppAssets(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalideAccessToken
  );
  req.userId =
    typeof payload.user_id === "string" ? payload.user_id : undefined;
  AppAssets(req.userId, NOT_FOUND, "user not found");
  req.sessionId =
    typeof payload.sessionId === "string" ? payload.sessionId : undefined;
  AppAssets(req.sessionId, NOT_FOUND, "session not found");
  next();
};

export default authenticate;
