"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function Breadcrumb() {
  const { locale } = useParams();

  return (
    <div className="mb-6">
      <nav className="flex">
        <Link href={`/${locale}`} className="text-blue-600 hover:text-blue-800">
          {locale === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">
          {locale === "ar" ? "وصفات" : "Recipes"}
        </span>
      </nav>
    </div>
  );
}
