import { BarChart } from "lucide-react";

interface LevelIconProps {
  level: string;
}

export function LevelIcon({ level }: LevelIconProps) {
  const levelColor =
    level === "easy"
      ? "text-green-500"
      : level === "medium"
      ? "text-yellow-500"
      : "text-red-500";

  return <BarChart className={`h-6 w-6 ${levelColor}`} />;
}
