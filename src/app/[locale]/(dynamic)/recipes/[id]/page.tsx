import { Suspense } from "react";
import { RecipeDetail } from "./components/RecipeDetail";
import { getRecipe, getRelatedRecipes, Recipe } from "./utils/data";

interface PageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function RecipeDetailPage({ params }: PageProps) {
  const { locale, id } = await params;

  const recipe = await getRecipe(id);

  let relatedRecipes: Recipe[] = [];
  if (recipe?.product?.id) {
    relatedRecipes = await getRelatedRecipes(recipe.product.id, parseInt(id));
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <RecipeDetail
        recipe={recipe}
        relatedRecipes={relatedRecipes}
        locale={locale}
      />
    </Suspense>
  );
}
