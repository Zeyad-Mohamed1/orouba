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
    // Fetch brand details with related categories
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/brands/${brandId}`,
      {
        cache: "no-store", // This ensures fresh data on each request
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch brand details: ${response.status}`);
    }

    const data = await response.json();
    return {
      brand: data.brand,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching brand data:", err);
    return {
      brand: null,
      error:
        err instanceof Error
          ? err.message
          : "An error occurred while fetching brand data",
    };
  }
}
