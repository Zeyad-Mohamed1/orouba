"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  color: string;
  image: string;
  category: {
    id: number;
    name_en: string;
    name_ar: string;
  };
  created_at: string;
  updated_at: string;
}

export default function ProductDetail() {
  const { locale, id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(
          locale === "ar"
            ? "فشل في تحميل بيانات المنتج"
            : "Failed to load product data"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, locale]);

  const handleDelete = async () => {
    if (
      window.confirm(
        locale === "ar"
          ? "هل أنت متأكد من حذف هذا المنتج؟"
          : "Are you sure you want to delete this product?"
      )
    ) {
      try {
        const res = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete product");
        }

        // Redirect to products list
        router.push(`/${locale}/dashboard/products`);
      } catch (err) {
        console.error(err);
        setError(
          locale === "ar" ? "فشل في حذف المنتج" : "Failed to delete product"
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
        {locale === "ar" ? "المنتج غير موجود" : "Product not found"}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href={`/${locale}/dashboard/products`}
            className="mr-3 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {locale === "ar" ? product.name_ar : product.name_en}
          </h1>
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/${locale}/dashboard/products/${id}/edit`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Pencil size={16} className="mr-2" />
            {locale === "ar" ? "تعديل" : "Edit"}
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            <Trash2 size={16} className="mr-2" />
            {locale === "ar" ? "حذف" : "Delete"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {product.image && (
                <img
                  src={product.image}
                  alt={locale === "ar" ? product.name_ar : product.name_en}
                  className="w-full h-auto rounded-lg object-cover"
                />
              )}
              <div
                className="mt-4 p-3 rounded-md"
                style={{ backgroundColor: product.color + "33" }}
              >
                <div className="flex items-center">
                  <span
                    className="h-6 w-6 rounded-full inline-block mr-2"
                    style={{ backgroundColor: product.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {product.color}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {locale === "ar" ? "التفاصيل" : "Details"}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {locale === "ar"
                        ? "الاسم (الإنجليزية)"
                        : "Name (English)"}
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {product.name_en}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {locale === "ar" ? "الاسم (العربية)" : "Name (Arabic)"}
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {product.name_ar}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {locale === "ar" ? "الفئة" : "Category"}
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {locale === "ar"
                        ? product.category.name_ar
                        : product.category.name_en}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {locale === "ar" ? "تاريخ الإنشاء" : "Created At"}
                    </p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(product.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {locale === "ar"
                    ? "الوصف (الإنجليزية)"
                    : "Description (English)"}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.description_en,
                  }}
                  className="prose max-w-none"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {locale === "ar" ? "الوصف (العربية)" : "Description (Arabic)"}
                </h3>
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.description_ar,
                  }}
                  className="prose max-w-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
