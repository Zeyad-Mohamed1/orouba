"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface ExportRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  details: string;
  createdAt: string;
  updatedAt: string;
}

export default function ExportRequestsPage() {
  const [exportRequests, setExportRequests] = useState<ExportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = useTranslations("dashboard.exportRequests");

  useEffect(() => {
    const fetchExportRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/export-requests");

        if (!response.ok) {
          throw new Error("Failed to fetch export requests");
        }

        const data = await response.json();
        setExportRequests(data);
      } catch (error) {
        console.error("Error fetching export requests:", error);
        setError(t("loadingError"));
      } finally {
        setLoading(false);
      }
    };

    fetchExportRequests();
  }, [t]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        const response = await fetch(`/api/export-requests/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete export request");
        }

        // Remove the deleted request from the state
        setExportRequests(
          exportRequests.filter((request) => request.id !== id)
        );
        toast.success(t("deleteSuccess"));
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
        <Button variant="outline" onClick={() => window.location.reload()}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  if (exportRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {t("title")}
        </h1>
        <p className="text-gray-500 mb-6">{t("noRequests")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {t("title")}
      </h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("phone")}</TableHead>
              <TableHead>{t("createdAt")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exportRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.name}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.phone}</TableCell>
                <TableCell>
                  {format(new Date(request.createdAt), "MMM dd, yyyy HH:mm")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/dashboard/export-requests/${request.id}`}>
                    <Button variant="outline" size="sm">
                      {t("view")}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(request.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
