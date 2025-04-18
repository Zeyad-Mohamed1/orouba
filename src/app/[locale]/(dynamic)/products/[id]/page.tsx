import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "./components/Breadcrumb";
import ProductDetails from "./components/ProductDetails";
import RelatedProducts from "./components/RelatedProducts";
import ProductRecipes from "./components/ProductRecipes";
import ProductStyles from "./components/ProductStyles";
import { Product, Brand, Recipe } from "./types";

async function getProduct(id: string): Promise<Product> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/products/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch product");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

async function getBrand(brandId: number): Promise<Brand | null> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/brands/${brandId}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.brand;
  } catch (error) {
    console.error("Error fetching brand:", error);
    return null;
  }
}

async function getRelatedProducts(
  categoryId: number,
  productId: number
): Promise<Product[]> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/products?category=${categoryId}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return [];
    }

    const products = await res.json();
    return products.filter((p: Product) => p.id !== productId).slice(0, 4);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}

async function getProductRecipes(productId: number): Promise<Recipe[]> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
      }/api/recipes?product_id=${productId}`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return [];
  }
}

interface ProductPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { locale, id } = await params;

  let product: Product;

  try {
    product = await getProduct(id);
  } catch (error) {
    notFound();
  }

  const [brand, relatedProducts, recipes] = await Promise.all([
    product.category?.brand_id
      ? getBrand(product.category.brand_id)
      : Promise.resolve(null),
    getRelatedProducts(product.category_id, product.id),
    getProductRecipes(product.id),
  ]);

  const productColor = product.color || "#003366";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb navigation */}
      <Breadcrumb product={product} brand={brand} locale={locale} />

      {/* Product details */}
      <div className="container mx-auto py-20 px-4 md:px-8">
        <ProductDetails product={product} brand={brand} locale={locale} />
      </div>

      {/* Related products section */}
      <RelatedProducts relatedProducts={relatedProducts} locale={locale} />

      {/* Recipes section */}
      <ProductRecipes recipes={recipes} locale={locale} />

      {/* CSS styling */}
      <ProductStyles productColor={productColor} />
    </div>
  );
}
