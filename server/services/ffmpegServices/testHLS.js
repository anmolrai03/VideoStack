import { runMockHLS } from "./videoPresets.js";

const inputFilePath = "public/data/clientUploads/input.mp4";
const videoId = "1234d";

runMockHLS(inputFilePath , videoId);