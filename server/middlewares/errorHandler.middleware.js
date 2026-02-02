import AppError from "../utils/AppError.js";
import {errorResponse} from "../utils/responseHandler.js"

import { statusCodes } from "../constants/statusCodes.js";

const errorHandler = (err , req , res , next) =>{

  if( !(err instanceof AppError )) {
    err = new AppError({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      code:"INTERNAL_SERVER_ERROR",
      message: "Something unknown went wrong.",
    })
  };

  return errorResponse(
    res ,
    err.statusCode,
    err.code,
    err.message,
    err.errors || []
  )
};

export default errorHandler;