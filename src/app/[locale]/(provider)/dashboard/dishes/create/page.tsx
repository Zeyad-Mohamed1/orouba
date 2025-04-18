"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/shared/FileUpload";
import { uploadFile } from "@/lib/imageUpload";

interface DishCategory {
  id: number;
  name_en: string;
  name_ar: string;
}

export default function CreateDishPage() {
  const { locale } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dishCategories, setDishCategories] = useState<DishCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    dishCategory_id: "",
  });

  useEffect(() => {
    async function fetchDishCategories() {
      try {
        const res = await fetch("/api/dish-categories");
        if (!res.ok) {
          throw new Error("Failed to fetch dish categories");
        }

        const data = await res.json();
        setDishCategories(data);
      } catch (err) {
        console.error("Error fetching dish categories:", err);
        setError(
          "Failed to load dish categories. Please refresh and try again."
        );
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchDishCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      // Upload image if selected
      let imagePath = "";
      if (imageFile) {
        try {
          imagePath = await uploadFile(imageFile);
        } catch (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError}`);
        }
      }

      const res = await fetch("/api/dishes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          dishCategory_id: parseInt(formData.dishCategory_id),
          image: imagePath || null,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      // Redirect to dishes list page
      router.push(`/${locale}/dashboard/dishes`);
      router.refresh();
    } catch (err) {
      console.error("Error creating dish:", err);
      setError(err instanceof Error ? err.message : "Failed to create dish");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === "ar" ? "إضافة أطباق جديدة" : "Add New Dishes"}
        </h1>
        <Link
          href={`/${locale}/dashboard/dishes`}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
        >
          <ArrowLeft size={16} className={locale === "ar" ? "ml-2" : "mr-2"} />
          {locale === "ar" ? "العودة إلى القائمة" : "Back to List"}
        </Link>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Selection */}
            <div className="md:col-span-2">
              <label
                htmlFor="dishCategory_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "الفئة" : "Category"}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="dishCategory_id"
                name="dishCategory_id"
                required
                value={formData.dishCategory_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoadingCategories}
              >
                <option value="">
                  {isLoadingCategories
                    ? locale === "ar"
                      ? "جاري التحميل..."
                      : "Loading..."
                    : locale === "ar"
                    ? "اختر الفئة"
                    : "Select Category"}
                </option>
                {dishCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {locale === "ar" ? category.name_ar : category.name_en}
                  </option>
                ))}
              </select>
            </div>

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
              disabled={isSubmitting || isLoadingCategories}
              className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                isSubmitting || isLoadingCategories
                  ? "opacity-50 cursor-not-allowed"
                  : ""
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
