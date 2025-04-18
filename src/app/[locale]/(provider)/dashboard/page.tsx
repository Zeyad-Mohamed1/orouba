"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import DashboardStats from "@/components/DashboardStats";
import CatalogUploader from "@/components/CatalogUploader";

export default function DashboardPage() {
  const { locale } = useParams();
  const [isRtl, setIsRtl] = useState(false);
  const t = useTranslations("dashboard");

  useEffect(() => {
    setIsRtl(locale === "ar");
  }, [locale]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-gray-500">{t("subtitle")}</p>
      </div>

      {/* Dashboard statistics */}
      <DashboardStats isRtl={isRtl} />

      {/* PDF Uploader */}
      <div className="mb-8">
        <CatalogUploader />
      </div>
    </div>
  );
}
