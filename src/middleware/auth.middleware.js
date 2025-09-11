import { findById } from "../DB/DBServices.js";
import { userModel } from "../DB/models/user.model.js";
import { InvalidTokeExceotion, LoginAgainException, NotConfirmedException, UserNotFound } from "../utilities/exceptions.js";

import jwt from "jsonwebtoken";
export const tokenTypes={
    access:"access",
    refresh:"refresh"
} 
Object.freeze(tokenTypes)
export const decodeToken = async ({authorization, type=tokenTypes.access,next}) => {
  if (!authorization) {
    return next(new InvalidTokeExceotion());
  }
  if(!authorization.startsWith(process.env.BEARER_KEY)){
        return next(new InvalidTokeExceotion());
  }
  const token=authorization.split(" ")[1]
  let signature=process.env.ACCESS_SIGNATURE
  if(type==tokenTypes.refresh){
    signature=process.env.REFRESH_SIGNATURE
  }
  const data = jwt.verify(token,signature );
  console.log(data);
  const user = await findById({ model: userModel, id: data._id });
  if(!user){
    return next(new UserNotFound())
  }
  if(!user.confirmed){
    return next(new NotConfirmedException())
  }
  if(user.changed_credentials?.getTime()>=data.iat*1000){
    return next(new LoginAgainException())
  }
  return user;
};
export const auth = () => {
  return async (req, res, next) => {
    const authorization = req.headers.auth;
    const user = await decodeToken({ authorization,next });
    req.user = user;
    next();
  };
};
