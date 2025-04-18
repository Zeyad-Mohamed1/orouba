"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-20 px-4 md:px-8 text-center">
      <p className="text-red-500 text-xl">
        {error?.message ||
          (locale === "ar" ? "حدث خطأ ما" : "Something went wrong")}
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {locale === "ar" ? "حاول مرة أخرى" : "Try Again"}
        </button>
        <Link
          href="/products"
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {locale === "ar" ? "العودة إلى المنتجات" : "Back to Products"}
        </Link>
      </div>
    </div>
  );
}
