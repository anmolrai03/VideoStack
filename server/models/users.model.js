import mongoose from "mongoose";

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


const User = mongoose.model('User', UserSchema);

export default User;