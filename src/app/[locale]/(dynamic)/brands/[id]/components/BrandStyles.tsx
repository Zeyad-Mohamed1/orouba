"use client";

interface BrandStylesProps {
  brandColor: string;
}

const BrandStyles = ({ brandColor }: BrandStylesProps) => {
  return (
    <style jsx global>{`
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .animate-fade-up {
        animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }

      .animate-fade-in {
        animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
      }

      :root {
        --brand-color: ${brandColor};
      }

      .masonry {
        column-count: 3;
        column-gap: 2rem;
      }

      .masonry > div {
        display: inline-block;
        width: 100%;
        margin-bottom: 2rem;
        break-inside: avoid;
      }

      @media (max-width: 768px) {
        .masonry {
          column-count: 1;
        }
      }

      /* Add smooth scrolling to the whole page */
      html {
        scroll-behavior: smooth;
      }

      /* Enhance typography */
      .prose {
        font-feature-settings: "liga" 1, "kern" 1, "dlig" 1;
        font-kerning: normal;
      }

      .prose p {
        transition: transform 0.3s ease;
      }

      .prose p:hover {
        transform: translateX(8px);
      }

      .prose strong {
        color: var(--brand-color);
        font-weight: 600;
      }

      .prose a {
        color: var(--brand-color);
        text-decoration: none;
        position: relative;
      }

      .prose a::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: var(--brand-color);
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.3s ease;
      }

      .prose a:hover::after {
        transform: scaleX(1);
        transform-origin: left;
      }

      @media (max-width: 768px) {
        .prose p:hover {
          transform: none;
        }
      }

      /* Video loading indicator */
      video:not([readyState="4"]) ~ .video-loading {
        opacity: 1;
      }

      /* Video control button active state */
      .video-controls button.active {
        background-color: rgba(255, 255, 255, 0.3);
        border-color: rgba(255, 255, 255, 0.4);
      }

      /* Video hover effect */
      .video-container:hover .video-controls {
        opacity: 1;
        transform: translateY(0);
      }

      /* Video gradient overlay */
      .mix-blend-overlay {
        mix-blend-mode: overlay;
      }
    `}</style>
  );
};

export default BrandStyles;
