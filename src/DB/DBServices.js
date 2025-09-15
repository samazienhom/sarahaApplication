import { userModel } from "./models/user.model.js"

export const findOne=async({model,filter})=>{
    const doc =await model.findOne(filter)
    return doc
}
export const findByEmail=async(email)=>{
    const doc =await userModel.findOne(email)
    return doc
}

export const findById=async({model,id})=>{
    const doc =await model.findById(id)
    return doc
}
export const find=async({model,filter})=>{
    const docs =await model.find(filter)
    return docs
}
export const create=async({model,data})=>{
    const doc=await model.create(data)
    return doc
}
export const findByIdAndUdate=async({model,id,data={},options={new:true}})=>{
    const doc =await model.findByIdAndUdate(id,data,options)
    return doc
}
export const findOneAndUdate=async({model,filter={},data={},options={new:true}})=>{
    const doc =await model.findOneAndUdate(filter,data,options)
    return doc
}
export const findByIdAndDelete=async({model,id})=>{
    const doc =await model.findByIdAndDelete(id)
    return doc
}
export const findOneAndDelete=async({model,filter={}})=>{
    const doc =await model.findOneAndDelete(filter)
    return doc
}