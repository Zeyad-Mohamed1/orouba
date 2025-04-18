import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { deleteImageFile } from "@/lib/fileUtils";

// GET /api/recipes/[id] - Get a single recipe by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({
      where: {
        id,
      },
      include: {
        dish: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
            image: true,
          },
        },
      },
    });

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

// PUT /api/recipes/[id] - Update a recipe
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);
    const body = await request.json();

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Make sure ingredients and instructions are valid JSON arrays
    const ingredients = Array.isArray(body.ingredients)
      ? body.ingredients
      : existingRecipe.ingredients;
    const instructions = Array.isArray(body.instructions)
      ? body.instructions
      : existingRecipe.instructions;

    // Delete old image file if exists and a new image is provided
    if (existingRecipe.image && body.image) {
      await deleteImageFile(existingRecipe.image);
    }

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        level: body.level || existingRecipe.level,
        prep_time: body.prep_time || existingRecipe.prep_time,
        cooking_time: body.cooking_time || existingRecipe.cooking_time,
        servings: body.servings || existingRecipe.servings,
        image: body.image !== undefined ? body.image : existingRecipe.image,
        ingredients,
        instructions,
        // Update dish if provided
        ...(body.dish_id && {
          dish: {
            connect: {
              id: body.dish_id,
            },
          },
        }),
        // Update product if provided
        ...(body.product_id && {
          product: {
            connect: {
              id: body.product_id,
            },
          },
        }),
        // Remove product connection if explicitly set to null
        ...(body.product_id === null && {
          product: {
            disconnect: true,
          },
        }),
      },
      include: {
        dish: true,
        product: true,
      },
    });

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("Error updating recipe:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}

// DELETE /api/recipes/[id] - Delete a recipe
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    // Delete the image file if it exists
    if (existingRecipe.image) {
      await deleteImageFile(existingRecipe.image);
    }

    await prisma.recipe.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Recipe deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
