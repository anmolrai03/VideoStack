import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Hls from "hls.js";
import { useAuthContext } from "../../contexts/AuthContext/AuthContext";
import { useDeleteVideo } from "../../hooks/videos/video.hooks";
import api from "../../apis/setup/api";
import { Loader2, Trash2, ArrowLeft, AlertCircle, RefreshCw, UploadCloud, Film } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "../../components/StatusBadge/StatusBadge";

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { execute: deleteVideo } = useDeleteVideo();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchVideo = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      // First try to fetch the active HLS stream
      const res = await api.get(`/api/videos/stream/${id}`);
      if (res.data.success) {
        setVideo((prev) => ({
          ...prev,
          _id: id,
          streamPlaylistUrl: res.data.data.url,
          status: "READY",
        }));
        setLoading(false);
        return;
      }
    } catch (err) {
      // If stream not found (404), fetch status and failure metadata
      if (err.response && err.response.status === 404) {
        try {
          const statusRes = await api.get(`/api/videos/user/status/${id}`);
          if (statusRes.data.success) {
            const data = statusRes.data.data;
            setVideo({
              _id: id,
              status: data.status,
              failureReason: data.failureReason,
              title: data.title,
              description: data.description,
              thumbnail: data.thumbnail,
            });
            setLoading(false);
            return;
          }
        } catch (statusErr) {
          setError(statusErr.response?.data?.message || "Video not found");
        }
      } else {
        setError(err.response?.data?.message || "An error occurred fetching the video.");
      }
      setLoading(false);
    }
  };

  const handleManualRetry = async () => {
    setIsRetrying(true);
    await fetchVideo(false);
    setTimeout(() => {
      setIsRetrying(false);
      toast.info("Status updated");
    }, 600);
  };

  useEffect(() => {
    fetchVideo(true);
  }, [id]);

  useEffect(() => {
    // Poll if video is queued or processing
    if (video && (video.status === "QUEUED" || video.status === "PROCESSING")) {
      intervalRef.current = setInterval(() => {
        fetchVideo(false);
      }, 4000);
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
          // Stream manifest ready
        });
      } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
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
      <main className="min-h-screen bg-background pt-24 px-6 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-neutral-400" size={40} />
        <p className="text-sm text-neutral-500 font-mono">Loading video...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background pt-24 px-6 text-center">
        <div className="max-w-md mx-auto bg-[#0d0d0d] border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-xl font-medium text-white mb-2">Video Unavailable</h2>
          <p className="text-sm text-neutral-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 rounded-xl text-sm font-medium transition-colors"
            >
              Go Back
            </button>
            <Link
              to="/my-videos"
              className="px-4 py-2 bg-white text-black hover:bg-neutral-200 rounded-xl text-sm font-medium transition-colors"
            >
              My Videos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-white pt-24 pb-12 px-6 md:px-12 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 text-sm"
      >
        <ArrowLeft size={16} />
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
          ) : video.status === "FAILED" ? (
            /* Distinct Failed Processing State UI */
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-lg">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 shadow-lg">
                <AlertCircle size={32} />
              </div>
              <div className="mb-2">
                <StatusBadge status="FAILED" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Video Processing Failed</h3>
              <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                The video transcoding worker encountered an error while generating multi-resolution HLS streams.
              </p>

              {video.failureReason && (
                <div className="w-full bg-red-950/20 border border-red-900/40 rounded-xl p-3 mb-6 text-left">
                  <p className="text-xs font-mono text-red-400 uppercase tracking-wider mb-1 font-semibold">Failure Details</p>
                  <p className="text-xs font-mono text-neutral-300 break-words">{video.failureReason}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleManualRetry}
                  disabled={isRetrying}
                  className="px-4 py-2 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800 text-white rounded-xl text-sm font-medium transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isRetrying ? "animate-spin text-blue-400" : ""} />
                  {isRetrying ? "Checking..." : "Check Status"}
                </button>
                <Link
                  to="/upload"
                  className="px-4 py-2 bg-white text-black hover:bg-neutral-200 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-md active:scale-95"
                >
                  <UploadCloud size={14} />
                  Re-upload Video
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-medium transition-all flex items-center gap-2 active:scale-95"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            /* Queued / Processing State UI */
            <div className="flex flex-col items-center justify-center text-center p-8 max-w-md gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-lg">
                <Loader2 size={32} className="animate-spin" />
              </div>
              <StatusBadge status={video.status} />
              <div>
                <h3 className="text-lg font-medium text-white mb-1">
                  {video.status === "QUEUED" ? "Queued for Transcoding" : "Processing Adaptive HLS Streams"}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  Generating 360p, 480p, 720p, and 1080p stream renditions. This page will automatically update once processing completes.
                </p>
              </div>
              <button
                onClick={handleManualRetry}
                className="mt-2 text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono"
              >
                <RefreshCw size={12} className={isRetrying ? "animate-spin" : ""} />
                Check now
              </button>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-tight mb-2">{video.title || "Video Details"}</h1>
            {video.description && (
              <p className="text-neutral-400 text-sm leading-relaxed">{video.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-colors text-sm font-medium"
            >
              <Trash2 size={16} />
              Delete Video
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
