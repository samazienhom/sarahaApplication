import { findById, findOne } from "../../DB/DBServices.js";
import { userModel } from "../../DB/models/user.model.js";
import { decodeToken, tokenTypes } from "../../middleware/auth.middleware.js";
import {
  InvalidCredentials,
  NotValidEmail,
  UserNotFound,
} from "../../utilities/exceptions.js";
import { successHandler } from "../../utilities/success.handler.js";
import jwt from "jsonwebtoken";
import { otp_tamplate } from "../../utilities/send.email/otp.tamplate.js";
import { customAlphabet } from "nanoid";
import { sendEmail } from "../../utilities/send.email/send.email.js";
import { compare, hash } from "../../utilities/bcrypt.js";

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
      expiredAt: Date.now() + 1000 * 30,
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
  if (user.email_otp.expiredAt <= Date.now()) {
    return next(new Error("expired otp", { cause: 404 }));
  }
  if (!compare(otp, user.email_otp.otp)) {
    return next(new Error("Invalid otp", { cause: 404 }));
  }
  await user.updateOne({
    confirmed: true,
    $unset: {
      email_otp: "",
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
    }}),
      successHandler({ res, status: 202, data: user });
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findOne({
    model: userModel,
    filter: { email },
  });
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
      refreshToken,
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
export const forgetPass=async(req,res,next)=>{
  const {email}=req.body
  const user=await findOne({model:userModel,filter:{email}})
  if(!user){
    return UserNotFound("email")
  }
  if(!user.confirmed){
    return next(new Error("user not confirmed",{cause:409}))
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
    }})
    successHandler({res})

}
export const changePass=async(req,res,next)=>{
  const {email,otp,password}=req.body
  const user=await findOne({model:userModel,filter:{email}})
  if(!user){
    return UserNotFound('user')
  }
    if (!user.password_otp.otp) {
    return next(new Error("no otp", { cause: 404 }));
  }
  if (user.password_otp.expiredAt <= Date.now()) {
    return next(new Error("expired otp", { cause: 404 }));
  }
  if(!compare(otp,user.password_otp.otp)){
        return next(new Error("Invalid otp", { cause: 404 }));
  }
  await user.updateOne({
    password,
    $unset:{
      password_otp:""
    }
  })
  successHandler({res})
}
