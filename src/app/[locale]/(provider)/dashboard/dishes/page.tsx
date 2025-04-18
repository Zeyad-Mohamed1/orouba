"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react";

interface Dish {
  id: number;
  name_en: string;
  name_ar: string;
  image: string | null;
  dishCategory: {
    id: number;
    name_en: string;
    name_ar: string;
  };
}

export default function DishesPage() {
  const { locale } = useParams();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDishes() {
      try {
        const res = await fetch("/api/dishes");

        if (!res.ok) {
          throw new Error("Failed to fetch dishes");
        }

        const data = await res.json();
        setDishes(data);
      } catch (err) {
        setError("Failed to load dishes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchDishes();
  }, []);

  const handleDeleteDish = async (dishId: number) => {
    if (
      window.confirm(
        locale === "ar"
          ? "هل أنت متأكد من حذف هذا الطعام؟"
          : "Are you sure you want to delete this dish?"
      )
    ) {
      try {
        const res = await fetch(`/api/dishes/${dishId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete dish");
        }

        // Update UI by removing the deleted dish
        setDishes(dishes.filter((dish) => dish.id !== dishId));
      } catch (err) {
        console.error("Error deleting dish:", err);
        alert(locale === "ar" ? "فشل في حذف الطعام" : "Failed to delete dish");
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
          {locale === "ar" ? "الأطباق" : "Dishes"}
        </h1>
        <Link
          href={`/${locale}/dashboard/dishes/create`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusCircle size={16} className={locale === "ar" ? "ml-2" : "mr-2"} />
          {locale === "ar" ? "إضافة أطباق جديدة" : "Add New Dishes"}
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
                  {locale === "ar" ? "الفئة" : "Category"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dishes.length > 0 ? (
                dishes.map((dish) => (
                  <tr key={dish.id} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {dish.image ? (
                        <img
                          src={dish.image}
                          alt={locale === "ar" ? dish.name_ar : dish.name_en}
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
                        {locale === "ar" ? dish.name_ar : dish.name_en}
                      </div>
                      <div className="text-sm text-gray-500">
                        {locale === "ar" ? dish.name_en : dish.name_ar}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {locale === "ar"
                        ? dish.dishCategory.name_ar
                        : dish.dishCategory.name_en}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3 justify-center">
                        <Link
                          href={`/${locale}/dashboard/dishes/${dish.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title={locale === "ar" ? "تعديل" : "Edit"}
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteDish(dish.id)}
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
                    colSpan={4}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {locale === "ar"
                      ? "لا يوجد أطباق متاحين حاليًا"
                      : "No dishes available yet"}
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
