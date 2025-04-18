import Image from "next/image";
import { ShareButton } from "./ShareButton";
import { Recipe } from "../utils/data";

interface RecipeHeaderProps {
  recipe: Recipe;
  locale: string;
}

export function RecipeHeader({ recipe, locale }: RecipeHeaderProps) {
  const title = locale === "ar" ? recipe.dish.name_ar : recipe.dish.name_en;

  return (
    <div className="relative">
      {recipe.image ? (
        <div className="h-96 relative">
          <Image
            src={recipe.image}
            alt={title}
            fill
            style={{ objectFit: "cover" }}
            className="brightness-75"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg px-4 text-center">
              {title}
            </h1>
          </div>
          <div className="absolute top-4 right-4 flex space-x-2">
            <ShareButton title={title} locale={locale} />
          </div>
        </div>
      ) : (
        <div className="h-80 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white">{title}</h1>
        </div>
      )}
    </div>
  );
}
