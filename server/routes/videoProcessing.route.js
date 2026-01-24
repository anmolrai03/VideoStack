import express from "express";

import uploads from "../middlewares/multer.middleware.js";
import { processVideo } from "../controller/videoProcessing.controller.js";

const router = express.Router();

router.post("/convert", uploads.single("video") , processVideo);

export default router;