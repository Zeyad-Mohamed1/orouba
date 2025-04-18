"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Dish } from "@/types/recipes";

interface DishSidebarProps {
  dishes: Dish[];
}

export default function DishSidebar({ dishes }: DishSidebarProps) {
  const { locale } = useParams();
  const searchParams = useSearchParams();

  const selectedCategoryId = searchParams.get("category")
    ? parseInt(searchParams.get("category") as string)
    : null;
  const selectedDishId = searchParams.get("dish")
    ? parseInt(searchParams.get("dish") as string)
    : null;

  return (
    <div className="md:w-1/4 bg-blue-50 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">
        {locale === "ar" ? "الأطباق" : "Dishes"}
      </h2>
      <ul className="space-y-2">
        {dishes.length > 0 ? (
          dishes.map((dish) => (
            <li key={dish.id}>
              <Link
                href={`/${locale}/recipes?category=${selectedCategoryId}&dish=${dish.id}`}
                className={`block p-2 rounded ${
                  selectedDishId === dish.id
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-100"
                }`}
              >
                {locale === "ar" ? dish.name_ar : dish.name_en}
              </Link>
            </li>
          ))
        ) : (
          <li className="text-gray-500">
            {locale === "ar"
              ? "لا يوجد أطباق في هذه الفئة"
              : "No dishes in this category"}
          </li>
        )}
      </ul>
    </div>
  );
}
