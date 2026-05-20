import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UploadCloud, FileVideo } from "lucide-react";
import ActionButton from "../../components/ActionButton/ActionButton";
import InputField from "../../components/InputField/InputField";
import api from "../../apis/setup/api";
import videosURLs from "../../constants/APIConstants/videosURLs";

export default function Upload() {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
    } else {
      toast.error("Please select a valid video file.");
      e.target.value = null;
      setSelectedFile(null);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error("Video file is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("video", selectedFile);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await api.post(videosURLs.UPLOAD_VIDEO_URL, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        toast.success(response.data.message || "Video uploaded successfully");
        reset();
        setSelectedFile(null);
        navigate("/my-videos");
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "An error occurred during upload";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-white pt-24 pb-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-xl bg-[#0a0a0a]/80 p-8 rounded-2xl border border-neutral-800 backdrop-blur-md">
        <h1 className="text-2xl font-light mb-6">Upload Video</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <InputField
            htmlFor="title"
            labelName="TITLE"
            inputType="text"
            placeholder="Give your video a catchy title"
            {...register("title", { required: "Title is required." })}
            error={errors.title?.message}
            disabled={isUploading}
          />

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-xs tracking-wider text-neutral-400 font-medium">
              DESCRIPTION
            </label>
            <textarea
              id="description"
              placeholder="Tell viewers about your video"
              className="bg-transparent border-b border-neutral-800 text-white pb-2 focus:outline-none focus:border-white transition-colors resize-none h-24"
              {...register("description")}
              disabled={isUploading}
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <label className="text-xs tracking-wider text-neutral-400 font-medium">
              VIDEO FILE
            </label>
            <div className="relative border-2 border-dashed border-neutral-800 rounded-xl p-8 hover:border-neutral-600 transition-colors group cursor-pointer text-center flex flex-col items-center justify-center gap-4 bg-neutral-900/30">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              {selectedFile ? (
                <>
                  <FileVideo size={32} className="text-emerald-500" />
                  <div className="text-sm">
                    <span className="font-medium text-white">{selectedFile.name}</span>
                    <p className="text-neutral-500 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud size={32} className="text-neutral-500 group-hover:text-white transition-colors" />
                  <div className="text-sm text-neutral-400">
                    <span className="text-white font-medium">Click to upload</span> or drag and drop
                    <p className="mt-1 text-xs">MP4, MKV, AVI</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {isUploading && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-neutral-400">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <ActionButton
            buttonName={isUploading ? "Uploading..." : "Upload Video"}
            type="submit"
            disabled={isUploading}
            loading={isUploading}
            className="mt-4"
          />
        </form>
      </div>
    </main>
  );
}
