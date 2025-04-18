"use client";

import Link from "next/link";
import { Product } from "../types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  locale: string;
  brandColor: string;
}

export default function ProductGrid({
  products,
  locale,
  brandColor,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-white rounded-xl shadow border border-gray-100 max-w-2xl mx-auto mt-6">
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
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {locale === "ar"
            ? "لا توجد منتجات متاحة حالياً"
            : "No products available at the moment"}
        </h3>
        <p className="text-gray-500 mb-6">
          {locale === "ar"
            ? "لم نتمكن من العثور على منتجات في هذه الفئة"
            : "We couldn't find any products in this category"}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-white rounded-lg transition-colors"
          style={{ backgroundColor: brandColor }}
        >
          {locale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          brandColor={brandColor}
        />
      ))}
    </div>
  );
}
