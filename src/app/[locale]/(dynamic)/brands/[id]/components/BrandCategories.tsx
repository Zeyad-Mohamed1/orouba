"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  image: string;
  brand_id: number;
}

interface BrandCategoriesProps {
  categories: Category[];
  brandId: string;
  brandName: string;
  brandColor: string;
  locale: string;
}

const BrandCategories = ({
  categories,
  brandId,
  brandName,
  brandColor,
  locale,
}: BrandCategoriesProps) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(
    categories.length > 0 ? categories[0].id : null
  );

  if (categories.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-xl shadow border border-gray-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mx-auto mb-4 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M20 12H4M12 4v16"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2 font-sans">
          {locale === "ar"
            ? "لا توجد فئات متاحة حالياً"
            : "No categories available at the moment"}
        </h3>
        <p className="text-gray-500 font-serif">
          {locale === "ar"
            ? "يرجى التحقق مرة أخرى لاحقًا"
            : "Please check back later"}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-20 animate-fade-up" style={{ animationDelay: "0.7s" }}>
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 tracking-tight font-sans">
        {locale === "ar"
          ? `استكشف منتجات ${brandName}`
          : `Explore ${brandName} Products`}
      </h2>

      {/* Category tabs for mobile */}
      <div className="md:hidden overflow-x-auto whitespace-nowrap mb-8 pb-2 -mx-4 px-4">
        <div className="inline-flex gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                activeCategory === category.id
                  ? "text-white shadow-md"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
              style={{
                backgroundColor:
                  activeCategory === category.id ? brandColor : "white",
                borderColor:
                  activeCategory === category.id ? brandColor : "#e5e7eb",
              }}
              onClick={() => setActiveCategory(category.id)}
            >
              {locale === "ar" ? category.name_ar : category.name_en}
            </button>
          ))}
        </div>
      </div>

      {/* Category Grid for Desktop */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 masonry">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`relative rounded-2xl overflow-hidden transition-all duration-500 group cursor-pointer bg-white ${
              activeCategory === category.id
                ? "shadow-2xl scale-[1.02] ring-2"
                : "shadow-lg hover:shadow-xl"
            } ${
              activeCategory !== null && activeCategory !== category.id
                ? "opacity-75 hover:opacity-100"
                : ""
            }`}
            style={
              {
                backgroundColor: "white",
                "--tw-ring-color": brandColor,
              } as React.CSSProperties
            }
            onClick={() => setActiveCategory(category.id)}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={category.image}
                alt={locale === "ar" ? category.name_ar : category.name_en}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
              {activeCategory === category.id && (
                <div
                  className="absolute top-4 right-4 w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: brandColor }}
                ></div>
              )}
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-[var(--brand-color)] transition-colors duration-300 font-sans">
                {locale === "ar" ? category.name_ar : category.name_en}
              </h3>
              <p className="text-gray-500 text-sm line-clamp-2 font-serif group-hover:text-gray-700 transition-colors duration-300">
                {locale === "ar"
                  ? "اكتشف مجموعة متنوعة من المنتجات عالية الجودة."
                  : "Discover a diverse range of high-quality products."}
              </p>
              <Link
                href={`/products?category=${category.id}&brand=${brandId}`}
                className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3"
                style={{ color: brandColor }}
                onClick={(e) => e.stopPropagation()}
              >
                {locale === "ar" ? "عرض المنتجات" : "View Products"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Active Category Display for Mobile */}
      <div className="md:hidden mt-8 space-y-6">
        {categories
          .filter((cat) => activeCategory === null || cat.id === activeCategory)
          .map((category) => (
            <div
              key={category.id}
              className="relative rounded-2xl overflow-hidden transition-all duration-300 group border border-gray-100 shadow-lg bg-white animate-fade-in"
            >
              <div className="relative aspect-[16/9]">
                <Image
                  src={category.image}
                  alt={locale === "ar" ? category.name_ar : category.name_en}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              <div className="p-6 space-y-4">
                <h3
                  className="text-2xl font-semibold font-sans transition-colors duration-300"
                  style={{ color: brandColor }}
                >
                  {locale === "ar" ? category.name_ar : category.name_en}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 font-serif">
                  {locale === "ar"
                    ? "اكتشف مجموعة متنوعة من المنتجات عالية الجودة."
                    : "Discover a diverse range of high-quality products."}
                </p>
                <Link
                  href={`/products?category=${category.id}&brand=${brandId}`}
                  className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all duration-300"
                  style={{ color: brandColor }}
                >
                  {locale === "ar" ? "عرض المنتجات" : "View Products"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BrandCategories;
