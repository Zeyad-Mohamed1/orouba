"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  locale: string;
  brandColor: string;
}

export default function ProductCard({
  product,
  locale,
  brandColor,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={locale === "ar" ? product.name_ar : product.name_en}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {product.color && (
          <div
            className="absolute top-3 left-3 w-6 h-6 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: product.color }}
          />
        )}
      </div>
      <div className="p-5 space-y-2">
        <h3 className="font-medium text-lg text-gray-800 line-clamp-1">
          {locale === "ar" ? product.name_ar : product.name_en}
        </h3>
        <div
          className="text-sm text-gray-500 line-clamp-2"
          dangerouslySetInnerHTML={
            locale === "ar"
              ? { __html: product.description_ar?.substring(0, 100) }
              : { __html: product.description_en?.substring(0, 100) }
          }
        />
        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium mt-2 group-hover:gap-2 transition-all duration-300"
          style={{ color: brandColor }}
        >
          {locale === "ar" ? "عرض التفاصيل" : "View Details"}
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
  );
}
