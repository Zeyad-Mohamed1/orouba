import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FormSection,
  FormLabel,
  FormInput,
  FormTextarea,
  FormHelperText,
} from "@/components/ui/form";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import Editor from "@/components/ui/mdx-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Brand {
  id: number;
  name_en: string;
  name_ar: string;
}

interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  brand?: Brand;
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

interface ProductFormProps {
  initialData?: ProductFormData;
  isEditing?: boolean;
  onSubmit: (data: ProductFormData, imageFile: File | null) => Promise<void>;
}

export default function ProductForm({
  initialData,
  isEditing = false,
  onSubmit,
}: ProductFormProps) {
  const { locale } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name_en: "",
      name_ar: "",
      description_en: "",
      description_ar: "",
      color: "#000000",
      image: "",
      category_id: "",
    }
  );

  // State for handling image uploads
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(
    initialData?.image || null
  );

  // When initialData changes, update the existingImage
  useEffect(() => {
    if (initialData?.image) {
      setExistingImage(initialData.image);
    }
  }, [initialData]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        // Fetch categories with their associated brands
        const res = await fetch("/api/categories?include=brand");
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
        setError(
          locale === "ar" ? "فشل في تحميل الفئات" : "Failed to load categories"
        );
      }
    }

    fetchCategories();
  }, [locale]);

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

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category_id: value,
    }));
  };

  const handleRichTextChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);

    if (file) {
      // Create a preview of the new file
      const reader = new FileReader();
      reader.onload = () => {
        // This will replace the existing image preview
        setExistingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle file upload for rich text editor
  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // If there's no new image file but there is an existing image,
      // make sure to keep the existing image URL in the form data
      if (!imageFile && existingImage) {
        setFormData((prev) => ({
          ...prev,
          image: existingImage,
        }));
      }

      await onSubmit({ ...formData, image: existingImage || "" }, imageFile);
    } catch (err) {
      console.error(err);
      setError(
        locale === "ar"
          ? "حدث خطأ أثناء معالجة النموذج"
          : "An error occurred while processing the form"
      );
    } finally {
      setLoading(false);
    }
  };

  // Find selected category to show its brand information
  const selectedCategory = categories.find(
    (c) => c.id.toString() === formData.category_id.toString()
  );

  // Create the image URL for display
  const getImageUrl = (imagePath: string | null): string => {
    if (!imagePath) return "";

    // If it's already a data URL, return it as is
    if (imagePath.startsWith("data:")) {
      return imagePath;
    }

    // If it's a relative URL, make it absolute
    if (imagePath.startsWith("/")) {
      return `${window.location.origin}${imagePath}`;
    }

    // Otherwise, return as is
    return imagePath;
  };

  // Create a dummy file object when we want to show the existing image in FileUpload
  const createFileFromExistingImage = (): File | null => {
    if (!existingImage) return null;

    // If we already have a file, return that
    if (imageFile) return imageFile;

    // Otherwise, just return null since we'll handle displaying the image separately
    return null;
  };

  return (
    <div>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <FormSection
        title={locale === "ar" ? "بيانات المنتج" : "Product Information"}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormLabel htmlFor="name_en">
                {locale === "ar" ? "الاسم (الإنجليزية)" : "Name (English)"}
              </FormLabel>
              <FormInput
                id="name_en"
                name="name_en"
                value={formData.name_en}
                onChange={handleChange}
                placeholder={
                  locale === "ar"
                    ? "أدخل اسم المنتج بالإنجليزية"
                    : "Enter product name in English"
                }
                required
              />
            </div>

            <div>
              <FormLabel htmlFor="name_ar">
                {locale === "ar" ? "الاسم (العربية)" : "Name (Arabic)"}
              </FormLabel>
              <FormInput
                id="name_ar"
                name="name_ar"
                value={formData.name_ar}
                onChange={handleChange}
                placeholder={
                  locale === "ar"
                    ? "أدخل اسم المنتج بالعربية"
                    : "Enter product name in Arabic"
                }
                required
              />
            </div>

            <div className="md:col-span-2">
              <FormLabel htmlFor="category_id">
                {locale === "ar" ? "الفئة" : "Category"}
              </FormLabel>
              <Select
                value={formData.category_id.toString() || undefined}
                onValueChange={handleCategoryChange}
                name="category_id"
              >
                <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <SelectValue
                    placeholder={
                      locale === "ar" ? "اختر فئة" : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {locale === "ar" ? category.name_ar : category.name_en}
                      {category.brand &&
                        ` - ${
                          locale === "ar"
                            ? category.brand.name_ar
                            : category.brand.name_en
                        }`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <FormLabel htmlFor="description_en">
                {locale === "ar"
                  ? "الوصف (الإنجليزية)"
                  : "Description (English)"}
              </FormLabel>
              <Editor
                value={formData.description_en}
                onChange={(value) =>
                  handleRichTextChange("description_en", value)
                }
              />
            </div>

            <div className="md:col-span-2">
              <FormLabel htmlFor="description_ar">
                {locale === "ar" ? "الوصف (العربية)" : "Description (Arabic)"}
              </FormLabel>
              <Editor
                value={formData.description_ar}
                onChange={(value) =>
                  handleRichTextChange("description_ar", value)
                }
              />
            </div>

            <div>
              <FormLabel htmlFor="color">
                {locale === "ar" ? "اللون" : "Color"}
              </FormLabel>
              <FormInput
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="h-10"
              />
            </div>

            <div>
              <FormLabel htmlFor="image">
                {locale === "ar" ? "الصورة" : "Image"}
              </FormLabel>

              {/* Display existing image if available and no new file is uploaded */}
              {existingImage && !imageFile && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-500 mb-1">
                    {locale === "ar" ? "الصورة الحالية:" : "Current Image:"}
                  </div>
                  <img
                    src={getImageUrl(existingImage)}
                    alt="Current product"
                    className="h-32 w-32 object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => setExistingImage(null)}
                    className="mt-1 text-sm text-red-500 hover:text-red-700"
                  >
                    {locale === "ar" ? "إزالة الصورة" : "Remove Image"}
                  </button>
                </div>
              )}

              <FileUpload
                file={imageFile}
                onChange={handleImageChange}
                placeholderText={
                  locale === "ar"
                    ? "انقر للتحميل أو اسحب وأفلت"
                    : "Click to upload or drag and drop"
                }
                accept="image/*"
                required={!isEditing && !existingImage}
              />
              <FormHelperText>
                {locale === "ar"
                  ? "الحد الأقصى لحجم الملف: 50MB"
                  : "Maximum file size: 50MB"}
              </FormHelperText>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading
                ? locale === "ar"
                  ? "جاري الحفظ..."
                  : "Saving..."
                : isEditing
                ? locale === "ar"
                  ? "تحديث المنتج"
                  : "Update Product"
                : locale === "ar"
                ? "إنشاء المنتج"
                : "Create Product"}
            </Button>
          </div>
        </form>
      </FormSection>
    </div>
  );
}
