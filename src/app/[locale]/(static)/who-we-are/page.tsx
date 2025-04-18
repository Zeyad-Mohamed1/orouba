"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const WhoWeAre = () => {
  const { locale } = useParams();
  const t = useTranslations("whoWeAre");
  const headerT = useTranslations("home.header");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const topRowStats = [
    {
      icon: "/images/who-we-are/area.png",
      title: t("factoryStats.area.title"),
      description: t("factoryStats.area.description"),
    },
    {
      icon: "/images/who-we-are/employees.png",
      title: t("factoryStats.employees.title"),
      description: t("factoryStats.employees.description"),
    },
    {
      icon: "/images/who-we-are/capacity.png",
      title: t("factoryStats.capacity.title"),
      description: t("factoryStats.capacity.description"),
    },
  ];

  const bottomRowStats = [
    {
      icon: "/images/who-we-are/products.png",
      title: t("factoryStats.preFried.title"),
      description: t("factoryStats.preFried.description"),
    },
    {
      icon: "/images/who-we-are/cold-store.png",
      title: t("factoryStats.coldStore.title"),
      description: t("factoryStats.coldStore.description"),
    },
  ];

  const productionSteps1 = [
    {
      step: "1",
      title: t("productionSteps.step1.title"),
      description: t("productionSteps.step1.description"),
    },
    {
      step: "2",
      title: t("productionSteps.step2.title"),
      description: t("productionSteps.step2.description"),
    },
    {
      step: "3",
      title: t("productionSteps.step3.title"),
      description: t("productionSteps.step3.description"),
    },
  ];

  const productionSteps2 = [
    {
      step: "4",
      title: t("productionSteps.step4.title"),
      description: t("productionSteps.step4.description"),
    },
    {
      step: "5",
      title: t("productionSteps.step5.title"),
      description: t("productionSteps.step5.description"),
    },
    {
      step: "6",
      title: t("productionSteps.step6.title"),
      description: t("productionSteps.step6.description"),
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 mt-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              {headerT("home")}
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="ml-1 text-sm font-medium text-gray-500">
              {headerT("whoWeAre")}
            </span>
          </li>
        </ol>
      </nav>

      {/* Hero Image */}
      <div className="w-full">
        <Image
          src="/images/who-we-are/who-we-are.png"
          alt="Orouba Facility"
          width={1200}
          height={675}
          className="object-cover w-full"
          priority
        />
      </div>

      <div className="w-full">
        {/* About Us Section */}
        <section className="py-6 md:py-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B71] mb-4">
              {t("aboutUs.title")}
            </h2>
            <div className="text-gray-700 text-lg space-y-4 sm:text-lg">
              <p>{t("aboutUs.paragraph1")}</p>
            </div>
          </motion.div>
        </section>

        {/* Our Purpose Section */}
        <section className="py-6 md:py-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B71] mb-4">
              {t("ourPurpose.title")}
            </h2>
            <div className="text-gray-700 space-y-4 text-base sm:text-lg">
              <p>{t("ourPurpose.paragraph1")}</p>
            </div>
          </motion.div>
        </section>

        {/* Our Factory Section */}
        <section className="py-6 md:py-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B71] mb-4">
              {t("ourFactory.title")}
            </h2>
            <div className="text-gray-700 mb-6 text-base sm:text-lg">
              <p>{t("ourFactory.description")}</p>
            </div>

            {/* Building Information - Side by Side Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Building A */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold text-[#003B71] mb-4">
                  {t("ourFactory.buildingA.title")}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  {t("ourFactory.buildingA.description")}
                </p>
              </div>

              {/* Building B */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg sm:text-xl font-bold text-[#003B71] mb-4">
                  {t("ourFactory.buildingB.title")}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  {t("ourFactory.buildingB.description")}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Factory Statistics Section */}
        <section className="py-6 md:py-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B71] mb-6">
              {t("factoryStats.title")}
            </h2>

            <div className="space-y-8">
              {/* Top Row - 3 items */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row gap-8 justify-center flex-wrap"
              >
                {topRowStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    className="flex flex-col items-center text-center p-4 md:p-6 flex-1 min-w-[250px]"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 relative mb-4">
                      <Image
                        src={stat.icon}
                        alt={stat.title}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#003B71] mb-2">
                      {stat.title}
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base">
                      {stat.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Bottom Row - 2 items */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row gap-8 justify-center md:justify-evenly flex-wrap"
              >
                {bottomRowStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn}
                    className="flex flex-col items-center text-center p-4 md:p-6 max-w-[400px]"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 relative mb-4">
                      <Image
                        src={stat.icon}
                        alt={stat.title}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#003B71] mb-2">
                      {stat.title}
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base">
                      {stat.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Production Steps Section */}
        <section className="py-6 md:py-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B71] mb-6">
              {t("productionSteps.title")}
            </h2>

            {/* First set of steps with image on left */}
            <div className="flex flex-col md:flex-row gap-8 mb-10">
              {/* Image for steps 1-3 */}
              <div className="relative md:w-1/2">
                <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden rounded-lg transform rotate-1 shadow-xl">
                  <div className="absolute inset-0 bg-yellow-300 rounded-lg -z-10 transform translate-x-3 translate-y-3"></div>
                  <Image
                    src="/images/who-we-are/step-1.jpg"
                    alt="Production Process - Steps 1-3"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Steps 1-3 content */}
              <div className="md:w-1/2 space-y-6">
                {productionSteps1.map((step, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#003B71]">
                      {step.step}-{step.title}
                    </h3>
                    <p className="text-gray-700 mt-2 text-sm sm:text-base">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Second set of steps with image on right */}
            <div className="flex flex-col-reverse md:flex-row gap-8">
              {/* Steps 4-6 content */}
              <div className="md:w-1/2 space-y-6">
                {productionSteps2.map((step, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-[#003B71]">
                      {step.step}-{step.title}
                    </h3>
                    <p className="text-gray-700 mt-2 text-sm sm:text-base">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Image for steps 4-6 */}
              <div className="relative md:w-1/2">
                <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden rounded-lg transform -rotate-1 shadow-xl">
                  <div className="absolute inset-0 bg-yellow-300 rounded-lg -z-10 transform translate-x-3 translate-y-3"></div>
                  <Image
                    src="/images/who-we-are/step-2.jpg"
                    alt="Production Process - Steps 4-6"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Specialized processing quote section */}
            <div className="mt-12 relative px-6 md:px-10">
              <div className="text-[#003B71] text-base sm:text-xl md:text-2xl font-medium max-w-4xl mx-auto text-center relative">
                <span className="absolute -left-4 sm:-left-8 -top-4 text-4xl sm:text-6xl text-[#003B71] opacity-30">
                  "
                </span>
                <p className="text-sm sm:text-base md:text-xl lg:text-2xl">
                  {t("productionSteps.specializedProcessing")}
                </p>
                <span className="absolute -right-4 sm:-right-8 -bottom-4 text-4xl sm:text-6xl text-[#003B71] opacity-30">
                  "
                </span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default WhoWeAre;
