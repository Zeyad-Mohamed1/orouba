import { Recipe } from "../utils/data";

interface InstructionsSectionProps {
  recipe: Recipe;
  locale: string;
}

export function InstructionsSection({
  recipe,
  locale,
}: InstructionsSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-6 pb-2 border-b">
        {locale === "ar" ? "طريقة التحضير" : "Instructions"}
      </h2>
      <ol className="space-y-6">
        {recipe.instructions.map((instruction, index) => (
          <li key={instruction.id} className="flex">
            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-semibold mr-4">
              {index + 1}
            </span>
            <div className="text-gray-700">
              {locale === "ar" ? instruction.text_ar : instruction.text_en}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
