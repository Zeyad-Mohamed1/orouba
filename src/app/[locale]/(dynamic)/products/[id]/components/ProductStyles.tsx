"use client";

interface ProductStylesProps {
  productColor: string;
}

export default function ProductStyles({ productColor }: ProductStylesProps) {
  return (
    <style jsx global>{`
      :root {
        --product-color: ${productColor};
      }

      .prose a {
        color: var(--product-color);
      }

      .prose strong {
        color: var(--product-color);
        font-weight: 600;
      }
    `}</style>
  );
}
