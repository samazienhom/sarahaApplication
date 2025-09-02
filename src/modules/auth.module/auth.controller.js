import { Router } from "express";
import * as authServises from "./auth.services.js";
import { auth } from "../../middleware/auth.middleware.js";
const authRouter=Router()
authRouter.post("/signup",authServises.signup)
authRouter.get("/login",authServises.login)
authRouter.get("/getUserProfile",auth() ,authServises.getUserProfile)
authRouter.post("/refreshToken",authServises.refreshToken)
authRouter.post("/confirm-email",authServises.confirmEmail)
authRouter.post("/resend-otp",authServises.resend_emailOtp)
authRouter.post("/forget-pass",authServises.forgetPass)
authRouter.post("/change-pass",authServises.changePass)
export default authRouter