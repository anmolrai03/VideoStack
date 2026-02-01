import AppError from "../utils/AppError";

const origins = process.env.CORS_ORIGIN;
if (!origins) {
  throw new AppError({
    statusCode: 500,
    code: "CORS_CONFIG_MISSING",
    message: "CORS_ORIGIN is not configured in environment variables.",
  });
}

const allowedOrigins = origins.split(",").map((origin) => origin.trim());

export default allowedOrigins;
