import { Router } from "express";
import * as authServises from "./auth.services.js";
import { auth } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
const authRouter=Router()
authRouter.post("/signup",validation(signupSchema),authServises.signup)
authRouter.get("/login",validation(loginSchema),authServises.login)
authRouter.post("/social-login",authServises.socialLogin)
authRouter.get("/getUserProfile",auth() ,authServises.getUserProfile)
authRouter.post("/refreshToken",authServises.refreshToken)
authRouter.post("/confirm-email",authServises.confirmEmail)
authRouter.post("/resend-otp",authServises.resend_emailOtp)
authRouter.post("/forget-pass",authServises.forgetPass)
authRouter.post("/change-pass",authServises.changePass)
authRouter.post("/add-pass",authServises.addPass)
authRouter.patch("/update_email",auth(),authServises.updateEmail)
authRouter.patch("/confirm-new-email",auth(),authServises.confirmNewEmail)
export default authRouter