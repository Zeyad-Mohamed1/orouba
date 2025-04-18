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
              unoptimized={true}
              onError={(e) => {
                // Fallback to chef icon on error
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement?.classList.add(
                  "flex",
                  "items-center",
                  "justify-center",
                  "bg-blue-100",
                  "text-blue-500"
                );
                const icon = document.createElement("div");
                icon.innerHTML =
                  '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chef-hat"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" x2="18" y1="17" y2="17"/></svg>';
                e.currentTarget.parentElement?.appendChild(icon);
              }}
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
