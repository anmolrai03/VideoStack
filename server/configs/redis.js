import IORedis from "ioredis";
import debugLog from "../utils/debugLog.js";
import { PROD_ENV } from "../constants/nodeEnv.js";

function createRedisConnection() {

  const isProduction = (process.env.NODE_ENV?.trim() === PROD_ENV);

  const redisURL = (isProduction ? process.env.REDIS_URL : "redis://127.0.0.1:6379");
  debugLog("url" , redisURL);
  const redisOptions = {
    maxRetriesPerRequest: null, // for letting bullmq handle the retries
    enableReadyCheck: true, // to ensure redis is connected before the worker asks for the job
    retryStrategy: (times) => Math.min(times * 50, 2000), // controls reconnection tries
  }

  if( isProduction ){
    redisOptions.tls = {};// required for prodction , using upstash it will always provide  tls
  }

  const redisConnection = new IORedis(redisURL,redisOptions);

  redisConnection.on("connect", () => {
    console.log("Redis connected...");
  });

  let logged = false;

  redisConnection.on("error", (err) => {
    if (!logged) {
      debugLog("url", process.env.REDIS_URL);
      console.error("Redis connection failed:", err.message);
      logged = true;
    }
  });

  redisConnection.on("reconnecting", () => {
    console.log("Redis reconnecting...");
  });

  redisConnection.on("end", () => {
    console.log(" Redis connection closed");
  });

  return redisConnection;
}

let redisInstance = null;

function getRedisConnection() {
  if( redisInstance ) return redisInstance;
  redisInstance = createRedisConnection();
  return redisInstance;
}

export default getRedisConnection;



// config/redis.js
// import IORedis from "ioredis";
// import debugLog from "../utils/debugLog.js";

// function createRedisConnection() {
//   const redisUrl = process.env.REDIS_URL;

//   debugLog("Redis URL", redisUrl);
  
//   if (!redisUrl) {
//     console.error("❌ REDIS_URL is not set in environment variables");
//     console.log("💡 For local development: redis://localhost:6379");
//     console.log("💡 For Upstash: rediss://username:password@host:port");
//     throw new Error("REDIS_URL environment variable is required");
//   }

  
  
//   // Configure based on URL type
//   const options = {
//     maxRetriesPerRequest: null,
//     enableReadyCheck: false, // Change to false for BullMQ compatibility
//     retryStrategy: (times) => {
//       const delay = Math.min(times * 100, 3000);
//       console.log(`🔄 Redis reconnecting attempt ${times}, delay: ${delay}ms`);
//       return delay;
//     }
//   };

//   // Enable TLS ONLY for rediss:// URLs (Upstash SSL)
//   if (redisUrl.startsWith('rediss://')) {
//     options.tls = {};
//     console.log("🔐 Using TLS for Redis connection");
//   } else if (redisUrl.startsWith('redis://')) {
//     console.log("🔓 Using plain TCP for Redis connection");
//   }

//   const redisConnection = new IORedis(redisUrl, options);

//   redisConnection.on("connect", () => {
//     console.log("🔗 Redis connecting...");
//   });

//   redisConnection.on("ready", () => {
//     console.log("✅ Redis connected and ready");
//   });

//   redisConnection.on("error", (err) => {
//     console.error("❌ Redis connection error:", err.message);
//     debugLog("Full error", err);
//   });

//   redisConnection.on("reconnecting", () => {
//     console.log("🔄 Redis reconnecting...");
//   });

//   redisConnection.on("end", () => {
//     console.log("🔌 Redis connection closed");
//   });

//   return redisConnection;
// }

// // Create a singleton instance
// let redisInstance = null;

// export default function getRedisConnection() {
//   if (!redisInstance) {
//     redisInstance = createRedisConnection();
//   }
//   return redisInstance;
// }