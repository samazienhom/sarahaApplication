import { findById } from "../../DB/DBServices.js";
import { Roles, userModel } from "../../DB/models/user.model.js";
import { UserNotFound } from "../../utilities/exceptions.js";
import cloudinary from "../../utilities/multer/cloud.config.js";
import { successHandler } from "../../utilities/success.handler.js";
import fs from "fs/promises";
import { deleteByPrefix, deleteFolder, destroySinglefile, uploadmultibleFiles, uploadsingleFile } from "../../utilities/multer/cloud.services.js";
export const updateBsicInfo = async (req, res, next) => {
  const { firstName, lastName, age, phone } = req.body;
  const user = req.user;
  await user.updateOne({
    firstName,
    lastName,
    age,
    phone,
  });
  successHandler({ res, data: user });
};
export const shareProfile = async (req, res, next) => {
  const user = req.user;
  const link = `${req.protocol}://${req.host}/user/${user._id}`;
  successHandler({ res, data: link });
};
export const getProfile = async (req, res, next) => {
  const id = req.params.id;
  const user = await userModel
    .findOne({
      _id: id,
      isDeleted: false,
    })
    .select("firstName lastName email phone profileImage");
  if (!user) {
    return next(new Error(UserNotFound));
  }
  user.profileImage = `${req.protocol}://${req.host}/${user.profileImage}`;
  successHandler({ res, data: user });
};
export const softDelete = async (req, res, next) => {
  const { id } = req.params;
  const user = await userModel.findOne({
    isDeleted: false,
    _id: id,
  });
  if (!user) {
    return next(new Error(UserNotFound));
  }
  if (user.role == Roles.admin) {
    return next(new Error("Admin can not be deleted"));
  }
  user.isDeleted = true;
  user.deletedBy = req.user._id;
  await user.save();
  successHandler({ res });
};
export const restoreAccount = async (req, res, next) => {
  const id = req.params.id;
  const user = await userModel.findById(id);
  if (!user) {
    return next(new Error(UserNotFound));
  }
  if (!user.isDeleted) {
    return next(new Error("user not deleted", { cause: 400 }));
  }
  if (user.deletedBy.toString() != req.user._id.toString()) {
    return next(new Error("ypu can not restore this account", { cause: 401 }));
  }
  user.deletedBy = undefined;
  user.isDeleted = false;
  await user.save();
  successHandler({ res });
};
export const deleteUser = async (req, res, next) => {
  const user = req.user;
  await user.deleteOne();
  successHandler({ res });
};
export const profileImage = async (req, res, next) => {
  const path = `${req.file.destination}/${req.file.filename}`;
  console.log(path);
  console.log(req.file);
  const user = req.user;
  if (user.profileImage) {
    await fs.unlink(user.profileImage);
  }
  user.profileImage = path;
  await user.save();
  successHandler({ res });
};
export const profileImageCloud = async (req, res, next) => {
  // console.log(req.file);
  const user = req.user;
  const { secure_url,public_id } =await uploadsingleFile({path:req.file.path,dest:`users/${user.id}/profile_images`})
  if(user.profileImage.public_id){
    await destroySinglefile({public_id:user.profileImage.public_id})
    console.log("deleted");
  }
  user.profileImage={
    secure_url,
    public_id
  }
  await user.save();
  successHandler({ res });
};
export const coverImages=async(req,res)=>{
  const files=req.files
  const user=req.user
  const paths=[]
  req.files.map(file=>{
    paths.push(file.path)
  })
  const coverImages=await uploadmultibleFiles({paths,dest:`users/${user.id}/cover_images`})
  user.coverImages.push(...coverImages)
  await user.save()
  successHandler({res})
}
export const deleteImages = async (req, res, next) => {
  const user = req.user;
 if(user.profileImage||user.coverImages){
   await deleteByPrefix({prefix:`users/${user._id}`})
  await deleteFolder({folder:`users/${user._id}`})
 }
  await user.deleteOne();
  successHandler({ res });
};