export interface Recipe {
  id: number;
  level: string;
  prep_time: string;
  cooking_time: string;
  servings: number;
  image: string;
  ingredients: Array<{
    id: string;
    text_ar: string;
    text_en: string;
  }>;
  instructions: Array<{
    id: string;
    text_ar: string;
    text_en: string;
  }>;
  dish_id: number;
  dish: {
    id: number;
    name_en: string;
    name_ar: string;
    image?: string;
  };
  product?: {
    id: number;
    name_en: string;
    name_ar: string;
    image?: string;
  };
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/recipes/${id}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) throw new Error("Failed to fetch recipe");
    return await res.json();
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return null;
  }
}

export async function getRelatedRecipes(
  productId: number,
  currentRecipeId: number
): Promise<Recipe[]> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || ""
      }/api/recipes?product_id=${productId}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) throw new Error("Failed to fetch related recipes");
    const data = await res.json();

    // Filter out the current recipe and limit to 3
    return data.filter((r: Recipe) => r.id !== currentRecipeId).slice(0, 3);
  } catch (err) {
    console.error("Error fetching related recipes:", err);
    return [];
  }
}
