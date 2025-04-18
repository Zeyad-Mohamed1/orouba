import { getBrandData } from "./components/getBrandData";
import BrandHero from "./components/BrandHero";
import BrandDescription from "./components/BrandDescription";
import BrandCategories from "./components/BrandCategories";
import ErrorMessage from "./components/ErrorMessage";
import BrandStyles from "./components/BrandStyles";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { Suspense } from "react";

interface BrandDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function BrandDetailPage({
  params,
}: BrandDetailPageProps) {
  const { locale, id: brandId } = await params;

  const { brand, error } = await getBrandData(brandId);

  if (error || !brand) {
    return <ErrorMessage error={error || "Brand not found"} locale={locale} />;
  }

  const brandColor = brand.color || "#003366";
  const categories = brand.categories || [];

  const brandName = locale === "ar" ? brand.name_ar : brand.name_en;
  const description =
    locale === "ar" ? brand.description_ar : brand.description_en;
  const brandText = locale === "ar" ? brand.brand_text_ar : brand.brand_text_en;

  return (
    <div
      className="min-h-screen bg-white"
      style={{ "--brand-color": brandColor } as React.CSSProperties}
    >
      <Suspense fallback={<LoadingSkeleton />}>
        {/* Hero Banner */}
        <BrandHero
          brandName={brandName}
          banner={brand.banner}
          brandColor={brandColor}
          locale={locale}
        />

        <div className="relative" id="brand-content">
          {/* Brand Description */}
          <div className="container mx-auto py-20 md:py-28 px-4 md:px-8">
            <BrandDescription
              name={brandName}
              description={description}
              brandText={brandText}
              brandColor={brandColor}
              mainImage={brand.main_image}
              locale={locale}
            />

            {/* Product Categories */}
            <BrandCategories
              categories={categories}
              brandId={brandId}
              brandName={brandName}
              brandColor={brandColor}
              locale={locale}
            />
          </div>
        </div>

        {/* CSS for animations and masonry layout */}
        <BrandStyles brandColor={brandColor} />
      </Suspense>
    </div>
  );
}
