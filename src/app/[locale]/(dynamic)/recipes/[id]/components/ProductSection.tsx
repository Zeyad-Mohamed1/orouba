import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Recipe } from "../utils/data";

interface ProductSectionProps {
  recipe: Recipe;
  locale: string;
}

export function ProductSection({ recipe, locale }: ProductSectionProps) {
  if (!recipe.product) return null;

  return (
    <div className="mt-12 p-6 border border-gray-200 rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">
        {locale === "ar" ? "المنتج المستخدم" : "Product Used"}
      </h2>
      <div className="flex items-center">
        {recipe.product.image ? (
          <div className="h-24 w-24 relative rounded overflow-hidden mr-4 shadow">
            <Image
              src={recipe.product.image}
              alt={
                locale === "ar"
                  ? recipe.product.name_ar
                  : recipe.product.name_en
              }
              fill
              style={{ objectFit: "cover" }}
              unoptimized={true}
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.classList.add(
                    "flex",
                    "items-center",
                    "justify-center",
                    "bg-gray-100"
                  );
                  parent.innerHTML =
                    '<span class="text-gray-500 text-xs">No IMG</span>';
                }
              }}
            />
          </div>
        ) : (
          <div className="h-24 w-24 rounded bg-gray-200 flex items-center justify-center mr-4">
            <span className="text-gray-500 text-xs">No IMG</span>
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">
            {locale === "ar" ? recipe.product.name_ar : recipe.product.name_en}
          </h3>
          <Link
            href={`/${locale}/products/${recipe.product.id}`}
            className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center mt-1"
          >
            {locale === "ar" ? "تعرف على المنتج" : "View product details"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
