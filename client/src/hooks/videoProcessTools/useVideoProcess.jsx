import { useState } from "react";
import processVideoAPI from "../../apis/videoProcessTools/processVideoAPI";
import triggerDownload from "../../utils/triggerDownload";

function useVideoProcess() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const processVid = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await processVideoAPI(formData);
      // console.log(response);

      // IF RESPONSE IF A TEXT
      if (response.status !== 200) {
        const text = await response.data.text();
        const jsonRes = JSON.parse(text);

        // console.log("Text response: ", jsonRes)

        return {
          success: false,
          message: jsonRes.message || "Error Received by the API",
        };
      }

      const fileName = triggerDownload(response);

      return {
        success: true,
        message: `File downloaded ${fileName}`,
      };

    } catch (error) {
      console.log("[useVIDPROCESS error:] ", error);
      return {
        success: false,
        message: error?.message,
      };
    } finally {
      setLoading(false);
    }
  };
  return { loading, error, processVid };
}

export default useVideoProcess;
