"use client";

import CatalogUploader from "@/components/CatalogUploader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale, useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function CatalogManagementPage() {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const [isCatalogAvailable, setIsCatalogAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const checkCatalogAvailability = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/catalog");
      setIsCatalogAvailable(response.ok);
    } catch (error) {
      console.error("Error checking catalog:", error);
      setIsCatalogAvailable(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkCatalogAvailability();
  }, []);

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/catalog");

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orouba-catalog-${locale}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(
        locale === "ar"
          ? "تم تحميل الكتالوج بنجاح"
          : "Catalog downloaded successfully"
      );
    } catch (error) {
      console.error("Error downloading catalog:", error);
      toast.error(
        locale === "ar" ? "فشل في تحميل الكتالوج" : "Failed to download catalog"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">
        {locale === "ar" ? "إدارة الكتالوج" : "Catalog Management"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "ar" ? "تحميل الكتالوج" : "Upload Catalog"}
            </CardTitle>
            <CardDescription>
              {locale === "ar"
                ? "قم بتحميل أو استبدال كتالوج المنتجات الحالي (PDF فقط)"
                : "Upload or replace the current product catalog (PDF only)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CatalogUploader onSuccess={checkCatalogAvailability} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {locale === "ar" ? "تنزيل الكتالوج" : "Download Catalog"}
            </CardTitle>
            <CardDescription>
              {locale === "ar"
                ? "قم بتنزيل كتالوج المنتجات الحالي"
                : "Download the current product catalog"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 text-center">
              {isCatalogAvailable ? (
                <div className="space-y-4">
                  <div className="text-green-600 font-medium mb-6">
                    {locale === "ar"
                      ? "الكتالوج متاح للتنزيل"
                      : "Catalog is available for download"}
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {locale === "ar" ? "تنزيل الكتالوج" : "Download Catalog"}
                  </Button>
                </div>
              ) : (
                <div className="text-amber-600">
                  {locale === "ar"
                    ? "لا يوجد كتالوج متاح حاليًا. يرجى تحميل واحد أولاً."
                    : "No catalog available yet. Please upload one first."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
