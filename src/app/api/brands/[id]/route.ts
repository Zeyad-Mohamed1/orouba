import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import {
  deleteImageFile,
  ensureDirectoryExists,
  getExtensionFromMimeType,
} from "@/lib/fileUtils";

// Get a specific brand by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        categories: {
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ brand });
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: 500 }
    );
  }
}

// Update a brand by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Process FormData
    const formData = await request.formData();

    // Extract brand data from the form data
    const name_ar = formData.get("name_ar") as string;
    const name_en = formData.get("name_en") as string;
    const description_ar = formData.get("description_ar") as string;
    const description_en = formData.get("description_en") as string;
    const brand_text_ar = formData.get("brand_text_ar") as string;
    const brand_text_en = formData.get("brand_text_en") as string;
    const color = formData.get("color") as string;

    // File uploads
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

    // Data to update
    const updateData: any = {
      name_ar,
      name_en,
      description_ar,
      description_en,
      brand_text_ar,
      brand_text_en,
      color,
    };

    // Define upload directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", "brands");

    // Ensure upload directory exists
    await ensureDirectoryExists(uploadDir);

    // Save main_image if provided
    if (main_image && main_image.size > 0) {
      // Delete existing main_image if it exists
      await deleteImageFile(existingBrand.main_image);

      const bytes = await main_image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueId = uuidv4();
      const extension = getExtensionFromMimeType(main_image);
      const filename = `main_${uniqueId}.${extension}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      updateData.main_image = `/uploads/brands/${filename}`;
    }

    // Save banner if provided
    if (banner && banner.size > 0) {
      // Delete existing banner if it exists
      await deleteImageFile(existingBrand.banner);

      const bytes = await banner.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueId = uuidv4();
      const extension = getExtensionFromMimeType(banner);
      const filename = `banner_${uniqueId}.${extension}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      updateData.banner = `/uploads/brands/${filename}`;
    }

    // Save small_img if provided
    if (small_img && small_img.size > 0) {
      // Delete existing small_img if it exists
      await deleteImageFile(existingBrand.small_img);

      const bytes = await small_img.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uniqueId = uuidv4();
      const extension = getExtensionFromMimeType(small_img);
      const filename = `small_${uniqueId}.${extension}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      updateData.small_img = `/uploads/brands/${filename}`;
    }

    // Update the brand in the database
    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ brand: updatedBrand }, { status: 200 });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    );
  }
}

// Delete a brand by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Delete associated images
    await deleteImageFile(existingBrand.main_image);
    await deleteImageFile(existingBrand.banner);
    await deleteImageFile(existingBrand.small_img);

    // Delete the brand
    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 }
    );
  }
}
