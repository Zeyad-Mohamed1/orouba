import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/dish-categories - Get all dish categories
export async function GET() {
  try {
    const dishCategories = await prisma.dishCategory.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    if (!dishCategories) {
      return NextResponse.json(
        { error: "No dish categories found" },
        { status: 404 }
      );
    }

    return NextResponse.json(dishCategories);
  } catch (error) {
    console.error("Error fetching dish categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch dish categories" },
      { status: 500 }
    );
  }
}

// POST /api/dish-categories - Create a new dish category
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name_ar || !body.name_en) {
      return NextResponse.json(
        { error: "Name is required in both languages" },
        { status: 400 }
      );
    }

    // Validate base64 image if provided
    let image_base64 = null;
    if (body.image) {
      const bytes = await body.image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      image_base64 = `data:${body.image.type};base64,${buffer.toString('base64')}`;
    }

    const dishCategory = await prisma.dishCategory.create({
      data: {
        name_ar: body.name_ar,
        name_en: body.name_en,
        image: image_base64 || null,
      },
    });

    return NextResponse.json(dishCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating dish category:", error);
    return NextResponse.json(
      { error: "Failed to create dish category" },
      { status: 500 }
    );
  }
}
