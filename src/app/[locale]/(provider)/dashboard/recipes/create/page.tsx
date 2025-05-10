"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Minus, X } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/shared/FileUpload";
import { uploadFile } from "@/lib/imageUpload";
import { v4 as uuidv4 } from "uuid";

interface Dish {
  id: number;
  name_en: string;
  name_ar: string;
}

interface Product {
  id: number;
  name_en: string;
  name_ar: string;
}

interface Ingredient {
  id: string;
  text_ar: string;
  text_en: string;
}

interface Instruction {
  id: string;
  text_ar: string;
  text_en: string;
}

export default function CreateRecipePage() {
  const { locale } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: uuidv4(), text_ar: "", text_en: "" },
  ]);
  const [instructions, setInstructions] = useState<Instruction[]>([
    { id: uuidv4(), text_ar: "", text_en: "" },
  ]);

  const [formData, setFormData] = useState({
    level: "easy",
    prep_time: "",
    cooking_time: "",
    servings: "",
    dish_id: "",
    product_id: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch dishes
        const dishesRes = await fetch("/api/dishes");
        if (!dishesRes.ok) {
          throw new Error("Failed to fetch dishes");
        }
        const dishesData = await dishesRes.json();
        setDishes(dishesData);

        // Fetch products
        const productsRes = await fetch("/api/products");
        if (!productsRes.ok) {
          throw new Error("Failed to fetch products");
        }
        const productsData = await productsRes.json();
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          "Failed to load necessary data. Please refresh and try again."
        );
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData();
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

  const handleIngredientChange = (
    id: string,
    field: "text_ar" | "text_en",
    value: string
  ) => {
    setIngredients(
      ingredients.map((ingredient) =>
        ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  const handleInstructionChange = (
    id: string,
    field: "text_ar" | "text_en",
    value: string
  ) => {
    setInstructions(
      instructions.map((instruction) =>
        instruction.id === id ? { ...instruction, [field]: value } : instruction
      )
    );
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: uuidv4(), text_ar: "", text_en: "" },
    ]);
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
    }
  };

  const addInstruction = () => {
    setInstructions([
      ...instructions,
      { id: uuidv4(), text_ar: "", text_en: "" },
    ]);
  };

  const removeInstruction = (id: string) => {
    if (instructions.length > 1) {
      setInstructions(
        instructions.filter((instruction) => instruction.id !== id)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate ingredients and instructions
      const allIngredientsValid = ingredients.every(
        (ingredient) => ingredient.text_ar.trim() && ingredient.text_en.trim()
      );

      const allInstructionsValid = instructions.every(
        (instruction) =>
          instruction.text_ar.trim() && instruction.text_en.trim()
      );

      if (!allIngredientsValid || !allInstructionsValid) {
        throw new Error(
          "All ingredients and instructions must be filled in both languages"
        );
      }

      // Upload image if selected
      let imagePath = "";
      if (imageFile) {
        try {
          imagePath = await uploadFile(imageFile);
        } catch (uploadError) {
          throw new Error(`Failed to upload image: ${uploadError}`);
        }
      }

      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          prep_time: parseInt(formData.prep_time),
          cooking_time: parseInt(formData.cooking_time),
          servings: parseInt(formData.servings),
          dish_id: parseInt(formData.dish_id),
          product_id: formData.product_id
            ? parseInt(formData.product_id)
            : null,
          image: imagePath || null,
          ingredients,
          instructions,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      // Redirect to recipes list page
      router.push(`/${locale}/dashboard/recipes`);
      router.refresh();
    } catch (err) {
      console.error("Error creating recipe:", err);
      setError(err instanceof Error ? err.message : "Failed to create recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === "ar" ? "إضافة وصفة جديدة" : "Add New Recipe"}
        </h1>
        <Link
          href={`/${locale}/dashboard/recipes`}
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
            {/* Cook Selection */}
            <div>
              <label
                htmlFor="dish_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "الأطباق" : "Dishes"}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="dish_id"
                name="dish_id"
                required
                value={formData.dish_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoadingData}
              >
                <option value="">
                  {isLoadingData
                    ? locale === "ar"
                      ? "جاري التحميل..."
                      : "Loading..."
                    : locale === "ar"
                      ? "اختر الأطباق"
                      : "Select Dishes"}
                </option>
                {dishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {locale === "ar" ? dish.name_ar : dish.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Selection (Optional) */}
            <div>
              <label
                htmlFor="product_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "المنتج (اختياري)" : "Product (Optional)"}
              </label>
              <select
                id="product_id"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isLoadingData}
              >
                <option value="">
                  {isLoadingData
                    ? locale === "ar"
                      ? "جاري التحميل..."
                      : "Loading..."
                    : locale === "ar"
                      ? "اختر المنتج (اختياري)"
                      : "Select Product (Optional)"}
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {locale === "ar" ? product.name_ar : product.name_en}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar" ? "مستوى الصعوبة" : "Difficulty Level"}
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
                {locale === "ar" ? "عدد الأشخاص" : "Servings"}
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
                placeholder={
                  locale === "ar"
                    ? "أدخل عدد الأشخاص"
                    : "Enter number of servings"
                }
              />
            </div>

            {/* Prep Time */}
            <div>
              <label
                htmlFor="prep_time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar"
                  ? "وقت التحضير (بالدقائق)"
                  : "Prep Time (minutes)"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="prep_time"
                name="prep_time"
                required
                min="1"
                value={formData.prep_time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={
                  locale === "ar"
                    ? "أدخل وقت التحضير بالدقائق"
                    : "Enter prep time in minutes"
                }
              />
            </div>

            {/* Cooking Time */}
            <div>
              <label
                htmlFor="cooking_time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {locale === "ar"
                  ? "وقت الطهي (بالدقائق)"
                  : "Cooking Time (minutes)"}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="cooking_time"
                name="cooking_time"
                required
                min="1"
                value={formData.cooking_time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={
                  locale === "ar"
                    ? "أدخل وقت الطهي بالدقائق"
                    : "Enter cooking time in minutes"
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

          {/* Ingredients Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {locale === "ar" ? "المكونات" : "Ingredients"}
                <span className="text-red-500">*</span>
              </h3>
              <button
                type="button"
                onClick={addIngredient}
                className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                <Plus size={14} className={locale === "ar" ? "ml-1" : "mr-1"} />
                {locale === "ar" ? "إضافة مكون" : "Add Ingredient"}
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-2 text-gray-500">
                    {index + 1}.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow">
                    <input
                      type="text"
                      value={ingredient.text_ar}
                      onChange={(e) =>
                        handleIngredientChange(
                          ingredient.id,
                          "text_ar",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={
                        locale === "ar"
                          ? "المكون بالعربية"
                          : "Ingredient in Arabic"
                      }
                      required
                    />
                    <input
                      type="text"
                      value={ingredient.text_en}
                      onChange={(e) =>
                        handleIngredientChange(
                          ingredient.id,
                          "text_en",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={
                        locale === "ar"
                          ? "المكون بالإنجليزية"
                          : "Ingredient in English"
                      }
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient.id)}
                    className="flex-shrink-0 p-2 text-red-600 hover:text-red-800"
                    title={locale === "ar" ? "حذف" : "Remove"}
                    disabled={ingredients.length <= 1}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {locale === "ar" ? "خطوات التحضير" : "Instructions"}
                <span className="text-red-500">*</span>
              </h3>
              <button
                type="button"
                onClick={addInstruction}
                className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                <Plus size={14} className={locale === "ar" ? "ml-1" : "mr-1"} />
                {locale === "ar" ? "إضافة خطوة" : "Add Step"}
              </button>
            </div>

            <div className="space-y-3">
              {instructions.map((instruction, index) => (
                <div key={instruction.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-2 text-gray-500">
                    {index + 1}.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-grow">
                    <textarea
                      value={instruction.text_ar}
                      onChange={(e) =>
                        handleInstructionChange(
                          instruction.id,
                          "text_ar",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={
                        locale === "ar" ? "الخطوة بالعربية" : "Step in Arabic"
                      }
                      rows={2}
                      required
                    />
                    <textarea
                      value={instruction.text_en}
                      onChange={(e) =>
                        handleInstructionChange(
                          instruction.id,
                          "text_en",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder={
                        locale === "ar"
                          ? "الخطوة بالإنجليزية"
                          : "Step in English"
                      }
                      rows={2}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeInstruction(instruction.id)}
                    className="flex-shrink-0 p-2 text-red-600 hover:text-red-800"
                    title={locale === "ar" ? "حذف" : "Remove"}
                    disabled={instructions.length <= 1}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingData}
              className={`inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${isSubmitting || isLoadingData
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
