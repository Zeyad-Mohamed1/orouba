"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/dashboard/ProductForm";
import PageHeader from "@/components/shared/PageHeader";

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

export default function CreateProductPage() {
  const { locale } = useParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleCreateProduct = async (
    data: ProductFormData,
    imageFile: File | null
  ) => {
    try {
      // Create form data to handle file upload
      const formData = new FormData();

      // Add all product data fields
      formData.append("name_en", data.name_en);
      formData.append("name_ar", data.name_ar);
      formData.append("description_en", data.description_en);
      formData.append("description_ar", data.description_ar);
      formData.append("color", data.color);
      formData.append("category_id", data.category_id.toString());

      // Add image file if exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Send request to API
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      // Redirect to products list on success
      router.push(`/${locale}/dashboard/products`);
    } catch (err) {
      console.error("Error creating product:", err);
      setError(
        locale === "ar"
          ? "حدث خطأ أثناء إنشاء المنتج"
          : "An error occurred while creating the product"
      );
      throw err;
    }
  };

  return (
    <div>
      <PageHeader
        title={locale === "ar" ? "إنشاء منتج جديد" : "Create New Product"}
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
        <ProductForm onSubmit={handleCreateProduct} isEditing={false} />
      </div>
    </div>
  );
}
