import Joi from "joi";
import { generalValidation } from "../../utilities/general.validation.js ";

export const getUserByIdSchema=Joi.object({
    id:generalValidation.id.required()
})
export const updatebasicInfoSchema=Joi.object({
    firstName:generalValidation.firstName,
    lastName:generalValidation.lastName,
    age:generalValidation.age,
    phone:generalValidation.phone
})