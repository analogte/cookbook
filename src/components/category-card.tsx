import Link from "next/link";
import Image from "next/image";
import { type Category } from "@/server/db/schema";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
}

export function CategoryCard({ category, className }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-lg bg-charcoal shadow-elegant transition-all duration-300 hover:shadow-elegant-lg hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden">
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-charcoal-700">
            <span className="text-6xl">{category.icon || "🍽️"}</span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center gap-2">
          {category.icon && (
            <span className="text-2xl">{category.icon}</span>
          )}
          <h3 className="font-display text-xl font-semibold text-cream">
            {category.name}
          </h3>
        </div>
        {category.description && (
          <p className="mt-2 text-sm text-cream/70 line-clamp-2">
            {category.description}
          </p>
        )}
        <span className="mt-3 inline-flex items-center text-sm font-medium text-gold transition-colors group-hover:text-gold-400">
          ดูทั้งหมด
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
