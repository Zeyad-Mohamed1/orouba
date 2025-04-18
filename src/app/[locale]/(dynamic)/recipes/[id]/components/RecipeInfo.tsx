import { Clock, Users, ChefHat } from "lucide-react";
import { LevelIcon } from "./LevelIcon";
import { Recipe } from "../utils/data";

interface RecipeInfoProps {
  recipe: Recipe;
  locale: string;
}

export function RecipeInfo({ recipe, locale }: RecipeInfoProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      <div className="bg-blue-50 p-6 rounded-xl flex flex-col items-center justify-center">
        <div className="text-blue-600 mb-3">
          <LevelIcon level={recipe.level.toLowerCase()} />
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {locale === "ar" ? "المستوى" : "Level"}
        </div>
        <div className="font-medium mt-1 capitalize">
          {locale === "ar"
            ? recipe.level === "easy"
              ? "سهل"
              : recipe.level === "medium"
              ? "متوسط"
              : "صعب"
            : recipe.level}
        </div>
      </div>
      <div className="bg-blue-50 p-6 rounded-xl flex flex-col items-center justify-center">
        <div className="text-blue-600 mb-3">
          <Clock className="h-6 w-6" />
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {locale === "ar" ? "وقت التحضير" : "Prep Time"}
        </div>
        <div className="font-medium mt-1">
          {recipe.prep_time} {locale === "ar" ? "دقيقة" : "min"}
        </div>
      </div>
      <div className="bg-blue-50 p-6 rounded-xl flex flex-col items-center justify-center">
        <div className="text-blue-600 mb-3">
          <ChefHat className="h-6 w-6" />
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {locale === "ar" ? "وقت الطهي" : "Cooking Time"}
        </div>
        <div className="font-medium mt-1">
          {recipe.cooking_time} {locale === "ar" ? "دقيقة" : "min"}
        </div>
      </div>
      <div className="bg-blue-50 p-6 rounded-xl flex flex-col items-center justify-center">
        <div className="text-blue-600 mb-3">
          <Users className="h-6 w-6" />
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          {locale === "ar" ? "عدد الأشخاص" : "Servings"}
        </div>
        <div className="font-medium mt-1">{recipe.servings}</div>
      </div>
    </div>
  );
}
