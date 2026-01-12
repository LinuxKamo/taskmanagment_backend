import { Request, Response } from "express";
import catchError from "../utils/catchErrors";
import { registerSchema } from "./schema/register.schema";
import {
  createAccount_Credentials,
  createAccount_Google,
  login_service_credentials,
  login_service_google,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  VerifyEmail,
} from "./auth.service";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http.status";
import {
  emailSchema,
  resetPasswordSchema,
  verificationCodeSchema,
} from "./schema/auth.schema";
import { verifyToken } from "../utils/jwt";
import SessionModel from "../sessions/session.model";
import AppAssets from "../utils/AppAssets";
import { FRONTEND_URL } from "../constants/env";

export const register_controller_credentials = catchError(
  async (req: Request, res: Response) => {
    //validate request
    const request = registerSchema.parse({
      ...req.body,
      userAgent: req.headers["user-agent"],
    });
    console.log("Provider is " + request.provider);
    //call service
    if (request.provider === "credentials") {
      const { accessToken, refreshToken, user } =
        await createAccount_Credentials(request);
      //return responce
      return setAuthCookies({ res, accessToken, refreshToken })
        .status(CREATED)
        .json(user);
    } else if (request.provider === "google") {
      const { accessToken, refreshToken, user } = await createAccount_Credentials(
        req.body
      );
      //return responce
      return setAuthCookies({ res, accessToken, refreshToken })
        .status(CREATED)
        .json(user);
    }
  }
);
export const register_controller_google = catchError(
  async (req, res) => {
    // Automatically get user agent from request headers
    const userAgent = req.headers["user-agent"] || "Unknown";

    // Passport sets the verified Google user in req.user
    const googleUser = req.user as {
      googleId: string;
      email: string;
      name?: string;
      surname?: string;
    };

    AppAssets(googleUser, UNAUTHORIZED, "Google authentication failed");

    // Call the existing account creation service (adapted for redirect)
    const { accessToken, refreshToken, user } = await createAccount_Google({
      googleId:googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
      surname: googleUser.surname,
      userAgent, // automatically passed
    });

    // Set cookies and redirect

    return setAuthCookies({ res, accessToken, refreshToken }).redirect(`${FRONTEND_URL}/user`);;
  }
);

export const login_controller_credentials = catchError(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Get user agent automatically
    const userAgent = req.headers["user-agent"] || "Unknown";

    const { user, accessToken, refreshToken } = await login_service_credentials(
      {
        email,
        password,
        userAgent,
      }
    );

    return setAuthCookies({ res, accessToken, refreshToken })
      .status(OK)
      .json(user);
  }
);
export const login_controller_google = catchError(async (req, res) => {
  console.log(req.user)
  const googleUser = req.user as {
    googleId: string;
    email?: string;
  };
  console.log(googleUser)

  AppAssets(googleUser, UNAUTHORIZED, "Google authentication failed");

  const { accessToken, refreshToken, user } = await login_service_google({
    googleId: googleUser.googleId,
    email: googleUser.email,
    userAgent: req.headers["user-agent"],
  });

  return setAuthCookies({ res, accessToken, refreshToken }).redirect(`${FRONTEND_URL}/user`);
});

export const refresh = catchError(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  if (!refreshToken)
    return res.status(UNAUTHORIZED).json({ message: "Not logged in" });
  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken || ""
  );
  if (newRefreshToken) {
    res.cookie("accessToken", accessToken, getAccessTokenCookieOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({ message: "Access token refreshed" });
});

export const verifyEmail = catchError(async (req: Request, res: Response) => {
  //Verify information
  const verificationCode = verificationCodeSchema.parse(req.params.code);
  //call service
  const { user } = await VerifyEmail(verificationCode);

  return res.status(OK).json({ message: "Email Verified",user:user });
});

export const sendPasswordReset = catchError(
  async (req: Request, res: Response) => {
    const email = emailSchema.parse(req.body.email);
    await sendPasswordResetEmail(email);
    return res.status(OK).json({ message: "email reset sent" });
  }
);

export const resetPasswordHandler = catchError(
  async (req: Request, res: Response) => {
    console.log(req.body);
    const request = resetPasswordSchema.parse(req.body);
    //service call
    const { user } = await resetPassword(request);

    return clearAuthCookies(res)
      .status(OK)
      .json({ message: "password reset successful" });
  }
);
export const logout = catchError(async (req: Request, res: Response) => {
  //TODO : must make is to work with refresh token
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || "");
  //Only deletes to database with both access and refresh token are available
  //TODO
  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "Logout successful" });
});
