import { PROD_ENV } from "../constants/nodeEnv.js";

import User from "../models/users.model.js";

import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/responseHandler.js";
import debugLog from "../utils/debugLog.js";
import { checkPassword, checkEmail } from "../utils/validateData.js";

import { statusCodes } from "../constants/statusCodes.js";

// LOGIN CONTROLLER
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // VALIDATE THE DATA RECEIVED IN REQUEST
    let errors = [];

    const validateEmail = checkEmail(email);
    if (!validateEmail.status) {
      errors.push({ field: "email", message: validateEmail.errorMessage });
    }

    if (!password) {
      errors.push({ field: "password", message: "Password is missing." });
    }

    if (errors.length > 0) {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "MISSING_FIELDS",
        message: "Required fields are missing.",
        errors,
      });
    }

    // FIND USER IN DB
    const currUser = await User.findOne({ email }).select("+password");
    debugLog("Login Controller", currUser);

    // Check if user exists
    if (!currUser) {
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "USER_NOT_FOUND",
        message: "Invalid credentials! Email is not registered.",
      });
    }

    //VERIFY THE USER
    const isMatch = await currUser.comparePassword(password);
    if (!isMatch) {
      throw new AppError({
        statusCode: statusCodes.UNAUTHORIZED,
        code: "PASSWORD_MISMATCH",
        message: "Password did not match.",
        errors: [{ field: "password", message: "password mismatch." }],
      });
    }

    //GENERATE ACCESSTOKEN
    const accessToken = currUser.generateToken();

    // SET IT TO HTTP ONLY COOKIE
    const isProduction = process.env.NODE_ENV === PROD_ENV;
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 24 * 60 *60 *1000
    });

    // SEND RESPONSE TO THE USER
    const avatarName = currUser.fullname
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join("");

    const data = {
      id: currUser._id,
      avatarName,
    };

    return successResponse(
      res,
      statusCodes.OK,
      "LOGIN_SUCCESS",
      "Login successful.",
      data,
    );
  } catch (error) {
    next(error);
  }
};

// REGISTER/SIGN-UP CONTROLLER
const registerController = async (req, res, next) => {
  try {
    const { fullname, email, username, password } = req.body;

    // VALIDATE RECEIVED DATA
    let errors = [];

    if (typeof fullname !== "string") {
      errors.push({ field: "fullname", message: "Name should be a String." });
    }
    if (!fullname.trim()) {
      errors.push({ field: "fullname", message: "Name is Required." });
    }

    if (typeof username !== "string") {
      errors.push({
        field: "username",
        message: "username should be a string.",
      });
    }
    if (!username.trim()) {
      errors.push({ field: "username", message: "Username is Required." });
    }

    const validateEmail = checkEmail(email);
    if (!validateEmail.status) {
      errors.push({ field: "email", message: validateEmail.errorMessage });
    }

    const validatePassword = checkPassword(password);
    if (!validatePassword.status) {
      errors.push({
        field: "password",
        message: validatePassword.errorMessage,
      });
    }

    if (errors.length > 0) {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        message: "Validation Failed",
        errors,
      });
    }

    // CHECK IF USER WITH THE EMAIL EXISTS
    const currUser = await User.findOne({ email });
    if (currUser) {
      throw new AppError({
        statusCode: statusCodes.CONFLICT,
        code: "USER_EXISTS",
        message: "User with this email already exists.",
      });
    }

    // CREATE USER
    const newUser = new User({
      fullname,
      email,
      username,
      password,
    });

    await newUser.save();

    // RETURN RESPONSE
    return successResponse(
      res,
      statusCodes.CREATED,
      "USER_CREATED",
      "User created successfully.",
    );
  } catch (error) {
    next(error);
  }
};

// LOGOUT CONTROLLER
const logoutController = async (req, res, next) => {
  try {
    // GETTING FROM AUTHMIDDLEWARE
    const { userId, fullname } = req.clientData;
    debugLog("logout controller", req.clientData);

    // CHECK IF USERID IS NOT NULL
    if (!userId) {
      throw new AppError({
        statusCode: statusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      });
    }

    // CLEAR COOKIES
    const isProduction = process.env.NODE_ENV === PROD_ENV;
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
    });

    // RETURN MESSAGE
    return successResponse(
      res,
      statusCodes.OK,
      "LOGGED_OUT",
      `${fullname} logged out.`,
    );
  } catch (error) {
    next(error);
  }
};

//VERIFY PASSWORD.
const verifyPasswordController = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { userId } = req.clientData;
    debugLog("Verify passowrd", { password, userId });

    //VALIDATE PASSWORD
    const validatePassword = checkPassword(password);
    if (!validatePassword.status) {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "VALIDATION_ERROR",
        message: validatePassword.errorMessage,
        errors: [{ field: "password", message: validatePassword.errorMessage }],
      });
    }

    // SEARCH FOR USER
    const currUser = await User.findOne({ _id: userId }).select("+password");
    if (!currUser) {
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "USER_DO_NOT_EXIST",
        message: "User do not exist.",
      });
    }

    //CHECK IF PASSWORD MATCHS
    const isMatch = await currUser.comparePassword(password);
    if (!isMatch) {
      throw new AppError({
        statusCode: statusCodes.UNAUTHORIZED,
        code: "VALIDATION_ERROR",
        message: "Password do not match. You cannot upload any video.",
      });
    }
    // RETURN RESPONSE.
    return successResponse(
      res,
      statusCodes.OK,
      "PASSWORD_VERIFIED",
      "Password verified.",
    );
  } catch (error) {
    next(error);
  }
};

const getUserDetailsController = async (req, res, next) => {
  try {
    const { userId } = req.clientData;

    // VALIDATE USERID
    if (!userId) {
      throw new AppError({
        statusCode: statusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "Authentication required.",
      });
    }

    // QUERY DATA
    const user = await User.findOne({ _id: userId }).lean();
    if (!user) {
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "USER_NOT_FOUND",
        message: "The user do not exist in database.",
      });
    }

    // RETURN RESPONSE
    return successResponse(
      res,
      statusCodes.OK,
      "USER_DATA_SENT",
      "User data received",
      user,
    );
  } catch (error) {
    next(error);
  }
};

export {
  loginController,
  registerController,
  logoutController,
  verifyPasswordController,
  getUserDetailsController,
};
