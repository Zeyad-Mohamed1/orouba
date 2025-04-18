import Link from "next/link";
import Image from "next/image";
import { Recipe } from "../types";

interface ProductRecipesProps {
  recipes: Recipe[];
  locale: string;
}

export default function ProductRecipes({
  recipes,
  locale,
}: ProductRecipesProps) {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto my-16 px-4 md:px-8 bg-gray-50 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">
          {locale === "ar"
            ? "وصفات باستخدام هذا المنتج"
            : "Recipes Using This Product"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recipes.map((recipe) => (
            <Link
              href={`/${locale}/recipes/${recipe.id}`}
              key={recipe.id}
              className="flex bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md"
            >
              <div className="w-1/3 relative">
                {recipe.image ? (
                  <Image
                    src={recipe.image}
                    alt={locale === "ar" ? "وصفة" : "Recipe"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 20vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="w-2/3 p-5">
                <div className="text-xs font-medium mb-1 text-gray-500 uppercase">
                  {recipe.level === "easy"
                    ? locale === "ar"
                      ? "سهل"
                      : "Easy"
                    : recipe.level === "medium"
                    ? locale === "ar"
                      ? "متوسط"
                      : "Medium"
                    : locale === "ar"
                    ? "صعب"
                    : "Hard"}
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                  {locale === "ar" ? "وصفة بواسطة: " : "Recipe by: "}
                  {locale === "ar" ? recipe.dish.name_ar : recipe.dish.name_en}
                </h3>
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <div className="flex items-center mr-4">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {recipe.prep_time + recipe.cooking_time}{" "}
                      {locale === "ar" ? "دقيقة" : "mins"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <span>
                      {recipe.servings} {locale === "ar" ? "أشخاص" : "servings"}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
