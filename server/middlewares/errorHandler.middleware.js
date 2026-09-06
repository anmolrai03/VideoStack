import AppError from "../utils/AppError.js";
import { errorResponse } from "../utils/responseHandler.js";
import { statusCodes } from "../constants/statusCodes.js";

const errorHandler = (err, req, res, next) => {
  // If response headers have already been sent, delegate to default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || statusCodes.INTERNAL_SERVER_ERROR;
  let code = err.code || "INTERNAL_SERVER_ERROR";
  let message = err.message || "An unexpected error occurred.";
  let errors = err.errors || [];

  // 1. Handle Multer Upload Errors (e.g. file size exceeded)
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      statusCode = statusCodes.PAYLOAD_TOO_LARGE;
      code = "FILE_TOO_LARGE";
      message = "Uploaded file exceeds the maximum allowed file size limit.";
    } else {
      statusCode = statusCodes.BAD_REQUEST;
      code = "FILE_UPLOAD_ERROR";
      message = err.message;
    }
    errors = [{ field: err.field || "file", message }];
  }
  // 2. Handle Mongoose CastError (e.g. invalid ObjectId format)
  else if (err.name === "CastError") {
    statusCode = statusCodes.BAD_REQUEST;
    code = "INVALID_ID_FORMAT";
    message = `Invalid format for field: ${err.path}`;
    errors = [{ field: err.path, message: `Cast to ${err.kind} failed for value "${err.value}"` }];
  }
  // 3. Handle Mongoose Validation Errors
  else if (err.name === "ValidationError") {
    statusCode = statusCodes.BAD_REQUEST;
    code = "VALIDATION_ERROR";
    message = "Validation failed for request data.";
    errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }
  // 4. Handle JSON Body Parser Syntax Errors
  else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = statusCodes.BAD_REQUEST;
    code = "INVALID_JSON_PAYLOAD";
    message = "Malformed JSON payload in request body.";
  }
  // 5. Handle JWT Authentication Errors
  else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    statusCode = statusCodes.UNAUTHORIZED;
    code = "INVALID_TOKEN";
    message = "Authentication token is invalid or expired.";
  }
  // 6. Generic or Unhandled Errors (Never leak raw stack traces to the client)
  else if (!(err instanceof AppError)) {
    console.error("[UNHANDLED ERROR LOG]:", err);
    statusCode = statusCodes.INTERNAL_SERVER_ERROR;
    code = "INTERNAL_SERVER_ERROR";
    message = "An unexpected error occurred on the server.";
    errors = [];
  }

  return errorResponse(res, statusCode, code, message, errors);
};

export default errorHandler;