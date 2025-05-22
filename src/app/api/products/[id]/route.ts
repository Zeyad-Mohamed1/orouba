import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { deleteImageFile, ensureDirectoryExists } from "@/lib/fileUtils";
import prisma from "@/lib/prisma";

// Get a single product
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
          select: {
            id: true,
            name_ar: true,
            name_en: true,
            brand_id: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// Update a product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Parse form data
    const formData = await request.formData();

    // Get product data from form fields
    const name_ar =
      (formData.get("name_ar") as string) || existingProduct.name_ar;
    const name_en =
      (formData.get("name_en") as string) || existingProduct.name_en;
    const description_ar =
      (formData.get("description_ar") as string) ||
      existingProduct.description_ar;
    const description_en =
      (formData.get("description_en") as string) ||
      existingProduct.description_en;
    const color = (formData.get("color") as string) || existingProduct.color;
    const category_id = formData.get("category_id")
      ? parseInt(formData.get("category_id") as string)
      : existingProduct.category_id;

    // Get image file if exists
    const imageFile = formData.get("image") as File | null;

    let image_base64 = null;
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      image_base64 = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
    }

    // Data to update
    const updateData: any = {
      name_ar,
      name_en,
      description_ar,
      description_en,
      color,
      category_id,
    };

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

    // Update product
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name_ar,
        name_en,
        description_ar,
        description_en,
        color,
        image: image_base64 || "",
        category_id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// Delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the image file if it exists
    if (existingProduct.image) {
      await deleteImageFile(existingProduct.image);
    }

    // Delete product
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
