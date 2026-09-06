import { beforeEach, describe, expect, it, vi } from "vitest";

import AppError from "../../../utils/AppError.js";
import { processVideo } from "../../../controller/videoProcessing.controller.js";

vi.mock("node:fs/promises", () => ({
  default: {
    mkdir: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock("../../../utils/responseHandler.js", () => ({
  errorResponse: vi.fn((res, status, code, message, errors) => ({
    status,
    code,
    message,
    errors,
  })),
}));

vi.mock("../../../services/ffmpegServices/argsGenerator.js", () => ({
  default: vi.fn(),
}));

vi.mock("../../../services/ffmpegServices/ffmpegRunner.js", () => ({
  default: vi.fn(),
}));

vi.mock("../../../services/ffmpegServices/validateMedia.js", () => ({
  default: vi.fn(),
}));

vi.mock("../../../utils/cleanUpHandler.js", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

import fs from "node:fs/promises";
import argsGenerator from "../../../services/ffmpegServices/argsGenerator.js";
import ffmpegRunner from "../../../services/ffmpegServices/ffmpegRunner.js";
import validateVideoFile from "../../../services/ffmpegServices/validateMedia.js";
import cleanUpFiles from "../../../utils/cleanUpHandler.js";
import { errorResponse } from "../../../utils/responseHandler.js";

describe("processVideo", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      file: {
        path: "public/data/clientUploads/input.mp4",
        mimetype: "video/mp4",
      },
      body: {
        action: "video-resize",
        targetFormat: "mp4",
        resolution: "720",
      },
    };
    res = {
      download: vi.fn((outputPath, callback) => callback()),
    };

    vi.clearAllMocks();
    validateVideoFile.mockResolvedValue({ isValid: true });
    argsGenerator.mockReturnValue({
      args: ["-i", req.file.path, "output.mp4"],
      outputFilePath: "public/data/processed/output.mp4",
    });
    ffmpegRunner.mockResolvedValue(undefined);
  });

  it("rejects a request without a video file", async () => {
    req.file = undefined;

    await processVideo(req, res);

    expect(validateVideoFile).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalledWith(
      res,
      400,
      "VIDEO_MISSING",
      "Video file is missing!",
      [{ field: "video", message: "Upload a video." }],
    );
  });

  it("rejects a corrupt upload and removes the input file", async () => {
    validateVideoFile.mockResolvedValueOnce({
      isValid: false,
      error: "Invalid data found when processing input",
    });

    await processVideo(req, res);

    expect(validateVideoFile).toHaveBeenCalledWith(req.file.path);
    expect(cleanUpFiles).toHaveBeenCalledWith(req.file.path);
    expect(argsGenerator).not.toHaveBeenCalled();
    expect(errorResponse).toHaveBeenCalledWith(
      res,
      400,
      "CORRUPTED_OR_INVALID_VIDEO",
      "Invalid data found when processing input",
      [{ field: "video", message: "Invalid data found when processing input" }],
    );
  });

  it("queues the conversion with FFmpeg and cleans up after download", async () => {
    await processVideo(req, res);

    expect(fs.mkdir).toHaveBeenCalledWith(
      expect.stringContaining("public\\data\\processed"),
      { recursive: true },
    );
    expect(argsGenerator).toHaveBeenCalledWith(
      "video-resize",
      "mp4",
      "720",
      req.file.path,
      expect.stringContaining("public\\data\\processed"),
    );
    expect(ffmpegRunner).toHaveBeenCalledWith(["-i", req.file.path, "output.mp4"]);
    expect(res.download).toHaveBeenCalledWith(
      "public/data/processed/output.mp4",
      expect.any(Function),
    );
    expect(cleanUpFiles).toHaveBeenCalledWith(
      req.file.path,
      "public/data/processed/output.mp4",
    );
  });

  it("returns a typed FFmpeg error and cleans up generated paths", async () => {
    const ffmpegError = new AppError({
      statusCode: 500,
      code: "FFMPEG_FAILED",
      message: "FFmpeg failed to process media.",
      errors: [{ field: "ffmpeg", message: "Invalid input" }],
    });
    ffmpegRunner.mockRejectedValueOnce(ffmpegError);

    await processVideo(req, res);

    expect(cleanUpFiles).toHaveBeenCalledWith(
      req.file.path,
      "public/data/processed/output.mp4",
    );
    expect(errorResponse).toHaveBeenCalledWith(
      res,
      500,
      "FFMPEG_FAILED",
      "FFmpeg failed to process media.",
      [{ field: "ffmpeg", message: "Invalid input" }],
    );
  });

  it("returns a generic processing error for an unexpected FFmpeg failure", async () => {
    ffmpegRunner.mockRejectedValueOnce(new Error("worker crashed"));

    await processVideo(req, res);

    expect(cleanUpFiles).toHaveBeenCalledWith(
      req.file.path,
      "public/data/processed/output.mp4",
    );
    expect(errorResponse).toHaveBeenCalledWith(
      res,
      500,
      "MEDIA_PROCESSING_FAILED",
      "Video conversion process failed via server.",
    );
  });

  it("handles malformed processing parameters through the AppError path", async () => {
    const parameterError = new AppError({
      statusCode: 400,
      code: "INVALID_ARGUMENTS",
      message: "correct the parameters passed to the server.",
    });
    argsGenerator.mockImplementationOnce(() => {
      throw parameterError;
    });

    await processVideo(req, res);

    expect(ffmpegRunner).not.toHaveBeenCalled();
    expect(cleanUpFiles).toHaveBeenCalledWith(req.file.path, undefined);
    expect(errorResponse).toHaveBeenCalledWith(
      res,
      400,
      "INVALID_ARGUMENTS",
      "correct the parameters passed to the server.",
      [],
    );
  });

  it("cleans up even when the response download reports an error", async () => {
    res.download.mockImplementationOnce((outputPath, callback) =>
      callback(new Error("client disconnected")),
    );

    await processVideo(req, res);

    expect(cleanUpFiles).toHaveBeenCalledWith(
      req.file.path,
      "public/data/processed/output.mp4",
    );
    expect(errorResponse).not.toHaveBeenCalled();
  });
});
