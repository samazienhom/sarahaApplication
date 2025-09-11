import { auth } from "../../middleware/auth.middleware.js";
import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as userServices from "./user.services.js";
import { getUserByIdSchema, updatebasicInfoSchema } from "./user.validation.js";
const userRouter=Router()
userRouter.get("/getUserProfileById/:id",validation(getUserByIdSchema),userServices.getUserProfileById)
userRouter.patch("/updateBasicInfo",validation(updatebasicInfoSchema),auth(),userServices.updateBsicInfo)
export default userRouter