import { get, model, Schema, set, Types } from "mongoose";
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
export const Providers = {
  system: "system",
  google: "google",
};
Object.freeze(Providers);

const otpSchema=new Schema(
  {
    otp:"String",
    expiredAt:Date
  },{
    _id:false
  }
)
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
      required: function () {
        if (this.provider == Providers.google) {
          return false;
        }
        if (this.provider == Providers.system) {
          return true;
        }
      },
      set(value) {
        return hash(value);
      },
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
      required: function () {
        if (this.provider == Providers.google) {
          return false;
        }
        if (this.provider == Providers.system) {
          return true;
        }
      },
      set(value) {
        if (value) {
          return encryption(value);
        }
        return value
      },
      get(value) {
        return decryption(value);
      },
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    email_otp: {
       otp:"String",
    expiredAt:Date,
      failedAttempts: { type: Number, default: 0 },
      banned: Date,
    },
    new_email_otp:otpSchema,
    old_email_otp:otpSchema,
    newEmail:String,
    password_otp: {
      otp: String,
      expiredAt: Date,
    },
    changed_credentials: Date,
    provider: {
      type: String,
      enum: Object.values(Providers),
      default: Providers.system,
    },
    isDeleted:{
      type:Boolean,
      default:false
    },
    deletedBy:{
      type:Types.ObjectId,
      ref:"users"
    },
    profileImage:{
      secure_url:String,
      public_id:String
    },
    coverImages:[{
    secure_url:String,
    public_id:String
  }]
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
    },
    toObject: {
      getters: true,
    },
    virtuals: {
      fullName: {
        get() {
          return this.firstName + " " + this.lastName;
        },
      },
    },
    methods: {
      checkPass(password) {
        return compare(password, this.password);
      },
    },
  }
);
export const userModel = model("users", uesrSchema);
