"use client";

import { Brand } from "../types";

interface BrandBannerProps {
  brand: Brand | null;
  locale: string;
  brandColor: string;
}

export default function BrandBanner({
  brand,
  locale,
  brandColor,
}: BrandBannerProps) {
  return (
    <div
      className="bg-gradient-to-r from-[var(--brand-color)]"
      style={{ backgroundColor: `${brandColor}15` }}
    >
      <div className="container mx-auto py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white/90">
            {brand
              ? locale === "ar"
                ? brand.name_ar
                : brand.name_en
              : locale === "ar"
              ? "منتجاتنا"
              : "Our Products"}
          </h1>
          {brand && (
            <div className="flex items-center justify-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: brandColor }}
              />
              <span className="text-sm text-gray-600 font-medium">
                {locale === "ar" ? "علامة تجارية مميزة" : "Premium Brand"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
