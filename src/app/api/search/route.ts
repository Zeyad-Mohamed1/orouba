import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// Define types for our search results
type SearchResultBase = {
  id: string;
  name: string;
  category: "product" | "brand" | "recipe";
  image: string | null;
  nameAr?: string;
};

type BrandResult = SearchResultBase & {
  category: "brand";
  color: string;
};

type ProductResult = SearchResultBase & {
  category: "product";
  color: string;
  categoryName: string;
  brandName: string;
};

type RecipeResult = SearchResultBase & {
  category: "recipe";
  level: string;
  prepTime: number;
  cookingTime: number;
};

type SearchResult = BrandResult | ProductResult | RecipeResult;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query")?.toLowerCase() || "";
  const category =
    (searchParams.get("category") as "product" | "brand" | "recipe") ||
    "product";

  if (!query) {
    return NextResponse.json({
      results: [],
      message: "No query provided",
    });
  }

  try {
    let results: SearchResult[] = [];

    switch (category) {
      case "brand":
        const brandResults = await prisma.brand.findMany({
          where: {
            OR: [
              { name_en: { contains: query, mode: "insensitive" } },
              { name_ar: { contains: query, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            name_en: true,
            name_ar: true,
            main_image: true,
            color: true,
          },
          take: 10,
        });

        // Map to the format expected by the frontend
        results = brandResults.map((brand) => ({
          id: String(brand.id),
          name: brand.name_en, // Use English name as default
          category: "brand" as const,
          image: brand.main_image || null,
          color: brand.color,
          nameAr: brand.name_ar,
        }));
        break;

      case "product":
        const productResults = await prisma.product.findMany({
          where: {
            OR: [
              { name_en: { contains: query, mode: "insensitive" } },
              { name_ar: { contains: query, mode: "insensitive" } },
            ],
          },
          select: {
            id: true,
            name_en: true,
            name_ar: true,
            image: true,
            color: true,
            category: {
              select: {
                name_en: true,
                brand: {
                  select: {
                    name_en: true,
                  },
                },
              },
            },
          },
          take: 10,
        });

        // Map to the format expected by the frontend
        results = productResults.map((product) => ({
          id: String(product.id),
          name: product.name_en, // Use English name as default
          category: "product" as const,
          image: product.image || null,
          color: product.color,
          nameAr: product.name_ar,
          categoryName: product.category.name_en,
          brandName: product.category.brand.name_en,
        }));
        break;

      case "recipe":
        const recipeResults = await prisma.recipe.findMany({
          where: {
            OR: [
              { dish: { name_en: { contains: query, mode: "insensitive" } } },
              { dish: { name_ar: { contains: query, mode: "insensitive" } } },
            ],
          },
          select: {
            id: true,
            image: true,
            dish: {
              select: {
                name_en: true,
                name_ar: true,
              },
            },
            level: true,
            prep_time: true,
            cooking_time: true,
          },
          take: 10,
        });

        // Map to the format expected by the frontend
        results = recipeResults.map((recipe) => ({
          id: String(recipe.id),
          name: recipe.dish.name_en, // Use dish name as recipe name
          category: "recipe" as const,
          image: recipe.image || null,
          nameAr: recipe.dish.name_ar,
          level: recipe.level,
          prepTime: recipe.prep_time,
          cookingTime: recipe.cooking_time,
        }));
        break;

      default:
        break;
    }

    return NextResponse.json({
      results,
      message: results.length > 0 ? "Results found" : "No results found",
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      {
        results: [],
        message: "An error occurred while searching",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
