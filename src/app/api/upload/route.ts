import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Define allowed file types and size limit
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = [
  // Images
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".bmp",
  // Videos
  ".mp4",
  ".webm",
  ".mov",
  ".avi",
  ".mkv",
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds limit of ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
        },
        { status: 400 }
      );
    }

    // Get file extension and check if it's allowed
    const originalName = file.name;
    const fileExt = path.extname(originalName).toLowerCase();

    if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
      return NextResponse.json(
        { error: `File type ${fileExt} is not allowed` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a unique filename with original extension
    const fileName = `${uuidv4()}${fileExt}`;

    // Create the upload path
    const uploadDir = path.join(process.cwd(), "public", "upload");

    // Ensure the upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);

    // Save the file
    await writeFile(filePath, buffer);

    // Determine if it's a video or image
    const isVideo = [".mp4", ".webm", ".mov", ".avi", ".mkv"].includes(fileExt);

    // Return the path that can be stored in the database
    // This will be relative to the public folder
    const publicPath = `/upload/${fileName}`;

    return NextResponse.json({
      success: true,
      filePath: publicPath,
      fileType: isVideo ? "video" : "image",
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
