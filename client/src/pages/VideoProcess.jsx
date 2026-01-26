import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import useVideoProcess from "../hooks/videoProcessTools/useVideoProcess";

const ACTIONS = {
  VIDEO_RESIZE: "video-resize",
  AUDIO_EXTRACT: "audio-extract",
  FORMAT_CONVERT: "format-convert",
};

function VideoProcess() {
  const { loading, error: apiError, processVid } = useVideoProcess();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      action: ACTIONS.VIDEO_RESIZE,
      targetFormat: "mp4",
      resolution: "360",
      video: null,
    },
  });

  const action = watch("action");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("video", data.video[0]);
    formData.append("action", data.action);
    formData.append("targetFormat", data.targetFormat);

    if (data.action === ACTIONS.VIDEO_RESIZE) {
      formData.append("resolution", data.resolution);
    }

    const res = await processVid(formData);

    if (!res.success) {
      toast.error(res.message);
      setError("root", { message: res.message });
      return;
    }

    toast.success(res.message);
    reset(); // full reset ONLY on success
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <Link to="/" className="text-blue-500 underline">
        Go to home
      </Link>

      <h2 className="text-xl font-semibold">Video Process</h2>

      {/* FORM SECTON STARTS HERE */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 border p-4 rounded"
      >
        {/* VIDEO SELECTION SECTION STARTS HERE */}
        <div>
          <label className="block font-medium">Input Video</label>
          <input
            type="file"
            accept="video/*"
            {...register("video", {
              required: "Video file is required",
            })}
          />
          {errors.video && (
            <p className="text-red-500 text-sm">{errors.video.message}</p>
          )}
        </div>
        {/* VIDEO SELECTION SECTION ENDS HERE */}

        {/* ACTION SELECTION SECTION STARTS HERE */}
        <div>
          <label htmlFor="action" className="block font-medium">Action</label>
          <select {...register("action")} className="border px-2 py-1 w-full">
            <option value={ACTIONS.VIDEO_RESIZE}>Video Resize</option>
            <option value={ACTIONS.FORMAT_CONVERT}>Format Convert</option>
            <option value={ACTIONS.AUDIO_EXTRACT}>Audio Extract</option>
          </select>
        </div>
        {/* ACTION SELECTION SECTION ENDS HERE */}

        {/* RESOLUTION SECTION STARTS HERE */}
        {action === ACTIONS.VIDEO_RESIZE && (
          <div>
            <label className="block font-medium">Resolution</label>
            <select
              {...register("resolution")}
              className="border px-2 py-1 w-full"
            >
              <option value="240">240p</option>
              <option value="360">360p</option>
              <option value="480">480p</option>
              <option value="720">720p</option>
              <option value="1080">1080p</option>
            </select>
          </div>
        )}
        {/* RESOLUTION SECTION ENDS HERE */}

        {/* TARGET FORMAT SECTION STARTS HERE */}
        <div>
          <label className="block font-medium">Target Format</label>
          <select
            {...register("targetFormat")}
            className="border px-2 py-1 w-full"
          >
            {action === ACTIONS.FORMAT_CONVERT && (
              <>
                <option value="mp4">mp4</option>
                <option value="mkv">mkv</option>
              </>
            )}

            {action === ACTIONS.AUDIO_EXTRACT && (
              <option value="mp3">mp3</option>
            )}

            {action === ACTIONS.VIDEO_RESIZE && (
              <option value="mp4">mp4</option>
            )}
          </select>
        </div>
        {/* TARGET FORMAT SECTION ENDS HERE */}

        {/* API ERROR DISPLAY SECTION STARTS HERE */}
        {(errors.root || apiError) && (
          <p className="text-red-600 text-sm">
            {errors.root?.message || apiError}
          </p>
        )}
        {/* API ERROR DISPLAY SECTION ENDS HERE */}

        {/* SUBMIT BUTTON SECION STARTS HERE */}
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Processing..." : "Convert"}
        </button>
        {/* SUBMIT BUTTON SECTION ENDS HERE */}

      </form>
      {/* FORM SECTON ENDS HERE */}

    </div>
  );
}

export default VideoProcess;
