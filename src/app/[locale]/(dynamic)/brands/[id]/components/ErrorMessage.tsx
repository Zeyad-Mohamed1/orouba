import { Link } from "@/i18n/navigation";

interface ErrorMessageProps {
  error: string;
  locale: string;
}

const ErrorMessage = ({ error, locale }: ErrorMessageProps) => {
  return (
    <div className="container mx-auto py-12 px-4 md:px-8 text-center">
      <p className="text-red-500 text-xl">{error || "Brand not found"}</p>
      <Link
        href="/"
        className="inline-block mt-6 px-6 py-3 bg-[#003366] text-white rounded-lg hover:bg-opacity-90 transition-colors"
      >
        {locale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
      </Link>
    </div>
  );
};

export default ErrorMessage;
