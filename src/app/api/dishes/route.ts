import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/cooks - Get all cooks or filter by category_id
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");

    // Build where clause for query
    const where: any = {};

    // Add category filter if provided
    if (categoryId) {
      where.dishCategory_id = parseInt(categoryId);
      console.log(`Filtering dishes by dishCategory_id: ${categoryId}`);
    }

    const dishes = await prisma.dish.findMany({
      where,
      orderBy: {
        name_en: "asc",
      },
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

    return NextResponse.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return NextResponse.json(
      { error: "Failed to fetch dishes" },
      { status: 500 }
    );
  }
}

// POST /api/dishes - Create a new dish
export async function POST(request: Request) {
  try {
    const body = await request.json();

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

    const dish = await prisma.dish.create({
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

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error("Error creating dish:", error);
    return NextResponse.json(
      { error: "Failed to create dish" },
      { status: 500 }
    );
  }
}
