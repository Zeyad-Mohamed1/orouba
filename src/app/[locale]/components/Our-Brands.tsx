"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";

interface Brand {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  brand_text_ar: string;
  brand_text_en: string;
  color: string;
  main_image: string;
  banner: string;
  small_img: string;
}

const BrandCard = ({ brand, locale }: { brand: Brand; locale: string }) => {
  return (
    <Link
      href={`/brands/${brand.id}`}
      className="block group hover:shadow-lg transition-shadow duration-300 rounded-lg p-4"
    >
      <div className="text-center">
        <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-lg">
          <Image
            src={brand.main_image}
            alt={locale === "ar" ? brand.name_ar : brand.name_en}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="text-2xl font-semibold text-[#003366] mb-2">
          {locale === "ar" ? brand.name_ar : brand.name_en}
        </h3>
      </div>
    </Link>
  );
};

const OurBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands");
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }
        const data = await response.json();
        setBrands(data.brands);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch brands");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (isLoading) {
    return (
      <div className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {[1, 2, 3].map((index) => (
                <div key={index}>
                  <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 px-4 md:px-8">
        <div className="container mx-auto text-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Return null if there are no brands
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-[#003366]">
          {locale === "ar" ? "علاماتنا التجارية" : "Our Brands"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurBrands;
