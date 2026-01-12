import { Router } from "express";
import {
  login_controller_credentials,
  login_controller_google,
  logout,
  refresh,
  register_controller_credentials,
  register_controller_google,
  resetPasswordHandler,
  sendPasswordReset,
  verifyEmail,
} from "./auth.controller";
import passport from "passport";

const auth_route = Router();

auth_route.post("/register", register_controller_credentials);
auth_route.post("/login", login_controller_credentials);
// Registration
auth_route.get(
  "/google/register",
  passport.authenticate("google-register", { scope: ["profile", "email"] })
);

auth_route.get(
  "/google/register/callback",
  passport.authenticate("google-register", { session: false }),
  register_controller_google
);

// Login
auth_route.get(
  "/google/login",
  passport.authenticate("google-login", { scope: ["profile", "email"] })
);

auth_route.get(
  "/google/callback",
  passport.authenticate("google-login", { session: false }),
  login_controller_google
);

auth_route.get("/logout", logout);
auth_route.get("/refresh", refresh);
auth_route.get("/email/verify/:code", verifyEmail);
auth_route.post("/password/forgot", sendPasswordReset);
auth_route.post("/password/reset", resetPasswordHandler);

export default auth_route;
