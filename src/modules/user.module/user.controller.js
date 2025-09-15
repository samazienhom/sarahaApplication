import { allowTo, auth } from "../../middleware/auth.middleware.js";
import { Router } from "express";
import { validation } from "../../middleware/validation.middleware.js";
import * as userServices from "./user.services.js";
import { getUserByIdSchema, updatebasicInfoSchema } from "./user.validation.js";
import { Roles } from "../../DB/models/user.model.js";
import { uploadFile } from "../../utilities/multer/multer.js";
const userRouter=Router()
userRouter.patch("/soft-delete/:id",auth(),allowTo(Roles.admin),userServices.softDelete)
userRouter.patch("/restore-account/:id",auth(),allowTo(Roles.admin),userServices.restoreAccount)
userRouter.delete("/hard-delete",auth(),userServices.deleteUser)
userRouter.get("/getUserProfileById/:id",validation(getUserByIdSchema),userServices.getProfile)
userRouter.get("/shareProfile",auth(),userServices.shareProfile)
userRouter.patch("/updateBasicInfo",validation(updatebasicInfoSchema),auth(),userServices.updateBsicInfo)

userRouter.patch(
    '/profile-image',
    auth(),
    uploadFile('profile_images').single("profileImage"),
    userServices.profileImage)
export default userRouter