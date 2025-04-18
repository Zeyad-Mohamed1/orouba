"use client";

import React from "react";
import { useTranslations } from "next-intl";

const WhyChooseUs = () => {
  const t = useTranslations("Careers.whyChooseUs");

  const reasonItems = [
    {
      id: 1,
      key: "dynamicEnvironment",
    },
    {
      id: 2,
      key: "benefits",
    },
    {
      id: 3,
      key: "careerDevelopment",
    },
    {
      id: 4,
      key: "makeADifference",
    },
    {
      id: 5,
      key: "growthOpportunities",
    },
    {
      id: 6,
      key: "innovation",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-sm">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t("title")}
          </h2>

          <p className="text-lg text-gray-600 mb-8">{t("description")}</p>
          <div className="w-24 h-1 bg-primary/20 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {reasonItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-primary/20 group"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-5">
                  <div className="w-14 h-14 bg-primary/10 group-hover:bg-primary/20 rounded-full flex items-center justify-center text-2xl font-bold text-primary transition-colors duration-300">
                    {item.id}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {t(`reasons.${item.key}.title`)}
                  </h3>
                  <p className="text-gray-600">
                    {t(`reasons.${item.key}.description`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
