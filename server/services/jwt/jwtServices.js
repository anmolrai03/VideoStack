import jwt from "jsonwebtoken";

import { JWT_AUDIENCE, JWT_ISSUER, JWT_EXPIRES } from "../../constants/jwt.js";
import {statusCodes} from '../../constants/statusCodes.js'

import AppError from "../../utils/AppError.js";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
  throw new AppError({
    statusCode: statusCodes.INTERNAL_SERVER_ERROR,
    code: "MISSING_AUTH_KEY",
    message: "Missing key for auth in jwt",
  });
}

const jwtSign = (payload, id) => {

  if( payload == null ) {
    throw new AppError({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      code: "MISSING_PAYLOAD",
      message: "missing data to be used to sign the token",
    });
  }

  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      subject: id.toString(),
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      expiresIn: JWT_EXPIRES,
      algorithm: "HS256",
    });

    return token;
  } catch (error) {
    console.log("[Error occured in jwtServices.]: ", error);
    throw new AppError({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      code: "JWT_ERROR",
      message: "Error in JWT token production."
    })
  }
};

const jwtVerify = (clientToken) => {
  if( !clientToken ) {
    throw new AppError({
      statusCode: statusCodes.UNAUTHORIZED,
      code: "CLIENT_TOKEN_MISSING",
      message: 'Authentication token is required.'
    })
  }

  try {
    const decoded = jwt.verify(clientToken, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],
    });

    return decoded;
  } catch (error) {
    console.error("[Error in jwt verification]: ", error);
    throw new AppError({
      statusCode: statusCodes.UNAUTHORIZED,
      code:"INVALID_TOKEN",
      message: "Token verification error."
    })
  }
};

export { jwtSign, jwtVerify };
