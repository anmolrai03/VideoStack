import express from "express";
import uploads from "../middlewares/multer.middleware.js";

import {
  uploadVideoController,
  getUserVideosController,
  deleteVideoController,
  getVideoStatusController,
  getHomeFeedController,
  getStreamUrl,
} from "../controller/videos.controller.js";

const router = express.Router();

router.post("/upload", uploads.single("video"), uploadVideoController);

router.get("/", getHomeFeedController);
router.get("/stream/:videoId", getStreamUrl);

router.get("/user", getUserVideosController);
router.delete("/user/delete/:videoId", deleteVideoController);
router.get("/user/status/:videoId", getVideoStatusController);

export default router;
