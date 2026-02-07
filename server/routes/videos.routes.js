import express from "express";
import uploads from "../middlewares/multer.middleware.js";

import { uploadVideoController , getUserVideosController, deleteVideoController } from "../controller/videos.controller.js";

const router = express.Router();

router.post("/upload",uploads.single("video"), uploadVideoController);
router.get("/user", getUserVideosController);
router.delete("/delete/:id", deleteVideoController);


export default router;