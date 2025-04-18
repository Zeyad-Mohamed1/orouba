"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Recipe } from "@/types/recipes";

interface RecipeGridProps {
  recipes: Recipe[];
}

export default function RecipeGrid({ recipes }: RecipeGridProps) {
  const { locale } = useParams();

  if (recipes.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">
          {locale === "ar"
            ? "لا توجد وصفات متاحة حاليًا"
            : "No recipes available yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <div
          key={recipe.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {recipe.image ? (
            <div className="h-48 relative">
              <Image
                src={recipe.image}
                alt={
                  locale === "ar" ? recipe.dish.name_ar : recipe.dish.name_en
                }
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : (
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold">
              {locale === "ar" ? recipe.dish.name_ar : recipe.dish.name_en}
            </h3>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>
                {locale === "ar" ? "وقت التحضير:" : "Prep:"} {recipe.prep_time}
              </span>
              <span>
                {locale === "ar" ? "الطهي:" : "Cook:"} {recipe.cooking_time}
              </span>
            </div>
            <div className="mt-4">
              <Link
                href={`/${locale}/recipes/${recipe.id}`}
                className="block text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                {locale === "ar" ? "عرض الوصفة" : "View Recipe"}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
