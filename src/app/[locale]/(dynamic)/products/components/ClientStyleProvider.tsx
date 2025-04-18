"use client";

import { useEffect } from "react";

interface ClientStyleProviderProps {
  brandColor: string;
}

export default function ClientStyleProvider({
  brandColor,
}: ClientStyleProviderProps) {
  useEffect(() => {
    // Set CSS variable on the document root
    document.documentElement.style.setProperty("--brand-color", brandColor);
  }, [brandColor]);

  // This component doesn't render anything visible
  return null;
}
