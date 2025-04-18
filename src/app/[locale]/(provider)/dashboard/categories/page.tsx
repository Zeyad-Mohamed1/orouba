"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  image: string;
  brand_id: number;
  brand: {
    name_en: string;
    name_ar: string;
  };
  created_at: string;
}

const CategoriesPage = () => {
  const t = useTranslations("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error(t("loadingError"));
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(t("loadingError"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [t]);

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(t("deleteError"));
      }

      // Remove the deleted category from the state
      setCategories(categories?.filter((category) => category.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(t("deleteError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t("title")}
        buttonLabel={t("addCategory")}
        buttonHref="/dashboard/categories/add"
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
      ) : categories?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
          <p className="mb-4">{t("noCategories")}</p>
          <Link
            href="/dashboard/categories/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {t("addFirstCategory")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(categories) &&
            categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <Image
                  src={category?.image}
                  alt={category?.name_en}
                  width={300}
                  height={300}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {category?.name_en}
                  </h3>
                  <p className="text-sm text-gray-500">{category?.name_ar}</p>
                  <div className="text-xs text-gray-600 mt-1">
                    {t("brandLabel")}: {category?.brand?.name_en} |{" "}
                    {category?.brand?.name_ar}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {t("addedOn")}{" "}
                    {new Date(category.created_at).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      href={`/dashboard/categories/${category.id}`}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                    >
                      {t("view")}
                    </Link>
                    <Link
                      href={`/dashboard/categories/${category.id}/edit`}
                      className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded text-sm font-medium hover:bg-amber-200 transition-colors"
                    >
                      {t("edit")}
                    </Link>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
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

export default CategoriesPage;
