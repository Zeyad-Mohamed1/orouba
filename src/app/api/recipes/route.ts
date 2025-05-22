import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/recipes - Get all recipes or filter by product_id or dish_id
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("product_id");
    const dishId = searchParams.get("dish");

    // Build where clause for query
    const where: any = {};

    // Add product filter if provided
    if (productId) {
      where.product_id = parseInt(productId);
      console.log(`Filtering recipes by product_id: ${productId}`);
    }

    // Add dish filter if provided
    if (dishId) {
      where.dish_id = parseInt(dishId);
      console.log(`Filtering recipes by dish_id: ${dishId}`);
    }

    const recipes = await prisma.recipe.findMany({
      where,
      orderBy: {
        created_at: "desc",
      },
      include: {
        dish: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
          },
        },
        product: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
          },
        },
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (
      !body.level ||
      !body.prep_time ||
      !body.cooking_time ||
      !body.servings ||
      !body.dish_id
    ) {
      return NextResponse.json(
        {
          error:
            "Level, prep time, cooking time, servings, and dish are required",
        },
        { status: 400 }
      );
    }

    let image_base64 = null;
    if (body.image) {
      const bytes = await body.image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      image_base64 = `data:${body.image.type};base64,${buffer.toString('base64')}`;
    }

    const ingredients = Array.isArray(body.ingredients) ? body.ingredients : [];
    const instructions = Array.isArray(body.instructions)
      ? body.instructions
      : [];

    const recipe = await prisma.recipe.create({
      data: {
        level: body.level,
        prep_time: body.prep_time,
        cooking_time: body.cooking_time,
        servings: body.servings,
        image: image_base64 || null,
        ingredients: ingredients,
        instructions: instructions,
        dish: {
          connect: {
            id: body.dish_id,
          },
        },
        ...(body.product_id && {
          product: {
            connect: {
              id: body.product_id,
            },
          },
        }),
      },
      include: {
        dish: true,
        product: true,
      },
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
