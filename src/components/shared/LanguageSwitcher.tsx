"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { Button } from "../ui/button";
import { languages } from "@/config/navigation";

export const LanguageSwitcher = () => {
  const t = useTranslations("home.header");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedIndex(-1);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < languages.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : languages.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleLanguageChange(languages[selectedIndex].code);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex]);

  const handleLanguageChange = (langCode: string) => {
    const currentLang = locale;
    let newPath = pathname;
    if (pathname?.startsWith(`/${currentLang}/`)) {
      newPath = pathname.replace(`/${currentLang}/`, `/${langCode}/`);
    } else if (pathname?.startsWith(`/${currentLang}`)) {
      newPath = pathname.replace(`/${currentLang}`, `/${langCode}`);
    } else {
      newPath = `/${langCode}${pathname || ""}`;
    }

    if (newPath) {
      router.push(newPath);
    }
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-gray-200 relative group"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Change language"
          aria-expanded={isOpen}
          aria-controls="language-menu"
        >
          <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
          <span className="absolute -top-1 -right-1 text-[10px] bg-white/90 text-primary rounded-full w-4 h-4 flex items-center justify-center font-semibold shadow-sm">
            {locale.toUpperCase()}
          </span>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="language-menu"
            role="menu"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute ${
              locale === "ar" ? "left-0" : "right-0"
            } mt-3 w-72 bg-white rounded-xl shadow-xl py-3 z-50 border border-gray-100/50 backdrop-blur-sm`}
          >
            <div className="px-4 pb-2 mb-2 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-500">
                {t("selectLanguage") || "Select Language"}
              </h3>
            </div>
            {languages.map((lang, index) => (
              <motion.button
                key={lang.code}
                role="menuitem"
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-3 hover:bg-gray-50/80 transition-all flex items-center gap-3 relative group ${
                  locale === lang.code ? "bg-primary/5" : ""
                } ${
                  selectedIndex === index ? "bg-gray-50/80" : ""
                } cursor-pointer`}
                whileHover={{ x: 8 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setSelectedIndex(index)}
                onMouseLeave={() => setSelectedIndex(-1)}
              >
                <div className="relative">
                  <span className="text-2xl filter drop-shadow-sm">
                    {lang.flag}
                  </span>
                  {locale === lang.code && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {lang.label}
                    </span>
                    {locale === lang.code && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {t("current") || "Current"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {lang.description}
                  </span>
                </div>
                <div
                  className={`w-1 h-8 rounded-full transition-all duration-300 ${
                    locale === lang.code
                      ? "bg-primary"
                      : "bg-transparent group-hover:bg-gray-200"
                  }`}
                />
              </motion.button>
            ))}
            <div className="px-4 pt-2 mt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                {t("languageNote") ||
                  "Content and interface will adapt to selected language"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
