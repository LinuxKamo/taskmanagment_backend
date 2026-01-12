import { FRONTEND_URL } from "../constants/env";
import {
  CONFLICT,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../constants/http.status";
import RoleType from "../constants/role.types";
import { userStatus } from "../constants/status.enum";
import VerifcationCodeType from "../constants/VaricicationCodeTypes";
import SessionModel from "../sessions/session.model";
import AppAssets from "../utils/AppAssets";
import { hashValue } from "../utils/bcrypt";
import { fiverMinutesAgo, One_Day_MS, oneHourFromNow, oneYearFromNow, thirtyDaysFromNow } from "../utils/date";
import { getPasswordResetTemplate, getVerifyEmailTemplate } from "../utils/emalTemplates";
import {
  refreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../utils/jwt";
import { sendMail } from "../utils/sendMail";
import ProviderModel from "./models/provider.model";
import UserModel from "./models/user.model";
import VerificationModel from "./models/varificationCode.model";

export type CreateAccountCredentialsParam = {
  name: string;
  surname: string;
  email: string;
  password: string;
  userAgent?: string;
  provider: string;
};
export const createAccount_Credentials = async (
  data: CreateAccountCredentialsParam
) => {
  //verify user doesnt exist
  const existuser = await UserModel.exists({
    email: data.email,
  });
  AppAssets(!existuser, CONFLICT, "Email already in use");
  //Add the use
  const user = await UserModel.create({
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: data.password,
    verified: false,
    role: RoleType.User,
    status: userStatus.ACTIVE,
  });

  const provider = await ProviderModel.create({
    email: user.email,
    user_id: user._id,
    provider: data.provider,
  });
  console.log("Provider is", provider);
  // Create varifcation code
  const verificationCode = await VerificationModel.create({
    userId: user.id,
    type: VerifcationCodeType.EmailVerification,
    expireAt: oneYearFromNow(),
  });
  //url
  const url = `${FRONTEND_URL}/email/verify/${verificationCode!._id}`;
  // Send varification email
  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });

  if (error) {
    console.error(error.message);
  }
  //create session
  const session = await SessionModel.create({
    userId: user.id,
    userAgent: data.userAgent,
  });
  // sign access token and refresh token
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({ sessionId: session._id, user_id: user._id });
  // return use and tokens
  return { user: user.omitPassword(), accessToken, refreshToken };
  // return user
};
type GoogleAuthParams = {
  googleId: string;
  email: string;
  name?: string;
  surname?: string;
  userAgent?: string;
};

export const createAccount_Google = async ({
  googleId,
  userAgent,email,name,surname
}: GoogleAuthParams) => {
  AppAssets(email, UNAUTHORIZED, "Google account has no email");

  // Find existing provider
  let provider = await ProviderModel.findOne({
    provider: "google",
    provider_id: googleId,
  });

  let user:any;

  if (provider) {
    // Existing user
    user = await UserModel.findById(provider.user_id);
    AppAssets(!user, CONFLICT, "Email already in use");
  } else {
    // Check if email exists
    user = await UserModel.findOne({ email });

    if (user) {
      // Link Google provider to existing account
      provider = await ProviderModel.create({
        user_id: user._id,
        provider: "google",
        provider_id: googleId,
        email,
      });
    } else {
      
      // New user
      user = await UserModel.create({
        name: name || "",
        surname: surname || "",
        email,
        verified: true,
        role: RoleType.User,
        status: userStatus.ACTIVE,
      });
      console.log(user)

      provider = await ProviderModel.create({
        user_id: user._id,
        provider: "google",
        provider_id: googleId,
        email,
      });
    }
  }
  // Create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent,
  });

  // Sign tokens
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    sessionId: session._id,
    user_id: user._id,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

type LoginParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const login_service_credentials = async ({
  email,
  password,
  userAgent,
}: LoginParams) => {
  // 1️⃣ Find user
  const user = await UserModel.findOne({ email });
  AppAssets(user, NOT_FOUND, "Invalid email or password");

  // 2️⃣ Verify account status
  AppAssets(
    user.status === userStatus.ACTIVE,
    FORBIDDEN,
    "Account is : "+user.status
  );

  // 3️⃣ Ensure credentials login is allowed
  AppAssets(
    user.password,
    UNAUTHORIZED,
    "This account does not support password login"
  );

  // 4️⃣ Compare password
  const isValid = await user.comparePassword(password);
  AppAssets(isValid, UNAUTHORIZED, "Invalid email or password");

  // 5️⃣ Create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent,
  });

  // 6️⃣ Sign tokens
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    sessionId: session._id,
    user_id: user._id,
  });

  // 7️⃣ Return
  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
};

