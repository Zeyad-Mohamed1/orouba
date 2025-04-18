"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { Category } from "@/types/recipes";

interface CategoryCarouselProps {
  categories: Category[];
}

export default function CategoryCarousel({
  categories,
}: CategoryCarouselProps) {
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get("category")
    ? parseInt(searchParams.get("category") as string)
    : null;

  return (
    <div className="relative mb-10">
      <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/${locale}/recipes?category=${category.id}`}
            className={`flex flex-col items-center min-w-[100px] ${
              selectedCategoryId === category.id
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            <div
              className={`rounded-full overflow-hidden border-2 p-1 ${
                selectedCategoryId === category.id
                  ? "border-blue-600"
                  : "border-gray-200"
              }`}
            >
              {category.image ? (
                <div className="h-20 w-20 relative rounded-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={locale === "ar" ? category.name_ar : category.name_en}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No IMG</span>
                </div>
              )}
            </div>
            <span className="mt-2 text-center">
              {locale === "ar" ? category.name_ar : category.name_en}
            </span>
          </Link>
        ))}
      </div>
      <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow">
        ‹
      </button>
      <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow">
        ›
      </button>
    </div>
  );
}
