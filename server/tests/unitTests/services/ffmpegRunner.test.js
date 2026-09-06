import { describe, expect, it, vi, beforeEach } from "vitest";
import { EventEmitter } from "node:events";

vi.mock("node:child_process", () => ({
  spawn: vi.fn(),
}));

import { spawn } from "node:child_process";
import ffmpegRunner from "../../../services/ffmpegServices/ffmpegRunner.js";

describe("ffmpegRunner (FFmpeg execution wrapper unit test)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should resolve when ffmpeg exits with code 0", async () => {
    const mockProcess = new EventEmitter();
    mockProcess.stderr = new EventEmitter();
    mockProcess.kill = vi.fn();

    spawn.mockReturnValue(mockProcess);

    const runnerPromise = ffmpegRunner(["-i", "input.mp4", "output.mp4"]);

    mockProcess.emit("close", 0, null);

    await expect(runnerPromise).resolves.toBeUndefined();
  });

  it("should reject with AppError when ffmpeg exits with non-zero code", async () => {
    const mockProcess = new EventEmitter();
    mockProcess.stderr = new EventEmitter();
    mockProcess.kill = vi.fn();

    spawn.mockReturnValue(mockProcess);

    const runnerPromise = ffmpegRunner(["-i", "bad.mp4", "output.mp4"]);

    mockProcess.stderr.emit("data", "Error decoding audio stream");
    mockProcess.emit("close", 1, null);

    await expect(runnerPromise).rejects.toMatchObject({
      statusCode: 500,
      code: "FFMPEG_FAILED",
      message: "FFmpeg failed to process media.",
    });
  });

  it("should terminate process with SIGKILL and reject with FFMPEG_TIMEOUT when execution exceeds timeoutMs", async () => {
    vi.useFakeTimers();

    const mockProcess = new EventEmitter();
    mockProcess.stderr = new EventEmitter();
    mockProcess.kill = vi.fn();

    spawn.mockReturnValue(mockProcess);

    const runnerPromise = ffmpegRunner(["-i", "hang.mp4", "output.mp4"], 5000);

    // Fast-forward timer past 5000ms
    vi.advanceTimersByTime(5001);

    await expect(runnerPromise).rejects.toMatchObject({
      statusCode: 500,
      code: "FFMPEG_TIMEOUT",
    });

    expect(mockProcess.kill).toHaveBeenCalledWith("SIGKILL");

    vi.useRealTimers();
  });
});
