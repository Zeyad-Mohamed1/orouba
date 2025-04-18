"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";

interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string | null;
  description_en: string | null;
  image: string;
  brand_id: number;
  brand: {
    id: number;
    name_en: string;
    name_ar: string;
  };
  created_at: string;
  updated_at: string;
}

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("categories");
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryId = params.id as string;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`);
        if (!response.ok) {
          throw new Error(t("loadingError"));
        }
        const data = await response.json();
        setCategory(data.category);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(t("loadingError"));
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, t]);

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete"))) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(t("deleteError"));
      }

      router.push("/dashboard/categories");
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(t("deleteError"));
      setIsDeleting(false);
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
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
        {error}
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-600">
        {t("categoryNotFound")}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={category.name_en}
        subtitle={category.name_ar}
        buttonLabel={t("backToCategories")}
        buttonHref="/dashboard/categories"
        buttonIcon="back"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-60 w-full">
              <div className="absolute inset-0">
                <img
                  src={category.image}
                  alt={category.name_en}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="p-4 border-t">
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">{t("brand")}:</span>{" "}
                <Link
                  href={`/dashboard/brands/${category.brand.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {category.brand.name_en} | {category.brand.name_ar}
                </Link>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">{t("created")}:</span>{" "}
                {new Date(category.created_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-medium">{t("updated")}:</span>{" "}
                {new Date(category.updated_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href={`/dashboard/categories/${category.id}/edit`}
              className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              {t("edit")}
            </Link>
            <Button
              variant="destructive"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              {isDeleting ? t("deleting") : t("delete")}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">{t("details")}</h2>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">{t("nameEn")}</h3>
              <p className="text-gray-700">{category.name_en}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">{t("nameAr")}</h3>
              <p className="text-gray-700" dir="rtl">
                {category.name_ar}
              </p>
            </div>

            {category.description_en && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  {t("descriptionEn")}
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {category.description_en}
                </p>
              </div>
            )}

            {category.description_ar && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  {t("descriptionAr")}
                </h3>
                <p className="text-gray-700 whitespace-pre-line" dir="rtl">
                  {category.description_ar}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
