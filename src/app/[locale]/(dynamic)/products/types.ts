export interface Product {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  color: string;
  image: string;
  category_id: number;
}

export interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  image: string;
  brand_id: number;
}

export interface Brand {
  id: string;
  name_ar: string;
  name_en: string;
  color: string;
  categories?: Category[];
}
