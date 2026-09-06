import { Loader2, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function StatusBadge({ status }) {
  let badgeClasses = "px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 backdrop-blur-md ";
  let content = null;

  switch (status) {
    case "QUEUED":
      badgeClasses += "bg-neutral-800/90 text-neutral-300 border border-neutral-700/60";
      content = (
        <>
          <Clock size={12} className="text-neutral-400" />
          Queued
        </>
      );
      break;
    case "PROCESSING":
      badgeClasses += "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      content = (
        <>
          <Loader2 size={12} className="animate-spin text-amber-400" />
          Processing
        </>
      );
      break;
    case "READY":
      badgeClasses += "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
      content = (
        <>
          <CheckCircle2 size={12} className="text-emerald-400" />
          Ready
        </>
      );
      break;
    case "FAILED":
      badgeClasses += "bg-red-500/15 text-red-400 border border-red-500/40 shadow-sm";
      content = (
        <>
          <XCircle size={12} className="text-red-400" />
          Failed
        </>
      );
      break;
    default:
      badgeClasses += "bg-neutral-800 text-neutral-300 border border-neutral-700";
      content = "Unknown";
  }

  return (
    <span className={badgeClasses}>
      {content}
    </span>
  );
}
