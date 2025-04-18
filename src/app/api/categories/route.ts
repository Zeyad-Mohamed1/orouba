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
    // Process FormData
    const formData = await request.formData();

    // Extract category data from the form data
    const name_ar = formData.get("name_ar") as string;
    const name_en = formData.get("name_en") as string;
    const description_ar = formData.get("description_ar") as string;
    const description_en = formData.get("description_en") as string;
    const brand_id = formData.get("brand_id") as string;
    const image = formData.get("image") as File | null;

    // Validate required fields
    if (!name_ar || !name_en || !brand_id || !image) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate brand_id is a valid integer
    const brandId = parseInt(brand_id);
    if (isNaN(brandId)) {
      return NextResponse.json({ error: "Invalid brand ID" }, { status: 400 });
    }

    // Check if brand exists
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Save image file
    let image_path = null;
    if (image) {
      // Define upload directory
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "categories"
      );

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
          default:
            return file.name.includes(".")
              ? file.name
                  .split(".")
                  .pop()
                  ?.replace(/[^a-zA-Z0-9]/g, "") || "jpg"
              : "jpg";
        }
      };

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with proper extension
      const uniqueId = uuidv4();
      const extension = getExtensionFromMimeType(image);
      const filename = `category_${uniqueId}.${extension}`;
      const filepath = path.join(uploadDir, filename);

      // Write file to the server
      await writeFile(filepath, buffer);

      // Store the public URL path
      image_path = `/uploads/categories/${filename}`;
    }

    // Create the category in the database
    const category = await prisma.category.create({
      data: {
        name_ar,
        name_en,
        description_ar,
        description_en,
        image: image_path!,
        brand_id: brandId,
      },
      include: {
        brand: true,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name_en: true,
        name_ar: true,
        image: true,
        created_at: true,
        brand: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
          },
        },
      },
      orderBy: {
        name_en: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
