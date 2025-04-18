import { Recipe } from "../utils/data";
import { Breadcrumb } from "./Breadcrumb";
import { RecipeHeader } from "./RecipeHeader";
import { RecipeInfo } from "./RecipeInfo";
import { DishSection } from "./DishSection";
import { IngredientsSection } from "./IngredientsSection";
import { InstructionsSection } from "./InstructionsSection";
import { ProductSection } from "./ProductSection";
import { RelatedRecipes } from "./RelatedRecipes";

interface RecipeDetailProps {
  recipe: Recipe | null;
  relatedRecipes: Recipe[];
  locale: string;
}

export function RecipeDetail({
  recipe,
  relatedRecipes,
  locale,
}: RecipeDetailProps) {
  if (!recipe) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Recipe not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Breadcrumb recipe={recipe} locale={locale} />

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <RecipeHeader recipe={recipe} locale={locale} />

        <div className="p-8">
          <RecipeInfo recipe={recipe} locale={locale} />

          <DishSection recipe={recipe} locale={locale} />

          <div className="grid md:grid-cols-2 gap-10">
            <IngredientsSection recipe={recipe} locale={locale} />
            <InstructionsSection recipe={recipe} locale={locale} />
          </div>

          <ProductSection recipe={recipe} locale={locale} />

          <RelatedRecipes recipes={relatedRecipes} locale={locale} />
        </div>
      </div>
    </div>
  );
}
