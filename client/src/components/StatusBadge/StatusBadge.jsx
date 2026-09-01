import { Loader2 } from "lucide-react";

export default function StatusBadge({ status }) {
  let badgeClasses = "px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 ";
  let content = null;

  switch (status) {
    case "QUEUED":
      badgeClasses += "bg-neutral-800 text-neutral-300 border border-neutral-700";
      content = "Queued";
      break;
    case "PROCESSING":
      badgeClasses += "bg-amber-900/40 text-amber-500 border border-amber-900/50";
      content = (
        <>
          <Loader2 size={12} className="animate-spin" />
          Processing
        </>
      );
      break;
    case "READY":
      badgeClasses += "bg-emerald-900/40 text-emerald-500 border border-emerald-900/50";
      content = "Ready";
      break;
    case "FAILED":
      badgeClasses += "bg-red-900/40 text-red-500 border border-red-900/50";
      content = "Failed";
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
