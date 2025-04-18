"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
  Clock,
  ChefHat,
  Users,
} from "lucide-react";

interface Recipe {
  id: number;
  level: string;
  prep_time: number;
  cooking_time: number;
  servings: number;
  image: string | null;
  dish: {
    id: number;
    name_en: string;
    name_ar: string;
  };
  product: {
    id: number;
    name_en: string;
    name_ar: string;
  } | null;
}

export default function RecipesPage() {
  const { locale } = useParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("/api/recipes");

        if (!res.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        setError("Failed to load recipes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId: number) => {
    if (
      window.confirm(
        locale === "ar"
          ? "هل أنت متأكد من حذف هذه الوصفة؟"
          : "Are you sure you want to delete this recipe?"
      )
    ) {
      try {
        const res = await fetch(`/api/recipes/${recipeId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete recipe");
        }

        // Update UI by removing the deleted recipe
        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
      } catch (err) {
        console.error("Error deleting recipe:", err);
        alert(
          locale === "ar" ? "فشل في حذف الوصفة" : "Failed to delete recipe"
        );
      }
    }
  };

  // Helper function to get difficulty level label
  const getDifficultyLabel = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return locale === "ar" ? "سهل" : "Easy";
      case "medium":
        return locale === "ar" ? "متوسط" : "Medium";
      case "hard":
        return locale === "ar" ? "صعب" : "Hard";
      default:
        return level;
    }
  };

  // Helper function to get difficulty color
  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}${locale === "ar" ? " ساعة " : "h"} ${
        mins > 0 ? `${mins}${locale === "ar" ? " دقيقة" : "m"}` : ""
      }`;
    }
    return `${mins}${locale === "ar" ? " دقيقة" : "m"}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === "ar" ? "الوصفات" : "Recipes"}
        </h1>
        <Link
          href={`/${locale}/dashboard/recipes/create`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusCircle size={16} className={locale === "ar" ? "ml-2" : "mr-2"} />
          {locale === "ar" ? "إضافة وصفة جديدة" : "Add New Recipe"}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "الصورة" : "Image"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "الأطباق" : "Dishes"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "المنتج" : "Product"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "المستوى" : "Level"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "التفاصيل" : "Details"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recipes.length > 0 ? (
                recipes.map((recipe) => (
                  <tr key={recipe.id} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {recipe.image ? (
                        <img
                          src={recipe.image}
                          alt="Recipe"
                          className="h-14 w-14 rounded-md object-cover mx-auto"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-md bg-gray-200 mx-auto flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No IMG</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <ChefHat size={16} className="text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">
                          {locale === "ar"
                            ? recipe.dish.name_ar
                            : recipe.dish.name_en}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {recipe.product
                        ? locale === "ar"
                          ? recipe.product.name_ar
                          : recipe.product.name_en
                        : locale === "ar"
                        ? "لا يوجد منتج"
                        : "No product"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(
                          recipe.level
                        )}`}
                      >
                        {getDifficultyLabel(recipe.level)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={14} className="mr-1" />
                          <span>
                            {locale === "ar" ? "التحضير: " : "Prep: "}
                            {formatTime(recipe.prep_time)}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={14} className="mr-1" />
                          <span>
                            {locale === "ar" ? "الطهي: " : "Cook: "}
                            {formatTime(recipe.cooking_time)}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Users size={14} className="mr-1" />
                          <span>
                            {locale === "ar" ? "يكفي لـ: " : "Serves: "}
                            {recipe.servings}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3 justify-center">
                        <Link
                          href={`/${locale}/dashboard/recipes/${recipe.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title={locale === "ar" ? "عرض" : "View"}
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/${locale}/dashboard/recipes/${recipe.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title={locale === "ar" ? "تعديل" : "Edit"}
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteRecipe(recipe.id)}
                          className="text-red-600 hover:text-red-900"
                          title={locale === "ar" ? "حذف" : "Delete"}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {locale === "ar"
                      ? "لا توجد وصفات متاحة حاليًا"
                      : "No recipes available yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
