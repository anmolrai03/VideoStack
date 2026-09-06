import { describe, expect, it, vi, beforeEach } from "vitest";
import { EventEmitter } from "node:events";

vi.mock("node:child_process", () => ({
  spawn: vi.fn(),
}));

import { spawn } from "node:child_process";
import validateVideoFile from "../../../services/ffmpegServices/validateMedia.js";

describe("validateVideoFile (ffprobe media validation unit test)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return isValid: true when ffprobe finds a valid video stream", async () => {
    const mockProcess = new EventEmitter();
    mockProcess.stdout = new EventEmitter();
    mockProcess.stderr = new EventEmitter();
    mockProcess.kill = vi.fn();

    spawn.mockReturnValue(mockProcess);

    const validationPromise = validateVideoFile("test-valid.mp4");

    // Simulate ffprobe output
    mockProcess.stdout.emit(
      "data",
      JSON.stringify({
        streams: [
          { codec_type: "video", codec_name: "h264" },
          { codec_type: "audio", codec_name: "aac" },
        ],
        format: { duration: "42.5" },
      }),
    );
    mockProcess.emit("close", 0);

    const result = await validationPromise;
    expect(result.isValid).toBe(true);
    expect(result.duration).toBe(42.5);
  });

  it("should return isValid: false when file has no video stream (e.g. audio-only)", async () => {
    const mockProcess = new EventEmitter();
    mockProcess.stdout = new EventEmitter();
    mockProcess.stderr = new EventEmitter();
    mockProcess.kill = vi.fn();

    spawn.mockReturnValue(mockProcess);

    const validationPromise = validateVideoFile("audio-only.mp3");

    mockProcess.stdout.emit(
      "data",
      JSON.stringify({
        streams: [{ codec_type: "audio", codec_name: "mp3" }],
        format: { duration: "12.0" },
      }),
    );
    mockProcess.emit("close", 0);

    const result = await validationPromise;
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("contains no valid video stream");
  });

  it("should return isValid: false when ffprobe exits with non-zero code on corrupt file", async () => {
    const mockProcess = new EventEmitter();
    mockProcess.stdout = new EventEmitter();
    mockProcess.stderr = new EventEmitter();
    mockProcess.kill = vi.fn();

    spawn.mockReturnValue(mockProcess);

    const validationPromise = validateVideoFile("corrupt.mp4");

    mockProcess.stderr.emit("data", "Invalid data found when processing input");
    mockProcess.emit("close", 1);

    const result = await validationPromise;
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("Invalid data found");
  });
});
