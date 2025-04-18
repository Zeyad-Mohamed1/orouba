"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Standard from "@/app/[locale]/components/Standards";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "react-hot-toast";
import {
  Form,
  FormGroup,
  FormLabel,
  FormInput,
  FormHelperText,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(6, { message: "Phone number is required" }),
  details: z
    .string()
    .min(10, { message: "Please provide more details about your request" }),
});

const Export = () => {
  const t = useTranslations("export");
  const headerT = useTranslations("home.header");
  const certT = useTranslations("certifications");
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      details: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/export-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      toast.success(t("form.successMessage"));
      form.reset();
    } catch (error) {
      toast.error(t("form.errorMessage"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

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

  const certifications = [
    {
      image: "/images/certifications/iso-45001.png",
      alt: "ISO 45001",
      width: 180,
      height: 180,
      label: "ISO 45001",
    },
    {
      image: "/images/certifications/iso-22000.png",
      alt: "ISO 22000",
      width: 180,
      height: 180,
      label: "ISO 22000",
    },
    {
      image: "/images/certifications/iso-14001.png",
      alt: "ISO 14001",
      width: 180,
      height: 180,
      label: "ISO 14001",
    },
    {
      image: "/images/certifications/iso-9001.png",
      alt: "ISO 9001",
      width: 180,
      height: 180,
      label: "ISO 9001",
    },
  ];

  const bottomCertifications = [
    {
      image: "/images/certifications/fda.png",
      alt: "FDA",
      width: 180,
      height: 180,
      label: "FDA Certification",
    },
    {
      image: "/images/certifications/sgs.png",
      alt: "SGS",
      width: 180,
      height: 180,
      label: "SGS Certification",
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
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
              {t("breadcrumb")}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <Image
            src="/images/export.png"
            alt="Global export routes"
            width={600}
            height={400}
            className="w-full"
            priority
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary">{t("title")}</h1>
          <p className="text-lg">{t("description")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-16 mb-12 text-center">
        <div className="font-medium text-primary text-xl">
          • {t("regions.africa")}
        </div>
        <div className="font-medium text-primary text-xl">
          • {t("regions.middleEast")}
        </div>
        <div className="font-medium text-primary text-xl">
          • {t("regions.europe")}
        </div>
        <div className="font-medium text-primary text-xl">
          • {t("regions.japan")}
        </div>
        <div className="font-medium text-primary text-xl">
          • {t("regions.australia")}
        </div>
        <div className="font-medium text-primary text-xl">
          • {t("regions.northAmerica")}
        </div>
      </div>

      {/* Global Map */}
      <div className="mt-12 w-full flex justify-center mb-20">
        <Image
          src="/images/map.jpg"
          alt="Global export map"
          width={1200}
          height={800}
          className="w-full rounded-lg shadow-md"
        />
      </div>

      {/* Standards Component */}
      <Standard />

      {/* Certifications Section */}
      <section className="py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#003B71] mb-8">
            {certT("title")}
          </h2>
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
            {certifications.map((cert, index) => (
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
                <p className="text-sm text-gray-700 font-medium">
                  {cert.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Row Certifications */}
          <motion.div
            variants={fadeIn}
            className="flex flex-wrap justify-center gap-8 md:gap-24"
          >
            {bottomCertifications.map((cert, index) => (
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
                <p className="text-sm text-gray-700 font-medium">
                  {cert.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Export Request Form */}
      <motion.section
        className="py-16 mb-20 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-primary to-blue-600"></div>
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-[#003B71] mb-3">
              {t("form.title")}
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t("form.description")}
            </p>
          </motion.div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup>
                  <FormLabel className="text-gray-700 font-medium text-sm">
                    {t("form.name")} <span className="text-primary">*</span>
                  </FormLabel>
                  <FormInput
                    placeholder={t("form.namePlaceholder")}
                    className="bg-gray-50 border-gray-200 rounded-md h-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    {...form.register("name")}
                  />
                  {form.formState.errors.name && (
                    <FormHelperText error>
                      {form.formState.errors.name.message}
                    </FormHelperText>
                  )}
                </FormGroup>

                <FormGroup>
                  <FormLabel className="text-gray-700 font-medium text-sm">
                    {t("form.email")} <span className="text-primary">*</span>
                  </FormLabel>
                  <FormInput
                    placeholder={t("form.emailPlaceholder")}
                    type="email"
                    className="bg-gray-50 border-gray-200 rounded-md h-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <FormHelperText error>
                      {form.formState.errors.email.message}
                    </FormHelperText>
                  )}
                </FormGroup>
              </div>

              <FormGroup>
                <FormLabel className="text-gray-700 font-medium text-sm">
                  {t("form.phone")} <span className="text-primary">*</span>
                </FormLabel>
                <FormInput
                  placeholder={t("form.phonePlaceholder")}
                  className="bg-gray-50 border-gray-200 rounded-md h-11 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <FormHelperText error>
                    {form.formState.errors.phone.message}
                  </FormHelperText>
                )}
              </FormGroup>

              <FormGroup>
                <FormLabel className="text-gray-700 font-medium text-sm">
                  {t("form.details")} <span className="text-primary">*</span>
                </FormLabel>
                <Textarea
                  placeholder={t("form.detailsPlaceholder")}
                  className="min-h-[150px] bg-gray-50 border-gray-200 rounded-md focus:border-primary focus:ring-1 focus:ring-primary resize-none transition-all duration-200"
                  {...form.register("details")}
                />
                {form.formState.errors.details && (
                  <FormHelperText error>
                    {form.formState.errors.details.message}
                  </FormHelperText>
                )}
              </FormGroup>

              <div className="text-center pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-primary hover:bg-primary/90 text-white font-medium px-8 py-2.5 rounded-md shadow-sm transition-all duration-200 flex items-center justify-center mx-auto ${
                    isSubmitting ? "cursor-not-allowed opacity-70" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {t("form.submitting")}
                    </>
                  ) : (
                    t("form.submit")
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Export;
