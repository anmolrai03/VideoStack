import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";
import StatusBadge from "../StatusBadge/StatusBadge";

export default function VideoCard({ video, showStatus = false }) {
  // Format date relative
  const getRelativeTime = (dateString) => {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const daysDifference = Math.round((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (Math.abs(daysDifference) < 1) {
      const hoursDiff = Math.round((new Date(dateString) - new Date()) / (1000 * 60 * 60));
      if (Math.abs(hoursDiff) < 1) return "Just now";
      return rtf.format(hoursDiff, "hour");
    }
    return rtf.format(daysDifference, "day");
  };

  return (
    <Link to={`/video/${video._id}`} className="group flex flex-col gap-3">
      {/* Thumbnail */}
      <div className={`relative aspect-video rounded-xl bg-neutral-900 border ${video.status === "FAILED" ? "border-red-900/60 bg-red-950/10" : "border-neutral-800"} overflow-hidden transition-all duration-300 group-hover:border-neutral-700`}>
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 gap-1.5 p-4 text-center">
            <span className="text-xs font-medium">
              {video.status === "FAILED" ? "Processing Failed" : video.status === "PROCESSING" ? "Transcoding..." : "No Preview"}
            </span>
          </div>
        )}
        
        {showStatus && (
          <div className="absolute top-2 right-2">
            <StatusBadge status={video.status} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className={`text-sm font-medium ${video.status === "FAILED" ? "text-red-300" : "text-white"} line-clamp-2 leading-snug group-hover:text-neutral-300 transition-colors`}>
          {video.title}
        </h3>
        {video.status === "FAILED" && video.failureReason ? (
          <p className="text-xs text-red-400/80 line-clamp-1 font-mono">
            {video.failureReason}
          </p>
        ) : (
          <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5">
            <div className="flex items-center gap-1.5">
              <User size={12} />
              <span className="truncate max-w-[100px]">{video.owner?.username || "Unknown"}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-700"></div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>{getRelativeTime(video.createdAt)}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
