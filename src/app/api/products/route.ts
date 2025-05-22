import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ensureDirectoryExists } from "@/lib/fileUtils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category");
    const brandId = searchParams.get("brand");

    // Build where clause for query
    const where: any = {};

    // Add category filter if provided
    if (categoryId) {
      where.category_id = parseInt(categoryId);
    }

    // Add brand filter if provided
    if (brandId) {
      where.category = {
        brand_id: parseInt(brandId),
      };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name_en: true,
            name_ar: true,
            brand_id: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Parse form data instead of JSON
    const formData = await request.formData();

    // Get product data from form fields
    const name_ar = formData.get("name_ar") as string;
    const name_en = formData.get("name_en") as string;
    const description_ar = formData.get("description_ar") as string;
    const description_en = formData.get("description_en") as string;
    const color = formData.get("color") as string;
    const category_id = formData.get("category_id") as string;

    // Get image file if exists
    const imageFile = formData.get("image") as File | null;
    let image_base64 = null;
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      image_base64 = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
    }

    // Validate required fields
    if (
      !name_ar ||
      !name_en ||
      !description_ar ||
      !description_en ||
      !category_id
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }


    // Create the product
    const product = await prisma.product.create({
      data: {
        name_ar,
        name_en,
        description_ar,
        description_en,
        color,
        image: image_base64 || "",
        category_id: parseInt(category_id),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
