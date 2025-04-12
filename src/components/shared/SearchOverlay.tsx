"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, Loader2, ArrowRight, History } from "lucide-react";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ isOpen, onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("home.header");

  const handleSearch = useCallback(
    async (query: string = searchQuery) => {
      if (!query.trim()) return;

      setIsLoading(true);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        setRecentSearches((prev) => {
          const newSearches = [query, ...prev.filter((s) => s !== query)].slice(
            0,
            5
          );
          localStorage.setItem("recentSearches", JSON.stringify(newSearches));
          return newSearches;
        });
        setIsLoading(false);
        onClose();
      }, 500);
    },
    [searchQuery, onClose]
  );

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

      if (recentSearches.length > 0) {
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
  }, [isOpen, onClose, recentSearches, selectedIndex, handleSearch]);

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

  if (!isOpen) return null;

  return (
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
        className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        <div className="p-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-primary focus-within:bg-white transition-all">
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
                placeholder="Search..."
              />
              <div className="flex items-center gap-2">
                {searchQuery && (
                  <motion.button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedIndex(-1);
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

          {recentSearches.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between px-4 mb-2">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <History className="w-4 h-4" />
                  <span>{t("recentSearches") || "Recent Searches"}</span>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t("clearHistory") || "Clear History"}
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
  );
};
