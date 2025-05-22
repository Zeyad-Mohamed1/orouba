import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
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
    const { id } = await params;
    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
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
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${image.type};base64,${buffer.toString('base64')}`;
      updateData.image = base64Image;
    }

    // Update the category in the database
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
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
    const { id } = await params;
    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Find the category to get the image path before deletion
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if there are products associated with this category
    const productsCount = await prisma.product.count({
      where: { category_id: parseInt(id) },
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

    // Delete the category
    await prisma.category.delete({
      where: { id: parseInt(id) },
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
