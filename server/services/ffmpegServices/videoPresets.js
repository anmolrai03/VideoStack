// CRF = CONSTANT RATE FACTOR , tells encoder hwo much quality to keep , and let ffmpeg decide how many bits are needed to achieve that.

// const VIDEO_PRESETS = {
//   240: {scale: -2 * 240 , crf: 24},
// }
import fs from "node:fs/promises";
import ffmpegRunner from "./ffmpegRunner.js";

export async function runMockHLS(inputFilePath, videoId){

  try {
    const outputFilePath = `public/data/processed/${videoId}`;
    await fs.mkdir(outputFilePath, {recursive: true});

    const resolutions = ["360p" , "480p", "720p" , "1080p"];
    for(const res of resolutions){
      await fs.mkdir(`${outputFilePath}/${res}`, {recursive: true});
    }

    const args = [
      "-i", inputFilePath,
      "-filter_complex", 
      "[0:v]split=4[v1][v2][v3][v4];[v1]scale=w=-2:h=360[v1out];[v2]scale=w=-2:h=480[v2out];[v3]scale=w=-2:h=720[v3out];[v4]scale=w=-2:h=1080[v4out]",

      "-map", "[v1out]", "-c:v:0", "libx264", "-b:v:0", "800k",
      "-map", "[v2out]", "-c:v:1", "libx264", "-b:v:1", "1400k",
      "-map", "[v3out]", "-c:v:2", "libx264", "-b:v:2", "2800k",
      "-map", "[v4out]", "-c:v:3", "libx264", "-b:v:3", "5000k",

      "-map", "0:a", "-c:a:0", "aac", "-b:a:0", "128k",
      "-map", "0:a", "-c:a:1", "aac", "-b:a:1", "128k",
      "-map", "0:a", "-c:a:2", "aac", "-b:a:2", "128k",
      "-map", "0:a", "-c:a:3", "aac", "-b:a:3", "128k",

      "-f", "hls",
      "-hls_time", "6",
      "-hls_playlist_type", "vod",
      "-master_pl_name", "master.m3u8",
      
      "-var_stream_map", "v:0,a:0,name:360p v:1,a:1,name:480p v:2,a:2,name:720p v:3,a:3,name:1080p",
      "-hls_segment_filename", `${outputFilePath}/%v/segment_%03d.ts`,
      `${outputFilePath}/%v/index.m3u8`
    ];

    await ffmpegRunner(args);

    console.log("work done.")
  } catch (error) {
    console.log("error occured in mockHLS" , error.message);
  }
}