import Joi from "joi";
import mongoose from "mongoose";
import { Gender, Roles } from "../DB/models/user.model.js";
const checkId=(value,helpers)=>{
       if(mongoose.isValidObjectId(value)){
        return true
       }else{
        return helpers.message("invalid object id")
       }
    }
export const generalValidation = {
  firstName: Joi.string().min(3).max(15),
  lastName: Joi.string().min(3).max(15),
  email: Joi.string().email(),
  password: Joi.string().min(6).max(20),
  confirmedPassword: Joi.string().valid(Joi.ref("password")),
  age: Joi.number().min(15).max(50),
  gender: Joi.string().valid(Gender.male, Gender.female),
  role: Joi.string().valid(Roles.admin, Roles.user),
  phone: Joi.string().regex(/^(0|0020|\+20)(1)[1250]\d{8}/),
  otp:Joi.string().length(6),
  id:Joi.string().custom(checkId)
};
