"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Products page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {locale === "ar" ? "حدث خطأ ما" : "Something went wrong"}
        </h1>
        <p className="text-gray-600 mb-8">
          {locale === "ar"
            ? "نعتذر، حدث خطأ أثناء محاولة عرض المنتجات. يرجى المحاولة مرة أخرى."
            : "We're sorry, but there was an error while trying to display products. Please try again."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            {locale === "ar" ? "إعادة المحاولة" : "Try again"}
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {locale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
          </Link>
        </div>
      </div>
    </div>
  );
}
