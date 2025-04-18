"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "@/i18n/navigation";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { EyeIcon, TrashIcon } from "lucide-react";

type Career = {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string | null;
  message: string | null;
  cv: string;
  createdAt: string;
  updatedAt: string;
};

const CareersDashboard = () => {
  const { locale } = useParams();
  const [careers, setCareers] = useState<Career[]>([]);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Career>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await fetch("/api/careers");
        if (!response.ok) {
          throw new Error("Failed to fetch career applications");
        }
        const data = await response.json();
        setCareers(data.careers);
      } catch (err) {
        setError("Failed to load career applications. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const handleSort = (field: keyof Career) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredCareers = careers.filter((career) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      career.name.toLowerCase().includes(searchLower) ||
      career.email.toLowerCase().includes(searchLower) ||
      career.position?.toLowerCase().includes(searchLower) ||
      career.phone.toLowerCase().includes(searchLower)
    );
  });

  const handleDeleteCareer = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this career application? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/careers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete career application");
      }

      toast.success(
        locale === "ar"
          ? "تم حذف الطلب بنجاح"
          : "Career application deleted successfully"
      );

      router.push("/dashboard/careers");
    } catch (err) {
      console.error("Error deleting career application:", err);
      setError("Failed to delete the career application. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const sortedCareers = [...filteredCareers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null) return sortDirection === "asc" ? -1 : 1;
    if (bValue === null) return sortDirection === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // For dates or other types
    const aCompare = aValue as any;
    const bCompare = bValue as any;
    return sortDirection === "asc"
      ? aCompare > bCompare
        ? 1
        : -1
      : aCompare < bCompare
      ? 1
      : -1;
  });

  const SortIcon = ({ field }: { field: keyof Career }) => {
    if (sortField !== field) return <span className="ml-1">⇅</span>;
    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Career Applications
        </h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search applications..."
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Name <SortIcon field="name" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email <SortIcon field="email" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("position")}
                >
                  Position <SortIcon field="position" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  Date Applied <SortIcon field="createdAt" />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCareers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No career applications found
                  </td>
                </tr>
              ) : (
                sortedCareers.map((career) => (
                  <tr key={career.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {career.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {career.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {career.position || "Not specified"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(career.createdAt), "MMM dd, yyyy")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center items-center gap-4">
                        <Link
                          href={`/en/dashboard/careers/${career.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCareer(career.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CareersDashboard;
