import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const {
      name_ar,
      name_en,
      description_ar,
      description_en,
      brand_text_ar,
      brand_text_en,
      color,
      main_image,
      banner,
      small_img
    } = data;

    // Validate required fields with specific error messages
    const missingFields = [];
    if (!name_ar) missingFields.push("name_ar");
    if (!name_en) missingFields.push("name_en");
    if (!description_ar) missingFields.push("description_ar");
    if (!description_en) missingFields.push("description_en");
    if (!brand_text_ar) missingFields.push("brand_text_ar");
    if (!brand_text_en) missingFields.push("brand_text_en");
    if (!color) missingFields.push("color");

    if (missingFields.length > 0) {
      console.log("Missing required fields:", missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate color format
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
      console.log("Invalid color format:", color);
      return NextResponse.json(
        { error: "Invalid color format. Must be a valid hex color code." },
        { status: 400 }
      );
    }

    try {
      
      // Create the brand in the database
      const brand = await prisma.brand.create({
        data: {
          name_ar,
          name_en,
          description_ar,
          description_en,
          brand_text_ar,
          brand_text_en,
          color,
          main_image,
          banner,
          small_img,
        },
      });

      console.log("Brand created successfully:", { id: brand.id });
      return NextResponse.json({ brand }, { status: 201 });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Database error while creating brand" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create brand" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        name_ar: true,
        name_en: true,
        description_ar: true,
        description_en: true,
        brand_text_ar: true,
        brand_text_en: true,
        color: true,
        main_image: true,
        banner: true,
        small_img: true,
        created_at: true,
        updated_at: true,
      },
    });    

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: '10mb',
  },
}
