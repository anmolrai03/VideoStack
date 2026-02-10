import Video from "../models/videos.model.js";

import AppError from "../utils/AppError.js";
import {successResponse} from "../utils/responseHandler.js";

import {statusCodes} from "../constants/statusCodes.js";

import videoQueue from "../queues/video.queue.js";
import debugLog from "../utils/debugLog.js";

const uploadVideoController = async (req , res ,next) => {
  try {

    //GET VIDEO FILE
    const videoData = req.file;

    //VALIDATE VIDEO FILE
    if( !videoData ){
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "MISSING_VIDEO_FILE",
        message: "Video file is required.",
      })
    }

    // GET TITLE AND DESCRIPTION
    const {title , description} = req.body;

    //VALIDATE TITLE
    if( !title || title.trim() === ""){
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code:"TITLE_REQUIRED",
        message: "Title is required."
      });
    }

    //CREATE VIDEO INSTANCE IN DATABASE
    const video = new Video({
      title,description,
      owner: req.clientData.userId,
      status: "QUEUED"
    });

    //SAVE TO DB
    await video.save();

    debugLog("sending to worker que");

    // CALL BACKGROUDN PROCESS BULLMQ TO HANDLE TASKS 
    await videoQueue.add("generate-hls-video", {videoId: video._id , inputFilePath: videoData.path});
    debugLog("sent")

    // RETURN RESPONSE
    return successResponse(
      res,
      statusCodes.ACCEPTED,
      "VIDEO_UPLOAD_ACCEPTED",
      "Video upload accepted."
    );

  } catch (error) {
    next(error);
  }
};

const getUserVideosController = async (req , res , next) => {
  res.send("get user video")
};

const deleteVideoController = async(req , res, next) => {
  const {id} = req.params;
  const {userId} = req.clientData;
  res.send(`Delete video with id: ${id} for user id: ${userId}`);
};


export {uploadVideoController , getUserVideosController, deleteVideoController};