import axios from "axios";
import ToastService from "./toastService";
import { API_URLS } from "../shared/utils/api-urls";
import type { DocumentInterface } from "../shared/interface/DocumentInterface";

// Define the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Utility function to extract filename from Content-Disposition header
function extractFilenameFromDisposition(
  disposition: string | undefined,
  fallback: string
): string {
  if (!disposition) return fallback;
  const regex = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/;
  const match = regex.exec(disposition);
  if (match) {
    if (match[1]) {
      return decodeURIComponent(match[1]);
    } else if (match[2]) {
      return match[2].replace(/"/g, "");
    }
  }
  return fallback;
}

// Function to download a document by its ID
export const downloadDocumentById = async (
  file: DocumentInterface
): Promise<void> => {
  try {
    const response = await axios.get(
      `${API_URL}${API_URLS.DOCUMENTS}/download/${file.documentFileId}`,
      {
        responseType: "blob", // Important for downloading binary data
      }
    );

    // ✅ Try different ways to access content-disposition header
    const disposition =
      response.headers["content-disposition"] ||
      response.headers["Content-Disposition"];

    let filename = `${file?.name || import.meta.env.VITE_ATS_DOCUMENT}`;

    if (disposition) {
      filename = extractFilenameFromDisposition(disposition, filename);
    } else {
      console.warn(
        "Content-Disposition header not found, using fallback filename."
      );
    }

    // ✅ Create a URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    ToastService.showSuccess(`Document "${filename}" downloaded successfully.`);
  } catch (error) {
    console.error("Download error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred during document download.";
    ToastService.showError(message);
    throw error;
  }
};
