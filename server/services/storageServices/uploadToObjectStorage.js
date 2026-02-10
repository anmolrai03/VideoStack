import fs from "node:fs/promises";
import path from "node:path";

import { UPLOAD_PREFIX, CONCURRENCY_LIMIT } from "../../constants/upload.js";
import cloudinary from "../../configs/cloudinary.js";

import debugLog from "../../utils/debugLog.js";

async function uploadToCloudinary(outputFilePath, videoId) {
  videoId = String(videoId);
  let streamPlaylistUrl = null;

  async function recursiveFolderUpload(currDir, baseDir) {
    try {
      const files = await fs.readdir(currDir, { withFileTypes: true });

      const uploadTasks = [];

      for (const file of files) {
        const currFullPath = path.join(currDir, file.name);

        if (file.isDirectory()) {
          await recursiveFolderUpload(currFullPath, baseDir);
        } else {
          const relativePath = path
            .relative(baseDir, currFullPath)
            .replace(/\\/g, "/");

          uploadTasks.push(async () => {
            const res = await cloudinary.uploader.upload(currFullPath, {
              resource_type: "raw",
              public_id: `${UPLOAD_PREFIX}/${videoId}/${relativePath}`,
              overwrite: true,
            });
            if (relativePath === "master.m3u8") {
              streamPlaylistUrl = res.secure_url;
            }
          });

        }
      }

      debugLog("uploaded tesks" , uploadTasks);
      await uploadInBatch(uploadTasks);
    } catch (error) {
      console.log("[RECURIVE FOLDER UPLOAD ERROR]: ", error.message);
      throw error;
    }
  }

  await recursiveFolderUpload(outputFilePath, outputFilePath);
  return streamPlaylistUrl;
}

async function uploadToB2(outputFilePath) {
  console.log(outputFilePath);
}


async function uploadInBatch(tasks){
  for(let i = 0; i < tasks.length; i += CONCURRENCY_LIMIT){
    const batch = tasks.slice(i , i+CONCURRENCY_LIMIT);
    await Promise.all(batch.map( task => task()));
  }
}


export { uploadToB2, uploadToCloudinary };
