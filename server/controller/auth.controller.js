import { PROD_ENV } from "../constants/nodeEnv.js";

import User from "../models/users.model.js";

import AppError from "../utils/AppError.js";
import {successResponse} from "../utils/responseHandler.js";
import debugLog from "../utils/debugLog.js";

const loginController = async (req , res, next) => {

  try {
    const {email , password} = req.body;

    // VALIDATE THE DATA RECEIVED IN REQUEST
    let errors = [];

    if( !email ){
      errors.push({field: "email" , message: "email field is missing"});
    }

    if( !password ){
      errors.push({field: "password" , message: "Password is missing."});
    }

    if( errors.length > 0 ){
      throw new AppError({
        statusCode: 400,
        code:"MISSING_FIELDS",
        message: "Required fields are missing.",
        errors
      });
    }

    // FIND USER IN DB
    const currUser = await User.findOne({email}).select("+password");
    debugLog("Login Controller" , currUser);

    // Check if user exists
    if (!currUser) {
      throw new AppError({
        statusCode: 401,
        code: "INVALID_CREDENTIALS",
        message: "Invalid credentials! User not found.",
      });
    }

    //VERIFY THE USER
    const isMatch = await currUser.comparePassword(password);
    if( !isMatch ){
      throw new AppError({
        statusCode: 401,
        code:"INVALID_CREDENTIALS",
        message: "Password did not match.",
        errors: [{field: "password", message: "password is missing."}]
      });
    }

    //GENERATE ACCESSTOKEN
    const accessToken = currUser.generateToken();

    // SET IT TO HTTP ONLY COOKIE
    const isProduction = process.env.NODE_ENV === PROD_ENV;
    res.cookie("accessToken", accessToken , {
      httpOnly: true,
      sameSite: isProduction ? "none": "lax",
      secure: isProduction
    });

    // SEND RESPONSE TO THE USER
    return successResponse(
      res,
      200,
      "LOGIN_SUCCESS",
      "Login successful."
    )
  } catch (error) {
    next(error);
  }

};

const registerController = async (req , res) => {
  res.send("register controller")
};

const logoutController = async (req , res) => {
  res.send("logout controller")
};

const verifyPasswordController = async (req , res) => {
  res.send("verifyPassword controller")
};

const getUserDetailsController = async (req , res) => {
  res.send("verifyPassword controller")
};

export {loginController, registerController, logoutController , verifyPasswordController, getUserDetailsController};

