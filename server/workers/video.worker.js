import { Worker } from "bullmq";
import fs from "node:fs/promises";

import getRedisConnection from "../configs/redis.js";
import queueNames from "../constants/queueNames.js";

import Video from "../models/videos.model.js";

import ffmpegRunner from "../services/ffmpegServices/ffmpegRunner.js";
import { uploadToCloudinary } from "../services/storageServices/uploadToObjectStorage.js";

import debugLog from "../utils/debugLog.js";
import cleanUpFiles from "../utils/cleanUpHandler.js";

console.log("video worker terminal started......");
const worker = new Worker(
  queueNames.VIDEO_QUEUE,
  async (job) => {
    debugLog("worker process started");

    //GET THE JOB DATA
    const { videoId, inputFilePath } = job.data;
    let outputFilePath = null;

    try {
      debugLog("processing update");
      // SET STATUS OF VIDEO TO PROCESSING IN DB.
      await Video.findByIdAndUpdate(videoId, { status: "PROCESSING" });
      debugLog("procssing update finished");

      // CREATE THE OUTPUT FOLDER LIKE public/data/processed/videoId/....
      debugLog("outputfilepath");
      outputFilePath = `public/data/processed/${videoId}`;
      await fs.mkdir(outputFilePath, { recursive: true });
      debugLog("outputFilepath finished");

      // GENREATE THE ARGS HERE;
      // const args = [
      //   "-i", inputFilePath,
      //   "-filter_complex",
      //   "[0:v]split=4[v1][v2][v3][v4];[v1]scale=w=-2:h=360[v1out];[v2]scale=w=-2:h=480[v2out];[v3]scale=w=-2:h=720[v3out];[v4]scale=w=-2:h=1080[v4out]",

      //   "-map", "[v1out]", "-c:v:0", "libx264", "-b:v:0", "800k",
      //   "-map", "[v2out]", "-c:v:1", "libx264", "-b:v:1", "1400k",
      //   "-map", "[v3out]", "-c:v:2", "libx264", "-b:v:2", "2800k",
      //   "-map", "[v4out]", "-c:v:3", "libx264", "-b:v:3", "5000k",

      //   "-map", "0:a", "-c:a:0", "aac", "-b:a:0", "128k",
      //   "-map", "0:a", "-c:a:1", "aac", "-b:a:1", "128k",
      //   "-map", "0:a", "-c:a:2", "aac", "-b:a:2", "128k",
      //   "-map", "0:a", "-c:a:3", "aac", "-b:a:3", "128k",

      //   "-f", "hls",
      //   "-hls_time", "6",
      //   "-hls_playlist_type", "vod",
      //   "-master_pl_name", "master.m3u8",

      //   "-var_stream_map", "v:0,a:0,name:360p v:1,a:1,name:480p v:2,a:2,name:720p v:3,a:3,name:1080p",
      //   "-hls_segment_filename", `${outputFilePath}/%v/segment_%03d.ts`,
      //   `${outputFilePath}/%v/index.m3u8`
      // ];
      const args = [
        "-i",
        inputFilePath,

        "-filter_complex",
        "[0:v]split=4[v1][v2][v3][v4];" +
          "[v1]scale=w=-2:h=360[v1out];" +
          "[v2]scale=w=-2:h=480[v2out];" +
          "[v3]scale=w=-2:h=720[v3out];" +
          "[v4]scale=w=-2:h=1080[v4out]",

        // VIDEO STREAMS
        "-map",
        "[v1out]",
        "-c:v:0",
        "libx264",
        "-preset:v:0",
        "veryfast",
        "-b:v:0",
        "800k",
        "-map",
        "[v2out]",
        "-c:v:1",
        "libx264",
        "-preset:v:1",
        "veryfast",
        "-b:v:1",
        "1400k",
        "-map",
        "[v3out]",
        "-c:v:2",
        "libx264",
        "-preset:v:2",
        "veryfast",
        "-b:v:2",
        "2800k",
        "-map",
        "[v4out]",
        "-c:v:3",
        "libx264",
        "-preset:v:3",
        "veryfast",
        "-b:v:3",
        "5000k",

        // DUPLICATED AUDIO STREAMS
        "-map",
        "0:a?",
        "-c:a:0",
        "aac",
        "-b:a:0",
        "128k",
        "-map",
        "0:a?",
        "-c:a:1",
        "aac",
        "-b:a:1",
        "128k",
        "-map",
        "0:a?",
        "-c:a:2",
        "aac",
        "-b:a:2",
        "128k",
        "-map",
        "0:a?",
        "-c:a:3",
        "aac",
        "-b:a:3",
        "128k",

        "-max_muxing_queue_size",
        "1024",

        "-f",
        "hls",
        "-hls_time",
        "6",
        "-hls_playlist_type",
        "vod",
        "-master_pl_name",
        "master.m3u8",

        "-var_stream_map",
        "v:0,a:0,name:360p v:1,a:1,name:480p v:2,a:2,name:720p v:3,a:3,name:1080p",

        "-hls_segment_filename",
        `${outputFilePath}/%v/segment_%03d.ts`,

        `${outputFilePath}/%v/index.m3u8`,
      ];

      debugLog("started ffmpeg");
      // RUN FFMPEG TO TO CREATE THE HLS PLAYLIST AND SAVE IT THE OUTPUT FOLDER
      await ffmpegRunner(args);
      debugLog("ffmpeg finished");
      // SAVE THE PLAYLIST TO B2
      // await uploadToCloudinary(outputFilePath, videoId)

      debugLog("upload to cloudinary");
      // SAVE THE PLAYLIST TO CLOUDINARY AND GET THE STREAMURL FROM THE B2's CDN
      const streamPlaylistUrl = await uploadToCloudinary(
        outputFilePath,
        videoId,
      );
      debugLog("upload to cloudinary finished");

      debugLog("updating to ready");
      // SAVE STATUS OF THE VIDEO TO READY AND STREAMURL FROM ABOVE IN THE DB
      await Video.findByIdAndUpdate(videoId, {
        status: "READY",
        streamPlaylistUrl,
      });
      debugLog("update to ready finished");

      // CONSOLE LOG, PROCCESS WITH ID THIS FINISHED.
      debugLog(`Video ${videoId} processing completed`);
    } catch (error) {

      try {
        debugLog("update db to fail");
        // SAVE FAILED STATE TO DB
        await Video.findByIdAndUpdate(videoId, { status: "FAILED" });
        debugLog("update db to fail finished");
      } catch (dbError) {
        console.log("DB error in video-worker", dbError);
      }

      console.log(`Processing error for videoId: ${videoId}: ${error.message}`);

      throw error;
    } finally {
      //CLEAR THE INPUT AND OUTPUT FILE PATHS
      cleanUpFiles(inputFilePath, outputFilePath);
    }
  },
  {
    connection: getRedisConnection(),
    concurrency: 1,
  },
);

worker.on("completed", (job) => {
  console.log(`Job with id: ${job.id} done.`);
});

worker.on("error", async (err) => {
  console.log("Error occured", err);
});
