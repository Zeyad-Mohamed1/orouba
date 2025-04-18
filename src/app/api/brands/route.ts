import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Helper function to ensure directory exists
async function ensureDirectoryExists(dirPath: string) {
  try {
    await fs.promises.access(dirPath);
  } catch (error) {
    // Directory doesn't exist, create it
    await mkdir(dirPath, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Process FormData instead of JSON
    const formData = await request.formData();

    // Extract brand data from the form data
    const name_ar = formData.get("name_ar") as string;
    const name_en = formData.get("name_en") as string;
    const description_ar = formData.get("description_ar") as string;
    const description_en = formData.get("description_en") as string;
    const brand_text_ar = formData.get("brand_text_ar") as string;
    const brand_text_en = formData.get("brand_text_en") as string;
    const color = formData.get("color") as string;

    // File uploads - these will be processed separately
    const main_image = formData.get("main_image") as File | null;
    const banner = formData.get("banner") as File | null;
    const small_img = formData.get("small_img") as File | null;

    // Validate required fields
    if (
      !name_ar ||
      !name_en ||
      !description_ar ||
      !description_en ||
      !brand_text_ar ||
      !brand_text_en ||
      !color
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save uploaded files to the server
    let main_image_path = null;
    let banner_path = null;
    let small_img_path = null;

    // Define upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "brands");

    // Ensure upload directory exists
    await ensureDirectoryExists(uploadDir);

    // Helper function to get file extension from mime type
    const getExtensionFromMimeType = (file: File): string => {
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

    // Save main_image if provided
    if (main_image) {
      const bytes = await main_image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with proper extension
      const uniqueId = uuidv4();
      const extension = getExtensionFromMimeType(main_image);
      const filename = `main_${uniqueId}.${extension}`;
      const filepath = path.join(uploadDir, filename);

      // Write file to the server
      await writeFile(filepath, buffer);

      // Store the public URL path
      main_image_path = `/uploads/brands/${filename}`;
    }

    // Save banner if provided
    if (banner) {
      const bytes = await banner.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with proper extension
      const uniqueId = uuidv4();
      const extension = getExtensionFromMimeType(banner);
      const filename = `banner_${uniqueId}.${extension}`;
      const filepath = path.join(uploadDir, filename);

      // Write file to the server
      await writeFile(filepath, buffer);

      // Store the public URL path
      banner_path = `/uploads/brands/${filename}`;
    }

    // Save small_img if provided
    if (small_img) {
      const bytes = await small_img.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with proper extension
      const uniqueId = uuidv4();
      const extension = getExtensionFromMimeType(small_img);
      const filename = `small_${uniqueId}.${extension}`;
      const filepath = path.join(uploadDir, filename);

      // Write file to the server
      await writeFile(filepath, buffer);

      // Store the public URL path
      small_img_path = `/uploads/brands/${filename}`;
    }

    // Create the brand in the database
    const brand = await prisma.brand.create({
      data: {
        name_ar,
        name_en,
        description_ar,
        description_en,
        brand_text_ar,
        brand_text_en,
        color,
        main_image: main_image_path,
        banner: banner_path,
        small_img: small_img_path,
      },
    });

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: "Failed to create brand" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    // For each brand, format the image URLs to be absolute paths
    const brandsWithFormattedImages = brands.map((brand) => ({
      ...brand,
      main_image: brand.main_image,
      banner: brand.banner,
      small_img: brand.small_img,
    }));

    return NextResponse.json({ brands: brandsWithFormattedImages });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
