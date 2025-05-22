"use server";
import prisma from "@/lib/prisma";

export interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  image: string;
  brand_id: number;
}

export interface Brand {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  brand_text_ar: string;
  brand_text_en: string;
  color: string;
  main_image: string;
  banner: string;
  small_img: string;
  categories: Category[];
}

export async function getBrandData(brandId: string): Promise<{
  brand: Brand | null;
  error: string | null;
}> {
  try {
    const response = await prisma.brand.findUnique({
      where: {
        id: parseInt(brandId),
      },
      include: {
        categories: true,
      },
    });

    if (!response) {
      throw new Error(`Failed to fetch brand details`);
    }

    return {
      brand: response as any,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching brand data:::", err);
    return {
      brand: null,
      error:
        err instanceof Error
          ? err.message
          : "An error occurred while fetching brand data",
    };
  }
}
