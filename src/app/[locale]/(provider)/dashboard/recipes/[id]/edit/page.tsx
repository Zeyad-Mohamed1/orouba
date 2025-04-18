"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import { uploadFile } from "@/lib/imageUpload";
import PageHeader from "@/components/shared/PageHeader";

interface DishCategory {
  id: number;
  name_en: string;
  name_ar: string;
}

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
}

interface Recipe {
  id: number;
  level: string;
  prep_time: string;
  cooking_time: string;
  servings: number;
  image: string | null;
  ingredients: {
    id: number;
    text_ar: string;
    text_en: string;
  }[];
  instructions: {
    id: number;
    text_ar: string;
    text_en: string;
  }[];
  dish: {
    id: number;
    name_en: string;
    name_ar: string;
  };
  product?: {
    id: number;
    name_en: string;
    name_ar: string;
  } | null;
}

export default function EditRecipePage() {
  const { locale, id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [dishes, setDishes] = useState<DishCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    level: "",
    prep_time: "",
    cooking_time: "",
    servings: "",
    dish_id: "",
    product_id: "",
    image: "",
    ingredients: [] as { id: number; text_ar: string; text_en: string }[],
    instructions: [] as { id: number; text_ar: string; text_en: string }[],
  });

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch recipe");
        }
        const recipe: Recipe = await res.json();
        setFormData({
          level: recipe.level,
          prep_time: recipe.prep_time,
          cooking_time: recipe.cooking_time,
          servings: String(recipe.servings),
          dish_id: String(recipe.dish.id),
          product_id: recipe.product ? String(recipe.product.id) : "",
          image: recipe.image || "",
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  // Fetch dishes and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dishesRes, productsRes] = await Promise.all([
          fetch("/api/dish-categories"),
          fetch("/api/products"),
        ]);

        if (!dishesRes.ok || !productsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [dishesData, productsData] = await Promise.all([
          dishesRes.json(),
          productsRes.json(),
        ]);

        setDishes(dishesData);
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dishes and products");
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (
    index: number,
    value: string,
    field: "ingredients" | "instructions",
    lang: "text_ar" | "text_en"
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = {
        ...newArray[index],
        [lang]: value,
      };
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const addArrayItem = (field: "ingredients" | "instructions") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        { id: Math.random(), text_ar: "", text_en: "" },
      ],
    }));
  };

  const removeArrayItem = (
    index: number,
    field: "ingredients" | "instructions"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
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

      const res = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          servings: parseInt(formData.servings),
          dish_id: parseInt(formData.dish_id),
          product_id: formData.product_id
            ? parseInt(formData.product_id)
            : null,
          ...(imagePath && { image: imagePath }),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      router.push(`/${locale}/dashboard/recipes/${id}`);
      router.refresh();
    } catch (err) {
      console.error("Error updating recipe:", err);
      setError(err instanceof Error ? err.message : "Failed to update recipe");
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
        title={locale === "ar" ? "تعديل الوصفة" : "Edit Recipe"}
        buttonLabel={
          locale === "ar" ? "العودة إلى التفاصيل" : "Back to Details"
        }
        buttonHref={`/dashboard/recipes`}
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
            {/* Dish Selection */}
            <div>
              <label
                htmlFor="dish_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "الطبق" : "Dish"}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="dish_id"
                name="dish_id"
                required
                value={formData.dish_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  {locale === "ar" ? "اختر الطبق" : "Select Dish"}
                </option>
                {dishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {locale === "ar" ? dish.name_ar : dish.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Selection */}
            <div>
              <label
                htmlFor="product_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "المنتج" : "Product"}
              </label>
              <select
                id="product_id"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  {locale === "ar" ? "اختر المنتج" : "Select Product"}
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {locale === "ar" ? product.name_ar : product.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "المستوى" : "Level"}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="level"
                name="level"
                required
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">
                  {locale === "ar" ? "اختر المستوى" : "Select Level"}
                </option>
                <option value="easy">{locale === "ar" ? "سهل" : "Easy"}</option>
                <option value="medium">
                  {locale === "ar" ? "متوسط" : "Medium"}
                </option>
                <option value="hard">{locale === "ar" ? "صعب" : "Hard"}</option>
              </select>
            </div>

            {/* Servings */}
            <div>
              <label
                htmlFor="servings"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "عدد الحصص" : "Servings"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="servings"
                name="servings"
                required
                min="1"
                value={formData.servings}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Prep Time */}
            <div>
              <label
                htmlFor="prep_time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "وقت التحضير" : "Prep Time"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="prep_time"
                name="prep_time"
                required
                value={formData.prep_time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={
                  locale === "ar" ? "مثال: 30 دقيقة" : "e.g. 30 minutes"
                }
              />
            </div>

            {/* Cooking Time */}
            <div>
              <label
                htmlFor="cooking_time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "وقت الطهي" : "Cooking Time"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cooking_time"
                name="cooking_time"
                required
                value={formData.cooking_time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={locale === "ar" ? "مثال: ساعة" : "e.g. 1 hour"}
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
                    alt="Current recipe image"
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

            {/* Ingredients */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === "ar" ? "المكونات" : "Ingredients"}
                <span className="text-red-500">*</span>
              </label>
              {formData.ingredients.map((ingredient, index) => (
                <div
                  key={ingredient.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4"
                >
                  <div>
                    <input
                      type="text"
                      value={ingredient.text_ar}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          e.target.value,
                          "ingredients",
                          "text_ar"
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={
                        locale === "ar"
                          ? "أدخل المكون بالعربية"
                          : "Enter ingredient in Arabic"
                      }
                      dir="rtl"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ingredient.text_en}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          e.target.value,
                          "ingredients",
                          "text_en"
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={
                        locale === "ar"
                          ? "أدخل المكون بالإنجليزية"
                          : "Enter ingredient in English"
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "ingredients")}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >
                      {locale === "ar" ? "حذف" : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("ingredients")}
                className="mt-2 px-4 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
              >
                {locale === "ar" ? "إضافة مكون" : "Add Ingredient"}
              </button>
            </div>

            {/* Instructions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === "ar" ? "خطوات التحضير" : "Instructions"}
                <span className="text-red-500">*</span>
              </label>
              {formData.instructions.map((instruction, index) => (
                <div
                  key={instruction.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4"
                >
                  <div>
                    <textarea
                      value={instruction.text_ar}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          e.target.value,
                          "instructions",
                          "text_ar"
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={
                        locale === "ar"
                          ? "أدخل خطوة التحضير بالعربية"
                          : "Enter instruction in Arabic"
                      }
                      rows={2}
                      dir="rtl"
                    />
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      value={instruction.text_en}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          e.target.value,
                          "instructions",
                          "text_en"
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={
                        locale === "ar"
                          ? "أدخل خطوة التحضير بالإنجليزية"
                          : "Enter instruction in English"
                      }
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, "instructions")}
                      className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 h-fit"
                    >
                      {locale === "ar" ? "حذف" : "Remove"}
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("instructions")}
                className="mt-2 px-4 py-2 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
              >
                {locale === "ar" ? "إضافة خطوة" : "Add Instruction"}
              </button>
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
