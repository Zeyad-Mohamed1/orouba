"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
const OurMap = () => {
  const t = useTranslations("home");
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B73] mb-4">
              {t("ourMap.title")}
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              {t("ourMap.description")}
            </p>
            <button className="bg-[#FFE500] text-[#003B73] font-semibold px-6 py-3 rounded-lg hover:bg-[#FFD700] transition-colors">
              {t("ourMap.button")}
            </button>
          </div>
          <div className="relative w-full md:w-1/2">
            <Image
              src="/images/map.jpg"
              alt="Orouba World Map showing presence in multiple continents"
              width={800}
              height={500}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMap;
