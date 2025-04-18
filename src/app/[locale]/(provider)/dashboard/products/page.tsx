"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react";

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
}

export default function ProductsPage() {
  const { locale } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId: number) => {
    if (
      window.confirm(
        locale === "ar"
          ? "هل أنت متأكد من حذف هذا المنتج؟"
          : "Are you sure you want to delete this product?"
      )
    ) {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete product");
        }

        // Update UI by removing the deleted product
        setProducts(products.filter((product) => product.id !== productId));
      } catch (err) {
        console.error("Error deleting product:", err);
        alert(
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === "ar" ? "المنتجات" : "Products"}
        </h1>
        <Link
          href={`/${locale}/dashboard/products/create`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusCircle size={16} className="mr-2" />
          {locale === "ar" ? "إضافة منتج جديد" : "Add New Product"}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "الصورة" : "Image"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "الاسم" : "Name"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "الفئة" : "Category"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "اللون" : "Color"}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {locale === "ar" ? "الإجراءات" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="text-center">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={
                            locale === "ar" ? product.name_ar : product.name_en
                          }
                          className="h-10 w-10 rounded-full object-cover mx-auto"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {locale === "ar" ? product.name_ar : product.name_en}
                      </div>
                      <div className="text-sm text-gray-500">
                        {locale === "ar" ? product.name_en : product.name_ar}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {locale === "ar"
                        ? product.category.name_ar
                        : product.category.name_en}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="h-6 w-6 rounded-full inline-block"
                        style={{ backgroundColor: product.color }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex justify-center">
                      <div className="flex space-x-3">
                        <Link
                          href={`/${locale}/dashboard/products/${product.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title={locale === "ar" ? "عرض" : "View"}
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/${locale}/dashboard/products/${product.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title={locale === "ar" ? "تعديل" : "Edit"}
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title={locale === "ar" ? "حذف" : "Delete"}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    {locale === "ar"
                      ? "لا توجد منتجات متاحة حاليًا"
                      : "No products available yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
