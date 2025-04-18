"use client";

import Image from "next/image";

interface BrandHeroProps {
  brandName: string;
  banner: string;
  brandColor: string;
  locale: string;
}

const BrandHero = ({
  brandName,
  banner,
  brandColor,
  locale,
}: BrandHeroProps) => {
  // Helper function to determine if the banner is a video or image
  const isBannerVideo = (url: string) => {
    return (
      url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov")
    );
  };

  const isVideo = isBannerVideo(banner);

  return (
    <div
      className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden"
      style={{ backgroundColor: brandColor }}
    >
      {banner && isVideo ? (
        <div className="relative w-full h-full">
          <video
            src={banner}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transform scale-105 transition-transform duration-700 filter brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-[var(--brand-color)]/20" />

          {/* Video Controls Overlay */}
          <div className="absolute bottom-8 left-8 flex items-center gap-4 z-10">
            <button
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
              onClick={(e) => {
                const video =
                  e.currentTarget.parentElement?.parentElement?.querySelector(
                    "video"
                  );
                if (video) {
                  if (video.paused) {
                    video.play();
                  } else {
                    video.pause();
                  }
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            <button
              className="group flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20"
              onClick={(e) => {
                const video =
                  e.currentTarget.parentElement?.parentElement?.querySelector(
                    "video"
                  );
                if (video) {
                  video.muted = !video.muted;
                  e.currentTarget.classList.toggle("active");
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072M12 18.364a7 7 0 010-12.728M8.464 15.536a5 5 0 010-7.072"
                />
              </svg>
            </button>
          </div>

          {/* Loading Indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white/80 animate-spin opacity-0 transition-opacity duration-300 video-loading" />
          </div>
        </div>
      ) : (
        banner && (
          <div className="relative w-full h-full">
            <Image
              src={banner}
              alt={locale === "ar" ? brandName : brandName}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105 filter brightness-[0.85]"
              priority
              style={{ transform: "translateY(-5%)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 mix-blend-overlay" />
            <div className="absolute inset-0 bg-[var(--brand-color)]/20" />
          </div>
        )
      )}

      <div className="absolute inset-0 flex items-end pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div
            className="max-w-3xl space-y-8 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-white leading-none tracking-tight drop-shadow-lg font-sans">
              {locale === "ar" ? brandName : brandName}
            </h1>
            <div className="h-1.5 w-32 bg-white rounded-full opacity-80" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandHero;
