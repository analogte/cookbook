import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye } from "lucide-react";
import { formatDate, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    slug: string;
    excerpt?: string | null;
    imageUrl?: string | null;
    author?: string | null;
    viewCount?: number | null;
    createdAt?: string | null;
    category?: {
      name: string;
      slug: string;
    } | null;
  };
  className?: string;
  featured?: boolean;
}

export function ArticleCard({ article, className, featured }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group block overflow-hidden rounded-lg bg-white shadow-elegant transition-all duration-300 hover:shadow-elegant-lg hover:-translate-y-1",
        featured && "md:flex",
        className
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative aspect-[16/9] overflow-hidden",
          featured && "md:aspect-auto md:w-1/2"
        )}
      >
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gold/20 to-burgundy/20">
            <span className="font-display text-4xl text-gold/50">G</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "p-5",
          featured && "md:flex md:w-1/2 md:flex-col md:justify-center md:p-8"
        )}
      >
        {/* Category */}
        {article.category && (
          <p className="text-xs font-medium uppercase tracking-wider text-burgundy">
            {article.category.name}
          </p>
        )}

        {/* Title */}
        <h3
          className={cn(
            "mt-1 font-display font-semibold text-charcoal transition-colors group-hover:text-burgundy",
            featured ? "text-2xl" : "text-lg"
          )}
        >
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p
            className={cn(
              "mt-2 text-charcoal-500",
              featured ? "text-base line-clamp-3" : "text-sm line-clamp-2"
            )}
          >
            {article.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-xs text-charcoal-400">
          {article.createdAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(article.createdAt)}
            </span>
          )}
          {article.viewCount !== undefined && article.viewCount !== null && (
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {article.viewCount.toLocaleString()} views
            </span>
          )}
          {article.author && (
            <span className="text-charcoal-500">โดย {article.author}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
