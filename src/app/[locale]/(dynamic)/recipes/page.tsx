import { Suspense } from "react";
import { notFound } from "next/navigation";

import Breadcrumb from "@/app/[locale]/(dynamic)/recipes/components/Breadcrumb";
import CategoryCarousel from "@/app/[locale]/(dynamic)/recipes/components/CategoryCarousel";
import DishSidebar from "@/app/[locale]/(dynamic)/recipes/components/DishSidebar";
import RecipeGrid from "@/app/[locale]/(dynamic)/recipes/components/RecipeGrid";
import LoadingState from "@/app/[locale]/(dynamic)/recipes/components/LoadingState";
import ErrorState from "@/app/[locale]/(dynamic)/recipes/components/ErrorState";

import {
  getCategories,
  getDishesByCategory,
  getRecipesByDish,
} from "@/app/[locale]/(dynamic)/recipes/components/recipes";
import { Category, Dish, Recipe } from "@/types/recipes";

interface RecipesPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    category?: string;
    dish?: string;
  };
}

export default async function RecipesPage({
  params,
  searchParams,
}: RecipesPageProps) {
  const { locale } = await params;
  const { category, dish } = await searchParams;

  if (locale !== "en" && locale !== "ar") {
    notFound();
  }

  try {
    const selectedCategoryId = category ? parseInt(category) : null;
    const selectedDishId = dish ? parseInt(dish) : null;

    // Fetch categories
    let categories: Category[] = [];
    try {
      categories = await getCategories();
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return (
        <ErrorState
          message={
            locale === "ar"
              ? "فشل في تحميل الفئات"
              : "Failed to load categories"
          }
        />
      );
    }

    // Default selection: If no category is selected and we have categories, use first one
    const effectiveCategoryId =
      selectedCategoryId || (categories.length > 0 ? categories[0].id : null);

    // Fetch dishes for the selected category
    let dishes: Dish[] = [];
    if (effectiveCategoryId) {
      try {
        dishes = await getDishesByCategory(effectiveCategoryId);
      } catch (error) {
        console.error("Failed to fetch dishes:", error);
        return (
          <ErrorState
            message={
              locale === "ar" ? "فشل في تحميل الأطباق" : "Failed to load dishes"
            }
          />
        );
      }
    }

    // Default selection: If no dish is selected and we have dishes, use first one
    const effectiveDishId =
      selectedDishId || (dishes.length > 0 ? dishes[0].id : null);

    // Fetch recipes for the selected dish
    let recipes: Recipe[] = [];
    if (effectiveDishId) {
      try {
        recipes = await getRecipesByDish(effectiveDishId);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
        return (
          <ErrorState
            message={
              locale === "ar"
                ? "فشل في تحميل الوصفات"
                : "Failed to load recipes"
            }
          />
        );
      }
    }

    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <Breadcrumb />

        <Suspense fallback={<LoadingState />}>
          <CategoryCarousel categories={categories} />
        </Suspense>

        <div className="flex flex-col md:flex-row gap-6">
          <Suspense fallback={<LoadingState />}>
            <DishSidebar dishes={dishes} />
          </Suspense>

          <div className="md:w-3/4">
            <h1 className="text-2xl font-bold mb-6">
              {locale === "ar" ? "الوصفات" : "Recipes"}
            </h1>

            <Suspense fallback={<LoadingState />}>
              <RecipeGrid recipes={recipes} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return (
      <ErrorState
        message={
          locale === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred"
        }
      />
    );
  }
}
