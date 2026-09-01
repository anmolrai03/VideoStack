import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Hls from "hls.js";
import { useAuthContext } from "../../contexts/AuthContext/AuthContext";
import { useDeleteVideo } from "../../hooks/videos/video.hooks";
import api from "../../apis/setup/api";
import videosURLs from "../../constants/APIConstants/videosURLs";
import { Loader2, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "../../components/StatusBadge/StatusBadge";

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { execute: deleteVideo } = useDeleteVideo();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchVideo = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      // The API doesn't have a direct GET /api/videos/:id exposed in the prompt,
      // but there is GET /api/videos/stream/:videoId. Wait, actually we can get status or we might need to rely on stream endpoint
      // Let's assume the endpoint GET /api/videos/user or we fetch from stream
      const res = await api.get(`/api/videos/stream/${id}`);
      if (res.data.success) {
        setVideo({
          _id: id,
          streamPlaylistUrl: res.data.data.url,
          status: "READY" // if stream is available, it's ready.
        });
        setLoading(false);
      } else {
        setError("Failed to fetch video stream");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // If not found in stream, maybe it's still processing. Let's check status.
        try {
          const statusRes = await api.get(`/api/videos/user/status/${id}`);
          if (statusRes.data.success) {
            setVideo({ _id: id, status: statusRes.data.data.status });
          } else {
            setError(statusRes.data.message);
          }
        } catch (statusErr) {
          setError(statusErr.response?.data?.message || "Video not found");
        }
      } else {
        setError(err.response?.data?.message || "An error occurred");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo(true);
  }, [id]);

  useEffect(() => {
    // Poll if video is queued or processing
    if (video && (video.status === "QUEUED" || video.status === "PROCESSING")) {
      intervalRef.current = setInterval(() => {
        fetchVideo(false);
      }, 5000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [video?.status]);

  useEffect(() => {
    if (video?.status === "READY" && video?.streamPlaylistUrl && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(video.streamPlaylistUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Optional: auto-play
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
        // Fallback for Safari
        videoRef.current.src = video.streamPlaylistUrl;
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [video?.status, video?.streamPlaylistUrl]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      const res = await deleteVideo(id);
      if (res.success) {
        toast.success(res.message);
        navigate("/my-videos");
      } else {
        toast.error(res.message);
      }
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-24 px-6 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background pt-24 px-6 text-center text-red-500">
        <h2 className="text-2xl mb-4">Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)} className="mt-6 text-white hover:underline">Go Back</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white pt-24 pb-12 px-6 md:px-12 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="aspect-video bg-black flex items-center justify-center relative">
          {video.status === "READY" ? (
            <video 
              ref={videoRef}
              controls 
              className="w-full h-full object-contain"
              autoPlay
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <StatusBadge status={video.status} />
              <p className="text-neutral-400 text-sm">
                {video.status === "FAILED" ? "Video processing failed." : "This video is currently being processed. Please wait..."}
              </p>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-medium mb-2">{video.title || "Video Details"}</h1>
            {video.description && (
              <p className="text-neutral-400 text-sm">{video.description}</p>
            )}
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
