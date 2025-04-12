import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const t = useTranslations("home.hero");
  const locale = useLocale();
  return (
    <section className="container mx-auto py-6 md:py-12 px-3 md:px-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
      <div className="w-full md:w-1/2">
        <Image
          src="/images/vision.png"
          alt="Mixed frozen vegetables"
          width={600}
          height={400}
          className="rounded-lg w-[90%] md:w-full mx-auto"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 space-y-2 md:space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800">
          {t("title")}
        </h2>

        <p className="text-gray-700 text-lg md:text-xl">{t("description")}</p>

        <div className="pt-2 md:pt-4">
          <Link
            href="/about"
            className="inline-block px-4 md:px-6 py-2 md:py-3 bg-yellow-400 text-blue-900 font-bold rounded-lg hover:bg-yellow-500 transition-colors text-sm md:text-base"
          >
            {locale === "ar" ? "عن العروبة" : "About Us"}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
