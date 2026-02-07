import { jwtVerify } from "../services/jwt/jwtServices.js";

import AppError from "../utils/AppError.js";
import debugLog from "../utils/debugLog.js";

import {statusCodes} from "../constants/statusCodes.js"

const authMiddleware = (req , res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if( !token ){
      throw new AppError({
        statusCode: statusCodes.UNAUTHORIZED,
        code: "MISSING_TOKEN",
        message: "Access Token is required."
      })
    }

    const decodedData = jwtVerify(token);

    debugLog("From auth middleware", decodedData.sub);

    req.clientData = {
      userId: decodedData.sub,
      fullname: decodedData?.fullname,
    };

    next();

  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(
        new AppError({
          statusCode: statusCodes.UNAUTHORIZED,
          code: "INVALID_TOKEN",
          message: "Invalid or expired token.",
        })
      );
    }

    next(error);
  }
}

export default authMiddleware;