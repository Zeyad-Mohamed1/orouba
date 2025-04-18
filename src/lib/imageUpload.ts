/**
 * Uploads a file (image or video) to the server
 * @param file The file to upload
 * @returns The path to the uploaded file
 */
export async function uploadFile(file: File): Promise<string> {
  try {
    if (!file) return "";

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to upload file");
    }

    const data = await response.json();
    return data.filePath;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Handles multiple file uploads (images or videos)
 * @param files An array of files to upload
 * @returns An array of paths to the uploaded files
 */
export async function uploadMultipleFiles(files: File[]): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadFile(file));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
}

// Keep the original function names for backward compatibility
export const uploadImage = uploadFile;
export const uploadMultipleImages = uploadMultipleFiles;
