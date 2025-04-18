"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  locale: string;
}

export function ShareButton({ title, locale }: ShareButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleShare = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: currentUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      try {
        await navigator.clipboard.writeText(currentUrl);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      } catch (error) {
        console.error("Failed to copy URL:", error);
      }
    }
  };

  return (
    <button
      className="bg-white/30 backdrop-blur-sm p-2 rounded-full hover:bg-white/50 transition-colors relative"
      onClick={handleShare}
      aria-label={locale === "ar" ? "مشاركة" : "Share"}
    >
      <Share2 className="h-5 w-5 text-white" />
      {showTooltip && (
        <div className="absolute -bottom-10 right-0 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
          {locale === "ar" ? "تم نسخ الرابط!" : "Link copied!"}
        </div>
      )}
    </button>
  );
}
