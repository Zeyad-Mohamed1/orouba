"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";

interface Recipe {
  id: number;
  level: string;
  prep_time: string;
  cooking_time: string;
  servings: number;
  image: string | null;
  ingredients: {
    id: number;
    text_ar: string;
    text_en: string;
  }[];
  instructions: {
    id: number;
    text_ar: string;
    text_en: string;
  }[];
  dish: {
    id: number;
    name_en: string;
    name_ar: string;
    image: string | null;
  };
  product?: {
    id: number;
    name_en: string;
    name_ar: string;
    image: string | null;
  } | null;
}

export default function ShowRecipePage() {
  const { locale, id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch recipe");
        }
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error || "Recipe not found"}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={locale === "ar" ? "تفاصيل الوصفة" : "Recipe Details"}
        buttonLabel={locale === "ar" ? "العودة إلى القائمة" : "Back to List"}
        buttonHref={`/dashboard/recipes`}
        buttonIcon="back"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {/* Recipe Image */}
          {recipe.image && (
            <div className="mb-6">
              <img
                src={recipe.image}
                alt="Recipe"
                className="w-full max-w-2xl h-64 object-cover rounded-lg mx-auto"
              />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === "ar" ? "الطبق" : "Dish"}
              </h3>
              <p>
                {locale === "ar" ? recipe.dish.name_ar : recipe.dish.name_en}
              </p>
            </div>

            {recipe.product && (
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {locale === "ar" ? "المنتج" : "Product"}
                </h3>
                <p>
                  {locale === "ar"
                    ? recipe.product.name_ar
                    : recipe.product.name_en}
                </p>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === "ar" ? "المستوى" : "Level"}
              </h3>
              <p>{recipe.level}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === "ar" ? "عدد الحصص" : "Servings"}
              </h3>
              <p>{recipe.servings}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === "ar" ? "وقت التحضير" : "Prep Time"}
              </h3>
              <p>{recipe.prep_time}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {locale === "ar" ? "وقت الطهي" : "Cooking Time"}
              </h3>
              <p>{recipe.cooking_time}</p>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">
              {locale === "ar" ? "المكونات" : "Ingredients"}
            </h3>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  {locale === "ar" ? ingredient.text_ar : ingredient.text_en}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {locale === "ar" ? "خطوات التحضير" : "Instructions"}
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              {recipe.instructions.map((instruction) => (
                <li key={instruction.id}>
                  {locale === "ar" ? instruction.text_ar : instruction.text_en}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
