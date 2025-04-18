"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/shared/FileUpload";
import { uploadFile } from "@/lib/imageUpload";
import PageHeader from "@/components/shared/PageHeader";

interface DishCategory {
  id: number;
  name_ar: string;
  name_en: string;
  image: string | null;
}

export default function EditDishCategoryPage() {
  const { locale, id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    image: "",
  });

  useEffect(() => {
    const fetchDishCategory = async () => {
      try {
        const res = await fetch(`/api/dish-categories/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch dish category");
        }
        const data: DishCategory = await res.json();
        setFormData({
          name_ar: data.name_ar,
          name_en: data.name_en,
          image: data.image || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishCategory();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload new image if selected
      let imagePath = undefined;
      if (imageFile) {
        try {
          imagePath = await uploadFile(imageFile);
        } catch (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError}`);
        }
      }

      const res = await fetch(`/api/dish-categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...(imagePath && { image: imagePath }),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      // Redirect to dish categories list page
      router.push(`/${locale}/dashboard/dish-categories`);
      router.refresh();
    } catch (err) {
      console.error("Error updating dish category:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update dish category"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={locale === "ar" ? "تعديل فئة الطعام" : "Edit Dish Category"}
        buttonLabel={locale === "ar" ? "العودة إلى القائمة" : "Back to List"}
        buttonHref={`/dashboard/dish-categories`}
        buttonIcon="back"
      />

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic Name */}
            <div>
              <label
                htmlFor="name_ar"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "الاسم (عربي)" : "Name (Arabic)"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name_ar"
                name="name_ar"
                required
                value={formData.name_ar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={
                  locale === "ar"
                    ? "أدخل الاسم بالعربية"
                    : "Enter name in Arabic"
                }
              />
            </div>

            {/* English Name */}
            <div>
              <label
                htmlFor="name_en"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "الاسم (إنجليزي)" : "Name (English)"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name_en"
                name="name_en"
                required
                value={formData.name_en}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={
                  locale === "ar"
                    ? "أدخل الاسم بالإنجليزية"
                    : "Enter name in English"
                }
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "الصورة" : "Image"}
              </label>
              {formData.image && (
                <div className="mb-4">
                  <img
                    src={formData.image}
                    alt="Current category image"
                    className="w-40 h-40 object-cover rounded-lg"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {locale === "ar" ? "الصورة الحالية" : "Current Image"}
                  </p>
                </div>
              )}
              <FileUpload
                file={imageFile}
                onChange={setImageFile}
                accept="image/*"
                placeholderText={
                  locale === "ar"
                    ? "انقر للتحميل أو اسحب وأفلت"
                    : "Click to upload or drag and drop"
                }
              />
              <p className="mt-1 text-xs text-gray-500">
                {locale === "ar"
                  ? "الحد الأقصى للحجم: 10 ميجابايت. الصيغ المدعومة: JPG، PNG، GIF"
                  : "Max file size: 10MB. Supported formats: JPG, PNG, GIF"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  {locale === "ar" ? "جاري الحفظ..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save
                    size={16}
                    className={locale === "ar" ? "ml-2" : "mr-2"}
                  />
                  {locale === "ar" ? "حفظ" : "Save"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
