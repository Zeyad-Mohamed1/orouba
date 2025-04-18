"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronDown, Search, Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { navigationLinks } from "@/config/navigation";
import { SearchOverlay } from "./SearchOverlay";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { toast } from "react-hot-toast";

interface Brand {
  id: string;
  name_ar: string;
  name_en: string;
  small_img: string | null;
}

const Header = () => {
  const t = useTranslations("home.header");
  const locale = useLocale();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [brandsError, setBrandsError] = useState<string | null>(null);
  const [isDownloadingCatalog, setIsDownloadingCatalog] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoadingBrands(true);
        setBrandsError(null);
        const response = await fetch("/api/brands");

        if (!response.ok) {
          throw new Error(`Failed to fetch brands: ${response.statusText}`);
        }

        const data = await response.json();
        setBrands(data.brands || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrandsError(
          error instanceof Error ? error.message : "Failed to fetch brands"
        );
      } finally {
        setIsLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  const toggleDropdown = useCallback((key: string) => {
    setActiveDropdown((current) => (current === key ? null : key));
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
    setActiveDropdown(null);
  }, []);

  const handleDownloadCatalog = async () => {
    try {
      setIsDownloadingCatalog(true);

      // Check if catalog exists
      const response = await fetch("/api/catalog");

      if (!response.ok) {
        // If response status is 404, catalog doesn't exist
        if (response.status === 404) {
          toast.error(
            locale === "ar"
              ? "الكتالوج غير متوفر حالياً"
              : "Catalog is not available at the moment"
          );
          return;
        }
        throw new Error(`Failed to download catalog: ${response.statusText}`);
      }

      // Check content type to determine if it's actually a PDF file
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/pdf")) {
        toast.error(
          locale === "ar"
            ? "تنسيق ملف الكتالوج غير صالح"
            : "Invalid catalog file format"
        );
        return;
      }

      // Get the blob from the response
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element and set its attributes
      const a = document.createElement("a");
      a.href = url;
      a.download = `orouba-catalog-${locale}.pdf`; // Name the downloaded file

      // Append the anchor to the body
      document.body.appendChild(a);

      // Click the anchor to start the download
      a.click();

      // Remove the anchor from the body
      document.body.removeChild(a);

      // Free the URL created for the blob
      window.URL.revokeObjectURL(url);

      toast.success(
        locale === "ar"
          ? "تم تحميل الكتالوج بنجاح"
          : "Catalog downloaded successfully"
      );
    } catch (error) {
      console.error("Error downloading catalog:", error);
      toast.error(
        locale === "ar"
          ? "فشل في تحميل الكتالوج، يرجى المحاولة مرة أخرى لاحقًا"
          : "Failed to download catalog, please try again later"
      );
    } finally {
      setIsDownloadingCatalog(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearch, isMobileMenuOpen]);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (!dropdownRef.current?.matches(":hover")) {
        setActiveDropdown(null);
      }
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const getNavigationLinksWithBrands = useCallback(() => {
    return navigationLinks.map((link) => {
      if (link.key === "products") {
        return {
          ...link,
          dropdownItems: isLoadingBrands
            ? [{ key: "loading", href: "#" }]
            : brandsError
            ? [{ key: "error", href: "#" }]
            : [
                { key: "allProducts", href: link.href || "/products" },
                ...brands.map((brand) => ({
                  key: `brand_${brand.id}`,
                  href: `/brands/${brand.id}`,
                  label: locale === "ar" ? brand.name_ar : brand.name_en,
                  image: brand.small_img,
                })),
              ],
        };
      }
      return link;
    });
  }, [brands, isLoadingBrands, brandsError, locale]);

  const linksWithBrands = getNavigationLinksWithBrands();

  return (
    <header className="bg-primary sticky top-0 text-white py-4 rounded-b-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between relative">
          <div className="">
            <Link
              href="/"
              className={`lg:absolute top-0 ${
                locale === "en" ? "left-0" : "right-0"
              }`}
            >
              <Image
                src="/logo.png"
                alt="Orouba Logo"
                width={90}
                height={30}
                className="object-contain max-sm:max-w-[60px] max-sm:max-h-[60px]"
              />
            </Link>
          </div>

          <div
            className="hidden lg:flex items-center gap-8 flex-1 justify-center"
            ref={dropdownRef}
          >
            {linksWithBrands.map((link) => (
              <div
                key={link.key}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(link.key)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={link.href ?? "#"}
                  className="hover:text-gray-200 transition-all font-semibold text-lg flex items-center gap-1 relative py-2"
                  onClick={(e) => {
                    if (!link.href) {
                      e.preventDefault();
                    }
                  }}
                >
                  {t(link.key)}
                  {link.dropdownItems && link.dropdownItems.length > 0 && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === link.key ? "rotate-180" : ""
                      }`}
                    />
                  )}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
                {link.dropdownItems && link.dropdownItems.length > 0 && (
                  <div
                    className={`absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100
                      transition-all duration-200 origin-top-left
                      ${
                        activeDropdown === link.key
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      }`}
                    onMouseEnter={() => handleMouseEnter(link.key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {link.key === "products" && isLoadingBrands && (
                      <div className="px-4 py-3 text-primary text-sm flex items-center">
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full"></div>
                        {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                      </div>
                    )}

                    {link.key === "products" && brandsError && (
                      <div className="px-4 py-3 text-red-500 text-sm">
                        {locale === "ar" ? "حدث خطأ" : "Error loading brands"}
                      </div>
                    )}

                    {link.dropdownItems &&
                      !isLoadingBrands &&
                      !brandsError &&
                      link.dropdownItems.map((item, index) => {
                        if (item.key === "allProducts") {
                          return (
                            <Link
                              key={item.key}
                              href={item.href}
                              className="block px-4 py-2.5 text-primary hover:bg-gray-50 transition-colors relative group/item font-semibold border-b border-gray-100"
                            >
                              <div className="relative z-10 text-sm">
                                {locale === "ar"
                                  ? "جميع المنتجات"
                                  : "All Products"}
                              </div>
                              <div className="absolute inset-0 bg-gray-100 opacity-0 transition-opacity group-hover/item:opacity-100 rounded-lg" />
                            </Link>
                          );
                        }

                        if (item.key.startsWith("brand_")) {
                          return (
                            <Link
                              key={item.key}
                              href={item.href}
                              className="block px-4 py-2.5 text-primary hover:bg-gray-50 transition-colors relative group/item"
                            >
                              <div className="relative z-10 text-sm flex items-center">
                                {item.image && (
                                  <div className="w-6 h-6 mr-2 rounded-full overflow-hidden flex-shrink-0">
                                    <Image
                                      src={item.image}
                                      alt={item.label || ""}
                                      width={24}
                                      height={24}
                                      className="object-cover w-full h-full"
                                    />
                                  </div>
                                )}
                                {item.label || t(item.key)}
                              </div>
                              <div className="absolute inset-0 bg-gray-100 opacity-0 transition-opacity group-hover/item:opacity-100 rounded-lg" />
                              {link.dropdownItems &&
                                index <
                                  (link.dropdownItems.length || 0) - 1 && (
                                  <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gray-100" />
                                )}
                            </Link>
                          );
                        }

                        return (
                          <Link
                            key={item.key}
                            href={item.href}
                            className="block px-4 py-2.5 text-primary hover:bg-gray-50 transition-colors relative group/item"
                          >
                            <div className="relative z-10 text-sm font-medium">
                              {item.label || t(item.key)}
                            </div>
                            <div className="absolute inset-0 bg-gray-100 opacity-0 transition-opacity group-hover/item:opacity-100 rounded-lg" />
                            {link.dropdownItems &&
                              index < (link.dropdownItems.length || 0) - 1 && (
                                <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gray-100" />
                              )}
                          </Link>
                        );
                      })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gray-200 relative group"
                onClick={toggleSearch}
                aria-label="Search"
              >
                <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                <span className="absolute -top-2 -right-2 scale-0 group-hover:scale-100 transition-transform bg-white/90 text-primary text-xs px-1.5 py-0.5 rounded-md whitespace-nowrap shadow-sm backdrop-blur-sm">
                  Ctrl + K
                </span>
              </Button>
            </motion.div>
            <LanguageSwitcher />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-white hover:bg-white/90 text-primary px-4 py-2 rounded-md transition-all shadow-md hover:shadow-lg active:shadow-sm flex items-center gap-2"
                onClick={handleDownloadCatalog}
                disabled={isDownloadingCatalog}
              >
                {isDownloadingCatalog ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span>
                      {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    {t("downloadCatalog")}
                  </>
                )}
              </Button>
            </motion.div>
          </div>

          <div className="flex lg:hidden items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-200"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-gray-200"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[72px] bg-primary z-40 lg:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col gap-4">
                {linksWithBrands.map((link) => (
                  <div key={link.key} className="border-b border-white/10 pb-4">
                    {link.dropdownItems ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(link.key)}
                          className="w-full flex items-center justify-between text-lg font-semibold"
                        >
                          {t(link.key)}
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-200 ${
                              activeDropdown === link.key ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {activeDropdown === link.key && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-2 ml-4 flex flex-col gap-2"
                            >
                              {link.key === "products" && isLoadingBrands && (
                                <div className="text-gray-200 py-2 flex items-center">
                                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                  {locale === "ar"
                                    ? "جاري التحميل..."
                                    : "Loading..."}
                                </div>
                              )}

                              {link.key === "products" && brandsError && (
                                <div className="text-red-300 py-2">
                                  {locale === "ar"
                                    ? "حدث خطأ"
                                    : "Error loading brands"}
                                </div>
                              )}

                              {link.dropdownItems &&
                                !isLoadingBrands &&
                                !brandsError &&
                                link.dropdownItems.map((item) => {
                                  if (item.key === "allProducts") {
                                    return (
                                      <Link
                                        key={item.key}
                                        href={item.href}
                                        className="text-white font-medium hover:text-gray-200 py-2 flex items-center"
                                        onClick={() =>
                                          setIsMobileMenuOpen(false)
                                        }
                                      >
                                        {locale === "ar"
                                          ? "جميع المنتجات"
                                          : "All Products"}
                                      </Link>
                                    );
                                  }

                                  if (item.key.startsWith("brand_")) {
                                    return (
                                      <Link
                                        key={item.key}
                                        href={item.href}
                                        className="text-gray-200 hover:text-white py-2 flex items-center"
                                        onClick={() =>
                                          setIsMobileMenuOpen(false)
                                        }
                                      >
                                        {item.image && (
                                          <div className="w-5 h-5 mr-2 rounded-full overflow-hidden flex-shrink-0">
                                            <Image
                                              src={item.image}
                                              alt={item.label || ""}
                                              width={20}
                                              height={20}
                                              className="object-cover w-full h-full"
                                            />
                                          </div>
                                        )}
                                        {item.label || t(item.key)}
                                      </Link>
                                    );
                                  }

                                  return (
                                    <Link
                                      key={item.key}
                                      href={item.href}
                                      className="text-gray-200 hover:text-white py-2"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {item.label || t(item.key)}
                                    </Link>
                                  );
                                })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={link.href ?? "#"}
                        className="block text-lg font-semibold"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t(link.key)}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mt-6 flex flex-col gap-4">
                <LanguageSwitcher />
                <Button
                  className="bg-white hover:bg-white/90 text-primary w-full py-3 rounded-md transition-all shadow-md hover:shadow-lg active:shadow-sm flex items-center justify-center gap-2"
                  onClick={handleDownloadCatalog}
                  disabled={isDownloadingCatalog}
                >
                  {isDownloadingCatalog ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      <span>
                        {locale === "ar" ? "جاري التحميل..." : "Loading..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      {t("downloadCatalog")}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchOverlay
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
