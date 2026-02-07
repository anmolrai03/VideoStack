import {Queue} from "bullmq";

import getRedisConnection from "../configs/redis.js"

import queueNames from "../constants/queueNames.js"

const videoQueue = new Queue(
  queueNames.VIDEO_QUEUE,
  {
    connection: getRedisConnection(),
    defaultJobOptions:{
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: false,
      timeout: 30000
    }
  }
);

export default videoQueue;