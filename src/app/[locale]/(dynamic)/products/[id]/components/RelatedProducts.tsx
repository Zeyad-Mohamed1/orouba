import Link from "next/link";
import Image from "next/image";
import { Product } from "../types";

interface RelatedProductsProps {
  relatedProducts: Product[];
  locale: string;
}

export default function RelatedProducts({
  relatedProducts,
  locale,
}: RelatedProductsProps) {
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto my-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">
          {locale === "ar" ? "منتجات مشابهة" : "Related Products"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Link
              href={`/${locale}/products/${relatedProduct.id}`}
              key={relatedProduct.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-transform hover:shadow-md hover:-translate-y-1"
            >
              <div className="relative h-48 bg-gray-50">
                {relatedProduct.image ? (
                  <Image
                    src={relatedProduct.image}
                    alt={
                      locale === "ar"
                        ? relatedProduct.name_ar
                        : relatedProduct.name_en
                    }
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {locale === "ar"
                    ? relatedProduct.name_ar
                    : relatedProduct.name_en}
                </h3>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">
                    {locale === "ar"
                      ? relatedProduct.category.name_ar
                      : relatedProduct.category.name_en}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
