import { findById } from "../../DB/DBServices.js";
import { userModel } from "../../DB/models/user.model.js";
import { successHandler } from "../../utilities/success.handler.js";

export const getUserProfileById = async (req, res, next) => {
  const id = req.params.id;
  const user=await findById({model:userModel,id})
  successHandler({ res, data: user });
};
export const updateBsicInfo=async(req,res,next)=>{
  const {firstName,lastName,age,phone}=req.body
  const user=req.user
  await user.updateOne({
    firstName,lastName,age,phone
  })
  successHandler({res,data:user})
}