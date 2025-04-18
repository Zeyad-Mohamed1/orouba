"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import PageHeader from "@/components/shared/PageHeader";

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

export default function CareerDetails() {
  const { id, locale } = useParams();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchCareerDetails = async () => {
      try {
        const response = await fetch(`/api/careers/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Career application not found");
          }
          throw new Error("Failed to fetch career application details");
        }
        const data = await response.json();
        setCareer(data.career);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCareerDetails();
  }, [id]);

  const isPdf = career?.cv.toLowerCase().endsWith(".pdf");

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4">
          {error || "Career application not found"}
        </div>
        <Link
          href="/en/dashboard/careers"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to all applications
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title={locale === "ar" ? "تفاصيل الطلب" : "Career Details"}
        buttonLabel={
          locale === "ar" ? "العودة إلى قائمة الطلبات" : "Back to List"
        }
        buttonHref="/dashboard/careers"
        buttonIcon="back"
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800">
            Application Details
          </h1>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Applicant Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-base text-gray-900">{career.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{career.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Phone Number
                  </p>
                  <p className="text-base text-gray-900">{career.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Position Applied For
                  </p>
                  <p className="text-base text-gray-900">
                    {career.position || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Date Applied
                  </p>
                  <p className="text-base text-gray-900">
                    {format(
                      new Date(career.createdAt),
                      "MMMM dd, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
                {career.message && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Message</p>
                    <p className="text-base text-gray-900 whitespace-pre-line">
                      {career.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">CV</h2>
              <div className="border rounded-md overflow-hidden bg-gray-50">
                {isPdf ? (
                  <div className="p-4">
                    <a
                      href={career.cv}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 p-6 rounded-md transition-colors"
                    >
                      <span className="mr-2 text-2xl">📄</span>
                      <span>View PDF</span>
                    </a>
                  </div>
                ) : (
                  <div className="relative h-[400px] w-full">
                    <Image
                      src={career.cv}
                      alt="CV Image"
                      fill
                      style={{ objectFit: "contain" }}
                      className="p-2"
                    />
                  </div>
                )}
                <div className="border-t p-3 bg-white">
                  <a
                    href={career.cv}
                    download
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center justify-center"
                  >
                    <span className="mr-1">⬇️</span> Download CV
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
