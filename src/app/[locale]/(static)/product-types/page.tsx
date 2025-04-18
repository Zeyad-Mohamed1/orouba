"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const ProductTypes = () => {
  const { locale } = useParams();
  const t = useTranslations("ProductTypes");
  const headerT = useTranslations("home.header");

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
              {headerT("productTypes")}
            </span>
          </li>
        </ol>
      </nav>

      {/* Product Types Header */}
      <div className="bg-yellow-200 rounded-lg p-8 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
          {t("title")}
        </h1>
        <p className="text-lg max-w-4xl mx-auto">{t("description")}</p>
      </div>

      {/* Product Types Cards */}
      <div className="flex flex-col gap-0">
        {/* Frozen Fruits Section */}
        <div className="flex flex-col lg:flex-row items-center bg-yellow-200 rounded-lg overflow-hidden">
          {/* Product Image */}
          <div className="w-full lg:w-1/2 p-8">
            <Image
              src="/images/product-types/image-1.png"
              alt="Frozen Fruits"
              width={600}
              height={600}
              className="rounded-lg"
            />
          </div>

          {/* Product Information */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {t("frozenFruitsTitle")}
            </h2>
            <p className="text-lg mb-8 text-center">
              {t("frozenFruitsDescription")}
            </p>

            {/* Brand Logos */}
            <div className="flex items-center space-x-6">
              <Image
                src="/images/product-types/farida.png"
                alt="Farida Brand"
                width={100}
                height={100}
              />
              <Image
                src="/images/product-types/basma.png"
                alt="Basma Brand"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>

        {/* Pre-Fried Section */}
        <div className="flex flex-col lg:flex-row-reverse items-center bg-yellow-200 rounded-lg overflow-hidden mt-[-1px]">
          {/* Product Image */}
          <div className="w-full lg:w-1/2 p-8">
            <Image
              src="/images/product-types/image-2.png"
              alt="Pre-Fried Products"
              width={600}
              height={600}
              className="rounded-lg"
            />
          </div>

          {/* Product Information */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {t("preFriedTitle")}
            </h2>
            <p className="text-lg mb-8 text-center">
              {t("preFriedDescription")}
            </p>

            {/* Brand Logos */}
            <div className="flex items-center space-x-6">
              <Image
                src="/images/product-types/farida.png"
                alt="Farida Brand"
                width={100}
                height={100}
              />
              <Image
                src="/images/product-types/basma.png"
                alt="Basma Brand"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>

        {/* Frozen Vegetables Section */}
        <div className="flex flex-col lg:flex-row items-center bg-yellow-200 rounded-lg overflow-hidden mt-[-1px]">
          {/* Product Image */}
          <div className="w-full lg:w-1/2 p-8">
            <Image
              src="/images/product-types/image-3.png"
              alt="Frozen Vegetables"
              width={600}
              height={600}
              className="rounded-lg"
            />
          </div>

          {/* Product Information */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {t("frozenVegetablesTitle")}
            </h2>
            <p className="text-lg mb-8 text-center">
              {t("frozenVegetablesDescription")}
            </p>

            {/* Brand Logos */}
            <div className="flex items-center space-x-6">
              <Image
                src="/images/product-types/farida.png"
                alt="Farida Brand"
                width={100}
                height={100}
              />
              <Image
                src="/images/product-types/basma.png"
                alt="Basma Brand"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>

        {/* Frozen Beans & Grains Section */}
        <div className="flex flex-col lg:flex-row-reverse items-center bg-yellow-200 rounded-lg overflow-hidden mt-[-1px]">
          {/* Product Image */}
          <div className="w-full lg:w-1/2 p-8">
            <Image
              src="/images/product-types/image-4.png"
              alt="Frozen Beans & Grains"
              width={600}
              height={600}
              className="rounded-lg"
            />
          </div>

          {/* Product Information */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
              {t("frozenBeansTitle")}
            </h2>
            <p className="text-lg mb-8 text-center">
              {t("frozenBeansDescription")}
            </p>

            {/* Brand Logos */}
            <div className="flex items-center space-x-6">
              <Image
                src="/images/product-types/farida.png"
                alt="Farida Brand"
                width={100}
                height={100}
              />
              <Image
                src="/images/product-types/basma.png"
                alt="Basma Brand"
                width={100}
                height={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTypes;
