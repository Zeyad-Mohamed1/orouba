import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Helper function to ensure directory exists
async function ensureDirectoryExists(dirPath: string) {
  if (!existsSync(dirPath)) {
    await mkdir(dirPath, { recursive: true });
  }
}

// Helper function to get catalog path
function getCatalogPath() {
  return path.join(process.cwd(), "public", "catalog", "orouba-catalog.pdf");
}

export async function GET() {
  try {
    // Define the path to the catalog PDF
    const catalogPath = getCatalogPath();

    // Check if the file exists
    if (!existsSync(catalogPath)) {
      return NextResponse.json({ error: "Catalog not found" }, { status: 404 });
    }

    // Read the file
    const fileBuffer = await readFile(catalogPath);

    // Return the file with proper content type
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=orouba-catalog.pdf",
      },
    });
  } catch (error) {
    console.error("Error serving catalog PDF:", error);
    return NextResponse.json(
      { error: "Failed to serve catalog" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const catalogPath = getCatalogPath();

    // Check if the catalog exists
    if (!existsSync(catalogPath)) {
      return NextResponse.json({ error: "Catalog not found" }, { status: 404 });
    }

    // Delete the catalog
    await unlink(catalogPath);

    return NextResponse.json({
      success: true,
      message: "Catalog deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting catalog:", error);
    return NextResponse.json(
      { error: "Failed to delete catalog" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Process FormData
    const formData = await request.formData();
    const catalogFile = formData.get("catalog") as File;

    if (!catalogFile) {
      return NextResponse.json(
        { error: "No catalog file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    const fileType = catalogFile.type;
    if (fileType !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed for catalog" },
        { status: 400 }
      );
    }

    // Define upload directory and ensure it exists
    const uploadDir = path.join(process.cwd(), "public", "catalog");
    await ensureDirectoryExists(uploadDir);

    // Define the file path
    const filePath = getCatalogPath();

    // Check if an existing catalog exists and delete it
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
        console.log("Existing catalog deleted successfully");
      } catch (deleteError) {
        console.error("Error deleting existing catalog:", deleteError);
        return NextResponse.json(
          { error: "Failed to replace existing catalog" },
          { status: 500 }
        );
      }
    }

    // Convert the file to buffer
    const bytes = await catalogFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Write the file
    await writeFile(filePath, buffer);

    return NextResponse.json(
      {
        success: true,
        message: "Catalog uploaded successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading catalog:", error);
    return NextResponse.json(
      { error: "Failed to upload catalog" },
      { status: 500 }
    );
  }
}
