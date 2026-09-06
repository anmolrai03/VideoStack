import { spawn } from "node:child_process";

/**
 * Validates whether the given file is a valid, uncorrupted video using ffprobe.
 * @param {string} filePath - Absolute or relative path to the uploaded file.
 * @returns {Promise<{ isValid: boolean, error?: string, duration?: number, codec?: string }>}
 */
function validateVideoFile(filePath) {
  return new Promise((resolve) => {
    const probeArgs = [
      "-v",
      "error",
      "-show_entries",
      "format=duration:stream=codec_type,codec_name",
      "-of",
      "json",
      filePath,
    ];

    const probe = spawn("ffprobe", probeArgs);
    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      probe.kill("SIGKILL");
      resolve({ isValid: false, error: "Validation timed out: file may be corrupted or stalled." });
    }, 10000); // 10s max validation timeout

    probe.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    probe.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    probe.on("error", (err) => {
      clearTimeout(timer);
      resolve({ isValid: false, error: err.message });
    });

    probe.on("close", (code) => {
      clearTimeout(timer);

      if (code !== 0) {
        return resolve({
          isValid: false,
          error: stderr.trim() || "Invalid or corrupt media file format.",
        });
      }

      try {
        const metadata = JSON.parse(stdout);
        const hasVideoStream = metadata.streams?.some(
          (stream) => stream.codec_type === "video",
        );

        if (!hasVideoStream) {
          return resolve({
            isValid: false,
            error: "File contains no valid video stream.",
          });
        }

        const duration = parseFloat(metadata.format?.duration || 0);
        return resolve({ isValid: true, duration, streams: metadata.streams });
      } catch (parseErr) {
        return resolve({
          isValid: false,
          error: "Failed to parse video metadata: file corrupted.",
        });
      }
    });
  });
}

export default validateVideoFile;
