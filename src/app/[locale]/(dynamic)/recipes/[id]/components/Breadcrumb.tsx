import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Recipe } from "../utils/data";

interface BreadcrumbProps {
  recipe: Recipe;
  locale: string;
}

export function Breadcrumb({ recipe, locale }: BreadcrumbProps) {
  return (
    <div className="mb-6">
      <nav className="flex items-center text-sm">
        <Link
          href={`/${locale}`}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {locale === "ar" ? "الرئيسية" : "Home"}
        </Link>
        <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
        <Link
          href={`/${locale}/recipes`}
          className="text-blue-600 hover:text-blue-800"
        >
          {locale === "ar" ? "وصفات" : "Recipes"}
        </Link>
        <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
        <span className="text-gray-700">
          {locale === "ar" ? recipe.dish.name_ar : recipe.dish.name_en}
        </span>
      </nav>
    </div>
  );
}
