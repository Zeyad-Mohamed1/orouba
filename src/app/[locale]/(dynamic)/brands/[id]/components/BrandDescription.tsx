import Image from "next/image";

interface BrandDescriptionProps {
  name: string;
  description: string;
  brandText: string;
  brandColor: string;
  mainImage: string;
  locale: string;
}

const BrandDescription = ({
  name,
  description,
  brandText,
  brandColor,
  mainImage,
  locale,
}: BrandDescriptionProps) => {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-24 items-start animate-fade-up"
      style={{ animationDelay: "0.5s" }}
    >
      <div className="md:col-span-2 space-y-10">
        <div className="relative">
          <div className="absolute -left-8 top-0 bottom-0 w-2 bg-gradient-to-b from-[var(--brand-color)] to-transparent opacity-30 rounded-full" />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight relative inline-block pb-3 font-sans">
            {locale === "ar" ? "عن العلامة التجارية" : "About the Brand"}
            <span
              className="absolute bottom-0 left-0 w-2/3 h-1.5 rounded-full"
              style={{ backgroundColor: brandColor }}
            ></span>
          </h2>
        </div>

        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed space-y-8 font-serif relative">
          <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-gray-200 to-transparent" />
          <div
            dangerouslySetInnerHTML={{
              __html: description,
            }}
            className="pl-8 relative"
          />
        </div>

        {brandText && (
          <div
            className="p-8 rounded-2xl relative bg-gradient-to-br from-white to-transparent transition-all duration-300 hover:shadow-xl border border-gray-100 group overflow-hidden"
            style={{
              backgroundColor: `${brandColor}05`,
            }}
          >
            <div
              className="absolute inset-y-0 left-0 w-1.5 rounded-l-2xl transition-all duration-300 group-hover:w-2"
              style={{ backgroundColor: brandColor }}
            />
            <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-gradient-to-br from-[var(--brand-color)]/5 to-transparent blur-3xl group-hover:scale-150 transition-transform duration-500" />
            <div className="relative">
              <svg
                className="absolute -top-4 -left-4 w-8 h-8 text-[var(--brand-color)] opacity-20"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <div
                dangerouslySetInnerHTML={{
                  __html: brandText,
                }}
                className="prose max-w-none italic text-gray-700 text-[0.95em] relative z-10"
              />
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-1 sticky top-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 space-y-6 transition-all duration-300 hover:shadow-xl">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden">
            <Image
              src={mainImage}
              alt={name}
              fill
              className="object-contain p-4 transition-all duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
          </div>
          <div className="space-y-3 text-center">
            <h3
              className="text-2xl font-semibold font-sans"
              style={{ color: brandColor }}
            >
              {name}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: brandColor }}
              />
              <span className="text-sm text-gray-500 font-medium">
                {locale === "ar" ? "علامة تجارية مميزة" : "Premium Brand"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDescription;
