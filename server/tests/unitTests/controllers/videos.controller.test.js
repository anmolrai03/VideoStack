import { beforeEach, describe, expect, it, vi } from "vitest";

import { statusCodes } from "../../../constants/statusCodes.js";
import AppError from "../../../utils/AppError.js";
import {
  uploadVideoController,
  getUserVideosController,
  deleteVideoController,
  getVideoStatusController,
} from "../../../controller/videos.controller.js";

// MOCK DEPENDENCIES
vi.mock("../../../models/videos.model.js", () => {
  const MockVideo = vi.fn().mockImplementation(function (data) {
    this._id = "mock-video-id-123";
    this.title = data.title;
    this.description = data.description;
    this.owner = data.owner;
    this.status = data.status || "QUEUED";
    this.save = vi.fn().mockResolvedValue(this);
  });

  MockVideo.find = vi.fn();
  MockVideo.findOne = vi.fn();
  MockVideo.findByIdAndUpdate = vi.fn();
  MockVideo.findByIdAndDelete = vi.fn().mockResolvedValue(true);

  return { default: MockVideo };
});

vi.mock("../../../queues/video.queue.js", () => ({
  default: {
    add: vi.fn(),
  },
}));

vi.mock("../../../services/ffmpegServices/validateMedia.js", () => ({
  default: vi.fn(),
}));

vi.mock("../../../utils/cleanUpHandler.js", () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock("../../../utils/responseHandler.js", () => ({
  successResponse: vi.fn((res, status, code, msg, data) => ({
    statusCode: status,
    code,
    message: msg,
    data,
  })),
}));

import Video from "../../../models/videos.model.js";
import videoQueue from "../../../queues/video.queue.js";
import validateVideoFile from "../../../services/ffmpegServices/validateMedia.js";
import cleanUpFiles from "../../../utils/cleanUpHandler.js";
import { successResponse } from "../../../utils/responseHandler.js";

describe("Videos Controller - Error Paths & Failure Scenarios", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      file: {
        path: "public/data/clientUploads/test-video.mp4",
        mimetype: "video/mp4",
      },
      body: {
        title: "Test Video",
        description: "Test Description",
      },
      clientData: {
        userId: "user-123",
      },
      params: {},
      query: {},
    };
    res = {};
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe("uploadVideoController", () => {
    it("should reject when no video file is provided in request", async () => {
      req.file = null;

      await uploadVideoController(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(statusCodes.BAD_REQUEST);
      expect(error.code).toBe("MISSING_VIDEO_FILE");
    });

    it("should reject when title is empty or missing", async () => {
      req.body.title = "   ";

      await uploadVideoController(req, res, next);

      expect(cleanUpFiles).toHaveBeenCalledWith(req.file.path);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(statusCodes.BAD_REQUEST);
      expect(error.code).toBe("TITLE_REQUIRED");
    });

    it("should reject corrupt or fake video before saving to DB or queueing", async () => {
      validateVideoFile.mockResolvedValueOnce({
        isValid: false,
        error: "Invalid data found when processing input",
      });

      await uploadVideoController(req, res, next);

      expect(validateVideoFile).toHaveBeenCalledWith(req.file.path);
      expect(cleanUpFiles).toHaveBeenCalledWith(req.file.path);
      expect(videoQueue.add).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(statusCodes.BAD_REQUEST);
      expect(error.code).toBe("CORRUPTED_OR_INVALID_VIDEO");
    });

    it("should handle unreachable Redis/BullMQ by deleting DB record and returning 503", async () => {
      validateVideoFile.mockResolvedValueOnce({ isValid: true, duration: 12.5 });
      videoQueue.add.mockRejectedValueOnce(new Error("Redis connection refused"));

      await uploadVideoController(req, res, next);

      expect(cleanUpFiles).toHaveBeenCalledWith(req.file.path);
      expect(Video.findByIdAndDelete).toHaveBeenCalledWith("mock-video-id-123");
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = next.mock.calls[0][0];
      expect(error.statusCode).toBe(statusCodes.SERVICE_UNAVAILABLE);
      expect(error.code).toBe("QUEUE_SERVICE_UNAVAILABLE");
    });

    it("should successfully save and queue a valid video", async () => {
      validateVideoFile.mockResolvedValueOnce({ isValid: true, duration: 12.5 });
      videoQueue.add.mockResolvedValueOnce({ id: "job-456" });

      await uploadVideoController(req, res, next);

      expect(videoQueue.add).toHaveBeenCalledWith("generate-hls-video", {
        videoId: "mock-video-id-123",
        inputFilePath: req.file.path,
      });
      expect(successResponse).toHaveBeenCalledWith(
        res,
        statusCodes.ACCEPTED,
        "VIDEO_UPLOAD_ACCEPTED",
        "Video upload accepted and queued for processing.",
        expect.objectContaining({ videoId: "mock-video-id-123" }),
      );
    });
  });

  describe("getVideoStatusController", () => {
    it("should return video status and failureReason if job failed", async () => {
      req.params.videoId = "mock-video-id-123";

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue({
          _id: "mock-video-id-123",
          owner: "user-123",
          status: "FAILED",
          failureReason: "FFmpeg processing timed out after 300 seconds.",
          title: "Test Video",
        }),
      };
      Video.findOne.mockReturnValue(mockQuery);

      await getVideoStatusController(req, res, next);

      expect(successResponse).toHaveBeenCalledWith(
        res,
        statusCodes.OK,
        "STATUS_SENT",
        "Status fetched successfully.",
        expect.objectContaining({
          status: "FAILED",
          failureReason: "FFmpeg processing timed out after 300 seconds.",
        }),
      );
    });
  });

  describe("deleteVideoController", () => {
    it("should correctly allow deleting a valid video", async () => {
      req.params.videoId = "valid-video-id-999";
      Video.findOne.mockResolvedValue({ _id: "valid-video-id-999", owner: "user-123" });

      await deleteVideoController(req, res, next);

      expect(Video.findByIdAndDelete).toHaveBeenCalledWith("valid-video-id-999");
      expect(successResponse).toHaveBeenCalledWith(
        res,
        statusCodes.OK,
        "VIDEO_DELETED",
        "Deletion Successful",
      );
    });
  });
});
