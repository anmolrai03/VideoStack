import AppError from "../utils/AppError";

import { statusCodes } from "./statusCodes";

function getAllowedOrigins() {
  const origins = process.env.CORS_ORIGIN;
  if (!origins) {
    throw new AppError({
      statusCode: statusCodes.INTERNAL_SERVER_ERROR,
      code: "CORS_CONFIG_MISSING",
      message: "CORS_ORIGIN is not configured in environment variables.",
    });
  }

  const allowedOrigins = origins.split(",").map((origin) => origin.trim());

  return allowedOrigins;
}

export default getAllowedOrigins;
