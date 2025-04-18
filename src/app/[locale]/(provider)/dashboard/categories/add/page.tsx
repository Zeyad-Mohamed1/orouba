"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import FileUpload from "@/components/shared/FileUpload";

interface Brand {
  id: number;
  name_en: string;
  name_ar: string;
}

const AddCategoryPage = () => {
  const t = useTranslations("categories");
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    brand_id: "",
  });
  const [categoryImage, setCategoryImage] = useState<File | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands");
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }
        const data = await response.json();
        setBrands(data.brands);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands. Please try again.");
      }
    };

    fetchBrands();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBrandChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      brand_id: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate form
    if (
      !formData.name_en ||
      !formData.name_ar ||
      !formData.brand_id ||
      !categoryImage
    ) {
      setError(t("requiredFieldsError"));
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData object for file upload
      const submitData = new FormData();
      submitData.append("name_en", formData.name_en);
      submitData.append("name_ar", formData.name_ar);
      submitData.append("description_en", formData.description_en);
      submitData.append("description_ar", formData.description_ar);
      submitData.append("brand_id", formData.brand_id);

      if (categoryImage) {
        submitData.append("image", categoryImage);
      }

      // Submit the form
      const response = await fetch("/api/categories", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      // Redirect to categories page on success
      router.push("/dashboard/categories");
      router.refresh();
    } catch (err: any) {
      console.error("Error creating category:", err);
      setError(err.message || t("createError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title={t("addCategory")}
        buttonLabel={t("backToCategories")}
        buttonHref="/dashboard/categories"
        buttonIcon="back"
      />

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="name_en">{t("nameEn")} *</Label>
              <Input
                id="name_en"
                name="name_en"
                value={formData.name_en}
                onChange={handleChange}
                placeholder={t("nameEnPlaceholder")}
                required
              />
            </div>
            <div>
              <Label htmlFor="name_ar">{t("nameAr")} *</Label>
              <Input
                id="name_ar"
                name="name_ar"
                value={formData.name_ar}
                onChange={handleChange}
                placeholder={t("nameArPlaceholder")}
                required
                dir="rtl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="description_en">{t("descriptionEn")}</Label>
              <Textarea
                id="description_en"
                name="description_en"
                value={formData.description_en}
                onChange={handleChange}
                placeholder={t("descriptionEnPlaceholder")}
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="description_ar">{t("descriptionAr")}</Label>
              <Textarea
                id="description_ar"
                name="description_ar"
                value={formData.description_ar}
                onChange={handleChange}
                placeholder={t("descriptionArPlaceholder")}
                rows={4}
                dir="rtl"
              />
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="brand_id">{t("brand")} *</Label>
            <Select
              value={formData.brand_id}
              onValueChange={handleBrandChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectBrand")} />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id.toString()}>
                    {brand.name_en} | {brand.name_ar}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <Label>{t("categoryImage")} *</Label>
            <FileUpload
              file={categoryImage}
              onChange={setCategoryImage}
              className="mt-2"
              placeholderText={t("uploadCategoryImage")}
              accept="image/*"
              required
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? t("creating") : t("createCategory")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryPage;
