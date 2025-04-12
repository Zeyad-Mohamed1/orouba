"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const Standard = () => {
  const t = useTranslations("home.standards");
  const standards = [
    {
      icon: "/images/no-preservatives-icon.png",
      text: t("noPreservatives"),
    },
    {
      icon: "/images/selection-icon.png",
      text: t("selection"),
    },
    {
      icon: "/images/freezing-icon.png",
      text: t("freezing"),
    },
  ];

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[#003B71] tracking-tight mb-4 leading-[1.2]">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {standards.map((standard, index) => (
            <div
              key={index}
              className="group relative bg-[#003B71] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#003B71] to-[#004d94] opacity-90" />
              <div className="absolute inset-0">
                <Image
                  src="/images/standards_bg.png"
                  alt="Background pattern"
                  fill
                  className="object-cover opacity-5 group-hover:opacity-10 transition-opacity duration-300"
                />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 mb-6 rounded-full bg-white/10 p-4 backdrop-blur-sm ring-2 ring-white/20 group-hover:ring-white/30 transition-all duration-300">
                  <div className="relative w-full h-full">
                    <Image
                      src={standard.icon}
                      alt={`Standard ${index + 1}`}
                      fill
                      className="object-contain p-2 drop-shadow-lg"
                    />
                  </div>
                </div>
                <p className="text-white text-center text-base sm:text-lg font-medium leading-relaxed">
                  {standard.text}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button
            variant="outline"
            size="default"
            className="bg-white text-[#003B71] border border-[#003B71]/80 hover:border-[#003B71] hover:bg-[#003B71]/5 hover:text-[#003B71] transition-all duration-300 group font-medium"
          >
            {t("button")}
            <svg
              className="ml-2 w-4 h-4 inline-block transition-transform duration-300 group-hover:translate-x-1 opacity-80 group-hover:opacity-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Standard;
