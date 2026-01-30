import fs from "node:fs/promises";
import path from "node:path";

import { errorResponse } from "../utils/responseHandler.js";
import argsGenerator from "../services/ffmpegServices/argsGenerator.js";
import ffmpegRunner from "../services/ffmpegServices/ffmpegRunner.js";
import cleanUpFiles from "../utils/cleanUpHandler.js";

const processVideo = async (req, res) => {
  const videoData = req.file;

  if (!videoData) {
    return errorResponse(res, 400, "VIDEO_MISSING", "Video file is missing!", [
      { field: "video", message: "Upload a video." },
    ]);
  }

  const inputPath = videoData.path;

  if (!videoData.mimetype.startsWith("video/")) {
    cleanUpFiles(inputPath);
    return errorResponse(
      res,
      415,
      "UNSUPPORTED_MEDIA_TYPE",
      "only video files required",
      [{ field: "video", message: "Select Video files only." }],
    );
  }

  // CREATE INPUT AND OUTPUT PATHS STARTS HERE
  const processedDir = path.join(process.cwd(), "public/data/processed");
  await fs.mkdir(processedDir, { recursive: true });
  // CREATE INPUT AND OUTPUT PATHS ENDS HERE

  // FFMPEG SECTION STARTS HERE
  let outputPath;
  // RUN FFMPEG
  try {
    // AGRS AND OUTPUTPATH
    const generatorResponse = argsGenerator(
      req.body.action,
      req.body.targetFormat,
      req.body.resolution,
      inputPath,
      processedDir,
    );

    outputPath = generatorResponse.outputFilePath;

    await ffmpegRunner(generatorResponse.args);
    res.download(outputPath, (err) => {
      if (err) {
        console.error("Download error: ", err);
      }
      cleanUpFiles(inputPath, outputPath);
    });
  } catch (error) {
    cleanUpFiles(inputPath, outputPath);

    // This is AppError
    if (error instanceof Error && error.statusCode && error.code) {
      console.log("App Error Generated traces: ", error)
      return errorResponse(res, error.statusCode, error.code, error.message);
    }

    // Unknown / unexpected error
    console.error("UNHANDLED ERROR:", error);

    return errorResponse(
      res,
      500,
      "MEDIA_PROCESSING_FAILED",
      "Video conversion process failed via server.",
    );
  }

  // FFMPEG SECTION ENDS HERE
};

export { processVideo };
