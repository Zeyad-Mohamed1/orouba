import { ArrowRightIcon } from "lucide-react";
import { ArrowLeftIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

const WhyUs = () => {
  const t = useTranslations("home.why-us");
  const locale = useLocale();
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-8">
      {/* Left side - Images */}
      <div className="w-full md:w-1/2 relative">
        <div className="relative w-full h-[500px]">
          <Image
            src="/images/why.png"
            alt="Orouba Products Display"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 space-y-6">
        <h2 className="text-4xl font-bold text-[#003B71]">{t("title")}</h2>
        <h3 className="text-xl font-semibold text-[#003B71]">
          {t("subtitle")}
        </h3>
        <p className="text-lg leading-relaxed text-[#2C5282]">
          {t("description")}
        </p>
        <button className="bg-yellow-400 hover:bg-yellow-500 text-[#003B71] font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center gap-2">
          {t("button")}
          <span className="text-xl">
            {locale === "en" ? <ArrowRightIcon /> : <ArrowLeftIcon />}
          </span>
        </button>
      </div>
    </div>
  );
};

export default WhyUs;
