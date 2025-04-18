"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Loader2,
  ArrowRight,
  History,
  ChevronDown,
  Info,
} from "lucide-react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type SearchCategory = "product" | "brand" | "recipe";
type SearchResult = {
  id: string;
  name: string;
  category: SearchCategory;
  image: string | null;
  nameAr?: string;
  // Brand specific
  color?: string;
  // Product specific
  categoryName?: string;
  brandName?: string;
  // Recipe specific
  level?: string;
  prepTime?: number;
  cookingTime?: number;
};

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const locale = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] =
    useState<SearchCategory>("product");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("home.header");

  const fetchSearchResults = async (
    query: string,
    category: SearchCategory
  ) => {
    if (!query.trim()) {
      setSearchResults([]);
      setNoResults(false);
      return;
    }

    setIsLoading(true);
    setNoResults(false);

    try {
      // Call our API endpoint
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}&category=${category}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSearchResults(data.results || []);
      setNoResults(data.results.length === 0);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(
    async (query: string = searchQuery) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      try {
        // Get search results directly
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(
            query
          )}&category=${searchCategory}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // Add to recent searches
        setRecentSearches((prev) => {
          const newSearches = [query, ...prev.filter((s) => s !== query)].slice(
            0,
            5
          );
          localStorage.setItem("recentSearches", JSON.stringify(newSearches));
          return newSearches;
        });

        // If we have results, navigate to the first result directly
        if (data.results && data.results.length > 0) {
          const firstResult = data.results[0];
          switch (firstResult.category) {
            case "product":
              router.push(`/products/${firstResult.id}`);
              break;
            case "brand":
              router.push(`/brands/${firstResult.id}`);
              break;
            case "recipe":
              router.push(`/recipes/${firstResult.id}`);
              break;
          }
          onClose();
        } else {
          // If no results, show the no results state
          setSearchResults([]);
          setNoResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setNoResults(true);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, searchCategory, onClose, router]
  );

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      // Add to recent searches
      setRecentSearches((prev) => {
        const newSearches = [
          result.name,
          ...prev.filter((s) => s !== result.name),
        ].slice(0, 5);
        localStorage.setItem("recentSearches", JSON.stringify(newSearches));
        return newSearches;
      });

      // Navigate based on category
      switch (result.category) {
        case "product":
          router.push(`/products/${result.id}`);
          break;
        case "brand":
          router.push(`/brands/${result.id}`);
          break;
        case "recipe":
          router.push(`/recipes/${result.id}`);
          break;
      }

      onClose();
    },
    [router, onClose]
  );

  // Live search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchSearchResults(searchQuery, searchCategory);
      }, 300);
    } else {
      setSearchResults([]);
      setNoResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, searchCategory]);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
        return;
      }

      if (searchResults.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev < searchResults.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev > 0 ? prev - 1 : searchResults.length - 1
            );
            break;
          case "Enter":
            e.preventDefault();
            if (selectedIndex >= 0) {
              // Handle selection of search result
              handleResultClick(searchResults[selectedIndex]);
            }
            break;
        }
      } else if (recentSearches.length > 0 && searchResults.length === 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev < recentSearches.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev > 0 ? prev - 1 : recentSearches.length - 1
            );
            break;
          case "Enter":
            e.preventDefault();
            if (selectedIndex >= 0) {
              const selectedSearch = recentSearches[selectedIndex];
              setSearchQuery(selectedSearch);
              handleSearch(selectedSearch);
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    onClose,
    recentSearches,
    searchResults,
    selectedIndex,
    handleSearch,
    handleResultClick,
  ]);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showCategoryDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(e.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCategoryDropdown]);

  const toggleCategoryDropdown = () => {
    if (!showCategoryDropdown && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleClickOutside = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (overlayRef.current === e.target) {
        onClose();
      }
    },
    [onClose]
  );

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const categoryOptions: { value: SearchCategory; label: string }[] = [
    { value: "product", label: "Products" },
    { value: "brand", label: "Brands" },
    { value: "recipe", label: "Recipes" },
  ];

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClickOutside}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden relative"
        >
          <div className="p-4">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
                <div className="relative">
                  <button
                    ref={dropdownButtonRef}
                    type="button"
                    onClick={toggleCategoryDropdown}
                    className="flex items-center gap-1 text-sm font-medium bg-white text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded border border-gray-200 min-w-[100px] justify-between"
                  >
                    {
                      categoryOptions.find(
                        (option) => option.value === searchCategory
                      )?.label
                    }
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-gray-400" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(-1);
                  }}
                  className="flex-1 bg-transparent text-lg focus:outline-none text-gray-700 placeholder:text-gray-400"
                  placeholder={`Search ${searchCategory}s...`}
                />
                <div className="flex items-center gap-2">
                  {searchQuery && (
                    <motion.button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedIndex(-1);
                        setSearchResults([]);
                        inputRef.current?.focus();
                      }}
                      className="text-gray-400 hover:text-gray-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                  <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
                    ESC
                  </kbd>
                </div>
              </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4">
                <div className="px-4 mb-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Results for "{searchQuery}" in {searchCategory}s
                  </h3>
                </div>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <motion.button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3 group ${
                        selectedIndex === index ? "bg-gray-50" : ""
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      {result.image ? (
                        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={result.image}
                            alt={result.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center"
                          style={{ backgroundColor: result.color || "#f3f4f6" }}
                        >
                          <Search className="w-5 h-5 text-white" />
                        </div>
                      )}

                      <div className="flex-1">
                        <div className="font-medium text-gray-700">
                          {result.name}
                        </div>

                        {result.category === "product" && result.brandName && (
                          <div className="text-xs text-gray-500">
                            {result.brandName} • {result.categoryName}
                          </div>
                        )}

                        {result.category === "recipe" && result.level && (
                          <div className="text-xs text-gray-500">
                            {result.level} •{" "}
                            {result.prepTime && result.cookingTime
                              ? `${result.prepTime + result.cookingTime} min`
                              : ""}
                          </div>
                        )}
                      </div>

                      <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {noResults && !isLoading && searchQuery.trim() && (
              <div className="mt-4 px-4 py-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                  <Info className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-base font-medium text-gray-700 mb-1">
                  No {searchCategory}s found
                </h3>
                <p className="text-sm text-gray-500">
                  We couldn't find any {searchCategory}s matching "{searchQuery}
                  "
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      // Navigate to the category listing page instead of search page
                      switch (searchCategory) {
                        case "product":
                          router.push("/products");
                          break;
                        case "brand":
                          router.push("/brands");
                          break;
                        case "recipe":
                          router.push("/recipes");
                          break;
                      }
                      onClose();
                    }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View all {searchCategory}s
                  </button>
                </div>
              </div>
            )}

            {/* Recent Searches (only show when no results, no search term, and there are recent searches) */}
            {searchResults.length === 0 &&
              !noResults &&
              !searchQuery.trim() &&
              recentSearches.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between px-4 mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <History className="w-4 h-4" />
                      <span>
                        {locale === "ar" ? "آخر البحث" : "Recent Searches"}
                      </span>
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {locale === "ar" ? "مسح السجل" : "Clear History"}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          setSearchQuery(search);
                          handleSearch(search);
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-center gap-3 group ${
                          selectedIndex === index ? "bg-gray-50" : ""
                        }`}
                        whileHover={{ x: 4 }}
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="flex-1 text-gray-700">{search}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </motion.div>
      </motion.div>

      {/* Render dropdown as a portal to avoid z-index issues */}
      {typeof document !== "undefined" &&
        showCategoryDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 1000,
            }}
            className="bg-white rounded-md shadow-xl ring-1 ring-black ring-opacity-5 py-1 min-w-[140px]"
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSearchCategory(option.value);
                      setShowCategoryDropdown(false);
                      if (searchQuery.trim()) {
                        fetchSearchResults(searchQuery, option.value);
                      }
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      searchCategory === option.value
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>,
          document.body
        )}
    </>
  );
};
