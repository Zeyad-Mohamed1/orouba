"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "../types";

interface CategoryListProps {
  categories: Category[];
  locale: string;
  categoryId: string | null;
  brandId: string | null;
  brandColor: string;
}

export default function CategoryList({
  categories,
  locale,
  categoryId,
  brandId,
  brandColor,
}: CategoryListProps) {
  if (categories.length === 0) return null;

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => {
          const isActive = categoryId === category.id.toString();
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.id}${
                brandId ? `&brand=${brandId}` : ""
              }`}
              className={`
                relative px-5 py-3 rounded-xl text-sm md:text-base font-medium transition-all duration-300 flex items-center gap-3
                border-2 transform hover:translate-y-[-2px] hover:shadow-md
                ${
                  isActive
                    ? "text-white shadow-lg scale-[1.02]"
                    : "text-gray-700 bg-white hover:bg-gray-50"
                }
              `}
              style={{
                backgroundColor: isActive ? brandColor : "white",
                borderColor: isActive ? brandColor : "#e5e7eb",
              }}
            >
              {category.image && (
                <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={category.image}
                    alt={locale === "ar" ? category.name_ar : category.name_en}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              {locale === "ar" ? category.name_ar : category.name_en}
              {isActive && (
                <span
                  className="absolute -right-1 -top-1 w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: "white" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
