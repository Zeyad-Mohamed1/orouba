"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Heart,
  Award,
  Globe,
  Users,
  HandshakeIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const Certifications = () => {
  const { locale } = useParams();
  const t = useTranslations("certifications");
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

  const topRowCertifications = [
    {
      image: "/images/certifications/iso-45001.png",
      alt: "ISO 45001",
      width: 180,
      height: 180,
      label: t("iso45001"),
    },
    {
      image: "/images/certifications/iso-22000.png",
      alt: "ISO 22000",
      width: 180,
      height: 180,
      label: t("iso22000"),
    },
    {
      image: "/images/certifications/iso-14001.png",
      alt: "ISO 14001",
      width: 180,
      height: 180,
      label: t("iso14001"),
    },
    {
      image: "/images/certifications/iso-9001.png",
      alt: "ISO 9001",
      width: 180,
      height: 180,
      label: t("iso9001"),
    },
  ];

  const bottomRowCertifications = [
    {
      image: "/images/certifications/fda.png",
      alt: "FDA",
      width: 180,
      height: 180,
      label: t("fda"),
    },
    {
      image: "/images/certifications/iso-17025.png",
      alt: "ISO 17025",
      width: 180,
      height: 180,
      label: t("iso17025"),
    },
    {
      image: "/images/certifications/sgs.png",
      alt: "SGS",
      width: 180,
      height: 180,
      label: t("sgs"),
    },
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 mt-8 mb-16">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              {headerT("home")}
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="ml-1 text-sm font-medium text-gray-500">
              {headerT("certifications")}
            </span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-[#003B71] mb-8">
          {t("title")}
        </h1>
        <div className="max-w-4xl mx-auto text-center text-gray-700 text-lg">
          <p className="mb-4">{t("description.part1")}</p>
          <p>{t("description.part2")}</p>
        </div>
      </motion.div>

      {/* Certifications Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-16"
      >
        {/* Top Row Certifications */}
        <motion.div
          variants={fadeIn}
          className="flex flex-wrap justify-center gap-8 md:gap-12"
        >
          {topRowCertifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="flex flex-col items-center text-center max-w-[200px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={cert.image}
                alt={cert.alt}
                width={cert.width}
                height={cert.height}
                className="object-contain mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">{cert.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Row Certifications */}
        <motion.div
          variants={fadeIn}
          className="flex flex-wrap justify-center gap-8 md:gap-24"
        >
          {bottomRowCertifications.map((cert, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              className="flex flex-col items-center text-center max-w-[200px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={cert.image}
                alt={cert.alt}
                width={cert.width}
                height={cert.height}
                className="object-contain mb-4"
              />
              <p className="text-sm text-gray-700 font-medium">{cert.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Values Section */}
      <div className="relative mt-20 mb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/certifications/bg_certifications.png"
            alt="Background"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="relative z-10 py-16 px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#003B71] mb-6">
              {t("values.title")}
            </h2>
            <p className="max-w-4xl mx-auto text-center text-gray-700 text-lg">
              {t("values.description")}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-8"
          >
            {/* Collaboration Card */}
            <motion.div
              variants={fadeIn}
              className="bg-[#003B71] text-white rounded-lg p-8 shadow-lg max-w-sm flex flex-col items-center text-center"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 p-4 bg-[#0055a4] rounded-full">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M8 10C7.06812 10 6.60218 10 6.23463 10.1522C5.74458 10.3552 5.35523 10.7446 5.15224 11.2346C5 11.6022 5 12.0681 5 13" />
                  <path d="M8 10C8.93188 10 9.39782 10 9.76537 9.84776C10.2554 9.64477 10.6448 9.25542 10.8478 8.76537C11 8.39782 11 7.93188 11 7" />
                  <path d="M13 7C13 7.93188 13 8.39782 13.1522 8.76537C13.3552 9.25542 13.7446 9.64477 14.2346 9.84776C14.6022 10 15.0681 10 16 10" />
                  <path d="M16 10C16.9319 10 17.3978 10 17.7654 10.1522C18.2554 10.3552 18.6448 10.7446 18.8478 11.2346C19 11.6022 19 12.0681 19 13" />
                  <path d="M5 13V13.8C5 14.9201 5 15.4802 5.21799 15.908C5.40973 16.2843 5.71569 16.5903 6.09202 16.782C6.51984 17 7.07989 17 8.2 17H15.8C16.9201 17 17.4802 17 17.908 16.782C18.2843 16.5903 18.5903 16.2843 18.782 15.908C19 15.4802 19 14.9201 19 13.8V13" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t("values.collaboration.title")}
              </h3>
              <p>{t("values.collaboration.description")}</p>
            </motion.div>

            {/* Integrity Card */}
            <motion.div
              variants={fadeIn}
              className="bg-[#003B71] text-white rounded-lg p-8 shadow-lg max-w-sm flex flex-col items-center text-center"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 p-4 bg-[#0055a4] rounded-full">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t("values.integrity.title")}
              </h3>
              <p>{t("values.integrity.description")}</p>
            </motion.div>

            {/* Excellence Card */}
            <motion.div
              variants={fadeIn}
              className="bg-[#003B71] text-white rounded-lg p-8 shadow-lg max-w-sm flex flex-col items-center text-center"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 p-4 bg-[#0055a4] rounded-full">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t("values.excellence.title")}
              </h3>
              <p>{t("values.excellence.description")}</p>
            </motion.div>

            {/* Social Responsibility Card */}
            <motion.div
              variants={fadeIn}
              className="bg-[#003B71] text-white rounded-lg p-8 shadow-lg max-w-sm flex flex-col items-center text-center"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 p-4 bg-[#0055a4] rounded-full">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t("values.socialResponsibility.title")}
              </h3>
              <p>{t("values.socialResponsibility.description")}</p>
            </motion.div>

            {/* Customer Focus Card */}
            <motion.div
              variants={fadeIn}
              className="bg-[#003B71] text-white rounded-lg p-8 shadow-lg max-w-sm flex flex-col items-center text-center"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6 p-4 bg-[#0055a4] rounded-full">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <path d="m9 3 1 2 2-1-1 2 2 1-2 1 1 2-2-1-1 2-1-2-2 1 1-2-2-1 2-1-1-2 2 1Z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">
                {t("values.customerFocus.title")}
              </h3>
              <p>{t("values.customerFocus.description")}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Certifications;
