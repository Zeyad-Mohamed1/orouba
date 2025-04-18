"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Package, Utensils, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface Stats {
  brandCount: number;
  productCount: number;
  recipeCount: number;
  loading: boolean;
}

export default function DashboardStats({ isRtl }: { isRtl: boolean }) {
  const [stats, setStats] = useState<Stats>({
    brandCount: 0,
    productCount: 0,
    recipeCount: 0,
    loading: true,
  });
  const t = useTranslations("dashboard.stats");

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch brands count
        const brandsResponse = await fetch("/api/brands");
        const brandsData = await brandsResponse.json();

        // Fetch products count
        const productsResponse = await fetch("/api/products");
        const productsData = await productsResponse.json();

        // Fetch recipes count
        const recipesResponse = await fetch("/api/recipes");
        const recipesData = await recipesResponse.json();

        setStats({
          brandCount: brandsData.brands?.length || 0,
          productCount: productsData?.length || 0,
          recipeCount: recipesData?.length || 0,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      {/* Brands Card */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div className="p-5">
          <div
            className={`flex items-center ${
              isRtl ? "flex-row-reverse justify-between" : "justify-between"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{t("brands")}</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.loading ? "..." : stats.brandCount}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <ShoppingBag className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div
            className={`mt-4 flex items-center ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            <TrendingUp
              className={`w-4 h-4 text-green-500 ${isRtl ? "ml-1" : "mr-1"}`}
            />
            <span className="text-xs font-medium text-green-500">
              {t("updated")}
            </span>
          </div>
        </div>
      </div>

      {/* Products Card */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div className="p-5">
          <div
            className={`flex items-center ${
              isRtl ? "flex-row-reverse justify-between" : "justify-between"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-gray-500">
                {t("products")}
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.loading ? "..." : stats.productCount}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-full">
              <Package className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <div
            className={`mt-4 flex items-center ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            <TrendingUp
              className={`w-4 h-4 text-green-500 ${isRtl ? "ml-1" : "mr-1"}`}
            />
            <span className="text-xs font-medium text-green-500">
              {t("updated")}
            </span>
          </div>
        </div>
      </div>

      {/* Recipes Card */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <div className="p-5">
          <div
            className={`flex items-center ${
              isRtl ? "flex-row-reverse justify-between" : "justify-between"
            }`}
          >
            <div>
              <p className="text-sm font-medium text-gray-500">
                {t("recipes")}
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {stats.loading ? "..." : stats.recipeCount}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <Utensils className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div
            className={`mt-4 flex items-center ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            <TrendingUp
              className={`w-4 h-4 text-green-500 ${isRtl ? "ml-1" : "mr-1"}`}
            />
            <span className="text-xs font-medium text-green-500">
              {t("updated")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
