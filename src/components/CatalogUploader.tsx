"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, Check, AlertCircle, X, Trash } from "lucide-react";
import { useLocale } from "next-intl";
import { toast } from "react-hot-toast";

interface CatalogUploaderProps {
  onSuccess?: () => void;
}

export default function CatalogUploader({ onSuccess }: CatalogUploaderProps) {
  const locale = useLocale();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCatalogAvailable, setIsCatalogAvailable] = useState<boolean | null>(
    null
  );
  const [isCheckingCatalog, setIsCheckingCatalog] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if catalog already exists
  useEffect(() => {
    const checkCatalogAvailability = async () => {
      try {
        setIsCheckingCatalog(true);
        const response = await fetch("/api/catalog");
        setIsCatalogAvailable(response.ok);
      } catch (error) {
        console.error("Error checking catalog availability:", error);
        setIsCatalogAvailable(false);
      } finally {
        setIsCheckingCatalog(false);
      }
    };

    checkCatalogAvailability();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file) {
      // Validate file type
      if (file.type !== "application/pdf") {
        toast.error(
          locale === "ar"
            ? "يُسمح فقط بملفات PDF للكتالوج"
            : "Only PDF files are allowed for catalog"
        );
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error(
          locale === "ar"
            ? "حجم الملف كبير جدًا. الحد الأقصى هو 10 ميجابايت"
            : "File size too large. Maximum size is 10MB"
        );
        return;
      }

      setSelectedFile(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        locale === "ar"
          ? "هل أنت متأكد من أنك تريد حذف الكتالوج الحالي؟"
          : "Are you sure you want to delete the current catalog?"
      )
    ) {
      return;
    }

    try {
      setIsUploading(true);
      const response = await fetch("/api/catalog", {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(
          locale === "ar"
            ? "تم حذف الكتالوج بنجاح"
            : "Catalog deleted successfully"
        );
        setIsCatalogAvailable(false);
        if (onSuccess) onSuccess();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete catalog");
      }
    } catch (error) {
      console.error("Error deleting catalog:", error);
      toast.error(
        locale === "ar" ? "فشل في حذف الكتالوج" : "Failed to delete catalog"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("catalog", selectedFile);

      const response = await fetch("/api/catalog", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success(
          locale === "ar"
            ? "تم رفع الكتالوج بنجاح"
            : "Catalog uploaded successfully"
        );
        clearSelectedFile();
        setIsCatalogAvailable(true);
        if (onSuccess) onSuccess();
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload catalog");
      }
    } catch (error) {
      console.error("Error uploading catalog:", error);
      toast.error(
        locale === "ar" ? "فشل في رفع الكتالوج" : "Failed to upload catalog"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {locale === "ar" ? "إدارة كتالوج المنتجات" : "Manage Product Catalog"}
      </h2>

      {/* Current catalog status */}
      <div className="mb-6 p-4 rounded-lg bg-gray-50">
        <h3 className="font-medium mb-2">
          {locale === "ar" ? "حالة الكتالوج" : "Catalog Status"}
        </h3>

        {isCheckingCatalog ? (
          <div className="flex items-center text-gray-500">
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-500 border-t-transparent rounded-full"></div>
            <span>{locale === "ar" ? "جاري التحقق..." : "Checking..."}</span>
          </div>
        ) : isCatalogAvailable ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-600">
              <Check className="h-5 w-5 mr-2" />
              <span>
                {locale === "ar" ? "الكتالوج متاح" : "Catalog is available"}
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isUploading}
              className="flex items-center gap-1"
            >
              <Trash className="h-4 w-4" />
              {locale === "ar" ? "حذف" : "Delete"}
            </Button>
          </div>
        ) : (
          <div className="flex items-center text-amber-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>
              {locale === "ar"
                ? "لا يوجد كتالوج متاح. يرجى تحميل واحد."
                : "No catalog available. Please upload one."}
            </span>
          </div>
        )}
      </div>

      {/* File upload section */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          selectedFile
            ? "border-green-300 bg-green-50"
            : "border-gray-300 hover:border-primary/50"
        } transition-colors`}
      >
        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <FileUp className="h-6 w-6" />
              <span className="font-medium">{selectedFile.name}</span>
            </div>
            <div className="text-sm text-gray-500">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </div>
            <div className="flex justify-center gap-2">
              <Button
                variant="default"
                onClick={handleUpload}
                disabled={isUploading}
                className="flex items-center gap-1"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-1 border-2 border-white border-t-transparent rounded-full"></div>
                    {locale === "ar" ? "جاري الرفع..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {locale === "ar" ? "رفع الكتالوج" : "Upload Catalog"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={clearSelectedFile}
                disabled={isUploading}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                {locale === "ar" ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="catalog-uploader"
              ref={fileInputRef}
              disabled={isUploading}
            />
            <label
              htmlFor="catalog-uploader"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-lg font-medium">
                {locale === "ar" ? "اختر ملف PDF" : "Select PDF file"}
              </p>
              <p className="text-sm text-gray-500">
                {locale === "ar"
                  ? "اسحب وأفلت أو انقر لاختيار ملف"
                  : "Drag and drop or click to select a file"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {locale === "ar"
                  ? "الحد الأقصى للحجم: 10 ميجابايت، يقبل فقط ملفات PDF"
                  : "Max size: 10MB, PDF files only"}
              </p>
            </label>
          </>
        )}
      </div>
    </div>
  );
}
