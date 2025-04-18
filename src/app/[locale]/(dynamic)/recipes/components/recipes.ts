import { Category, Dish, Recipe } from "@/types/recipes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/api/dish-categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

export async function getDishesByCategory(categoryId: number): Promise<Dish[]> {
  const res = await fetch(`${API_URL}/api/dishes?category=${categoryId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dishes");
  }

  return res.json();
}

export async function getRecipesByDish(dishId: number): Promise<Recipe[]> {
  const res = await fetch(`${API_URL}/api/recipes?dish=${dishId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch recipes");
  }

  return res.json();
}
