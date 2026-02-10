import { Queue } from "bullmq";

import getRedisConnection from "../configs/redis.js";

import queueNames from "../constants/queueNames.js";

const videoQueue = new Queue(queueNames.VIDEO_QUEUE, {
  connection: getRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});

export default videoQueue;
