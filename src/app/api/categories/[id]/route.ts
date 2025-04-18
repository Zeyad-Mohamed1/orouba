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

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

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
    if (!name_ar || !name_en || !brand_id) {
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

    // Prepare update data
    const updateData: any = {
      name_ar,
      name_en,
      description_ar,
      description_en,
      brand_id: brandId,
    };

    // Process new image if provided
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

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with proper extension
      const uniqueId = uuidv4();
      const extension = getExtensionFromMimeType(image);
      const filename = `category_${uniqueId}.${extension}`;
      const filepath = path.join(uploadDir, filename);

      // Write file to the server
      await writeFile(filepath, buffer);

      // Delete old image file if exists
      if (existingCategory.image) {
        await deleteImageFile(existingCategory.image);
      }

      // Update image path
      updateData.image = `/uploads/categories/${filename}`;
    }

    // Update the category in the database
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        brand: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
          },
        },
      },
    });

    return NextResponse.json({ category: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Find the category to get the image path before deletion
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if there are products associated with this category
    const productsCount = await prisma.product.count({
      where: { category_id: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete category with associated products. Remove all products first.",
        },
        { status: 400 }
      );
    }

    // Delete the image file if it exists
    if (category.image) {
      await deleteImageFile(category.image);
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
