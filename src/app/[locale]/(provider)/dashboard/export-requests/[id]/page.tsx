"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";

interface ExportRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  createdAt: string;
  updatedAt: string;
}

export default function ExportRequestDetailPage() {
  const { id } = useParams();
  const [exportRequest, setExportRequest] = useState<ExportRequest | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("dashboard.exportRequests");
  const router = useRouter();

  useEffect(() => {
    const fetchExportRequest = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/export-requests/${id}`);

        if (response.status === 404) {
          setError(t("notFound"));
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch export request");
        }

        const data = await response.json();
        setExportRequest(data);
      } catch (error) {
        console.error("Error fetching export request:", error);
        setError(t("loadingError"));
      } finally {
        setLoading(false);
      }
    };

    fetchExportRequest();
  }, [id, t]);

  const handleDelete = async () => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        const response = await fetch(`/api/export-requests/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete export request");
        }

        toast.success(t("deleteSuccess"));
        router.push("/dashboard/export-requests");
      } catch (error) {
        console.error("Error deleting export request:", error);
        toast.error(t("deleteError"));
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/export-requests")}
        >
          {t("backToList")}
        </Button>
      </div>
    );
  }

  if (!exportRequest) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {t("notFound")}
        </h1>
        <p className="text-gray-500 mb-6">{t("requestNotFoundDescription")}</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/export-requests")}
        >
          {t("backToList")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title={t("requestDetails")}
        buttonLabel={t("backToList")}
        buttonHref="/dashboard/export-requests"
        buttonIcon="back"
      />

      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t("name")}
            </h3>
            <p className="text-lg font-medium text-gray-900 mb-4">
              {exportRequest.name}
            </p>

            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t("email")}
            </h3>
            <p className="text-lg text-gray-900 mb-4">{exportRequest.email}</p>

            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t("phone")}
            </h3>
            <p className="text-lg text-gray-900 mb-4">{exportRequest.phone}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t("createdAt")}
            </h3>
            <p className="text-lg text-gray-900 mb-4">
              {format(new Date(exportRequest.createdAt), "PPP p")}
            </p>

            <h3 className="text-sm font-medium text-gray-500 mb-1">
              {t("updatedAt")}
            </h3>
            <p className="text-lg text-gray-900 mb-4">
              {format(new Date(exportRequest.updatedAt), "PPP p")}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            {t("details")}
          </h3>
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-gray-900 whitespace-pre-wrap">
              {exportRequest.details}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
