import { spawn } from "node:child_process";
import AppError from "../../utils/AppError.js";

function ffmpegRunner(args, timeoutMs = 300000) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn("ffmpeg", args);

    let stderr = "";
    let isTimedOut = false;

    const timer = setTimeout(() => {
      isTimedOut = true;
      ffmpeg.kill("SIGKILL");
      reject(
        new AppError({
          statusCode: 500,
          code: "FFMPEG_TIMEOUT",
          message: `FFmpeg processing timed out after ${timeoutMs / 1000} seconds.`,
        }),
      );
    }, timeoutMs);

    ffmpeg.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ffmpeg.on("error", (err) => {
      clearTimeout(timer);
      if (!isTimedOut) {
        reject(
          new AppError({
            statusCode: 500,
            code: "FFMPEG_SPAWN_FAILED",
            message: err.message,
          }),
        );
      }
    });

    ffmpeg.on("close", (code, signal) => {
      clearTimeout(timer);
      if (isTimedOut) return;

      if (code !== 0) {
        reject(
          new AppError({
            statusCode: 500,
            code: "FFMPEG_FAILED",
            message: "FFmpeg failed to process media.",
            errors: [
              {
                field: "ffmpeg",
                message: stderr.slice(-400) || `Process exited with code ${code}, signal ${signal}`,
              },
            ],
          }),
        );
      } else {
        resolve();
      }
    });
  });
}

export default ffmpegRunner;