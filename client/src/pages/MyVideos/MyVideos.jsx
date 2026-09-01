import { useEffect, useState, useRef } from "react";
import { useGetUserVideo, useDeleteVideo } from "../../hooks/videos/video.hooks";
import VideoCard from "../../components/VideoCard/VideoCard";
import { FileVideo, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function MyVideos() {
  const { execute: getUserVideos, loading: initialLoading } = useGetUserVideo();
  const { execute: deleteVideo } = useDeleteVideo();
  
  const [videos, setVideos] = useState([]);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchVideos = async (isInitial = false) => {
    const res = await getUserVideos();
    if (res.success) {
      const data = res.data || [];
      setVideos(data);
      // Check if polling is needed
      const needsPolling = data.some(v => v.status === "QUEUED" || v.status === "PROCESSING");
      setIsPolling(needsPolling);
    } else {
      if (res.code !== "NO_VIDEOS_FOUND") {
        setError(res.message);
      } else {
        setVideos([]);
        setIsPolling(false);
      }
    }
  };

  useEffect(() => {
    fetchVideos(true);
  }, []);

  useEffect(() => {
    if (isPolling) {
      intervalRef.current = setInterval(() => {
        fetchVideos(false);
      }, 5000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPolling]);

  const handleDelete = async (e, videoId) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigating to VideoPlayer
    
    if (window.confirm("Are you sure you want to delete this video?")) {
      const res = await deleteVideo(videoId);
      if (res.success) {
        toast.success(res.message);
        setVideos(videos.filter(v => v._id !== videoId));
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <main className="min-h-screen bg-background text-white pt-24 pb-12 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-tight">My Videos</h1>
        <p className="text-neutral-400 mt-2">Manage your uploaded content</p>
      </div>

      {initialLoading && videos.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse">
              <div className="aspect-video bg-neutral-900 rounded-xl w-full" />
              <div className="h-4 bg-neutral-900 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">
          <p>{error}</p>
        </div>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="relative group">
              <VideoCard video={video} showStatus={true} />
              <button
                onClick={(e) => handleDelete(e, video._id)}
                className="absolute bottom-16 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
                title="Delete Video"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-neutral-500 gap-4">
          <FileVideo size={48} className="opacity-20" />
          <p>You haven't uploaded any videos yet.</p>
        </div>
      )}
    </main>
  );
}
