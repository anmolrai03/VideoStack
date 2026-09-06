import fs from "node:fs/promises";
import path from "node:path";

import { errorResponse } from "../utils/responseHandler.js";
import argsGenerator from "../services/ffmpegServices/argsGenerator.js";
import ffmpegRunner from "../services/ffmpegServices/ffmpegRunner.js";
import cleanUpFiles from "../utils/cleanUpHandler.js";
import validateVideoFile from "../services/ffmpegServices/validateMedia.js";

const processVideo = async (req, res) => {
  const videoData = req.file;

  if (!videoData) {
    return errorResponse(res, 400, "VIDEO_MISSING", "Video file is missing!", [
      { field: "video", message: "Upload a video." },
    ]);
  }

  const inputPath = videoData.path;

  // Validate corrupt or invalid container early
  const probeResult = await validateVideoFile(inputPath);
  if (!probeResult.isValid) {
    await cleanUpFiles(inputPath);
    return errorResponse(
      res,
      400,
      "CORRUPTED_OR_INVALID_VIDEO",
      probeResult.error || "The uploaded file is corrupt or not a valid playable video.",
      [{ field: "video", message: probeResult.error || "Invalid video file" }],
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
    res.download(outputPath, async (err) => {
      if (err) {
        console.error("Download error: ", err);
      }
      await cleanUpFiles(inputPath, outputPath);
    });
  } catch (error) {
    await cleanUpFiles(inputPath, outputPath);

    // This is AppError
    if (error instanceof Error && error.statusCode && error.code) {
      return errorResponse(res, error.statusCode, error.code, error.message, error.errors || []);
    }

    // Unknown / unexpected error
    console.error("UNHANDLED ERROR in processVideo:", error);

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
