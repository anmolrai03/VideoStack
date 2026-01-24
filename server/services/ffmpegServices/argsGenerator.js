import path from "node:path";
import crypto from "node:crypto";

import AppError from "../../utils/AppError.js";

const ACTIONS = {
  VIDEO_RESIZE: "video-resize",
  AUDIO_EXTRACT: "audio-extract",
  FORMAT_CONVERT: "format-convert",
};

const VIDEO_RESOLUTIONS = new Set(["240", "360", "480", "720", "1080"]);
const AUDIO_FORMAT = new Set(["mp3" , "aac"]);
const VIDEO_FORMAT = new Set(["mp4", "mkv"]);

const argsGenerator = (
  action,
  targetFormat,
  resolution,
  inputPath,
  outputDir,
) => {

  // ====== VIDEO RESIZING STARTS HERE =============
  if (action === ACTIONS.VIDEO_RESIZE) {

    const resol = String(resolution);

    if(!VIDEO_RESOLUTIONS.has(resol)){
      throw new AppError({
        statusCode: 400,
        code: "INCORRECT_RESOLUTION",
        message: "Select either 240, 360 , 480,720, 1080p only."
      })
    }

    if( !VIDEO_FORMAT.has(String(targetFormat)) ){
      throw new AppError({
        statusCode: 415,
        code:"INCORRECT_FORMAT",
        message: "format should be that of the file"
      });
    }

    const outputFileName = `video-${crypto.randomUUID()}.${targetFormat}`;
    const outputFilePath = path.join(outputDir, outputFileName);

    const args = [
      "-i",
      inputPath,
      "-vf",
      `scale=-2:${resol}`,
      "-c:v",
      "libx264",
      "-c:a",
      "copy",
      outputFilePath,
    ];

    return {args,outputFilePath};
  } 
  // ====== VIDEO RESIZING ENDS HERE =============


  // ====== AUDIO EXTRACTION STARTS HERE =============
  if (action === ACTIONS.AUDIO_EXTRACT) {

    if( !AUDIO_FORMAT.has( String(targetFormat) ) ){
      throw new AppError({
        statusCode: 415,
        code:"INCORRECT_FORMAT",
        message: "format should be that of the file"
      });
    }

    const outputFileName = `audio-${crypto.randomUUID()}.${targetFormat}`;
    const outputFilePath = path.join(outputDir, outputFileName);
    const audioCodec = targetFormat === "aac" ? "copy" : "libmp3lame";

    const args = ["-i", inputPath, "-vn", "-c:a", audioCodec, outputFilePath];

    return {args,outputFilePath};
  } 
  // ====== AUDIO EXTRACTION ENDS HERE =============

  // ====== FORMAT CONVERSION STARTS HERE =============
  if (action === ACTIONS.FORMAT_CONVERT) {

    if( !VIDEO_FORMAT.has(String(targetFormat)) ){
      throw new AppError({
        statusCode: 415,
        code:"INCORRECT_FORMAT",
        message: "format should be that of the file"
      });;
    }

    const outputFileName = `video-${crypto.randomUUID()}.${targetFormat}`;
    const outputFilePath = path.join(outputDir, outputFileName);

    const args = ["-i", inputPath, "-c", "copy", outputFilePath];
    return {args,outputFilePath};
  } 
  // ====== AUDIO EXTRACTION ENDS HERE =============
  
  throw new AppError({
    statusCode: 500,
    code: "INVALID_ARGUMENTS",
    message: "correct the parameters passed to the server."
  });

};

export default argsGenerator;
