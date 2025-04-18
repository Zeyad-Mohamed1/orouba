import Link from "next/link";

interface ErrorStateProps {
  error: string;
  locale: string;
}

export default function ErrorState({ error, locale }: ErrorStateProps) {
  return (
    <div className="container mx-auto py-12 px-4 md:px-8 text-center">
      <p className="text-red-500 text-xl">{error}</p>
      <Link
        href="/"
        className="inline-block mt-6 px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-opacity-90 transition-colors"
      >
        {locale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
      </Link>
    </div>
  );
}
