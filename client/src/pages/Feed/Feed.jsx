import { useEffect, useState } from "react";
import VideoBox from "../../components/VideoBox/VideoBox";

import { useGetAllVideos } from "../../hooks/videos/video.hooks.js";

import Loading from "../Loading/Loading";
import { toast } from "sonner"; // Fixed import

export default function Feed() {
  const { execute: getAllVideos, loading: apiLoading } = useGetAllVideos();

  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await getAllVideos();
      if (res?.success) {
        toast.success(res.message || "Videos loaded successfully!");
        setVideos(res.data || []);
      } else {
        setError(res?.message || "Failed to load videos");
        toast.error(res?.message || "Failed to load videos");
      }
    };

    fetchVideos();
  }, [getAllVideos]);

  if (apiLoading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen bg-(--bg-canvas) p-6 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] p-6">
      <h1 className="text-2xl font-light text-[var(--text-primary)] mb-8">
        Video Feed
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.length > 0 ? (
          videos.map((video, index) => (
            <VideoBox
              key={video._id || index + 235}
              videoId={video._id}
              title={video.title}
              thumbnail={video.thumbnail}
              createdAt={video.createdAt}
              owner={video.owner}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No videos found
          </p>
        )}
      </div>
    </div>
  );
}
