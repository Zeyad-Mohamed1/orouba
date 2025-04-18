"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react";

interface DishCategory {
  id: number;
  name_en: string;
  name_ar: string;
  image: string | null;
}

export default function DishCategoriesPage() {
  const { locale } = useParams();
  const [dishCategories, setDishCategories] = useState<DishCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDishCategories() {
      try {
        const res = await fetch("/api/dish-categories");

        if (!res.ok) {
          throw new Error("Failed to fetch dish categories");
        }

        const data = await res.json();
        setDishCategories(data);
      } catch (err) {
        setError("Failed to load dish categories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDishCategories();
  }, []);

  const handleDeleteDishCategory = async (categoryId: number) => {
    if (
      window.confirm(
        locale === "ar"
          ? "هل أنت متأكد من حذف هذه الفئة؟"
          : "Are you sure you want to delete this category?"
      )
    ) {
      try {
        const res = await fetch(`/api/dish-categories/${categoryId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete dish category");
        }

        // Update UI by removing the deleted category
        setDishCategories(
          dishCategories.filter((category) => category.id !== categoryId)
        );
      } catch (err) {
        console.error("Error deleting dish category:", err);
        alert(
          locale === "ar" ? "فشل في حذف الفئة" : "Failed to delete category"
        );
      }
    }
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
          {locale === "ar" ? "فئات الطعام" : "Dish Categories"}
        </h1>
        <Link
          href={`/${locale}/dashboard/dish-categories/create`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusCircle size={16} className={locale === "ar" ? "ml-2" : "mr-2"} />
          {locale === "ar" ? "إضافة فئة جديدة" : "Add New Category"}
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
                  {locale === "ar" ? "الاسم" : "Name"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dishCategories.length > 0 ? (
                dishCategories.map((category) => (
                  <tr key={category.id} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={
                            locale === "ar"
                              ? category.name_ar
                              : category.name_en
                          }
                          className="h-10 w-10 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 mx-auto flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No IMG</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {locale === "ar" ? category.name_ar : category.name_en}
                      </div>
                      <div className="text-sm text-gray-500">
                        {locale === "ar" ? category.name_en : category.name_ar}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3 justify-center">
                        <Link
                          href={`/${locale}/dashboard/dish-categories/${category.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title={locale === "ar" ? "تعديل" : "Edit"}
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteDishCategory(category.id)}
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
                    colSpan={3}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {locale === "ar"
                      ? "لا توجد فئات طهاة متاحة حاليًا"
                      : "No dish categories available yet"}
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
