import Image from "next/image";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { Recipe } from "../utils/data";

interface RelatedRecipesProps {
  recipes: Recipe[];
  locale: string;
}

export function RelatedRecipes({ recipes, locale }: RelatedRecipesProps) {
  if (recipes.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">
        {locale === "ar"
          ? "وصفات أخرى باستخدام نفس المنتج"
          : "More Recipes Using This Product"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link
            key={recipe.id}
            href={`/${locale}/recipes/${recipe.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
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
                  unoptimized={true}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.classList.add(
                        "flex",
                        "items-center",
                        "justify-center",
                        "bg-gray-100"
                      );
                      parent.innerHTML =
                        '<span class="text-gray-500">No image</span>';
                    }
                  }}
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">
                {locale === "ar" ? recipe.dish.name_ar : recipe.dish.name_en}
              </h3>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {recipe.cooking_time} {locale === "ar" ? "د" : "min"}
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {recipe.servings}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
