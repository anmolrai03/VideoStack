import { jwtVerify } from "../services/jwt/jwtServices";
import AppError from "../utils/AppError";

import {DEV_ENV} from "../constants/nodeEnv.js"

const authMiddleware = (req , res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if( !token ){
      throw new AppError({
        statusCode: 401,
        code: "MISSING_TOKEN",
        message: "Access Token is required."
      })
    }

    const decodedData = jwtVerify(token);

    if( process.env.NODE_ENV === DEV_ENV) {
      console.log("From auth middleware", decodedData);
    }

    req.userId = decodedData.sub;
    req.clientData = {
      email: decodedData?.email,
      username: decodedData?.username
    };

    next();

  } catch (error) {
    next(error);
  }
}

export default authMiddleware;