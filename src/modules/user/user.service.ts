import UserModel from "../auth/models/user.model";
import VerificationModel from "../auth/models/varificationCode.model";
import { FRONTEND_URL } from "../constants/env";
import VerifcationCodeType from "../constants/VaricicationCodeTypes";
import SessionModel from "../sessions/session.model";
import { oneYearFromNow } from "../utils/date";
import { getVerifyEmailTemplate } from "../utils/emalTemplates";
import { refreshTokenSignOptions, signToken } from "../utils/jwt";
import { sendMail } from "../utils/sendMail";
import { User } from "./user.type";

export const create_User_Service = async (data: User) => {
  const user = await UserModel.create({
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: data.password,
    verified: false,
    role: data.role,
  });
  // Create varifcation code
  const verificationCode = await VerificationModel.create({
    userId: user._id,
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
};
