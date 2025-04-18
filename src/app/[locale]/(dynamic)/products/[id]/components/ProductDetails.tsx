import Image from "next/image";
import Link from "next/link";
import { Product, Brand } from "../types";

interface ProductDetailsProps {
  product: Product;
  brand: Brand | null;
  locale: string;
}

export default function ProductDetails({
  product,
  brand,
  locale,
}: ProductDetailsProps) {
  const productColor = product.color || "#003366";
  const brandColor = brand?.color || productColor;

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Product image section */}
        <div className="md:w-1/2 p-6 md:p-8 lg:p-10 border-r border-gray-100">
          <div className="relative aspect-square w-full bg-gray-50 rounded-xl overflow-hidden mb-4">
            {product.image ? (
              <Image
                src={product.image}
                alt={locale === "ar" ? product.name_ar : product.name_en}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-24 w-24"
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
          </div>

          {/* Color indicator */}
          {product.color && (
            <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 mt-4">
              <div
                className="w-5 h-5 rounded-full border border-gray-200"
                style={{ backgroundColor: product.color }}
              />
              <span className="text-sm text-gray-600">
                {locale === "ar" ? "اللون" : "Color"}
              </span>
            </div>
          )}

          {/* Brand badge */}
          {brand && (
            <div className="flex items-center mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="mr-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: brandColor }}
                >
                  {(locale === "ar" ? brand.name_ar : brand.name_en).charAt(0)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">
                  {locale === "ar" ? "العلامة التجارية" : "Brand"}
                </div>
                <div className="font-medium text-gray-800">
                  {locale === "ar" ? brand.name_ar : brand.name_en}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="md:w-1/2 p-6 md:p-8 lg:p-10 flex flex-col">
          <div className="mb-auto">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Link
                href={`/products?category=${product.category_id}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
              >
                {locale === "ar"
                  ? product.category?.name_ar || "الفئة"
                  : product.category?.name_en || "Category"}
              </Link>
              {brand && (
                <Link
                  href={`/brands/${product.category.brand_id}`}
                  className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    backgroundColor: `${brandColor}15`,
                    color: brandColor,
                  }}
                >
                  {locale === "ar" ? brand.name_ar : brand.name_en}
                </Link>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {locale === "ar" ? product.name_ar : product.name_en}
            </h1>

            <div
              className="w-20 h-1.5 rounded-full mb-8"
              style={{ backgroundColor: productColor }}
            ></div>

            {/* Product description */}
            <div className="prose prose-lg max-w-none text-gray-600 mb-10">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    locale === "ar"
                      ? product.description_ar
                      : product.description_en,
                }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-gray-100 space-y-4">
            <div className="flex gap-4">
              <Link
                href={`/products?category=${product.category_id}`}
                className="inline-flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                {locale === "ar" ? "جميع المنتجات" : "All Products"}
              </Link>
              {brand && product.category?.brand_id && (
                <Link
                  href={`/brands/${product.category.brand_id}`}
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex-1"
                  style={{
                    color: brandColor,
                    borderColor: brandColor,
                    border: "1px solid",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  {locale === "ar" ? `${brand.name_ar}` : `${brand.name_en}`}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
