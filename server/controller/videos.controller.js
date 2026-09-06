import Video from "../models/videos.model.js";

import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/responseHandler.js";
import { statusCodes } from "../constants/statusCodes.js";

import videoQueue from "../queues/video.queue.js";
import debugLog from "../utils/debugLog.js";
import validateVideoFile from "../services/ffmpegServices/validateMedia.js";
import cleanUpFiles from "../utils/cleanUpHandler.js";

const uploadVideoController = async (req, res, next) => {
  const videoData = req.file;

  try {
    // 1. VALIDATE VIDEO FILE PRESENCE
    if (!videoData) {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "MISSING_VIDEO_FILE",
        message: "Video file is required.",
      });
    }

    // 2. VALIDATE TITLE
    const { title, description } = req.body;
    if (!title || title.trim() === "") {
      await cleanUpFiles(videoData.path);
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "TITLE_REQUIRED",
        message: "Title is required.",
      });
    }

    // 3. EARLY CORRUPT / FAKE VIDEO VALIDATION (Pre-pipeline check)
    const probeResult = await validateVideoFile(videoData.path);
    if (!probeResult.isValid) {
      await cleanUpFiles(videoData.path);
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "CORRUPTED_OR_INVALID_VIDEO",
        message: probeResult.error || "The uploaded file is corrupted or not a valid video.",
        errors: [{ field: "video", message: probeResult.error || "Media validation failed" }],
      });
    }

    // 4. CREATE VIDEO RECORD IN DATABASE
    const video = new Video({
      title: title.trim(),
      description: description?.trim() || "",
      owner: req.clientData.userId,
      status: "QUEUED",
    });

    await video.save();

    // 5. ATTEMPT QUEUE SUBMISSION (Safely handle Redis downtime)
    try {
      debugLog("sending to worker queue");
      await videoQueue.add("generate-hls-video", {
        videoId: video._id,
        inputFilePath: videoData.path,
      });
      debugLog("sent to queue successfully");
    } catch (queueError) {
      console.error("[QUEUE ERROR]: Redis/BullMQ is unreachable:", queueError.message);
      // Clean up orphaned document and uploaded file
      await cleanUpFiles(videoData.path);
      await Video.findByIdAndDelete(video._id);

      throw new AppError({
        statusCode: statusCodes.SERVICE_UNAVAILABLE,
        code: "QUEUE_SERVICE_UNAVAILABLE",
        message: "Video processing queue is temporarily unavailable. Please try again in a few moments.",
      });
    }

    // 6. RETURN RESPONSE
    return successResponse(
      res,
      statusCodes.ACCEPTED,
      "VIDEO_UPLOAD_ACCEPTED",
      "Video upload accepted and queued for processing.",
      {
        videoId: video._id,
        title: video.title,
      },
    );
  } catch (error) {
    next(error);
  }
};

const getUserVideosController = async (req, res, next) => {
  try {
    const { userId } = req.clientData;
    const { status } = req.query;

    const filters = { owner: userId };
    if (status) {
      filters.status = status.toUpperCase();
    }

    debugLog("filters", filters);

    const videos = await Video.find(filters)
      .select("title description thumbnail createdAt status failureReason")
      .sort({ createdAt: -1 })
      .lean();

    if (videos.length < 1) {
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "NO_VIDEOS_FOUND",
        message: "You do not have any uploaded videos.",
      });
    }

    return successResponse(
      res,
      statusCodes.OK,
      "VIDEOS_SENT",
      "Fetched your videos.",
      videos,
    );
  } catch (error) {
    next(error);
  }
};

const deleteVideoController = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { userId } = req.clientData;

    if (!videoId || videoId.trim() === "") {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "VIDEO_ID_MISSING",
        message: "Video Id is missing.",
      });
    }

    const video = await Video.findOne({ _id: videoId, owner: userId });

    if (!video) {
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "VIDEO_NOT_FOUND",
        message: "Video do not exist.",
        errors: [
          { field: "userid", message: "You are not owner of the video." },
        ],
      });
    }

    await Video.findByIdAndDelete(videoId);

    return successResponse(
      res,
      statusCodes.OK,
      "VIDEO_DELETED",
      "Deletion Successful",
    );
  } catch (error) {
    next(error);
  }
};

const getVideoStatusController = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    if (!videoId || videoId.trim() === "") {
      throw new AppError({
        statusCode: statusCodes.BAD_REQUEST,
        code: "VIDEO_ID_MISSING",
        message: "Video Id is missing.",
      });
    }

    const video = await Video.findOne({ _id: videoId })
      .select("status owner failureReason title description thumbnail")
      .lean();

    if (!video) {
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "NOT_FOUND",
        message: "Video not found.",
      });
    }

    if (String(video.owner) !== String(req.clientData.userId)) {
      throw new AppError({
        statusCode: statusCodes.UNAUTHORIZED,
        code: "UNAUTHORIZED",
        message: "This video do not belong to you.",
      });
    }

    return successResponse(
      res,
      statusCodes.OK,
      "STATUS_SENT",
      "Status fetched successfully.",
      {
        status: video.status,
        failureReason: video.failureReason,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail,
      },
    );
  } catch (error) {
    next(error);
  }
};

const getHomeFeedController = async (req, res, next) => {
  try {
    const videos = await Video.find({status: "READY"})
                              .select("title description thumbnail createdAt owner")
                              .populate("owner", "username -_id")
                              .sort({createdAt: -1})
                              .lean();

    if(videos.length < 1){
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "NO_VIDEOS_EXIST",
        message: "No videos to show."
      })
    }

    return successResponse(
      res,
      statusCodes.OK,
      "VIDEOS_SENT",
      "Videos fetched successfully.",
      videos
    )
  } catch (error) {
    next(error);
  }
};

const getStreamUrl = async (req, res, next) => {
  try {
    const {videoId} = req.params;

    const video = await Video.findOne({_id: videoId, status: "READY"}).select("streamPlaylistUrl").lean();

    if(!video){
      throw new AppError({
        statusCode: statusCodes.NOT_FOUND,
        code: "NO_VIDEO_FOUND",
        message: "This video do not exist."
      })
    }

    return successResponse(
      res,
      statusCodes.OK,
      "VIDEO_SENT",
      "Fetched successfully",
      {
        url: video.streamPlaylistUrl
      }
    )

  } catch (error) {
    next(error);
  }
};

export {
  uploadVideoController,
  getUserVideosController,
  deleteVideoController,
  getVideoStatusController,
  getHomeFeedController,
  getStreamUrl,
};
