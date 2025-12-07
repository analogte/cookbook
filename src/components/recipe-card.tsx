import Link from "next/link";
import Image from "next/image";
import { Clock, Users, ChefHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RecipeCardProps {
  recipe: {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    prepTime?: number | null;
    cookTime?: number | null;
    servings?: number | null;
    difficulty?: string | null;
    category?: {
      name: string;
      slug: string;
    } | null;
    tags?: Array<{
      id: number;
      name: string;
      slug: string;
      color?: string | null;
    }>;
  };
  className?: string;
  featured?: boolean;
}

export function RecipeCard({ recipe, className, featured }: RecipeCardProps) {
  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className={cn(
        "group block overflow-hidden rounded-lg bg-white shadow-elegant transition-all duration-300 hover:shadow-elegant-lg hover:-translate-y-1",
        featured && "md:flex md:h-80",
        className
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden",
          featured && "md:aspect-auto md:w-1/2"
        )}
      >
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-charcoal-100">
            <ChefHat className="h-16 w-16 text-charcoal-300" />
          </div>
        )}

        {/* Difficulty badge */}
        {recipe.difficulty && (
          <div className="absolute right-3 top-3">
            <Badge
              variant={
                recipe.difficulty === "easy"
                  ? "gold"
                  : recipe.difficulty === "medium"
                  ? "secondary"
                  : "burgundy"
              }
            >
              {recipe.difficulty === "easy"
                ? "ง่าย"
                : recipe.difficulty === "medium"
                ? "ปานกลาง"
                : "ยาก"}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("p-5", featured && "md:flex md:w-1/2 md:flex-col md:justify-center md:p-8")}>
        {/* Category */}
        {recipe.category && (
          <p className="text-xs font-medium uppercase tracking-wider text-gold">
            {recipe.category.name}
          </p>
        )}

        {/* Title */}
        <h3
          className={cn(
            "mt-1 font-display font-semibold text-charcoal transition-colors group-hover:text-burgundy",
            featured ? "text-2xl" : "text-lg"
          )}
        >
          {recipe.name}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p
            className={cn(
              "mt-2 text-charcoal-500 line-clamp-2",
              featured ? "text-base" : "text-sm"
            )}
          >
            {recipe.description}
          </p>
        )}

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-xs text-charcoal-400">
          {totalTime > 0 && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(totalTime)}
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings} ที่
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
