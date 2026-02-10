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
  try {
    const {userId} = req.clientData;
    const {status} = req.query;

    const filters = {owner: userId};
    if(status){
      filters.status = status.toUpperCase();
    }

    debugLog("filters" , filters)

    const videos = await Video.find(filters)
                            .select("title description thumbnail createdAt status")
                            .sort({createdAt: -1})
                            .lean();

    if(videos.length < 1){
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "NO_VIDEOS_FOUND",
        message: "You do not have any uploaded videos."
      })
    }

    return successResponse(
      res,
      statusCodes.OK,
      "VIDEOS_SENT",
      "Fetched your videos.",
      videos
    )


  } catch (error) {
    next(error);
  }
};

const deleteVideoController = async(req , res, next) => {
  try {
    const {videoId} = req.params;
    const {userId} = req.clientData;

    if(!videoId || videoId.trim()){
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "VIDEO_ID_MISSING",
        message: "Video Id is missing."
      })
    }

    const video = await Video.findOne({_id: videoId, owner: userId});

    if(!video){
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "VIDEO_NOT_FOUND",
        message: "Video do not exist.",
        errors: [{field: "userid" , message: "You are not owner of the video."}]
      })
    }

    await Video.findByIdAndDelete(videoId);

    return successResponse(
      res,
      statusCodes.OK,
      "VIDEO_DELETED",
      "Deletion Successful"
    );

  } catch (error) {
    next(error);
  }
};

const getVideoStatusController = async (req , res, next) => {
  try {
    const {videoId} = req.params;

    if( !videoId || videoId.trim() === ""){
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "VIDEO_ID_MISSING",
        message: "Video Id is missing."
      })
    }

    const video = await Video.findOne({_id: videoId}).select("status owner").lean();

    if(!video){
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "NOT_FOUND",
        message: "Video not found."
      })
    }

    if( String(video.owner) !== String(req.clientData.userId) ){
      throw new AppError({
        statusCode: statusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "This video do not belong to you."
      })
    }

    return successResponse(
      res,
      statusCodes.OK,
      "STATUS_SENT",
      "Status fetched successfully.",
      {status: video.status}
    )

  } catch (error) {
    next(error);
  }
}


export {uploadVideoController , getUserVideosController, deleteVideoController, getVideoStatusController};