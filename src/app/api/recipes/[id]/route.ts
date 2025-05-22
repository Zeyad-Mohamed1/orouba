import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/recipes/[id] - Get a single recipe by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({
      where: {
        id: parseInt(id),
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
    const { id } = await params;
    const body = await request.json();

    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) },
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

    let image_base64 = null;
    if (body.image) {
      const bytes = await body.image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      image_base64 = `data:${body.image.type};base64,${buffer.toString('base64')}`;
    }

    const recipe = await prisma.recipe.update({
      where: { id: parseInt(id) },
      data: {
        level: body.level || existingRecipe.level,
        prep_time: body.prep_time || existingRecipe.prep_time,
        cooking_time: body.cooking_time || existingRecipe.cooking_time,
        servings: body.servings || existingRecipe.servings,
        image: image_base64 || null,
        ingredients,
        instructions,
        ...(body.dish_id && {
          dish: {
            connect: {
              id: body.dish_id,
            },
          },
        }),
        ...(body.product_id && {
          product: {
            connect: {
              id: body.product_id,
            },
          },
        }),
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
    const { id } = await params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "Invalid recipe ID" }, { status: 400 });
    }

    // Check if recipe exists
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    await prisma.recipe.delete({
      where: { id: parseInt(id) },
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
