import { get, model, Schema, set } from "mongoose";
import { decryption, encryption } from "../../utilities/crypto.js";
import { hash } from "../../utilities/bcrypt.js";
import { compare } from "bcryptjs";

export const Gender = {
  male: "male",
  female: "female",
};
Object.freeze(Gender);
export const Roles = {
  admin: "admin",
  user: "user",
};
Object.freeze(Roles);
const uesrSchema = new Schema(
  {
    firstName: {
      type: "String",
      required: true,
    },
    lastName: {
      type: "String",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: "String",
      required: true,
      set(value){
        return hash(value)
      }
    },
    age: {
      type: Number,
      min: 20,
      max: 50,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      default: Gender.male,
    },
    role: {
      type: "String",
      enum: Object.values(Roles),
      default: Roles.user,
    },
    phone: {
      type: String,
      required: true,
      set(value) {
        return encryption(value);
      },
      get(value) {
        return decryption(value);
      },
    },
    confirmed:{
      type:Boolean,
      default:false
    },
    email_otp:{
      otp:String,
      expiredAt:Date
    },
    password_otp:{
      otp:String,
      expiredAt:Date
    }
  },
  {
    timestamps: true,
    toJSON:{
        getters:true
    },
    toObject:{
        getters:true
    },
    virtuals:{
        fullName:{
            get(){
                return this.firstName +" "+ this.lastName
            }
        }
    },
    methods:{
      checkPass(password){
        return compare(password,this.password)
      }
      }
    }
  
);
export const userModel = model("users", uesrSchema);
