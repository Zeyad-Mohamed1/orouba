export interface Product {
  id: number;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  color: string;
  image: string;
  category_id: number;
  category: {
    id: number;
    name_ar: string;
    name_en: string;
    brand_id: number;
  };
}

export interface Brand {
  id: number;
  name_ar: string;
  name_en: string;
  color: string;
}

export interface Recipe {
  id: number;
  level: string;
  prep_time: number;
  cooking_time: number;
  servings: number;
  image: string | null;
  ingredients: any;
  instructions: any;
  product_id: number | null;
  dish_id: number;
  dish: {
    id: number;
    name_ar: string;
    name_en: string;
  };
}
