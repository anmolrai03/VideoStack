import mongoose from "mongoose";
import bcrypt from "bcryptjs"

import {jwtSign} from "../services/jwt/jwtServices.js"

const UserSchema = new mongoose.Schema(
  {
    fullname:{
      type: String,
      required: [true, "Full name is required!"],
      trim: true,
      maxlength: [50 , "Full Name must be less than 50 characters!"]
    },

    email:{
      type: String,
      required: [true , "Email is required!"],
      unique: true,
      trim: true,
      index: true,
      lowercase: true,
      maxlength: [40, "Email must be less than 40 characters!"]
    },

    username:{
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true , "Username is required!"],
      maxlength: [20, "username must be less than 20 characters"],
      minlength: [5, "username must have atleast 5 characters"]
    },

    password:{
      type: String,
      required: [true , "Password is required!"],
      minlength: [8 , "Password should be atleast 8 characters long."],
      select: false
    }

  }, 
  {timestamps: true}
);

UserSchema.pre('save', async function () {
  if( !this.isModified('password')) return ;
  this.password = await bcrypt.hash(this.password , 12);
})

UserSchema.methods.comparePassword = async function(userPassword) {
  return await bcrypt.compare(userPassword , this.password);
}

UserSchema.methods.generateToken = function() {
  const payload = {email: this.email, fullname: this.fullname};
  const id = this._id;
  return jwtSign(payload , id);
}

const User = mongoose.model('User', UserSchema);

export default User;