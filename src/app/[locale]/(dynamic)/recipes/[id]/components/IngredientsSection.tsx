import { Recipe } from "../utils/data";

interface IngredientsSectionProps {
  recipe: Recipe;
  locale: string;
}

export function IngredientsSection({
  recipe,
  locale,
}: IngredientsSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-6 pb-2 border-b">
        {locale === "ar" ? "المكونات" : "Ingredients"}
      </h2>
      <ul className="space-y-3">
        {recipe.ingredients.map((ingredient) => (
          <li key={ingredient.id} className="flex items-start">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
            <span className="text-gray-700">
              {locale === "ar" ? ingredient.text_ar : ingredient.text_en}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
