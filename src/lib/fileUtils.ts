import { mkdir, unlink } from "fs/promises";
import fs from "fs";
import path from "path";

// Helper function to ensure directory exists
export async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.promises.access(dirPath);
  } catch (error) {
    // Directory doesn't exist, create it
    await mkdir(dirPath, { recursive: true });
  }
}

// Helper function to delete image file
export async function deleteImageFile(imagePath: string | null) {
  if (!imagePath) return;

  try {
    const fullPath = path.join(process.cwd(), "public", imagePath);
    await unlink(fullPath);
  } catch (error) {
    console.error(`Failed to delete image at ${imagePath}:`, error);
  }
}

// Helper function to get file extension from mime type
export const getExtensionFromMimeType = (file: File): string => {
  const type = file.type;
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    case "video/mp4":
      return "mp4";
    default:
      return file.name.includes(".")
        ? file.name
            .split(".")
            .pop()
            ?.replace(/[^a-zA-Z0-9]/g, "") || "jpg"
        : "jpg";
  }
};
