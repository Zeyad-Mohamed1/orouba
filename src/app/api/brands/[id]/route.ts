import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface BrandUpdateData {
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  brand_text_ar: string;
  brand_text_en: string;
  color: string;
  main_image?: string;
  banner?: string;
  small_img?: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

const validateBrandData = (data: Partial<BrandUpdateData>): string | null => {
  const requiredFields: (keyof BrandUpdateData)[] = [
    'name_ar',
    'name_en',
    'description_ar',
    'description_en',
    'brand_text_ar',
    'brand_text_en',
    'color'
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
};

// const convertFileToBase64 = async (file: File | null): Promise<string | null> => {
//   if (!file || file.size === 0) return null;

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);
//   const base64 = buffer.toString('base64');
//   const mimeType = file.type;
//   return `data:${mimeType};base64,${base64}`;
// };

// Get a specific brand by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
      const { id } = await params;
    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const brand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: {
          orderBy: {
            created_at: "desc",
          },
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json({ data: brand });
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: 500 }
    );
  }
}

// Update a brand by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const { id } = await params;
    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const existingBrand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const body = await request.json();
    const brandData: Partial<BrandUpdateData> = {
      name_ar: body.name_ar,
      name_en: body.name_en,
      description_ar: body.description_ar,
      description_en: body.description_en,
      brand_text_ar: body.brand_text_ar,
      brand_text_en: body.brand_text_en,
      color: body.color,
    };

    const validationError = validateBrandData(brandData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const updateData: BrandUpdateData = {
      ...brandData as BrandUpdateData,
      ...(body.main_image && { main_image: body.main_image }),
      ...(body.banner && { banner: body.banner }),
      ...(body.small_img && { small_img: body.small_img }),
    };

    const updatedBrand = await prisma.brand.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ data: updatedBrand });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 }
    );
  }
}

// Delete a brand by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<void>>> {
  try {
    const { id } = await params;
    if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const existingBrand = await prisma.brand.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    await prisma.brand.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
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
