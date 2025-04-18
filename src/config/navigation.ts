import { NavigationItem, Language } from "@/types/navigation";

export const navigationLinks: NavigationItem[] = [
  {
    key: "home",
    href: "/",
  },
  {
    key: "about",
    dropdownItems: [
      {
        key: "whoWeAre",
        href: "/who-we-are",
      },
      {
        key: "certifications",
        href: "/certifications",
      },
      {
        key: "productTypes",
        href: "/product-types",
      },
    ],
  },
  {
    key: "products",
    href: "/products",
  },
  {
    key: "export",
    href: "/export",
  },
  {
    key: "recipes",
    href: "/recipes",
  },
  {
    key: "contact",
    href: "/contact",
  },
  {
    key: "careers",
    href: "/careers",
  },
];

export const languages: Language[] = [
  {
    code: "en",
    label: "English",
    flag: "us",
    region: "United States",
    description: "Switch to English language",
  },
  {
    code: "ar",
    label: "العربية",
    flag: "eg",
    region: "Egypt",
    description: "التحويل إلى اللغة العربية",
  },
];
