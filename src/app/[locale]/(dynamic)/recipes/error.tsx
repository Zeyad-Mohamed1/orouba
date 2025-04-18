"use client";

import { useParams } from "next/navigation";
import ErrorState from "@/app/[locale]/(dynamic)/recipes/components/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { locale } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4">
        <ErrorState
          message={
            locale === "ar"
              ? "حدث خطأ أثناء تحميل الصفحة"
              : "An error occurred while loading the page"
          }
        />
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {locale === "ar" ? "إعادة المحاولة" : "Try again"}
        </button>
      </div>
    </div>
  );
}
