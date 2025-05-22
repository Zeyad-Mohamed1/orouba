"use client";
import Image from "next/image";
import Link from "next/link";
import { ChefHat, ChevronRight } from "lucide-react";
import { Recipe } from "../utils/data";

interface DishSectionProps {
  recipe: Recipe;
  locale: string;
}

export function DishSection({ recipe, locale }: DishSectionProps) {
  if (!recipe.dish) return null;

  return (
    <div className="mb-12 bg-gray-50 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-4">
        {locale === "ar" ? "الأطباق" : "Dishes"}
      </h2>
      <div className="flex items-center">
        {recipe.dish.image ? (
          <div className="h-20 w-20 relative rounded-full overflow-hidden mr-4 border-2 border-blue-500">
            <Image
              src={recipe.dish.image}
              alt={locale === "ar" ? recipe.dish.name_ar : recipe.dish.name_en}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-500 border-2 border-blue-500">
            <ChefHat className="h-8 w-8" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">
            {locale === "ar" ? recipe.dish.name_ar : recipe.dish.name_en}
          </h3>
          <Link
            href={`/${locale}/recipes?dish=${recipe.dish.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center mt-1"
          >
            {locale === "ar"
              ? "جميع وصفات هذه الأطباق"
              : "View all recipes from this dish"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
