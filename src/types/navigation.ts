export interface NavigationItem {
  key: string;
  href?: string;
  dropdownItems?: {
    key: string;
    href: string;
    label?: string;
    image?: string | null;
  }[];
}

export interface Language {
  code: string;
  label: string;
  flag: string;
  region: string;
  description: string;
}