type GoogleLoginParams = {
  googleId: string;
  email?: string;
  userAgent?: string;
}

export async function login_service_google({
  googleId,
  email,
  userAgent,
}: GoogleLoginParams) {
  AppAssets(email, UNAUTHORIZED, "Google account has no email");

  // 1️⃣ Find provider
  const provider = await ProviderModel.findOne({
    provider: "google",
    provider_id: googleId,
  });

  AppAssets(provider, NOT_FOUND, "Account not registered with Google");

  // 2️⃣ Find user
  const user = await UserModel.findById(provider.user_id);
  AppAssets(user, NOT_FOUND, "User not found");

  // 3️⃣ Check user status
  AppAssets(
    user.status === userStatus.ACTIVE,
    FORBIDDEN,
    "Account is disabled"
  );

  // 4️⃣ Create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent,
  });

  // 5️⃣ Sign tokens
  const refreshToken = signToken(
    { sessionId: session._id },
    refreshTokenSignOptions
  );

  const accessToken = signToken({
    sessionId: session._id,
    user_id: user._id,
  });

  return {
    user: user.omitPassword(),
    accessToken,
    refreshToken,
  };
}

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<refreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  AppAssets(payload, UNAUTHORIZED, "Invalid refresh Token");
  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  AppAssets(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );
  // refresh session if expire in 24h
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= One_Day_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }
  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : undefined;
  const accessToken = signToken({
    user_id: session.userId,
    sessionId: session._id,
  });

  return { accessToken, newRefreshToken };
};

export const VerifyEmail = async (code: string) => {
  //get verification code
  const validCode = await VerificationModel.findOne({
    _id: code,
    type: VerifcationCodeType.EmailVerification,
    expireAt: { $gt: new Date() },
  });

  AppAssets(validCode, NOT_FOUND, "Invalid or expired verificationcode");

  //Update user
  const user = await UserModel.findByIdAndUpdate(
    validCode!.userId,
    { verified: true },
    { new: true }
  );
  // Delete verification code after successful verification
  await validCode!.deleteOne();

  //Return updated user
  return { user: user?.omitPassword() };
  // retuen user
};

export const sendPasswordResetEmail = async (email: string) => {
  //get user by email
  const user = await UserModel.findOne({ email });
  AppAssets(user, NOT_FOUND, "user not found");
  //check email rate limit
  const fiverMintesAgo = fiverMinutesAgo();
  const count = await VerificationModel.countDocuments({
    userId: user!._id,
    type: VerifcationCodeType.PasswordReset,
    createAt: { $gt: fiverMintesAgo },
  });
  AppAssets(
    count <= 1,
    TOO_MANY_REQUESTS,
    "too many request please try again later"
  );
  //create verification code
  const expireAt = oneHourFromNow();
  const verificationCode = await VerificationModel.create({
    userId: user!._id,
    type: VerifcationCodeType.PasswordReset,
    expireAt,
  });

  //send email verification
  const url = `${FRONTEND_URL}/password/reset?code=${
    verificationCode._id
  }&exp=${expireAt.getTime()}`;
  const { data, error } = await sendMail({
    to: user!.email,
    ...getPasswordResetTemplate(url),
  });
  AppAssets(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name} - ${error?.message}`
  );
  //return success
  return { url, email_Id: data?.id };
};
type ResetParams = {
  password:string;
  verificationCode:string;
}

export const resetPassword = async ({password,verificationCode}:ResetParams)=>{
  //get verificationCode
  const validCode = await VerificationModel.findOne({_id:verificationCode,type:VerifcationCodeType.PasswordReset,expireAt:{$gt:new Date()}});
  AppAssets(validCode,NOT_FOUND,"Invalid or expired verifiation code");
  //update the users password
  const update_user= await UserModel.findByIdAndUpdate(validCode.userId,{
    password:await hashValue(password)
  });
  AppAssets(update_user,INTERNAL_SERVER_ERROR,"Failed to update password");

  // delete the verification code
  await validCode!.deleteOne();
  //delete all sessions 
  await SessionModel.deleteMany({
    userId:update_user!._id
  })

  return {
    user:update_user.omitPassword()
  }
}
