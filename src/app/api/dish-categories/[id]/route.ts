import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from 'fs/promises';
import path from 'path';

// Helper function to validate base64 image
function isValidBase64Image(str: string) {
  try {
    // Check if string starts with data:image
    if (!str.startsWith('data:image/')) {
      return false;
    }
    // Check if it's a valid base64 string
    const base64Regex = /^data:image\/[a-zA-Z]+;base64,([A-Za-z0-9+/=])+$/;
    return base64Regex.test(str);
  } catch {
    return false;
  }
}

// Helper function to convert image to base64
async function convertImageToBase64(imagePath: string): Promise<string | null> {
  try {
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    const imageBuffer = await fs.readFile(fullPath);
    const base64Image = `data:image/${path.extname(imagePath).slice(1)};base64,${imageBuffer.toString('base64')}`;
    return base64Image;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
}

// GET /api/dish-categories/[id] - Get a single dish category
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid dish category ID" },
        { status: 400 }
      );
    }

    const dishCategory = await prisma.dishCategory.findUnique({
      where: { id: parseInt(id) },
    });

    if (!dishCategory) {
      return NextResponse.json(
        { error: "Dish category not found" },
        { status: 404 }
      );
    }

    // Convert image to base64 if it exists
    let responseData = { ...dishCategory };
    if (dishCategory.image) {
      const base64Image = await convertImageToBase64(dishCategory.image);
      if (base64Image) {
        responseData.image = base64Image;
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching dish category:", error);
    return NextResponse.json(
      { error: "Failed to fetch dish category" },
      { status: 500 }
    );
  }
}

// PUT /api/dish-categories/[id] - Update a dish category
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid dish category ID" },
        { status: 400 }
      );
    }

    // Check if dish category exists
    const existingDishCategory = await prisma.dishCategory.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingDishCategory) {
      return NextResponse.json(
        { error: "Dish category not found" },
        { status: 404 }
      );
    }

    // Validate required fields
    if (!body.name_ar || !body.name_en) {
      return NextResponse.json(
        { error: "Name is required in both languages" },
        { status: 400 }
      );
    }

    // Validate base64 image if provided
    if (body.image !== undefined && !isValidBase64Image(body.image)) {
      return NextResponse.json(
        { error: "Invalid base64 image format" },
        { status: 400 }
      );
    }

    const dishCategory = await prisma.dishCategory.update({
      where: { id: parseInt(id) },
      data: {
        name_ar: body.name_ar,
        name_en: body.name_en,
        image: body.image !== undefined ? body.image : existingDishCategory.image,
      },
    });

    return NextResponse.json(dishCategory);
  } catch (error) {
    console.error("Error updating dish category:", error);
    return NextResponse.json(
      { error: "Failed to update dish category" },
      { status: 500 }
    );
  }
}

// DELETE /api/dish-categories/[id] - Delete a dish category
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid dish category ID" },
        { status: 400 }
      );
    }

    // Check if dish category exists
    const dishCategory = await prisma.dishCategory.findUnique({
      where: { id: parseInt(id) },
    });

    if (!dishCategory) {
      return NextResponse.json(
        { error: "Dish category not found" },
        { status: 404 }
      );
    }

    // Check if there are dishes associated with this category
    const dishesCount = await prisma.dish.count({
      where: { dishCategory_id: parseInt(id) },
    });

    if (dishesCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete dish category with associated dishes. Remove all dishes first.",
        },
        { status: 400 }
      );
    }

    // Delete the dish category
    await prisma.dishCategory.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Dish category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting dish category:", error);
    return NextResponse.json(
      { error: "Failed to delete dish category" },
      { status: 500 }
    );
  }
}
