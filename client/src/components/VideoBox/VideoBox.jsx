import { Link } from "react-router-dom";

import {  Play } from "lucide-react";

import { formatDistanceToNow } from "date-fns"; // For formatting timestamps

export default function VideoBox({ videoId, title, thumbnail, createdAt, owner }) {
  // Format the timestamp (e.g., "2 days ago")
  const formattedTimestamp = formatDistanceToNow(new Date(createdAt), { addSuffix: true });


  const handleNavigation = () => {
    const video = {
      videoId, title, thumbnail, createdAt, owner
    }
    sessionStorage.setItem(`video_${videoId}`, JSON.stringify(video))
  }


  return (
    <div className="bg-(--bg-card) rounded-lg border border-(--border-subtle) overflow-hidden transition-all hover:border-(--border-visible) hover:shadow-lg">
      {/* Thumbnail with play button */}
      <div className="relative aspect-video bg-black">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
        />
        <Link to={`/stream/${videoId}`} onClick={handleNavigation} className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
          <Play className="w-12 h-12 text-white" />
        </Link>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-(--text-primary) font-medium truncate">
          {title}
        </h3>
        <div className="flex gap-2 text-(--text-muted) text-sm mt-1">
          <span>{owner?.username || "Unknown"}</span>
          <span>•</span>
          <span>{formattedTimestamp}</span>
        </div>
      </div>
    </div>
  );
}
