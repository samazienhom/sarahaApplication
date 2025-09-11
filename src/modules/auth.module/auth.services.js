import { findById, findOne } from "../../DB/DBServices.js";
import { Providers, userModel } from "../../DB/models/user.model.js";
import { decodeToken, tokenTypes } from "../../middleware/auth.middleware.js";
import {
  InvalidCredentials,
  InvalidLoginMethodException,
  NotConfirmedException,
  NotValidEmail,
  UserNotFound,
} from "../../utilities/exceptions.js";
import { successHandler } from "../../utilities/success.handler.js";
import jwt from "jsonwebtoken";
import { otp_tamplate } from "../../utilities/send.email/otp.tamplate.js";
import { customAlphabet } from "nanoid";
import { sendEmail } from "../../utilities/send.email/send.email.js";
import { compare, hash } from "../../utilities/bcrypt.js";
import { OAuth2Client } from "google-auth-library";
import Joi from "joi";
import { loginSchema } from "./auth.validation.js";
const client = new OAuth2Client();
export const signup = async (req, res, next) => {
  const { firstName, lastName, email, password, age, gender, role, phone } =
    req.body;
  const isExist = await findOne({
    model: userModel,
    filter: {
      email,
    },
  });
  if (isExist) {
    return next(new NotValidEmail());
  }
  const custom = customAlphabet("0123456789");
  const otp = custom(6);
  const subject = "Email confirmation";
  const html = otp_tamplate(otp, firstName, subject);

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password,
    age,
    gender,
    role,
    phone,
    email_otp: {
      otp: await hash(otp),
      expiredAt: Date.now() + 1000 * 60*2,
      failedAttempts:0,
      banned:null
    },
  });
  await sendEmail({ to: user.email, html, subject });
  successHandler({ res, status: 202, data: user });
};
export const confirmEmail = async (req, res, next) => {
  const { otp, email } = req.body;
  const user = await findOne({ model: userModel, filter: { email } });
  if (!user) {
    return UserNotFound("email ");
  }
  if (!user.email_otp.otp) {
    return next(new Error("no otp", { cause: 404 }));
  }
  if (user.email_otp.banned && user.email_otp.banned>Date.now()){
    return next(new Error("you are banned now"))
  }
  if (user.email_otp.expiredAt <= Date.now()) {
    return next(new Error("expired otp", { cause: 404 }));
  }
  // if (!compare(otp, user.email_otp.otp)) {
  //   return next(new Error("Invalid otp", { cause: 404 }));
  // }
  const isValid=await compare(otp,user.email_otp.otp)
  if(!isValid){
    let failed=user.email_otp.failedAttempts+1
    if(failed>=5){
      await user.updateOne({
        "email_otp.failedAttempts":0,
        "email_otp.banned":Date.now()+ 1000*60*5,
      })
      return next(new Error("try again after 5 minutes"))
    }
    await user.updateOne({
      "email_otp.failedAttempts":failed
    })
    return next(new Error("invalid otp"))
  }
  await user.updateOne({
    confirmed: true,
    $unset: {
      email_otp: ""
    },
  });
  return successHandler({ res });
};
export const resend_emailOtp = async (req, res, next) => {
  const { email } = req.body;
  const user = await findOne({ model: userModel, filter: { email } });
  if (!user) {
    return UserNotFound("email");
  }
  if (user.confirmed) {
    return next(new Error("email already confirmed", { cause: 400 }));
  }
  if (user.email_otp.expiredAt > Date.now()) {
    return next(new Error("use your last otp", { cause: 400 }));
  }

  const custom = customAlphabet("0123456789");
  const otp = custom(6);
  const subject = "Email confirmation(resend otp)";
  const html = otp_tamplate(otp, user.firstName, subject);
  await sendEmail({ to: user.email, html, subject });
  await user.updateOne({
    email_otp: {
      otp: await hash(otp),
      expiredAt: Date.now() + 1000 * 60,
    },
  }),
    successHandler({ res, status: 202, data: user });
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  
  const user = await findOne({
    model: userModel,
    filter: { email },
  });
  if (!user.confirmed) {
    return next(new NotConfirmedException());
  }
  if (user.password == undefined) {
    if (user?.provider == Providers.google) {
      return next(new InvalidLoginMethodException());
    }
  }
  if (!user || !(await user.checkPass(password))) {
    return next(new InvalidCredentials());
  }
  const accessToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.ACCESS_SIGNATURE,
    {
      expiresIn: "1 H",
    }
  );
  const refreshToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.REFRESH_SIGNATURE,
    {
      expiresIn: "7 D",
    }
  );
  return successHandler({
    res,
    data: {
      accessToken,
      refreshToken
    },
  });
};
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  const user = await decodeToken({
    authorization: refreshToken,
    type: tokenTypes.refresh,
    next,
  });
  const accessToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.ACCESS_SIGNATURE,
    {
      expiresIn: "1 H",
    }
  );
  successHandler({
    res,
    data: {
      accessToken,
    },
  });
};
export const getUserProfile = async (req, res, next) => {
  const user = req.user;
  console.log(user);
  successHandler({ res, data: user });
};
export const forgetPass = async (req, res, next) => {
  const { email } = req.body;
  const user = await findOne({ model: userModel, filter: { email } });
  if (!user) {
    return UserNotFound("email");
  }
  if (!user.confirmed) {
    return next(new Error("user not confirmed", { cause: 409 }));
  }
  const custom = customAlphabet("0123456789");
  const otp = custom(6);
  const subject = "Forget password";
  const html = otp_tamplate(otp, user.firstName, subject);
  await sendEmail({ to: user.email, html, subject });
  await user.updateOne({
    password_otp: {
      otp: await hash(otp),
      expiredAt: Date.now() + 1000 * 60,
    },
  });
  successHandler({ res });
};
export const changePass = async (req, res, next) => {
  const { email, otp, password } = req.body;
  const user = await findOne({ model: userModel, filter: { email } });
  if (!user) {
    return UserNotFound("user");
  }
  if (!user.password_otp.otp) {
    return next(new Error("no otp", { cause: 404 }));
  }
  if (user.password_otp.expiredAt <= Date.now()) {
    return next(new Error("expired otp", { cause: 404 }));
  }
  if (!compare(otp, user.password_otp.otp)) {
    return next(new Error("Invalid otp", { cause: 404 }));
  }
  await user.updateOne({
    password,
    $unset: {
      password_otp: "",
    },
    changed_credentials: Date.now(),
  });
  successHandler({ res });
};
export const socialLogin = async (req, res, next) => {
  const idToken = req.body.idToken;
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const {
    email,
    email_verified,
    given_name: firstName,
    family_name: lastName,
  } = ticket.getPayload();
  let user = await findOne({
    model: userModel,
    filter: { email },
  });
  // if(user?.provider==Providers.system){
  //   return next(new InvalidLoginMethodException())
  // }
  if (!user) {
    user = await userModel.create({
      email,
      firstName,
      lastName,
      confirmed: email_verified,
      provider: Providers.google,
    });
  }
  if (!user.confirmed) {
    return next(new NotConfirmedException());
  }
  const accessToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.ACCESS_SIGNATURE,
    {
      expiresIn: "1 H",
    }
  );
  const refreshToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.REFRESH_SIGNATURE,
    {
      expiresIn: "7 D",
    }
  );
  successHandler({
    res,
    data: {
      accessToken,
      refreshToken,
    },
  });
};
export const addPass = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findOne({
    model: userModel,
    filter: { email },
  });
  if (!user) {
    return next(new UserNotFound());
  }
  if (user.provider == Providers.system) {
    return next(new Error("password already exist"));
  }
  await user.updateOne({
    password,
  });
  successHandler({ res });
};
