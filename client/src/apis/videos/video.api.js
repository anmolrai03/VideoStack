import api from "../setup/api.js";
import apiCallHandler from "../setup/apiCallHandler.js";

import videosURLs from "../../constants/APIConstants/videosURLs.js"

export function uploadVideoAPI({title, description, video}){
  
  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("video", video);

  return apiCallHandler(
    () => api.post(videosURLs.UPLOAD_VIDEO_URL, formData),
    "Video File Uploaded Successfully."
  )
}

export function getAllVideoAPI(){
  return apiCallHandler(
    () => api.get(videosURLs.GET_ALL_VIDEOS_URL),
    "Video Fetched Successfully."
  )
}

export function getUserVideoAPI(){
  return apiCallHandler(
    () => api.get(videosURLs.USER_VIDEOS_URL),
    "Your videos fetched successfully."
  )
}

export function deleteUserVideoAPI(videoId){
  if(!videoId){
    throw new Error("VideoId is missing.")
  }
  const url = `${videosURLs.DELETE_VIDEO_URL}/${videoId}`;

  return apiCallHandler(
    () => api.delete(url),
    "Deletion success."
  )
}

export function getVideoStatusAPI(videoId){
  if(!videoId){
    throw new Error("VideoId is missing.")
  }
  const url = `${videosURLs.GET_VIDEO_STATUS_URL}/${videoId}`;

  return apiCallHandler(
    () => api.get(url),
    "Fetched status."
  )
}

export function streamVideoAPI(videoId){
  if(!videoId){
    throw new Error("VideoId is missing.")
  }
  const url = `${videosURLs.STREAM_VIDEO_URL}/${videoId}`;

  return apiCallHandler(
    () => api.get(url),
    "Fetched."
  )
}
