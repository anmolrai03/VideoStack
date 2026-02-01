import AppError from "../utils/AppError.js";
import {errorResponse} from "../utils/responseHandler.js"

const errorHandler = (err , req , res , next) =>{

  if( !(err instanceof AppError )) {
    err = new AppError({
      statusCode: 500,
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