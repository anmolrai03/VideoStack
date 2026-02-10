import "dotenv/config";
import connectDb from "../configs/db.js";
import getRedisConnection from "../configs/redis.js";

async function startWorkers(){
  try {
    // connect mongodb
    await connectDb();

    //connect redis
    const redisConnection = await getRedisConnection();
    await redisConnection.ping();
    // import workers
    await import("./video.worker.js");

    // message
    console.log("All workers started.");
  } catch (error) {
    console.error("Workers start-up failed: ", error);
    process.exit(1);
  }
}

await startWorkers();