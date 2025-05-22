"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import Image from "next/image";

interface Brand {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  brand_text_ar: string;
  brand_text_en: string;
  color: string;
  main_image: string | null;
  banner: string | null;
  small_img: string | null;
  created_at: string;
}

export default function BrandDetailPage() {
  const params = useParams();
  const brandId = params.id as string;
  const t = useTranslations("brands");
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/brands/${brandId}`);
        if (!response.ok) {
          throw new Error(t("loadingError"));
        }
        const data = await response.json();
        setBrand(data?.data);
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError(t("loadingError"));
      } finally {
        setIsLoading(false);
      }
    };

    if (brandId) {
      fetchBrand();
    }
  }, [brandId, t]);

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/brands/${brandId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(t("deleteError"));
      }

      // Redirect to brands list
      window.location.href = "/dashboard/brands";
    } catch (err) {
      console.error("Error deleting brand:", err);
      setError(t("deleteError"));
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageHeader
          title={t("brandDetails")}
          buttonLabel={t("back")}
          buttonHref="/dashboard/brands"
        />
        <div className="p-4 mt-6 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div>
        <PageHeader
          title={t("brandDetails")}
          buttonLabel={t("back")}
          buttonHref="/dashboard/brands"
        />
        <div className="p-4 mt-6 bg-amber-50 border border-amber-200 rounded-md text-amber-600">
          {t("brandNotFound")}
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t("brandDetails")}
        buttonLabel={t("back")}
        buttonHref="/dashboard/brands"
      />

      <div className="mt-6 flex gap-4">
        <Link
          href={`/dashboard/brands/${brandId}/edit`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          {t("edit")}
        </Link>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
          className="inline-flex items-center"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          {t("delete")}
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Basic Information */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{t("basicInfo")}</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("nameEn")}
                </h3>
                <p className="mt-1">{brand.name_en}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("nameAr")}
                </h3>
                <p className="mt-1 direction-rtl">{brand.name_ar}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("descriptionEn")}
                </h3>
                <div
                  className="mt-1 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: brand.description_en }}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("descriptionAr")}
                </h3>
                <div
                  className="mt-1 prose max-w-none direction-rtl"
                  dangerouslySetInnerHTML={{ __html: brand.description_ar }}
                />
              </div>
            </div>
          </section>

          {/* Brand Content */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{t("brandContent")}</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("brandTextEn")}
                </h3>
                <div
                  className="mt-1 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: brand.brand_text_en }}
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("brandTextAr")}
                </h3>
                <div
                  className="mt-1 prose max-w-none direction-rtl"
                  dangerouslySetInnerHTML={{ __html: brand.brand_text_ar }}
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Styling and Brand Color */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{t("styling")}</h2>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {t("brandColor")}
              </h3>
              <div className="mt-2 flex items-center space-x-2">
                <div
                  className="w-10 h-10 rounded border"
                  style={{ backgroundColor: brand.color }}
                />
                <span>{brand.color}</span>
              </div>
            </div>
          </section>

          {/* Media */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{t("media")}</h2>

            <div className="space-y-6">
              {brand.main_image && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {t("mainImage")}
                  </h3>
                  <Image
                    src={brand.main_image}
                    alt={brand.name_en}
                    className="w-full h-auto rounded-md"
                    width={1000}
                    height={1000}
                  />
                </div>
              )}

              {brand.small_img && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {t("smallImage")}
                  </h3>
                  <Image
                    src={brand.small_img}
                    alt={`${brand.name_en} ${t("small")}`}
                    className="w-full h-auto rounded-md"
                    width={1000}
                    height={1000}
                  />
                </div>
              )}

              {brand.banner && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    {t("banner")}
                  </h3>
                  {brand.banner.endsWith(".mp4") ||
                    brand.banner.includes("/video/") ? (
                    <video
                      src={brand.banner}
                      controls
                      className="w-full h-auto rounded-md"
                      aria-label={`${brand.name_en} ${t("bannerVideo")}`}
                    />
                  ) : (
                    <Image
                      src={brand.banner}
                      alt={`${brand.name_en} ${t("bannerImage")}`}
                      className="w-full h-auto rounded-md"
                      width={1000}
                      height={1000}
                    />
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Metadata */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{t("metadata")}</h2>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                {t("created")}
              </h3>
              <p className="mt-1">
                {new Date(brand.created_at).toLocaleDateString(
                  params.locale === "ar" ? "ar-EG" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
