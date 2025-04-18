"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Grid,
  Layers,
  Package,
  UserCircle,
  FileText,
  Mail,
  Briefcase,
  FileOutput,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const { locale } = useParams();
  const pathname = usePathname();
  const [isRtl, setIsRtl] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsRtl(locale === "ar");
  }, [locale]);

  const menuItems = [
    {
      name: locale === "ar" ? "لوحة التحكم" : "Dashboard",
      href: `/${locale}/dashboard`,
      icon: <Home size={18} />,
    },
    {
      name: locale === "ar" ? "العلامات التجارية" : "Brands",
      href: `/${locale}/dashboard/brands`,
      icon: <ShoppingBag size={18} />,
    },
    {
      name: locale === "ar" ? "المنتجات" : "Products",
      href: `/${locale}/dashboard/products`,
      icon: <Package size={18} />,
    },
    {
      name: locale === "ar" ? "الفئات" : "Categories",
      href: `/${locale}/dashboard/categories`,
      icon: <Grid size={18} />,
    },
    {
      name: locale === "ar" ? "فئات الأطباق" : "Dish Categories",
      href: `/${locale}/dashboard/dish-categories`,
      icon: <Layers size={18} />,
    },
    {
      name: locale === "ar" ? "الأطباق" : "Dishes",
      href: `/${locale}/dashboard/dishes`,
      icon: <UserCircle size={18} />,
    },
    {
      name: locale === "ar" ? "الوصفات" : "Recipes",
      href: `/${locale}/dashboard/recipes`,
      icon: <FileText size={18} />,
    },
    {
      name: locale === "ar" ? "طلبات التصدير" : "Export Requests",
      href: `/${locale}/dashboard/export-requests`,
      icon: <FileOutput size={18} />,
    },
    {
      name: locale === "ar" ? "طلبات التواصل" : "Contact Requests",
      href: `/${locale}/dashboard/contacts`,
      icon: <Mail size={18} />,
    },
    {
      name: locale === "ar" ? "طلبات التوظيف" : "Career Requests",
      href: `/${locale}/dashboard/careers`,
      icon: <Briefcase size={18} />,
    },
  ];

  const isActive = (href: string) => {
    return (
      pathname === href ||
      (pathname.startsWith(href) && href !== `/${locale}/dashboard`)
    );
  };

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } bg-white shadow-md h-screen fixed ${
        isRtl ? "right-0" : "left-0"
      } top-0 pt-16 overflow-y-auto z-10 transition-all duration-300 mt-6 ${
        isRtl ? "border-l" : "border-r"
      } border-gray-200`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-transform duration-200 ${
            isCollapsed && isRtl ? "rotate-180" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d={
                isCollapsed
                  ? isRtl
                    ? "M13 17l5-5-5-5"
                    : "M11 17l-5-5 5-5"
                  : isRtl
                  ? "M11 17l-5-5 5-5"
                  : "M13 17l5-5-5-5"
              }
            />
          </svg>
        </button>
      </div>

      <nav className="mt-5">
        <div className={`px-3 ${isCollapsed ? "text-center" : ""}`}>
          <ul className={`space-y-1 ${isRtl ? "text-right" : "text-left"}`}>
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center ${
                    isCollapsed
                      ? "justify-center"
                      : isRtl
                      ? "justify-end"
                      : "justify-start"
                  } px-4 py-3 text-gray-700 rounded-md transition-all duration-150 ease-in-out group
                    ${
                      isActive(item.href)
                        ? `bg-blue-50 text-blue-600 font-medium ${
                            isRtl ? "border-l-4" : "border-r-4"
                          } border-blue-500`
                        : "hover:bg-gray-50 hover:text-blue-600"
                    }
                  `}
                  title={isCollapsed ? item.name : ""}
                >
                  {isRtl && !isCollapsed ? (
                    <>
                      {!isCollapsed && (
                        <span
                          className={`${
                            isActive(item.href) ? "font-medium" : ""
                          } transition-all duration-150`}
                        >
                          {item.name}
                        </span>
                      )}
                      <span
                        className={`text-${
                          isActive(item.href) ? "blue-600" : "gray-500"
                        } transition-all duration-150 mr-3`}
                      >
                        {item.icon}
                      </span>
                    </>
                  ) : (
                    <>
                      <span
                        className={`text-${
                          isActive(item.href) ? "blue-600" : "gray-500"
                        } transition-all duration-150 ${
                          isCollapsed ? "" : "mr-3"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span
                          className={`${
                            isActive(item.href) ? "font-medium" : ""
                          } transition-all duration-150`}
                        >
                          {item.name}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div
        className={`absolute bottom-0 w-full p-4 border-t border-gray-200 ${
          isRtl ? "text-right" : "text-left"
        }`}
      >
        {isCollapsed ? (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        ) : (
          <div className={`flex items-center ${isRtl ? "justify-end" : ""}`}>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className={`text-xs text-gray-500 ${isRtl ? "mr-2" : "ml-2"}`}>
              Admin v1.0
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
