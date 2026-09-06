import { describe, expect, it, vi, beforeEach } from "vitest";

// MOCK DEPENDENCIES
let mockWorkerHandler = null;
let mockWorkerListeners = {};

vi.mock("bullmq", () => ({
  Queue: vi.fn().mockImplementation(function () {
    this.count = vi.fn().mockResolvedValue(0);
  }),
  Worker: vi.fn().mockImplementation(function (queueName, processor, opts) {
    mockWorkerHandler = processor;
    this.on = vi.fn((event, handler) => {
      mockWorkerListeners[event] = handler;
    });
  }),
}));

vi.mock("../../../configs/redis.js", () => ({
  default: vi.fn().mockReturnValue({}),
}));

vi.mock("../../../models/videos.model.js", () => ({
  default: {
    findByIdAndUpdate: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock("../../../services/ffmpegServices/ffmpegRunner.js", () => ({
  default: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../../services/storageServices/uploadToObjectStorage.js", () => ({
  uploadToCloudinary: vi.fn().mockResolvedValue("https://res.cloudinary.com/demo/video/master.m3u8"),
}));

vi.mock("../../../utils/cleanUpHandler.js", () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock("node:fs/promises", () => ({
  default: {
    mkdir: vi.fn().mockResolvedValue(true),
  },
}));

import Video from "../../../models/videos.model.js";
import ffmpegRunner from "../../../services/ffmpegServices/ffmpegRunner.js";
import { uploadToCloudinary } from "../../../services/storageServices/uploadToObjectStorage.js";
import cleanUpFiles from "../../../utils/cleanUpHandler.js";

// Import worker module to register mocks
await import("../../../workers/video.worker.js");

describe("video.worker (BullMQ Transcoding Worker Unit Test)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should process a video successfully and mark it as READY with stream URL", async () => {
    const job = {
      id: "job-101",
      data: {
        videoId: "video-101",
        inputFilePath: "public/data/clientUploads/input.mp4",
      },
    };

    await mockWorkerHandler(job);

    expect(Video.findByIdAndUpdate).toHaveBeenCalledWith("video-101", { status: "PROCESSING" });
    expect(ffmpegRunner).toHaveBeenCalled();
    expect(uploadToCloudinary).toHaveBeenCalled();
    expect(Video.findByIdAndUpdate).toHaveBeenCalledWith("video-101", {
      status: "READY",
      streamPlaylistUrl: "https://res.cloudinary.com/demo/video/master.m3u8",
    });
    expect(cleanUpFiles).toHaveBeenCalledWith("public/data/clientUploads/input.mp4", "public/data/processed/video-101");
  });

  it("should record failureReason and update status to FAILED when FFmpeg processing fails", async () => {
    ffmpegRunner.mockRejectedValueOnce(new Error("FFmpeg transcode stream error"));

    const job = {
      id: "job-102",
      data: {
        videoId: "video-102",
        inputFilePath: "public/data/clientUploads/bad.mp4",
      },
    };

    await expect(mockWorkerHandler(job)).rejects.toThrow("FFmpeg transcode stream error");

    expect(Video.findByIdAndUpdate).toHaveBeenCalledWith("video-102", {
      status: "FAILED",
      failureReason: "FFmpeg transcode stream error",
    });
    expect(cleanUpFiles).toHaveBeenCalledWith("public/data/clientUploads/bad.mp4", "public/data/processed/video-102");
  });

  it("should handle the permanent 'failed' event when job exhausts retries", async () => {
    const job = {
      id: "job-103",
      data: {
        videoId: "video-103",
      },
    };

    const failedListener = mockWorkerListeners["failed"];
    expect(failedListener).toBeDefined();

    await failedListener(job, new Error("Max retries exceeded"));

    expect(Video.findByIdAndUpdate).toHaveBeenCalledWith("video-103", {
      status: "FAILED",
      failureReason: "Max retries exceeded",
    });
  });
});
