import { jwtVerify } from "../services/jwt/jwtServices";

import AppError from "../utils/AppError";
import debugLog from "../utils/debugLog.js";

import {statusCodes} from "../constants/statusCodes.js"

const authMiddleware = (req , res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if( !token ){
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "MISSING_TOKEN",
        message: "Access Token is required."
      })
    }

    const decodedData = jwtVerify(token);

    debugLog("From auth middleware", decodedData);

    req.clientData = {
      userId: decodedData.sub,
      fullname: decodedData?.fullname,
    };

    next();

  } catch (error) {
    next(error);
  }
}

export default authMiddleware;