"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";


interface Brand {
  id: number;
  name_ar: string;
  name_en: string;
  color: string;
  main_image: string | null;
  created_at: string;
}

const BrandsPage = () => {
  const t = useTranslations("brands");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands", {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(t("loadingError"));
        }
        const data = await response.json();
        setBrands(data);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError(t("loadingError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [t]);

  console.log("brands", brands);

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(t("deleteError"));
      }

      // Remove the deleted brand from the state
      setBrands(brands.filter((brand) => brand.id !== id));
    } catch (err) {
      console.error("Error deleting brand:", err);
      setError(t("deleteError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t("title")}
        buttonLabel={t("addBrand")}
        buttonHref="/dashboard/brands/add"
      />

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="sr-only">{t("loading")}</span>
        </div>
      ) : brands?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
          <p className="mb-4">{t("noBrands")}</p>
          <Link
            href="/dashboard/brands/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {t("addFirstBrand")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands?.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div
                className="h-32 bg-cover bg-center"
                style={{
                  backgroundColor: brand.color,
                  backgroundImage: brand.main_image
                    ? `url(${brand.main_image})`
                    : "none",
                }}
              ></div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">
                  {brand.name_en}
                </h3>
                <p className="text-sm text-gray-500">{brand.name_ar}</p>
                <div className="mt-2 text-xs text-gray-400">
                  Added on{" "}
                  {new Date(brand.created_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/dashboard/brands/${brand.id}`}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    {t("view")}
                  </Link>
                  <Link
                    href={`/dashboard/brands/${brand.id}/edit`}
                    className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded text-sm font-medium hover:bg-amber-200 transition-colors"
                  >
                    {t("edit")}
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(brand.id)}
                    className="px-3 py-1.5 inline-flex items-center justify-center"
                    title={t("delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">{t("delete")}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandsPage;
