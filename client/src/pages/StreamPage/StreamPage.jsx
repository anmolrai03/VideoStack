import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import Hls from "hls.js";

import { Play, MessageCircle, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import Loading from "../Loading/Loading";
import { useStreamVideo } from "../../hooks/videos/video.hooks";

export default function StreamPage() {
  const { videoId } = useParams();
  const { execute: getStreamLink, loading: streamLoading } = useStreamVideo();

  const [videoLink, setVideoLink] = useState();

  const [videoDetails] = useState(() => {
    const storedVideo = sessionStorage.getItem(`video_${videoId}`);
    return storedVideo ? JSON.parse(storedVideo) : null;
  });

  const videoRef = useRef(null);

  // Fetch video stream link
  useEffect(() => {
    const getLink = async () => {
      const res = await getStreamLink(videoId);
      if (res.success) {
        setVideoLink(res.data.url);
      } else {
        toast.error(res.message);
      }
    };
    getLink();
  }, [getStreamLink, videoId]);

  // Initialize HLS stream
  useEffect(() => {
    if (!videoLink || !videoRef.current) return;

    const videoElement = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoLink);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement
          .play()
          .catch((e) => toast.error("Autoplay blocked. Click to play."));
      });
      hls.on(Hls.Events.ERROR, (e, data) => {
        if (data.fatal) {
          toast.error("Stream error. Reload the page.");
        }
      });
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      videoElement.src = videoLink;
      videoElement.addEventListener("loadedmetadata", () => {
        videoElement
          .play()
          .catch((e) => toast.error("Autoplay blocked. Click to play."));
      });
    }
  }, [videoLink]);

  if (streamLoading || !videoDetails) return <Loading />;

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] flex flex-col md:flex-row">
      {/* Main Video Player */}
      <div className="flex-1 p-4 md:p-6">
        <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border-subtle)] overflow-hidden">
          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              controls
              className="w-full h-full object-cover"
              autoPlay
            />
          </div>

          {/* Video Info */}
          <div className="p-4">
            <h1 className="text-xl font-medium text-[var(--text-primary)]">
              {videoDetails?.title || "Stream Title"}
            </h1>
            <div className="flex gap-4 text-[var(--text-muted)] text-sm mt-2">
              <span>{videoDetails?.owner?.username || "Unknown"}</span>
              <span>•</span>
              <span>
                {formatDistanceToNow(new Date(videoDetails?.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
