import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import AppError from "../utils/AppError.js";
import { statusCodes } from "../constants/statusCodes.js";

const tempDir = path.join(process.cwd(), "public/data/clientUploads");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// 100 MB default max file limit
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE_BYTES, 10) || 100 * 1024 * 1024;

// CONFIG MULTER WITH EARLY REJECTION
const uploads = multer({
  dest: "public/data/clientUploads/",
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    // Reject non-video files immediately before storing chunks on disk
    if (!file.mimetype || !file.mimetype.startsWith("video/")) {
      return cb(
        new AppError({
          statusCode: statusCodes.UNSUPPORTED_MEDIA_TYPE,
          code: "UNSUPPORTED_MEDIA_TYPE",
          message: "Only video files (e.g. MP4, MOV, MKV, WebM) are permitted for upload.",
          errors: [{ field: file.fieldname || "video", message: `Invalid mime-type: "${file.mimetype}"` }],
        }),
        false,
      );
    }
    cb(null, true);
  },
});

export default uploads;