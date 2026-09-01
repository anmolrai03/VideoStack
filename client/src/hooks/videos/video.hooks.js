import { useAction } from "../generic/useAction.jsx";

import { deleteUserVideoAPI, getAllVideoAPI, getUserVideoAPI, getVideoStatusAPI, streamVideoAPI, uploadVideoAPI } from "../../apis/videos/video.api.js";

export function useUploadVideo(){
  return useAction(uploadVideoAPI);
}

export function useGetAllVideos() {
  return useAction(getAllVideoAPI);
}

export function useGetUserVideo(){
  return useAction(getUserVideoAPI);
}

export function useDeleteVideo(){
  return useAction(deleteUserVideoAPI);
}

export function useGetVideoStatus(){
  return useAction(getVideoStatusAPI);
}

export function useStreamVideo(){
  return useAction(streamVideoAPI);
}