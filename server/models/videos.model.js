import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    title:{
      type: String,
      required: [true , "Title is required!"],
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner of the video is required"],
      index: true
    },

    streamPlaylistUrl: {
      type: String,
      trim: true
    },

    thumbnail:{
      type: String,
    },

    status: {
      type: String,
      enum: ["QUEUED", "PROCESSING", "READY", "FAILED"],
      default: "QUEUED",
    }

  }, {timestamps: true}
)

const Video = mongoose.model("Video" , VideoSchema);

export default Video;