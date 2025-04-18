import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { Product, Category, Brand } from "./types";
import CategoryList from "./components/CategoryList";
import ProductGrid from "./components/ProductGrid";
import BrandBanner from "./components/BrandBanner";
import ClientStyleProvider from "./components/ClientStyleProvider";
import "./styles.css";

// Metadata generation for SEO
export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: { locale: string };
    searchParams: { category?: string; brand?: string };
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale } = (await params) || "en";
  const { brand } = await searchParams;

  let brandName = locale === "ar" ? "منتجاتنا" : "Our Products";

  if (brand) {
    try {
      const brandData = await getBrandData(brand);
      if (brandData.brand) {
        brandName =
          locale === "ar" ? brandData.brand.name_ar : brandData.brand.name_en;
      }
    } catch (error) {
      console.error("Error fetching brand data for metadata:", error);
    }
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: brandName,
    description:
      locale === "ar"
        ? `استكشف منتجاتنا المميزة من ${brandName}`
        : `Explore our high-quality products from ${brandName}`,
    openGraph: {
      images: [...previousImages],
    },
  };
}

// Create a server-side fetch function for brands
async function getBrandData(brandId: string) {
  try {
    // Update URL to ensure it's absolute - if testing locally, consider hardcoding full URL
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

    const url = `${apiUrl}/api/brands/${brandId}`;

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
      cache: "force-cache", // Use cache with revalidation
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch brand details: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      brand: data.brand as Brand,
      categories: data.brand.categories || [],
    };
  } catch (error) {
    console.error("Error fetching brand data:", error);
    return {
      brand: null,
      categories: [],
    };
  }
}

// Create a server-side fetch function for products
async function getProducts(categoryId: string | null, brandId: string | null) {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

    let url = `${apiUrl}/api/products`;

    if (categoryId || brandId) {
      const queryParams = new URLSearchParams();
      if (categoryId) queryParams.append("category", categoryId);
      if (brandId) queryParams.append("brand", brandId);
      url = `${url}?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Revalidate every hour
      cache: "force-cache", // Use cache with revalidation
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return data as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { category?: string; brand?: string };
}) {
  const { locale } = await params;
  const { category: categoryId } = (await searchParams) || null;
  const { brand: brandId } = (await searchParams) || null;

  // Fetch data in parallel
  const [brandData, products] = await Promise.all([
    brandId
      ? getBrandData(brandId)
      : Promise.resolve({ brand: null, categories: [] }),
    getProducts(categoryId || null, brandId || null),
  ]);

  const { brand, categories } = brandData;
  const brandColor = brand?.color || "#003366";

  // Filter products by category if needed
  const filteredProducts = categoryId
    ? products.filter((product) => product.category_id === parseInt(categoryId))
    : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Brand banner with title */}
      <BrandBanner brand={brand} locale={locale} brandColor={brandColor} />

      {/* Categories section */}
      <CategoryList
        categories={categories}
        locale={locale}
        categoryId={categoryId || null}
        brandId={brandId || null}
        brandColor={brandColor}
      />

      {/* Products grid */}
      <div className="container mx-auto py-8 pb-16 px-4 md:px-8">
        <Suspense
          fallback={
            <div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>
          }
        >
          <ProductGrid
            products={filteredProducts}
            locale={locale}
            brandColor={brandColor}
          />
        </Suspense>
      </div>

      {/* Client components for interactivity and debugging */}
      <ClientStyleProvider brandColor={brandColor} />
    </div>
  );
}
