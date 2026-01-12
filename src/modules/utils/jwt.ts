import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken";
import { GOOGLE_CLIENT_ID, JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env";
import { UserDocument } from "../auth/models/user.model";
import { SessionDocument } from "../sessions/session.model";
import { OAuth2Client } from "google-auth-library";
import { BAD_REQUEST } from "../constants/http.status";

export const googleClient = new OAuth2Client(
  GOOGLE_CLIENT_ID
);

export async function verifyGoogleToken(idToken: string) {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) throw new Error("Invalid Google token");

    return payload;
  } catch {
    throw {
      status: BAD_REQUEST,
      message: "Invalid Google token",
    };
  }
}

export type refreshTokenPayload = {
  sessionId: SessionDocument["_id"];
};

export type accessTokenPayload = {
  user_id: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};

export type signInOptionsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};
const accessTokenSignOptions: signInOptionsAndSecret = {
  expiresIn: "58m",
  secret: JWT_SECRET,
};
export const refreshTokenSignOptions: signInOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: accessTokenPayload | refreshTokenPayload,
  options?: signInOptionsAndSecret
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, { ...defaults, ...signOpts });
};

export const verifyToken =<TPayload extends object = accessTokenPayload> (
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};
  try {
    //need looking into
    const payload = jwt.verify(token, secret,verifyOpts) as TPayload

    return {payload}
  } catch (error:any) {
    return { error: error.message}
  }
};
