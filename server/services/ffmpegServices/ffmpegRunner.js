import { spawn } from "node:child_process";
import AppError from "../../utils/AppError.js";

function ffmpegRunner(args) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args);

    let stderr = "";

    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ffmpeg.on("error", (err) => {
      reject(
        new AppError({
          statusCode: 500,
          code:"FFMPEG_SPAWN_FAILED",
          message: err.message
        })
      )
    });

    ffmpeg.on("close", (code, signal) => {
      if (code !== 0) {
        reject(
          new AppError({
            statusCode: 500,
            code: "FFMPEG_FAILED",
            message: "FFmped failed to process your media.",
            exitCode: code,
            signal,
            stderr
          })
        );
      } else {
        resolve();
      }
    });
  });
}

export default ffmpegRunner;