"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/dashboard/ProductForm";
import PageHeader from "@/components/shared/PageHeader";

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
}

interface ProductFormData {
  id?: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  color: string;
  image: string;
  category_id: string | number;
}

export default function EditProduct() {
  const { locale, id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch product
        const productRes = await fetch(`/api/products/${id}`);
        if (!productRes.ok) {
          throw new Error("Failed to fetch product");
        }
        const productData = await productRes.json();
        setProduct(productData);
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

    fetchData();
  }, [id, locale]);

  const handleUpdateProduct = async (
    formData: ProductFormData,
    imageFile: File | null
  ) => {
    try {
      // Create form data for submission
      const dataToSend = new FormData();

      // Add all product data fields
      dataToSend.append("name_en", formData.name_en);
      dataToSend.append("name_ar", formData.name_ar);
      dataToSend.append("description_en", formData.description_en);
      dataToSend.append("description_ar", formData.description_ar);
      dataToSend.append("color", formData.color);
      dataToSend.append("category_id", formData.category_id.toString());

      // Add image file if exists, otherwise use existing image URL
      if (imageFile) {
        dataToSend.append("image", imageFile);
      } else if (formData.image) {
        // For existing images, we need to keep the path when sending to the API
        dataToSend.append("image", formData.image);
      }

      // Update product
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: dataToSend,
      });

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      // Redirect back to products list
      router.push(`/${locale}/dashboard/products`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={locale === "ar" ? "تعديل المنتج" : "Edit Product"}
        buttonLabel={locale === "ar" ? "الرجوع" : "Back"}
        buttonHref={`/dashboard/products`}
        buttonIcon="back"
      />

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        {product && (
          <ProductForm
            initialData={product}
            isEditing={true}
            onSubmit={handleUpdateProduct}
          />
        )}
      </div>
    </div>
  );
}
