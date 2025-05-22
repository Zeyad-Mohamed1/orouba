import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteImageFile } from "@/lib/fileUtils";

// GET /api/dishes/[id] - Get a single dish
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid dish ID" }, { status: 400 });
    }

    const dish = await prisma.dish.findUnique({
      where: { id },
      include: {
        dishCategory: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
          },
        },
      },
    });

    if (!dish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    return NextResponse.json(dish);
  } catch (error) {
    console.error("Error fetching dish:", error);
    return NextResponse.json(
      { error: "Failed to fetch dish" },
      { status: 500 }
    );
  }
}

// PUT /api/dishes/[id] - Update a dish
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);
    const body = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid dish ID" }, { status: 400 });
    }

    // Check if dish exists
    const existingDish = await prisma.dish.findUnique({
      where: { id },
    });

    if (!existingDish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    // Validate required fields
    if (!body.name_en || !body.name_ar || !body.dishCategory_id) {
      return NextResponse.json(
        { error: "Name (English), Name (Arabic), and Category are required" },
        { status: 400 }
      );
    }

    let image_base64 = null;
    if (body.image) {
      const bytes = await body.image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      image_base64 = `data:${body.image.type};base64,${buffer.toString('base64')}`;
    }

    const dish = await prisma.dish.update({
      where: { id },
      data: {
        name_en: body.name_en,
        name_ar: body.name_ar,
        image: image_base64 || null,
        dishCategory: {
          connect: {
            id: body.dishCategory_id,
          },
        },
      },
      include: {
        dishCategory: true,
      },
    });

    return NextResponse.json(dish);
  } catch (error) {
    console.error("Error updating dish:", error);
    return NextResponse.json(
      { error: "Failed to update dish" },
      { status: 500 }
    );
  }
}

// DELETE /api/dishes/[id] - Delete a dish
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid dish ID" }, { status: 400 });
    }

    // Check if dish exists
    const existingDish = await prisma.dish.findUnique({
      where: { id },
    });

    if (!existingDish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    // Check if there are any recipes associated with this dish
    const recipesCount = await prisma.recipe.count({
      where: { dish_id: id },
    });

    if (recipesCount > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete dish with associated recipes. Remove all recipes first.",
        },
        { status: 400 }
      );
    }

    // Delete the image file if it exists
    if (existingDish.image) {
      await deleteImageFile(existingDish.image);
    }

    await prisma.dish.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Dish deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting dish:", error);
    return NextResponse.json(
      { error: "Failed to delete dish" },
      { status: 500 }
    );
  }
}
