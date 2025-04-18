"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductNotFound() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  return (
    <div className="container mx-auto py-20 px-4 md:px-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {locale === "ar" ? "المنتج غير موجود" : "Product Not Found"}
      </h1>
      <p className="text-gray-600 mb-8">
        {locale === "ar"
          ? "عذراً، لم نتمكن من العثور على المنتج الذي تبحث عنه."
          : "Sorry, we couldn't find the product you were looking for."}
      </p>
      <Link
        href="/products"
        className="inline-block px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-opacity-90 transition-colors"
      >
        {locale === "ar" ? "العودة إلى المنتجات" : "Back to Products"}
      </Link>
    </div>
  );
}
