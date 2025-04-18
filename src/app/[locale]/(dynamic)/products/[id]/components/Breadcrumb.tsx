import Link from "next/link";
import { Product, Brand } from "../types";

interface BreadcrumbProps {
  product: Product;
  brand: Brand | null;
  locale: string;
}

export default function Breadcrumb({
  product,
  brand,
  locale,
}: BreadcrumbProps) {
  return (
    <div className="bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto py-5 px-4 md:px-8">
        <div className="flex items-center text-sm text-gray-500">
          <Link
            href="/"
            className="hover:text-gray-700 transition-colors duration-200"
          >
            {locale === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link
            href="/products"
            className="hover:text-gray-700 transition-colors duration-200"
          >
            {locale === "ar" ? "المنتجات" : "Products"}
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <Link
            href={`/products?category=${product.category_id}`}
            className="hover:text-gray-700 transition-colors duration-200"
          >
            {locale === "ar"
              ? product.category?.name_ar || "الفئة"
              : product.category?.name_en || "Category"}
          </Link>
          {brand && (
            <>
              <span className="mx-2 text-gray-300">/</span>
              <Link
                href={`/brands/${product.category.brand_id}`}
                className="hover:text-gray-700 transition-colors duration-200"
              >
                {locale === "ar" ? brand.name_ar : brand.name_en}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
