// IMPORT MODULES STARTS HERE
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

// IMPORT ROUTES STARTS HERE
import videoProcessingRoute from "./routes/videoProcessing.route.js";
import authRoute from "./routes/auth.route.js";
import videosRoute from "./routes/videos.routes.js";

// MIDDLEWARE IMPORTS STARTS HERE
import errorHandler from "./middlewares/errorHandler.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";

// IMPORT CONSTANTS AND UTILS STARTS HERE
import getAllowedOrigins from "./constants/appCORS.js";
import getRedisConnection from "./configs/redis.js";
import AppError from "./utils/AppError.js";
import { statusCodes } from "./constants/statusCodes.js";

// CONFIGURE DOTENV STARTS HERE
dotenv.config({
  path: "./.env",
});

function createApp() {
  // CREATE APP
  const app = express();

  // CORS SETTING
  const allowedOrigins = getAllowedOrigins();
  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  );

  // SET JSON LIMIT
  app.use(express.json({ limit: "16kb" }));

  // SET URL ENCODED LIMIT
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));

  // SET COOKIE PARSER
  app.use(cookieParser());

  // HEALTH CHECK ROUTE (Checks Redis & DB Connectivity)
  app.get("/health", async (req, res) => {
    let redisStatus = "disconnected";
    let dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    try {
      const redis = getRedisConnection();
      const pingResult = await Promise.race([
        redis.ping(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000)),
      ]);
      if (pingResult === "PONG") {
        redisStatus = "connected";
      }
    } catch {
      redisStatus = "disconnected";
    }

    const isHealthy = redisStatus === "connected" && dbStatus === "connected";
    const statusCode = isHealthy ? statusCodes.OK : statusCodes.SERVICE_UNAVAILABLE;

    return res.status(statusCode).json({
      status: isHealthy ? "healthy" : "unhealthy",
      services: {
        redis: redisStatus,
        database: dbStatus,
      },
      timestamp: new Date().toISOString(),
    });
  });

  // SET API ROUTES
  app.use("/api", videoProcessingRoute);
  app.use("/api/auth", authRoute);
  app.use("/api/videos", authMiddleware, videosRoute);

  // CATCH-ALL 404 HANDLER FOR UNMATCHED ROUTES
  app.use((req, res, next) => {
    next(
      new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "ROUTE_NOT_FOUND",
        message: `Cannot ${req.method} ${req.originalUrl}`,
      }),
    );
  });

  // CENTRALIZED ERROR MIDDLEWARE
  app.use(errorHandler);

  return app;
}

export default createApp;
