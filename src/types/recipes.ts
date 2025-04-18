export interface Category {
  id: number;
  name_en: string;
  name_ar: string;
  image: string;
}

export interface Dish {
  id: number;
  name_en: string;
  name_ar: string;
  image: string;
  dishCategory_id: number;
}

export interface Recipe {
  id: number;
  level: string;
  prep_time: string;
  cooking_time: string;
  servings: number;
  image: string;
  ingredients: string[];
  instructions: string[];
  dish_id: number;
  dish: {
    name_en: string;
    name_ar: string;
  };
}
