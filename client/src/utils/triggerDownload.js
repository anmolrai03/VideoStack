/**
 * Triggers a browser download from an Axios response (blob).
 * Assumes:
 * - responseType: "blob"
 * - success HTTP status
 */
function triggerDownload(response, fallbackFilename = "output", delayMs = 100) {
  if (!response?.data) {
    throw new Error("No download data received");
  }

  const blob = response.data;
  
  // Validate blob
  if (!(blob instanceof Blob)) {
    throw new Error("Response data is not a valid blob");
  }

  // Extract filename from Content-Disposition header
  let filename = fallbackFilename;
  const contentDisposition = response.headers?.["content-disposition"];
  
  if (contentDisposition) {
    // Handles: filename="name.pdf", filename*=UTF-8''name.pdf, filename=name.pdf
    const match = contentDisposition.match(
      /filename\*?=(?:UTF-8'')?(?:"([^"]*)"|([^;,\n]*))/
    );
    if (match?.[1] || match?.[2]) {
      filename = (match[1] || match[2]).trim();
    }
  }

  // Ensure filename has extension if not present
  if (!filename.includes(".")) {
    const mimeType = blob.type.split("/")[1] || "bin";
    filename += `.${mimeType}`;
  }

  const url = window.URL.createObjectURL(blob);

  try {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = "none";

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Revoke URL after a small delay to ensure download starts
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, delayMs);
  } catch (error) {
    window.URL.revokeObjectURL(url);
    throw new Error(`Download failed: ${error.message}`);
  }

  return filename;
}

export default triggerDownload;