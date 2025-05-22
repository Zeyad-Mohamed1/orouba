import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
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
    if (!name_ar || !name_en || !brand_id || !image) {
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

    // Convert image to base64
    let image_base64 = null;
    if (image) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      image_base64 = `data:${image.type};base64,${buffer.toString('base64')}`;
    }

    // Create the category in the database
    const category = await prisma.category.create({
      data: {
        name_ar,
        name_en,
        description_ar,
        description_en,
        image: image_base64!,
        brand_id: brandId,
      },
      include: {
        brand: true,
      },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name_en: true,
        name_ar: true,
        image: true,
        created_at: true,
        brand: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
          },
        },
      },
      orderBy: {
        name_en: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
